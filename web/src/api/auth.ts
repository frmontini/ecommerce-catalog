import { api } from "./client";
import type { AuthResponse } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

function extractAuthResponse(payload: unknown): AuthResponse {
  const record = (payload ?? {}) as Record<string, unknown>;
  const token =
    (typeof record.token === "string" && record.token) ||
    (typeof (record.data as Record<string, unknown> | undefined)?.token === "string"
      ? ((record.data as Record<string, unknown>).token as string)
      : "");

  const user =
    ((record.user as AuthResponse["user"]) ||
      ((record.data as Record<string, unknown> | undefined)?.user as AuthResponse["user"])) ??
    undefined;

  return { token, user };
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/login", payload);
  return extractAuthResponse(data);
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/register", payload);
  return extractAuthResponse(data);
}
