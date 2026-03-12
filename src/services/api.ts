// src/services/api.ts - FIXED (DUPLICATES REMOVED)

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class ApiService {
  private api: AxiosInstance;
  private tokenKey: string;
  private baseURL: string;
  private timeout: number;

  constructor() {
    // Get values from environment variables with fallbacks
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
    this.timeout = parseInt(process.env.REACT_APP_API_TIMEOUT || "30000");
    this.tokenKey = process.env.REACT_APP_AUTH_TOKEN_KEY || "access_token";
    const refreshTokenKey =
      process.env.REACT_APP_REFRESH_TOKEN_KEY || "refresh_token";
    const environment = process.env.REACT_APP_ENVIRONMENT || "development";
    const enableAnalytics = process.env.REACT_APP_ENABLE_ANALYTICS === "true";
    const enableRealTime = process.env.REACT_APP_ENABLE_REAL_TIME === "true";

    // Log configuration in development only
    if (environment === "development") {
      console.log("🚀 API Service Configuration:", {
        baseURL: this.baseURL,
        timeout: `${this.timeout}ms`,
        environment,
        enableAnalytics,
        enableRealTime,
        tokenKey: this.tokenKey,
      });
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: this.timeout,
    });

    // Request interceptor - add token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(this.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (environment === "development") {
          console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        console.error("❌ Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => {
        // Log responses in development
        if (environment === "development") {
          console.log(`📥 ${response.status} ${response.config.url}`, {
            data: response.data,
          });
        }
        return response;
      },
      async (error) => {
        // Handle timeout errors
        if (error.code === "ECONNABORTED") {
          console.error(`⏱️ Request timeout after ${this.timeout}ms`);
          return Promise.reject(
            new Error(
              `Request timeout after ${this.timeout}ms. The server might be slow or unavailable.`
            )
          );
        }

        // Handle network errors (server not running)
        if (!error.response) {
          console.error(`🔌 Cannot connect to API at ${this.baseURL}`);
          return Promise.reject(
            new Error(
              `Cannot connect to API at ${this.baseURL}. Please make sure the API server is running.\n` +
                `Run: python -m uvicorn app.main:app --reload`
            )
          );
        }

        // Handle specific HTTP status codes
        const status = error.response.status;
        const data = error.response.data;

        // Log errors in development
        if (environment === "development") {
          console.error(`❌ API Error ${status}:`, {
            url: error.config?.url,
            method: error.config?.method,
            data: data,
          });
        }

        // Handle 401 Unauthorized
        if (status === 401) {
          console.error("🔒 Unauthorized - redirecting to login");
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem(refreshTokenKey);

          // Only redirect if not already on login page
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }

          return Promise.reject(
            new Error("Your session has expired. Please login again.")
          );
        }

        // Handle 403 Forbidden
        if (status === 403) {
          return Promise.reject(
            new Error("You don't have permission to perform this action.")
          );
        }

        // Handle 404 Not Found
        if (status === 404) {
          return Promise.reject(
            new Error(
              `The requested resource was not found: ${error.config?.url}`
            )
          );
        }

        // Handle 422 Validation Error
        if (status === 422) {
          console.log("🔴 422 Error URL:", error.config?.url); // ADD THIS
          console.log("🔴 422 Error params:", error.config?.params); // ADD THIS
          console.log("🔴 422 Error data:", error.config?.data); // ADD THIS

          const validationErrors = data.detail
            ?.map((err: any) => `${err.loc.join(".")}: ${err.msg}`)
            .join(", ");

          return Promise.reject(
            new Error(
              `Validation error: ${validationErrors || "Invalid data provided"}`
            )
          );
        }

        // Handle 500 Internal Server Error
        if (status >= 500) {
          return Promise.reject(
            new Error(
              "Server error. Please try again later or contact support."
            )
          );
        }

        // Default error message
        const message =
          data?.detail ||
          data?.message ||
          error.message ||
          "An unknown error occurred";
        return Promise.reject(new Error(message));
      }
    );
  }

  // ==================== GENERIC HTTP METHODS ====================

  /**
   * Generic GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PATCH request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE request failed for ${url}:`, error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Check if API is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      await this.api.get("/health", { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set the authentication token
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Remove the authentication token (logout)
   */
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // src/services/api.ts - Add these methods to the ApiService class

  // Add this after the isAuthenticated() method (around line 200-220)

  /**
   * Decode JWT token and get user role
   */
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // JWT tokens are in three parts: header.payload.signature
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.role || "user"; // Default to 'user' if role not specified
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.getUserRole() === "admin";
  }

  /**
   * Get current user ID from token
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.sub || null;
    } catch {
      return null;
    }
  }

  /**
   * Get current user email from token
   */
  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.email || null;
    } catch {
      return null;
    }
  }

  /**
   * Get full token payload
   */
  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  }

  // ==================== ANALYTICS METHODS ====================

  /**
   * Fetch daily analytics for the last N days
   */
  async fetchDailyAnalytics(days: number = 7) {
    return this.get<any[]>(`/analytics/daily?days=${days}`);
  }

  /**
   * Fetch transaction types breakdown
   */
  async fetchTransactionTypes() {
    return this.get<any[]>("/analytics/transaction-types");
  }

  /**
   * Fetch top customers by transaction volume
   */
  async fetchTopCustomers(limit: number = 5) {
    return this.get<any[]>(`/analytics/top-customers?limit=${limit}`);
  }

  /**
   * Fetch customers for the current user
   */
  async fetchCustomers(skip: number = 0, limit: number = 100) {
    return this.get<any[]>(`/customers?skip=${skip}&limit=${limit}`);
  }
  /**
   * Get analytics summary (SINGLE DEFINITION)
   */
  async getAnalyticsSummary() {
    return this.get<any>("/analytics");
  }

  /**
   * Get comprehensive analytics summary (RENAMED to avoid duplicate)
   */
  async getComprehensiveAnalytics() {
    return this.get<any>("/analytics/summary");
  }

  // Add these after your existing analytics methods (around line 250-300)

  // ==================== ADMIN METHODS ====================

  /**
   * Get all users (admin only)
   */
  async getAllUsers(skip: number = 0, limit: number = 100) {
    return this.get<any[]>(`/admin/users?skip=${skip}&limit=${limit}`);
  }

  /**
   * Create a new user (admin only)
   */
  async createUserByAdmin(email: string, password: string) {
    return this.post<any>("/admin/users", { email, password });
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: number, newRole: string) {
    return this.put<any>(`/admin/users/${userId}/role?new_role=${newRole}`);
  }

  /**
   * Toggle user active status (admin only)
   */
  async toggleUserStatus(userId: number) {
    return this.put<any>(`/admin/users/${userId}/toggle-status`);
  }

  /**
   * Delete a user (admin only)
   */
  async deleteUser(userId: number) {
    return this.delete<any>(`/admin/users/${userId}`);
  }

  /**
   * Get analytics for all users (admin only)
   */
  async getAllUsersAnalytics() {
    return this.get<any[]>("/admin/analytics/all");
  }
  // ==================== TRANSACTION METHODS ====================

  /**
   * Fetch transactions with pagination and filters
   */
  async fetchTransactions(
    skip: number = 0,
    limit: number = 100,
    transaction_type?: string,
    start_date?: string,
    end_date?: string
  ) {
    let url = `/transactions?skip=${skip}&limit=${limit}`;
    if (transaction_type) url += `&transaction_type=${transaction_type}`;
    if (start_date) url += `&start_date=${start_date}`;
    if (end_date) url += `&end_date=${end_date}`;

    return this.get<any[]>(url);
  }

  /**
   * Get a single transaction by ID
   */
  async getTransaction(transactionId: string) {
    return this.get<any>(`/transactions/${transactionId}`);
  }

  /**
   * Create new transactions
   */
  async createTransactions(transactions: any[]) {
    return this.post<any>("/transactions", transactions);
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(transactionId: string) {
    return this.delete<any>(`/transactions/${transactionId}`);
  }

  // ==================== AUTH METHODS ====================

  /**
   * Login user
   */
  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await this.post<{
      access_token: string;
      token_type: string;
    }>("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Store token on successful login
    if (response.access_token) {
      this.setToken(response.access_token);
    }

    return response;
  }

  /**
   * Register user
   */
  async register(email: string, password: string) {
    return this.post<any>("/auth/register", { email, password });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.removeToken();
    window.location.href = "/login";
  }

  /**
   * Get current user info
   */
  async getCurrentUser() {
    return this.get<any>("/users/me");
  }

  /**
   * Get user statistics
   */
  async getUserStatistics() {
    return this.get<any>("/users/me/statistics");
  }
}

// Export a single instance
const apiService = new ApiService();
export default apiService;
