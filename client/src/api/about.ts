import api from "./api";
import { arrayResponse } from "./response";

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  expertise: string[];
  linkedin?: string;
  sortOrder?: number;
  status?: string;
  isMock?: boolean;
}

export interface Faq {
  _id: string;
  title?: string;
  question: string;
  answer: string;
  category: string;
  sortOrder?: number;
  status?: string;
  isMock?: boolean;
}

export const getTeamMembers = async (): Promise<{ members: TeamMember[] }> => {
  const response = await api.get("/api/team");
  return arrayResponse<TeamMember>(response.data, "members") as { members: TeamMember[] };
};

export const getFaqs = async (): Promise<{ faqs: Faq[] }> => {
  const response = await api.get("/api/faqs");
  return arrayResponse<Faq>(response.data, "faqs") as { faqs: Faq[] };
};

export const getAdminTeamMembers = async (): Promise<{ members: TeamMember[] }> => {
  const response = await api.get("/api/admin/team");
  return arrayResponse<TeamMember>(response.data, "members") as { members: TeamMember[] };
};

export const createTeamMember = async (data: Omit<TeamMember, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/team", data);
  return response.data;
};

export const updateTeamMember = async (id: string, data: Partial<TeamMember>) => {
  const response = await api.put(`/api/admin/team/${id}`, data);
  return response.data;
};

export const deleteTeamMember = async (id: string) => {
  const response = await api.delete(`/api/admin/team/${id}`);
  return response.data;
};

export const getAdminFaqs = async (): Promise<{ faqs: Faq[] }> => {
  const response = await api.get("/api/admin/faqs");
  return arrayResponse<Faq>(response.data, "faqs") as { faqs: Faq[] };
};

export const createFaq = async (data: Omit<Faq, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/faqs", data);
  return response.data;
};

export const updateFaq = async (id: string, data: Partial<Faq>) => {
  const response = await api.put(`/api/admin/faqs/${id}`, data);
  return response.data;
};

export const deleteFaq = async (id: string) => {
  const response = await api.delete(`/api/admin/faqs/${id}`);
  return response.data;
};
