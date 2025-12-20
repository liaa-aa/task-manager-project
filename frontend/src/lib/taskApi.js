import { api } from "./api.js";

export async function getTasksApi() {
  const res = await api.get("/task");
  return res.data; 
}

export async function getTaskApi(id) {
  const res = await api.get(`/task/${id}`);
  return res.data;
}

export async function createTaskApi(payload) {
  const res = await api.post("/task", payload);
  return res.data;
}

export async function deleteTaskApi(id) {
  const res = await api.delete(`/task/${id}`);
  return res.data;
}
