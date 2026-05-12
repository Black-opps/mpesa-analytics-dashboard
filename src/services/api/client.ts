import axios from "axios";

import { getToken, removeToken } from "../../features/auth/utils/token";

const api = axios.create({
  baseURL: "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      removeToken();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
