import api from "./api";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

function errorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "response" in error) {
    const maybe = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
    return maybe.response?.data?.message || maybe.response?.data?.error || maybe.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data as AuthResponse;
  } catch (error) {
    throw new Error(errorMessage(error, "Login failed"));
  }
};

export const register = async (email: string, password: string): Promise<{ email: string }> => {
  try {
    const response = await api.post("/api/auth/register", { email, password });
    return response.data as { email: string };
  } catch (error) {
    throw new Error(errorMessage(error, "Registration failed"));
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data as { success: boolean; message: string };
  } catch (error) {
    throw new Error(errorMessage(error, "Logout failed"));
  }
};
