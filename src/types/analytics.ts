export interface AnalyticsSummary {
  total_transactions: number;
  total_volume: number;
  average_transaction: number;
  active_customers: number;
  success_rate: number;
  peak_hour: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  volume?: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  average_transaction: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  phone: string;
  transaction_count: number;
  total_volume: number;
  last_transaction: string;
}

export interface TransactionTrend {
  date: string;
  count: number;
  volume: number;
  success_count: number;
  failed_count: number;
}
