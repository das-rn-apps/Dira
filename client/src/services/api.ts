import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
