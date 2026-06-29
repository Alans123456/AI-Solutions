import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import JSONbig from "json-bigint";
import { API_BASE_URL } from "./config";

const localApi = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    "Content-Type": "application/json"
  },
  validateStatus: (status) => status >= 200 && status < 300,
  transformResponse: [
    (data) => {
      if (!data) return data;
      try {
        return JSONbig.parse(data);
      } catch {
        return data;
      }
    }
  ]
});

let accessToken: string | null = null;

const isAdminEndpoint = (url?: string): boolean => Boolean(url?.startsWith("/api/admin"));
const isUserManagementEndpoint = (url?: string): boolean => Boolean(url?.startsWith("/api/auth/users"));
const isRefreshEndpoint = (url?: string): boolean => Boolean(url?.startsWith("/api/auth/refresh"));
const isLogoutEndpoint = (url?: string): boolean => Boolean(url?.startsWith("/api/auth/logout"));
const needsToken = (url?: string): boolean => isAdminEndpoint(url) || isUserManagementEndpoint(url) || isLogoutEndpoint(url);

localApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const requestUrl = config.url || "";

    if (needsToken(requestUrl)) {
      accessToken = accessToken || localStorage.getItem("accessToken");
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else if (config.headers) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

localApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url || "";

    if (
      error.response?.status &&
      [401, 403].includes(error.response.status) &&
      !originalRequest._retry &&
      needsToken(requestUrl) &&
      !isRefreshEndpoint(requestUrl)
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await localApi.post("/api/auth/refresh", { refreshToken });
        const newAccessToken = response.data?.accessToken || response.data?.data?.accessToken;
        const newRefreshToken = response.data?.refreshToken || response.data?.data?.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error("Invalid refresh response");
        }

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        accessToken = newAccessToken;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return localApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        accessToken = null;

        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  request: (config: AxiosRequestConfig) => localApi(config),
  get: (url: string, config?: AxiosRequestConfig) => localApi.get(url, config),
  post: (url: string, data?: unknown, config?: AxiosRequestConfig) => localApi.post(url, data, config),
  put: (url: string, data?: unknown, config?: AxiosRequestConfig) => localApi.put(url, data, config),
  delete: (url: string, config?: AxiosRequestConfig) => localApi.delete(url, config)
};

export default api;
