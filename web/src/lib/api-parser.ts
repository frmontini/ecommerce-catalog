import type { Category } from "@/types/category";
import type { PaginationMeta, Product } from "@/types/product";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function firstPrimitive(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

export function extractCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (isRecord(payload)) {
    if (Array.isArray(payload.data)) return payload.data as T[];

    if (isRecord(payload.data) && Array.isArray(payload.data.data)) {
      return payload.data.data as T[];
    }
  }

  return [];
}

export function extractSingle<T>(payload: unknown): T | null {
  if (isRecord(payload) && isRecord(payload.data)) {
    if ("id" in payload.data) return payload.data as T;
    if (isRecord(payload.data.data)) return payload.data.data as T;
  }

  if (isRecord(payload) && "id" in payload) {
    return payload as T;
  }

  return null;
}

export function extractPaginationMeta(payload: unknown): PaginationMeta {
  const fallback: PaginationMeta = {
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  };

  if (!isRecord(payload)) return fallback;

  const source = isRecord(payload.meta)
    ? payload.meta
    : isRecord(payload.data) && isRecord(payload.data.meta)
      ? payload.data.meta
      : null;

  if (!source) return fallback;

  return {
    current_page: Number(firstPrimitive(source.current_page) ?? 1),
    last_page: Number(firstPrimitive(source.last_page) ?? 1),
    per_page: Number(firstPrimitive(source.per_page) ?? 12),
    total: Number(firstPrimitive(source.total) ?? 0),
  };
}

export function normalizeProduct(input: Product): Product {
  const fallbackCategoryId = input.category?.id ? Number(input.category.id) : 0;

  return {
    ...input,
    price: Number(firstPrimitive(input.price) ?? 0),
    category_id: Number(firstPrimitive(input.category_id) ?? fallbackCategoryId),
    image_url: input.image_url || "https://placehold.co/600x400?text=Produto",
  };
}

export function normalizeCategory(input: Category): Category {
  return {
    ...input,
    name: input.name?.trim() || "Sem nome",
  };
}
