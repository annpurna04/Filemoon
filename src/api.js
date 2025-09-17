import axios from "axios";

export const api = axios.create({
  baseURL: "https://file-system-xi.vercel.app/api", // backend URL
});

// Automatically attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
