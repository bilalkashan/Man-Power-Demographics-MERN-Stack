import axios from "axios";

const LOCAL_API_URL = "http://localhost:8080";

export const fileUrl = (relative) => {
  if (!relative) return "";
  if (relative.startsWith("http")) return relative;
  
  // Use the updated fallback URL
  const base = import.meta.env.VITE_API_URL || LOCAL_API_URL;
  const clean = relative.replace(/^\/+/, "");
  return `${base}/${clean}`;
};

const api = axios.create({
  // Use the updated fallback URL
  baseURL: import.meta.env.VITE_API_URL || LOCAL_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;