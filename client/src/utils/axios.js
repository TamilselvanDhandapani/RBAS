import axios from "axios";
import { API_ENDPOINTS } from "../config/api.config";

const instance = axios.create({
  baseURL: API_ENDPOINTS.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle response errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;