import api from "./api";
import {
  Transaction,
  TransactionFilter,
  TransactionSummary,
  PaginatedResponse,
  PaginationParams,
} from "../types";

class TransactionService {
  private baseUrl = "/transactions";

  async getTransactions(
    filter?: TransactionFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    if (pagination) {
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      if (pagination.sortBy) params.append("sortBy", pagination.sortBy);
      if (pagination.sortOrder)
        params.append("sortOrder", pagination.sortOrder);
    }

    return api.get<PaginatedResponse<Transaction>>(`${this.baseUrl}?${params}`);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return api.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  async getTransactionSummary(
    filter?: TransactionFilter
  ): Promise<TransactionSummary> {
    const params = filter ? new URLSearchParams(filter as any) : "";
    return api.get<TransactionSummary>(`${this.baseUrl}/summary?${params}`);
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return api.get<Transaction[]>(`${this.baseUrl}/recent?limit=${limit}`);
  }
}

export default new TransactionService();
