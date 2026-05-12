import React, { createContext, useEffect, useState } from "react";

import {
  AuthContextType,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth.types";

import { authService } from "../services/authService";

import { getToken, saveToken, removeToken } from "../utils/token";

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(getToken());

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  // LOGIN
  const login = async (payload: LoginPayload) => {
    const response = await authService.login(payload);

    saveToken(response.access_token);

    setToken(response.access_token);

    setUser(response.user);
  };

  // REGISTER
  const register = async (payload: RegisterPayload) => {
    const response = await authService.register(payload);

    saveToken(response.access_token);

    setToken(response.access_token);

    setUser(response.user);
  };

  // LOGOUT
  const logout = () => {
    removeToken();

    setUser(null);

    setToken(null);
  };

  // RESTORE SESSION
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const existingToken = getToken();

        if (!existingToken) {
          setLoading(false);
          return;
        }

        setToken(existingToken);

        const userData = await authService.me();

        setUser(userData);
      } catch (error) {
        console.error(error);

        removeToken();

        setUser(null);

        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
