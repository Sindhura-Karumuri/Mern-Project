import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://mern-project-123-4mrk.onrender.com/api",
});

// Interceptor to attach JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token should be set on login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
