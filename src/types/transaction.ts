export interface Transaction {
  id: string;
  transaction_id: string;
  phone_number: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
  description?: string;
  recipient?: string;
  reference?: string;
}

export enum TransactionType {
  SEND_MONEY = "SEND_MONEY",
  WITHDRAW = "WITHDRAW",
  PAY_BILL = "PAY_BILL",
  BUY_GOODS = "BUY_GOODS",
  BUY_AIRTIME = "BUY_AIRTIME",
  DEPOSIT = "DEPOSIT",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
  REVERSED = "REVERSED",
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  phoneNumber?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionSummary {
  total_count: number;
  total_amount: number;
  average_amount: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
}
