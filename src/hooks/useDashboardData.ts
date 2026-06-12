import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboard.service";

interface DashboardState {
  summary: any | null;
  transactions: any[];
  categories: any[];
  insights: any[];
  loading: boolean;
  error: string | null;
  partial: boolean;
}

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardState>({
    summary: null,
    transactions: [],
    categories: [],
    insights: [],
    loading: true,
    error: null,
    partial: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data with individual error handling
        const results = await Promise.allSettled([
          dashboardService.getSummary(),
          dashboardService.getTransactions(10),
          dashboardService.getSpendingCategories(),
          dashboardService.getInsights(),
        ]);

        const [
          summaryResult,
          transactionsResult,
          categoriesResult,
          insightsResult,
        ] = results;

        const partial = results.some((r) => r.status === "rejected");

        setState({
          summary:
            summaryResult.status === "fulfilled" ? summaryResult.value : null,
          transactions:
            transactionsResult.status === "fulfilled"
              ? transactionsResult.value
              : [],
          categories:
            categoriesResult.status === "fulfilled"
              ? categoriesResult.value
              : [],
          insights:
            insightsResult.status === "fulfilled" ? insightsResult.value : [],
          loading: false,
          error: null,
          partial,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard data",
        }));
      }
    };

    loadData();
  }, []);

  return state;
};
