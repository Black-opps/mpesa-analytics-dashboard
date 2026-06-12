// src/services/api/client.ts
import axios from "axios";
import { getToken, removeToken } from "../../features/auth/utils/token";

// Use the full URL to your gateway - NOT empty string
const API_BASE = "http://localhost:9000";

console.log("🔧 API Client configured with base URL:", API_BASE);

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["X-Tenant-ID"] = "default";
  console.log(
    `📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
      config.url
    }`
  );
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.url}`, error.message);
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
