// src/services/dashboard.service.ts

import api from "./api/client";

// ==================== Types ====================
export interface DashboardSummary {
  money_in: number;
  money_out: number;
  net_flow: number;
  financial_health_score: number;
  grade: string;
  income_consistency: string;
  spending_discipline: string;
  transaction_stability: string;
  total_transactions: number;
}

export interface RecentTransaction {
  id: string;
  date: string;
  amount: number;
  type: "sent" | "received";
  counterparty: string;
  description: string;
  reference: string;
  balance: number | null;
  time_ago?: string;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
}

export interface Insight {
  type: "positive" | "warning" | "insight";
  title: string;
  description: string;
}

export interface SearchResult {
  name: string;
  phone: string;
  totalSent: number;
  totalReceived: number;
  transactionCount: number;
  firstSeen: string;
  lastSeen: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  recent_transactions: RecentTransaction[];
  spending_breakdown: SpendingCategory[];
  total_spent: number;
}

// ==================== Service ====================
class DashboardService {
  private tenantId: string = "default";
  private apiBase: string =
    process.env.REACT_APP_API_URL || "http://localhost:9000";

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  getTenantId(): string {
    return this.tenantId;
  }

  // Extract tenant from JWT
  private getTenantFromToken(): string {
    const token = this.getToken();
    if (!token) return this.tenantId;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.tenant_id) {
        console.log("Extracted tenant from JWT:", payload.tenant_id);
        return payload.tenant_id;
      }
    } catch (e) {
      console.warn("Could not extract tenant from JWT:", e);
    }
    return this.tenantId;
  }

  // ==================== Dashboard Data ====================
  async getDashboardData(
    tenantId: string = this.tenantId
  ): Promise<DashboardData> {
    try {
      const token = this.getToken();

      if (!token) {
        console.error("No authentication token found");
        throw new Error("No authentication token found");
      }

      let actualTenantId = tenantId;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.tenant_id) {
          actualTenantId = payload.tenant_id;
          console.log("Using tenant from JWT:", actualTenantId);
        }
      } catch (e) {
        console.warn("Could not extract tenant from JWT, using fallback");
      }

      console.log("Fetching dashboard data for tenant:", actualTenantId);

      const response = await fetch(
        `http://localhost:9000/api/dashboard/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": actualTenantId,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dashboard data received:", data);

      return {
        summary: data.summary,
        recent_transactions: data.recent_transactions || [],
        spending_breakdown: data.spending_breakdown || [],
        total_spent: data.total_spent || 0,
      };
    } catch (error) {
      console.error("Failed to get dashboard data:", error);
      return {
        summary: {
          money_in: 0,
          money_out: 0,
          net_flow: 0,
          financial_health_score: 0,
          grade: "N/A",
          income_consistency: "N/A",
          spending_discipline: "N/A",
          transaction_stability: "N/A",
          total_transactions: 0,
        },
        recent_transactions: [],
        spending_breakdown: [],
        total_spent: 0,
      };
    }
  }

  // Get dashboard summary (stats + calculated health score)
  async getSummary(): Promise<DashboardSummary> {
    try {
      const token = this.getToken();
      let tenantId = this.tenantId;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.tenant_id) {
            tenantId = payload.tenant_id;
            console.log("getSummary using tenant from JWT:", tenantId);
          }
        } catch (e) {
          console.warn("Could not extract tenant from JWT for summary");
        }
      }

      const response = await api.get(
        `/transactions/stats?tenant_id=${tenantId}`
      );
      const stats = response.data;

      let financial_health_score = 50;
      if (stats.net_flow > 0) {
        financial_health_score += Math.min(30, (stats.net_flow / 10000) * 10);
      } else {
        financial_health_score -= Math.min(
          30,
          (Math.abs(stats.net_flow) / 10000) * 10
        );
      }
      if (stats.total_transactions > 10) financial_health_score += 10;
      financial_health_score = Math.max(
        0,
        Math.min(100, financial_health_score)
      );

      let grade = "Poor";
      if (financial_health_score >= 80) grade = "Excellent";
      else if (financial_health_score >= 60) grade = "Good";
      else if (financial_health_score >= 40) grade = "Fair";

      return {
        money_in: stats.total_money_in,
        money_out: stats.total_money_out,
        net_flow: stats.net_flow,
        financial_health_score: Math.round(financial_health_score),
        grade: grade,
        income_consistency:
          stats.total_money_in > stats.total_money_out * 1.2
            ? "Strong"
            : "Moderate",
        spending_discipline:
          stats.total_money_out < stats.total_money_in * 0.7
            ? "Strong"
            : "Moderate",
        transaction_stability:
          stats.total_transactions > 20 ? "Strong" : "Building",
        total_transactions: stats.total_transactions,
      };
    } catch (error) {
      console.error("Failed to get summary:", error);
      return {
        money_in: 0,
        money_out: 0,
        net_flow: 0,
        financial_health_score: 0,
        grade: "N/A",
        income_consistency: "N/A",
        spending_discipline: "N/A",
        transaction_stability: "N/A",
        total_transactions: 0,
      };
    }
  }

  // ========== UPDATED: Get transactions with pagination support ==========
  async getTransactions(
    limit: number = 100,
    offset: number = 0
  ): Promise<RecentTransaction[]> {
    try {
      const token = this.getToken();
      let tenantId = this.tenantId;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.tenant_id) {
            tenantId = payload.tenant_id;
          }
        } catch (e) {}
      }

      const response = await api.get(
        `/transactions?tenant_id=${tenantId}&limit=${limit}&offset=${offset}`
      );
      return response.data.transactions || [];
    } catch (error) {
      console.error("Failed to get transactions:", error);
      return [];
    }
  }

  // ========== NEW: Get total transaction count ==========
  async getTransactionsCount(): Promise<number> {
    try {
      const stats = await this.getSummary();
      return stats.total_transactions;
    } catch (error) {
      console.error("Failed to get transaction count:", error);
      return 0;
    }
  }

  // Get spending breakdown
  async getSpendingCategories(): Promise<SpendingCategory[]> {
    try {
      const transactions = await this.getTransactions(500);
      const sentTransactions = transactions.filter((t) => t.type === "sent");

      const categories: Record<string, number> = {};
      const keywords: Record<string, string[]> = {
        Food: [
          "food",
          "restaurant",
          "cafe",
          "grocery",
          "supermarket",
          "kfc",
          "mcdonald",
          "uber eats",
          "naivas",
          "java",
        ],
        Transport: [
          "uber",
          "taxi",
          "fuel",
          "petrol",
          "bus",
          "transport",
          "bolt",
        ],
        Bills: [
          "kplc",
          "water",
          "electricity",
          "internet",
          "phone",
          "bill",
          "token",
        ],
        Shopping: ["shop", "mall", "store", "amazon", "jumia"],
        Entertainment: ["netflix", "spotify", "cinema", "movie"],
      };

      let totalExpense = 0;
      for (const tx of sentTransactions) {
        let categorized = false;
        const searchText = (
          tx.counterparty +
          " " +
          tx.description
        ).toLowerCase();
        for (const [category, keywordList] of Object.entries(keywords)) {
          if (keywordList.some((k) => searchText.includes(k))) {
            categories[category] = (categories[category] || 0) + tx.amount;
            totalExpense += tx.amount;
            categorized = true;
            break;
          }
        }
        if (!categorized) {
          categories["Other"] = (categories["Other"] || 0) + tx.amount;
          totalExpense += tx.amount;
        }
      }

      const result: SpendingCategory[] = Object.entries(categories)
        .map(([name, amount]) => ({
          name,
          amount: Math.round(amount),
          percentage:
            totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      return result;
    } catch (error) {
      console.error("Failed to get spending categories:", error);
      return [];
    }
  }

  // Get AI insights
  async getInsights(): Promise<Insight[]> {
    try {
      const stats = await this.getSummary();
      const insights: Insight[] = [];

      if (stats.money_in > 0) {
        insights.push({
          type: "positive",
          title: "Your income is stable",
          description: `You received KES ${stats.money_in.toLocaleString()} in payments. Your income pattern shows consistency.`,
        });
      }

      if (stats.money_out > 0) {
        insights.push({
          type: "warning",
          title: "Track your spending",
          description: `Your total expenses are KES ${stats.money_out.toLocaleString()}. Review your spending to identify saving opportunities.`,
        });
      }

      if (insights.length === 0) {
        insights.push({
          type: "insight",
          title: "Upload your first statement",
          description:
            "Upload an M-PESA statement to see personalized financial insights.",
        });
      }

      return insights;
    } catch (error) {
      console.error("Failed to get insights:", error);
      return [
        {
          type: "insight",
          title: "Welcome to Financial Intelligence",
          description:
            "Upload your first statement to get personalized insights.",
        },
      ];
    }
  }

  // Search counterparties
  async searchEntities(query: string): Promise<SearchResult | null> {
    if (!query || query.length < 2) return null;
    try {
      const transactions = await this.getTransactions(500);
      const userTransactions = transactions.filter((t) =>
        t.counterparty.toLowerCase().includes(query.toLowerCase())
      );

      if (userTransactions.length === 0) return null;

      const totalSent = userTransactions
        .filter((t) => t.type === "sent")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalReceived = userTransactions
        .filter((t) => t.type === "received")
        .reduce((sum, t) => sum + t.amount, 0);
      const dates = userTransactions.map((t) => new Date(t.date));
      const firstSeen = new Date(Math.min(...dates.map((d) => d.getTime())));
      const lastSeen = new Date(Math.max(...dates.map((d) => d.getTime())));

      return {
        name: query,
        phone: userTransactions[0]?.reference || "N/A",
        totalSent: Math.round(totalSent),
        totalReceived: Math.round(totalReceived),
        transactionCount: userTransactions.length,
        firstSeen: firstSeen.toLocaleDateString(),
        lastSeen: lastSeen.toLocaleDateString(),
      };
    } catch (error) {
      console.error("Failed to search:", error);
      return null;
    }
  }

  // Upload statement with optional password
  async uploadStatement(file: File, password?: string): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    let tenantId = this.tenantId;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.tenant_id) {
        tenantId = payload.tenant_id;
        console.log("Upload using tenant from JWT:", tenantId);
      }
    } catch (e) {}

    const formData = new FormData();
    formData.append("file", file);
    if (password) {
      formData.append("password", password);
    }

    const response = await fetch(`${this.apiBase}/api/v1/upload/statement`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant-ID": tenantId,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Upload failed: ${response.status}`);
    }

    return response.json();
  }
}

export const dashboardService = new DashboardService();
