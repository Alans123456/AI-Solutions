import api from "./api";
import { arrayResponse, itemResponse } from "./response";

export interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: string;
  tags: string[];
  featuredImage: string;
  featured?: boolean;
  status?: string;
  views?: number;
  isMock?: boolean;
}

export const getBlogPosts = async (): Promise<{ posts: BlogPost[] }> => {
  const response = await api.get("/api/blog");
  return arrayResponse<BlogPost>(response.data, "posts") as { posts: BlogPost[] };
};

export const getBlogPost = async (id: string): Promise<{ post: BlogPost }> => {
  const response = await api.get(`/api/blog/${encodeURIComponent(id)}`);
  return itemResponse<BlogPost>(response.data, "post") as { post: BlogPost };
};

export const getAdminBlogPosts = async (): Promise<{ posts: BlogPost[] }> => {
  const response = await api.get("/api/admin/blog");
  return arrayResponse<BlogPost>(response.data, "posts") as { posts: BlogPost[] };
};

export const createBlogPost = async (data: Omit<BlogPost, "_id" | "isMock">) => {
  const response = await api.post("/api/admin/blog", data);
  return response.data;
};

export const updateBlogPost = async (id: string, data: Partial<BlogPost>) => {
  const response = await api.put(`/api/admin/blog/${id}`, data);
  return response.data;
};

export const deleteBlogPost = async (id: string) => {
  const response = await api.delete(`/api/admin/blog/${id}`);
  return response.data;
};
