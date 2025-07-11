import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to include token
api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("diraAuth") || "{}");
  const token = authData.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
