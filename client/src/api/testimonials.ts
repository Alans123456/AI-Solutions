import api from "./api";

export interface Testimonial {
  _id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientImage?: string;
  rating: number;
  testimonial: string;
  date: string;
  industry: string;
  serviceType: string;
  status?: string;
  isMock?: boolean;
}

export const getTestimonials = async (): Promise<{ testimonials: Testimonial[] }> => {
  const response = await api.get("/api/testimonials");
  return response.data as { testimonials: Testimonial[] };
};

export const getAdminTestimonials = async (): Promise<{ testimonials: Testimonial[] }> => {
  const response = await api.get("/api/admin/testimonials");
  return response.data as { testimonials: Testimonial[] };
};

export const createTestimonial = async (data: Omit<Testimonial, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/testimonials", data);
  return response.data;
};

export const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
  const response = await api.put(`/api/admin/testimonials/${id}`, data);
  return response.data;
};

export const deleteTestimonial = async (id: string) => {
  const response = await api.delete(`/api/admin/testimonials/${id}`);
  return response.data;
};
