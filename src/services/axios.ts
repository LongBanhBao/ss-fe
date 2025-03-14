import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}`,
  timeout: 20000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("An error occurred:", error);
    return Promise.reject(error);
  }
);
export default instance;
