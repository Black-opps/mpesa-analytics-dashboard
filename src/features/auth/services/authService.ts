// src/features/auth/services/authService.ts
import api from "../../../services/api/client";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "../types/auth.types";

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },

  async me() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
