import axios from "axios";
import { authService } from "@/services/auth.service";
import { ApiResponse } from "@/types/api.types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<ApiResponse<null>> | null = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      
      if (!refreshPromise) {
        refreshPromise = authService.refreshToken();
      }

      await refreshPromise;

      return api(originalRequest);

    } catch (refreshError) {
      return Promise.reject(refreshError);

    } finally {
      refreshPromise = null;
    }
  }
);