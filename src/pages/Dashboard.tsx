// src/pages/Dashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { BarChart, PieChart } from "../components/charts";
import api from "../services/api"; // FIXED: default import

// Define types based on actual API response
interface AnalyticsResponse {
  total_sent: number;
  total_received: number;
  transaction_count: number;
}

interface DailyData {
  date: string;
  amount: number;
}

interface TransactionType {
  type: string;
  amount: number;
  count: number;
}

interface TopCustomer {
  counterparty: string;
  total: number;
  count: number;
}

interface ExtendedAnalytics {
  daily_totals: DailyData[];
  transaction_types: TransactionType[];
  top_customers: TopCustomer[];
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [extendedAnalytics, setExtendedAnalytics] =
    useState<ExtendedAnalytics | null>(null);
  const [loading, setLoading] = useState({
    summary: true,
    trends: true,
    transactionTypes: true,
    topCustomers: true,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchExtendedAnalytics = useCallback(async () => {
    try {
      let dailyData: DailyData[] = [];
      let transactionTypes: TransactionType[] = [];
      let topCustomers: TopCustomer[] = [];

      try {
        const dailyResponse = await api.get("/analytics/daily");
        dailyData = dailyResponse as DailyData[];
        setLoading((prev) => ({ ...prev, trends: false }));
      } catch {
        dailyData = generateMockDailyData();
        setLoading((prev) => ({ ...prev, trends: false }));
      }

      try {
        const typesResponse = await api.get("/analytics/transaction-types");
        transactionTypes = typesResponse as TransactionType[];
        setLoading((prev) => ({ ...prev, transactionTypes: false }));
      } catch {
        transactionTypes = generateMockTransactionTypes();
        setLoading((prev) => ({ ...prev, transactionTypes: false }));
      }

      try {
        const customersResponse = await api.get("/analytics/top-customers");
        topCustomers = customersResponse as TopCustomer[];
        setLoading((prev) => ({ ...prev, topCustomers: false }));
      } catch {
        topCustomers = generateMockTopCustomers();
        setLoading((prev) => ({ ...prev, topCustomers: false }));
      }

      setExtendedAnalytics({
        daily_totals: dailyData,
        transaction_types: transactionTypes,
        top_customers: topCustomers,
      });
    } catch (err) {
      console.error("Error fetching extended analytics:", err);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, summary: true }));
      const response = (await api.get(
        "/analytics/summary"
      )) as AnalyticsResponse;
      setAnalytics(response);
      setLoading((prev) => ({ ...prev, summary: false }));

      await fetchExtendedAnalytics();
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard error:", err);
      setLoading({
        summary: false,
        trends: false,
        transactionTypes: false,
        topCustomers: false,
      });
    }
  }, [fetchExtendedAnalytics]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Mock data generators (temporary until backend endpoints are ready)
  const generateMockDailyData = (): DailyData[] => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        amount: Math.floor(Math.random() * 10000 + 5000),
      });
    }
    return data;
  };

  const generateMockTransactionTypes = (): TransactionType[] => {
    return [
      { type: "send_money", amount: 45000, count: 15 },
      { type: "pay_bill", amount: 32000, count: 8 },
      { type: "buy_goods", amount: 18000, count: 12 },
      { type: "withdraw", amount: 25000, count: 5 },
    ];
  };

  const generateMockTopCustomers = (): TopCustomer[] => {
    return [
      { counterparty: "254712345678", total: 25000, count: 8 },
      { counterparty: "254723456789", total: 18000, count: 6 },
      { counterparty: "254734567890", total: 12500, count: 4 },
      { counterparty: "254745678901", total: 9500, count: 3 },
      { counterparty: "254756789012", total: 7200, count: 2 },
    ];
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sent
              </Typography>
              <Typography variant="h4">
                {loading.summary ? (
                  <CircularProgress size={30} />
                ) : (
                  `KES ${analytics?.total_sent?.toLocaleString() || 0}`
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Received
              </Typography>
              <Typography variant="h4">
                {loading.summary ? (
                  <CircularProgress size={30} />
                ) : (
                  `KES ${analytics?.total_received?.toLocaleString() || 0}`
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Transaction Count
              </Typography>
              <Typography variant="h4">
                {loading.summary ? (
                  <CircularProgress size={30} />
                ) : (
                  analytics?.transaction_count?.toLocaleString() || 0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Trends Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Daily Transaction Trends
        </Typography>
        {loading.trends ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <BarChart
            data={extendedAnalytics?.daily_totals || []}
            xKey="date"
            yKey="amount"
            title="Daily Transaction Volume"
            height={400}
          />
        )}
      </Paper>

      {/* Transaction Types Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChart
            data={extendedAnalytics?.transaction_types || []}
            title="Transaction Distribution by Type"
            height={420}
            isLoading={loading.transactionTypes}
          />
        </Grid>

        {/* Top Customers */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Customers
            </Typography>
            {loading.topCustomers ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {extendedAnalytics?.top_customers?.map((customer, index) => (
                  <Box
                    key={customer.counterparty}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom:
                        index <
                        (extendedAnalytics?.top_customers.length || 0) - 1
                          ? "1px solid #eee"
                          : "none",
                    }}
                  >
                    <Box>
                      <Typography variant="body1">
                        {customer.counterparty}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {customer.count} transactions
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      KES {customer.total.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
    </Container>
  );
}
