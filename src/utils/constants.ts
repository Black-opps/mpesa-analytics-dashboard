export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

export const TRANSACTION_TYPES = {
  SEND_MONEY: "Send Money",
  WITHDRAW: "Withdraw",
  PAY_BILL: "Pay Bill",
  BUY_GOODS: "Buy Goods",
  BUY_AIRTIME: "Buy Airtime",
  DEPOSIT: "Deposit",
} as const;

export const TRANSACTION_STATUS = {
  SUCCESS: "Success",
  FAILED: "Failed",
  PENDING: "Pending",
  REVERSED: "Reversed",
} as const;

export const DATE_RANGE_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Custom Range", value: "custom" },
] as const;

export const CHART_COLORS = [
  "#2196f3",
  "#4caf50",
  "#ff9800",
  "#f44336",
  "#9c27b0",
  "#00bcd4",
];

export const PAGINATION_DEFAULT = { page: 1, limit: 20 };

export const LOCAL_STORAGE_KEYS = {
  THEME: "theme",
  TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;
