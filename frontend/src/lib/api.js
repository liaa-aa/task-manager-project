import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("tm_session");
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    }
  } catch {
    // ignore
  }
  return config;
});
