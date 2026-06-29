import { createContext, ReactNode, useContext, useState } from "react";
import { login as apiLogin } from "../api/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: string; email: string; role: "admin" | "user" } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function messageFromError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function decodeUser(token: string | null): AuthContextType["user"] {
  if (!token) return null;

  try {
    const encodedPayload = token.split(".")[1] || "";
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    return {
      id: String(payload.id || ""),
      email: String(payload.email || ""),
      role: payload.role === "admin" ? "admin" : "user"
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("accessToken"));
  });
  const [user, setUser] = useState<AuthContextType["user"]>(() => decodeUser(localStorage.getItem("accessToken")));

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      const decodedUser = decodeUser(response.accessToken);
      if (decodedUser?.role !== "admin") {
        throw new Error("Only admin accounts can access the dashboard.");
      }

      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("accessToken", response.accessToken);
      setUser(decodedUser);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
      throw new Error(messageFromError(error, "Login failed"));
    }
  };

  const logout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
