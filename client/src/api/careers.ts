import api from "./api";
import { arrayResponse } from "./response";

export interface Career {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
  closingDate?: string;
  status?: string;
  isMock?: boolean;
}

export interface CareerApplicationPayload {
  name: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  cvName: string;
  cvType: string;
  cvData: string;
}

export interface CareerApplication {
  _id: string;
  careerId: string;
  careerTitle: string;
  name: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  cvName: string;
  cvType: string;
  cvData: string;
  status: string;
  submittedAt: string;
  notes?: string[];
}

export const getCareers = async (): Promise<{ jobs: Career[] }> => {
  const response = await api.get("/api/careers");
  return arrayResponse<Career>(response.data, "jobs") as { jobs: Career[] };
};

export const getAdminCareers = async (): Promise<{ jobs: Career[] }> => {
  const response = await api.get("/api/admin/careers");
  return arrayResponse<Career>(response.data, "jobs") as { jobs: Career[] };
};

export const createCareer = async (data: Omit<Career, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/careers", data);
  return response.data;
};

export const updateCareer = async (id: string, data: Partial<Career>) => {
  const response = await api.put(`/api/admin/careers/${id}`, data);
  return response.data;
};

export const deleteCareer = async (id: string) => {
  const response = await api.delete(`/api/admin/careers/${id}`);
  return response.data;
};

export const applyForCareer = async (careerId: string, data: CareerApplicationPayload) => {
  const response = await api.post(`/api/careers/${careerId}/apply`, data);
  return response.data as { success: boolean; message: string; confirmationNumber: string };
};

export const getCareerApplications = async (): Promise<{ applications: CareerApplication[] }> => {
  const response = await api.get("/api/admin/career-applications");
  return arrayResponse<CareerApplication>(response.data, "applications") as { applications: CareerApplication[] };
};

export const updateCareerApplication = async (id: string, data: Partial<CareerApplication> & { notes?: string }) => {
  const response = await api.put(`/api/admin/career-applications/${id}`, data);
  return response.data;
};
