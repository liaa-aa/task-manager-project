import { api } from "./api.js";

export async function listCategoriesApi() {
  const res = await api.get("/category/");
  return res.data;
}

export async function createCategoryApi(name) {
  const res = await api.post("/category/", { name });
  return res.data;
}

export async function deleteCategoryApi(id) {
  const res = await api.delete(`/category/${id}`);
  return res.data;
}
