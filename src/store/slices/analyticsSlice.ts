import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import analyticsService from "../../services/analytics";
import {
  AnalyticsSummary,
  TransactionTrend,
  CustomerSegment,
  TopCustomer,
} from "../../types";

interface AnalyticsState {
  summary: AnalyticsSummary | null;
  trends: TransactionTrend[];
  customerSegments: CustomerSegment[];
  topCustomers: TopCustomer[];
  loading: {
    summary: boolean;
    trends: boolean;
    segments: boolean;
    topCustomers: boolean;
  };
  error: string | null;
}

const initialState: AnalyticsState = {
  summary: null,
  trends: [],
  customerSegments: [],
  topCustomers: [],
  loading: {
    summary: false,
    trends: false,
    segments: false,
    topCustomers: false,
  },
  error: null,
};

export const fetchAnalyticsSummary = createAsyncThunk(
  "analytics/fetchSummary",
  async (dateRange?: { start: string; end: string }) => {
    return await analyticsService.getSummary(dateRange);
  }
);

export const fetchTrends = createAsyncThunk(
  "analytics/fetchTrends",
  async (period: "daily" | "weekly" | "monthly" = "daily") => {
    return await analyticsService.getTrends(period);
  }
);

export const fetchCustomerSegments = createAsyncThunk(
  "analytics/fetchCustomerSegments",
  async () => {
    return await analyticsService.getCustomerSegments();
  }
);

export const fetchTopCustomers = createAsyncThunk(
  "analytics/fetchTopCustomers",
  async (limit: number = 10) => {
    return await analyticsService.getTopCustomers(limit);
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading.summary = true;
        state.error = null;
      })
      .addCase(
        fetchAnalyticsSummary.fulfilled,
        (state, action: PayloadAction<AnalyticsSummary>) => {
          state.loading.summary = false;
          state.summary = action.payload;
        }
      )
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error =
          action.error.message || "Failed to fetch analytics summary";
      })
      // Trends
      .addCase(fetchTrends.pending, (state) => {
        state.loading.trends = true;
      })
      .addCase(
        fetchTrends.fulfilled,
        (state, action: PayloadAction<TransactionTrend[]>) => {
          state.loading.trends = false;
          state.trends = action.payload;
        }
      )
      .addCase(fetchTrends.rejected, (state, action) => {
        state.loading.trends = false;
        state.error = action.error.message || "Failed to fetch trends";
      })
      // Customer Segments
      .addCase(
        fetchCustomerSegments.fulfilled,
        (state, action: PayloadAction<CustomerSegment[]>) => {
          state.customerSegments = action.payload;
        }
      )
      // Top Customers
      .addCase(
        fetchTopCustomers.fulfilled,
        (state, action: PayloadAction<TopCustomer[]>) => {
          state.topCustomers = action.payload;
        }
      );
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
