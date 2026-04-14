// src/services/api.ts - COMPLETE FIXED VERSION

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class ApiService {
  private api: AxiosInstance;
  private tokenKey: string;
  private baseURL: string;
  private timeout: number;

  constructor() {
    // IMPORTANT: Point to API Gateway on port 9000, NOT port 8000
    this.baseURL =
      process.env.REACT_APP_API_URL || "http://localhost:9000/api/v1";
    this.timeout = parseInt(process.env.REACT_APP_API_TIMEOUT || "30000");
    this.tokenKey = process.env.REACT_APP_AUTH_TOKEN_KEY || "access_token";
    const refreshTokenKey =
      process.env.REACT_APP_REFRESH_TOKEN_KEY || "refresh_token";
    const environment = process.env.REACT_APP_ENVIRONMENT || "development";

    if (environment === "development") {
      console.log("🚀 API Service Configuration:", { baseURL: this.baseURL });
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: { "Content-Type": "application/json" },
      timeout: this.timeout,
    });

    // Request interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.response) {
          console.error(`🔌 Cannot connect to API at ${this.baseURL}`);
          return Promise.reject(new Error(`Cannot connect to API server`));
        }

        if (error.response.status === 401) {
          localStorage.removeItem(this.tokenKey);
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== GENERIC HTTP METHODS ====================
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  // ==================== TOKEN METHODS ====================
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ==================== USER METHODS FROM JWT ====================
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || "user";
    } catch {
      return null;
    }
  }

  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email || null;
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === "admin";
  }

  // ==================== AUTH METHODS ====================
  async login(email: string, password: string) {
    // Auth service expects JSON, not form-urlencoded
    const response = await this.post<{
      access_token: string;
      token_type: string;
    }>("/auth/login", { email, password });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async register(email: string, password: string) {
    return this.post("/auth/register", { email, password });
  }

  logout(): void {
    this.removeToken();
    window.location.href = "/login";
  }

  async getCurrentUser() {
    return this.get("/auth/me");
  }

  // ==================== TRANSACTION METHODS ====================
  async fetchTransactions(
    skip = 0,
    limit = 100,
    transactionType?: string
  ): Promise<any[]> {
    let url = `/transactions?skip=${skip}&limit=${limit}`;
    if (transactionType) url += `&transaction_type=${transactionType}`;
    const response = await this.get<any[]>(url);
    return response || [];
  }

  async createTransactions(transactions: any[]): Promise<any> {
    return this.post("/transactions", transactions);
  }

  async getTransaction(transactionId: string): Promise<any> {
    return this.get(`/transactions/${transactionId}`);
  }

  async deleteTransaction(transactionId: string): Promise<any> {
    return this.delete(`/transactions/${transactionId}`);
  }

  // ==================== CUSTOMER METHODS ====================
  async fetchCustomers(skip = 0, limit = 100): Promise<any[]> {
    try {
      // Try to get from analytics customers endpoint
      const response = await this.get<any>(
        `/analytics/customers?skip=${skip}&limit=${limit}`
      );
      return response.customers || response || [];
    } catch {
      // Fallback: derive from transactions
      const transactions = await this.fetchTransactions(skip, limit);
      const customerMap = new Map();
      transactions.forEach((tx: any) => {
        const phone = tx.counterparty;
        if (!customerMap.has(phone)) {
          customerMap.set(phone, {
            phone,
            transaction_count: 0,
            total_volume: 0,
          });
        }
        const c = customerMap.get(phone);
        c.transaction_count++;
        c.total_volume += Math.abs(tx.amount);
      });
      return Array.from(customerMap.values());
    }
  }

  // ==================== ANALYTICS METHODS ====================
  async getAnalyticsSummary() {
    return this.get("/analytics/summary");
  }

  async fetchDailyAnalytics(days = 7) {
    return this.get(`/analytics/daily?days=${days}`);
  }

  async fetchTransactionTypes() {
    return this.get("/analytics/transaction-types");
  }

  async fetchTopCustomers(limit = 5) {
    return this.get(`/analytics/top-customers?limit=${limit}`);
  }

  async getDashboardOverview() {
    return this.get("/dashboard/overview");
  }

  // ==================== HEALTH CHECK ====================
  async checkHealth(): Promise<boolean> {
    try {
      await this.api.get("/health", { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;
