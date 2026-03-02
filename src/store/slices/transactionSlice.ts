import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import transactionService from "../../services/transactions";
import {
  Transaction,
  TransactionFilter,
  TransactionSummary,
  PaginatedResponse,
} from "../../types";

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  summary: TransactionSummary | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  summary: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async ({
    filter,
    page = 1,
    limit = 20,
  }: {
    filter?: TransactionFilter;
    page?: number;
    limit?: number;
  }) => {
    return await transactionService.getTransactions(filter, { page, limit });
  }
);

export const fetchTransactionSummary = createAsyncThunk(
  "transactions/fetchSummary",
  async (filter?: TransactionFilter) => {
    return await transactionService.getTransactionSummary(filter);
  }
);

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchById",
  async (id: string) => {
    return await transactionService.getTransaction(id);
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
    clearTransactionError: (state) => {
      state.error = null;
    },
    setTransactionFilter: (state, action: PayloadAction<TransactionFilter>) => {
      // Handle filter in component state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Transaction>>) => {
          state.loading = false;
          state.transactions = action.payload.items;
          state.pagination = {
            page: action.payload.page,
            limit: action.payload.limit,
            total: action.payload.total,
            totalPages: action.payload.totalPages,
          };
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })
      // Fetch Summary
      .addCase(
        fetchTransactionSummary.fulfilled,
        (state, action: PayloadAction<TransactionSummary>) => {
          state.summary = action.payload;
        }
      )
      // Fetch Single Transaction
      .addCase(
        fetchTransactionById.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.selectedTransaction = action.payload;
        }
      );
  },
});

export const { clearSelectedTransaction, clearTransactionError } =
  transactionSlice.actions;
export default transactionSlice.reducer;
