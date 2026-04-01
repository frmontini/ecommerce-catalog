import { api } from "./client";
import {
  extractCollection,
  extractPaginationMeta,
  extractSingle,
  normalizeProduct,
} from "@/lib/api-parser";
import type { Product, ProductListResult } from "@/types/product";

export interface ProductQueryParams {
  page?: number;
  category?: string | number;
  search?: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
}

export async function getProducts(params: ProductQueryParams = {}): Promise<ProductListResult> {
  const { data } = await api.get("/products", { params });

  return {
    items: extractCollection<Product>(data).map(normalizeProduct),
    meta: extractPaginationMeta(data),
  };
}

export async function getProduct(id: number | string) {
  const { data } = await api.get(`/products/${id}`);
  const product = extractSingle<Product>(data);
  return product ? normalizeProduct(product) : null;
}

export async function createProduct(payload: ProductPayload) {
  const { data } = await api.post("/products", payload);
  const product = extractSingle<Product>(data);
  return product ? normalizeProduct(product) : null;
}

export async function updateProduct(id: number, payload: ProductPayload) {
  const { data } = await api.put(`/products/${id}`, payload);
  const product = extractSingle<Product>(data);
  return product ? normalizeProduct(product) : null;
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`);
}
