import api from "./api";
import { arrayResponse } from "./response";

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  technologies: string[];
  features: string[];
  pricing: string;
  status?: string;
  isMock?: boolean;
}

export const getServices = async (): Promise<{ services: Service[] }> => {
  const response = await api.get("/api/services");
  return arrayResponse<Service>(response.data, "services") as { services: Service[] };
};

export const getAdminServices = async (): Promise<{ services: Service[] }> => {
  const response = await api.get("/api/admin/services");
  return arrayResponse<Service>(response.data, "services") as { services: Service[] };
};

export const createService = async (data: Omit<Service, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/services", data);
  return response.data;
};

export const updateService = async (id: string, data: Partial<Service>) => {
  const response = await api.put(`/api/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await api.delete(`/api/admin/services/${id}`);
  return response.data;
};
