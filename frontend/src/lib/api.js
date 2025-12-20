import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// otomatis pasang Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("tm_session");
    if (raw) {
      const session = JSON.parse(raw);
      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    }
  } catch {}
  return config;
});

// normalisasi pesan error
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Network error";
    return Promise.reject(new Error(msg));
  }
);
