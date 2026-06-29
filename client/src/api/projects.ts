import api from "./api";
import { arrayResponse } from "./response";

export interface Project {
  _id: string;
  title: string;
  description: string;
  industry: string;
  technologies: string[];
  images: string[];
  client: string;
  testimonial?: string;
  completedDate: string;
  challenge: string;
  solution: string;
  status?: string;
  isMock?: boolean;
}

export const getProjects = async (): Promise<{ projects: Project[] }> => {
  const response = await api.get("/api/projects");
  return arrayResponse<Project>(response.data, "projects") as { projects: Project[] };
};

export const getAdminProjects = async (): Promise<{ projects: Project[] }> => {
  const response = await api.get("/api/admin/projects");
  return arrayResponse<Project>(response.data, "projects") as { projects: Project[] };
};

export const createProject = async (data: Omit<Project, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/projects", data);
  return response.data;
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const response = await api.put(`/api/admin/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete(`/api/admin/projects/${id}`);
  return response.data;
};
