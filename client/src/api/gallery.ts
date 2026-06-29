import api from "./api";

export interface GalleryImage {
  _id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
  uploadDate: string;
  status?: string;
  isMock?: boolean;
}

export const getGalleryImages = async (): Promise<{ images: GalleryImage[] }> => {
  const response = await api.get("/api/gallery");
  return response.data as { images: GalleryImage[] };
};

export const getAdminGalleryImages = async (): Promise<{ images: GalleryImage[] }> => {
  const response = await api.get("/api/admin/gallery");
  return response.data as { images: GalleryImage[] };
};

export const createGalleryImage = async (data: Omit<GalleryImage, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/gallery", data);
  return response.data;
};

export const updateGalleryImage = async (id: string, data: Partial<GalleryImage>) => {
  const response = await api.put(`/api/admin/gallery/${id}`, data);
  return response.data;
};

export const deleteGalleryImage = async (id: string) => {
  const response = await api.delete(`/api/admin/gallery/${id}`);
  return response.data;
};
