import api from "../../../services/api/client";

import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
} from "../types/auth.types";

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>(
      "/api/v1/auth/login",
      payload
    );

    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>(
      "/api/v1/auth/register",
      payload
    );

    return response.data;
  },

  async me() {
    const response = await api.get<User>("/api/v1/auth/me");

    return response.data;
  },
};
