import axios from "axios";
import { clearAuthStorage, getToken } from "@/lib/storage";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

export const api = axios.create({
  baseURL: configuredBaseUrl || "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
    }

    return Promise.reject(error);
  },
);
