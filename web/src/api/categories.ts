import { api } from "./client";
import { extractCollection, extractSingle, normalizeCategory } from "@/lib/api-parser";
import type { Category } from "@/types/category";

export interface CategoryPayload {
  name: string;
}

export async function getCategories() {
  const { data } = await api.get("/categories");
  return extractCollection<Category>(data).map(normalizeCategory);
}

export async function createCategory(payload: CategoryPayload) {
  const { data } = await api.post("/categories", payload);
  const category = extractSingle<Category>(data);
  return category ? normalizeCategory(category) : null;
}

export async function updateCategory(id: number, payload: CategoryPayload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  const category = extractSingle<Category>(data);
  return category ? normalizeCategory(category) : null;
}

export async function deleteCategory(id: number) {
  await api.delete(`/categories/${id}`);
}
