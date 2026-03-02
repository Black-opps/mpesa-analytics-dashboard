import api from "./api";
import {
  AnalyticsSummary,
  TransactionTrend,
  CustomerSegment,
  TopCustomer,
} from "../types";

class AnalyticsService {
  private baseUrl = "/analytics";

  async getSummary(dateRange?: {
    start: string;
    end: string;
  }): Promise<AnalyticsSummary> {
    const params = dateRange ? new URLSearchParams(dateRange) : "";
    return api.get<AnalyticsSummary>(`${this.baseUrl}/summary?${params}`);
  }

  async getTrends(
    period: "daily" | "weekly" | "monthly" = "daily"
  ): Promise<TransactionTrend[]> {
    return api.get<TransactionTrend[]>(
      `${this.baseUrl}/trends?period=${period}`
    );
  }

  async getCustomerSegments(): Promise<CustomerSegment[]> {
    return api.get<CustomerSegment[]>(`${this.baseUrl}/customer-segments`);
  }

  async getTopCustomers(limit: number = 10): Promise<TopCustomer[]> {
    return api.get<TopCustomer[]>(
      `${this.baseUrl}/top-customers?limit=${limit}`
    );
  }

  async getTransactionTypeDistribution(): Promise<Record<string, number>> {
    return api.get<Record<string, number>>(`${this.baseUrl}/transaction-types`);
  }

  async getPeakHours(): Promise<Array<{ hour: number; count: number }>> {
    return api.get<Array<{ hour: number; count: number }>>(
      `${this.baseUrl}/peak-hours`
    );
  }
}

export default new AnalyticsService();
