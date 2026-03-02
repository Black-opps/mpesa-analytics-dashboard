import api from "./api";
import { PaginatedResponse, PaginationParams } from "../types";

export interface Customer {
  id: string;
  phone_number: string;
  name?: string;
  email?: string;
  registered_date: string;
  total_transactions: number;
  total_volume: number;
  average_transaction: number;
  last_transaction_date?: string;
  status: "active" | "inactive" | "blocked";
}

export interface CustomerDetails extends Customer {
  transaction_history: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
  preferred_transaction_types: Record<string, number>;
  monthly_activity: Array<{
    month: string;
    transactions: number;
    volume: number;
  }>;
}

class CustomerService {
  private baseUrl = "/customers";

  async getCustomers(
    pagination?: PaginationParams,
    filter?: { status?: string; search?: string }
  ): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();

    if (pagination) {
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
    }

    if (filter) {
      if (filter.status) params.append("status", filter.status);
      if (filter.search) params.append("search", filter.search);
    }

    return api.get<PaginatedResponse<Customer>>(`${this.baseUrl}?${params}`);
  }

  async getCustomer(id: string): Promise<CustomerDetails> {
    return api.get<CustomerDetails>(`${this.baseUrl}/${id}`);
  }

  async getCustomerByPhone(phoneNumber: string): Promise<Customer> {
    return api.get<Customer>(`${this.baseUrl}/phone/${phoneNumber}`);
  }

  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    return api.get<Customer[]>(`${this.baseUrl}/top?limit=${limit}`);
  }
}

export default new CustomerService();
