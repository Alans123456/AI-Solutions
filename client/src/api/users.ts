import api from "./api";

export type UserRole = "admin" | "user";

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export const getUsers = async (): Promise<{ users: AdminUser[] }> => {
  const response = await api.get("/api/auth/users");
  return response.data as { users: AdminUser[] };
};

export const createUser = async (data: { email: string; password: string; role: UserRole }) => {
  const response = await api.post("/api/auth/users", data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: { email?: string; password?: string; role?: UserRole }
) => {
  const response = await api.put(`/api/auth/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/api/auth/users/${id}`);
  return response.data;
};
