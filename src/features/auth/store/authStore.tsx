// src/features/auth/store/authStore.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "../utils/token";
import api from "../../../services/api/client";

export interface User {
  id?: string;
  email?: string;
  full_name?: string;
  role?: string;
  tenant_id?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    full_name: string
  ) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Helper functions for refresh token
const getRefreshToken = (): string | null =>
  localStorage.getItem("refresh_token");
const saveRefreshToken = (token: string) =>
  localStorage.setItem("refresh_token", token);
const removeRefreshToken = () => localStorage.removeItem("refresh_token");

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    getRefreshToken()
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  const refreshAccessToken = async (): Promise<string | null> => {
    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) return null;

    try {
      const response = await api.post("/auth/refresh", {
        refresh_token: currentRefreshToken,
      });
      const newToken = response.data.access_token;
      saveToken(newToken);
      setTokenState(newToken);
      return newToken;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      logout();
      return null;
    }
  };

  const fetchUser = async (authToken: string): Promise<boolean> => {
    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
      setTokenState(authToken);
      return true;
    } catch (err: any) {
      console.error("Failed to fetch user", err);

      // If token expired, try to refresh
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return fetchUser(newToken);
        }
      }

      removeToken();
      removeRefreshToken();
      setTokenState(null);
      setRefreshTokenState(null);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const newToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      const userData = response.data.user;

      saveToken(newToken);
      saveRefreshToken(newRefreshToken);
      setTokenState(newToken);
      setRefreshTokenState(newRefreshToken);
      setUser(userData);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    full_name: string
  ) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        full_name,
      });
      const newToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      const userData = response.data.user;

      saveToken(newToken);
      saveRefreshToken(newRefreshToken);
      setTokenState(newToken);
      setRefreshTokenState(newRefreshToken);
      setUser(userData);
    } catch (err) {
      console.error("Register failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Optionally call logout endpoint
    if (refreshToken) {
      api
        .post("/auth/logout", { refresh_token: refreshToken })
        .catch(console.error);
    }
    removeToken();
    removeRefreshToken();
    setTokenState(null);
    setRefreshTokenState(null);
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
