import api from "./api";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  jobTitle?: string;
  jobDetails: string;
  budget?: string;
  timeline?: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  jobTitle?: string;
  jobDetails: string;
  budget?: string;
  timeline?: string;
  status: "New" | "In Progress" | "Responded" | "Closed";
  priority: "Low" | "Medium" | "High";
  submittedAt: string;
  notes?: string[];
}

export const submitContactForm = async (
  data: ContactFormData
): Promise<{ success: boolean; message: string; confirmationNumber: string }> => {
  const response = await api.post("/api/contact", data);
  return response.data as { success: boolean; message: string; confirmationNumber: string };
};

export const getInquiries = async (): Promise<{ inquiries: Inquiry[] }> => {
  const response = await api.get("/api/admin/inquiries");
  return response.data as { inquiries: Inquiry[] };
};

export const updateInquiry = async (
  id: string,
  data: { status?: string; priority?: string; notes?: string }
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`/api/admin/inquiries/${id}`, data);
  return response.data as { success: boolean; message: string };
};
