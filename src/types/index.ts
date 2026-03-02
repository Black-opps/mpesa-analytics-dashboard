export * from "./analytics";
export * from "./transaction";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
