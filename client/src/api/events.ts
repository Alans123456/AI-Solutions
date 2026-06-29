import api from "./api";
import { arrayResponse, itemResponse } from "./response";

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  speakers?: string[];
  agenda?: string[];
  registrationRequired: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  image: string;
  status?: string;
  isMock?: boolean;
}

export const getEvents = async (): Promise<{ events: Event[] }> => {
  const response = await api.get("/api/events");
  return arrayResponse<Event>(response.data, "events") as { events: Event[] };
};

export const getEvent = async (id: string): Promise<{ event: Event }> => {
  const response = await api.get(`/api/events/${encodeURIComponent(id)}`);
  return itemResponse<Event>(response.data, "event") as { event: Event };
};

export const getAdminEvents = async (): Promise<{ events: Event[] }> => {
  const response = await api.get("/api/admin/events");
  return arrayResponse<Event>(response.data, "events") as { events: Event[] };
};

export const createEvent = async (data: Omit<Event, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/events", data);
  return response.data;
};

export const updateEvent = async (id: string, data: Partial<Event>) => {
  const response = await api.put(`/api/admin/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/api/admin/events/${id}`);
  return response.data;
};

export const registerForEvent = async (
  eventId: string,
  data: { name: string; email: string; phone?: string }
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/api/events/${eventId}/register`, data);
  return response.data as { success: boolean; message: string };
};
