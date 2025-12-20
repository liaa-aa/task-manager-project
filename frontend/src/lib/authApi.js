import { api, setSession, clearSession } from "./api.js";

export async function registerApi({ name, email, password }) {
  const res = await api.post("/register", { name, email, password });
  return res.data;
}

export async function loginApi({ email, password }) {
  const res = await api.post("/login", { email, password });
  const data = res.data;

  setSession({ token: data.token, user: data.user });

  return data;
}

export function logoutApi() {
  clearSession();
}
