import axios from "axios";

const BASE_URL = "http://localhost:8080";
const LS_SESSION = "tm_session";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getSession() {
  try {
    const raw = localStorage.getItem(LS_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(LS_SESSION, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

api.interceptors.request.use(
  (config) => {
    const session = getSession();
    const token = session?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Network error";

    error.normalizedMessage = msg;

    if (error?.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  }
);
