// src/pages/Dashboard.tsx - COMPLETE FIXED VERSION

import { useNavigate } from "react-router-dom";
import BugReportIcon from "@mui/icons-material/BugReport";
import { Button } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  alpha,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import {
  AttachMoney,
  People,
  Receipt,
  TrendingUp,
  Refresh,
  Send,
  Receipt as ReceiptIcon,
  PhoneIphone,
  AccountBalance,
  Store,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAnalyticsSummary,
  fetchTrends,
  selectAnalyticsSummary,
  selectTrends,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from "../store/slices/analyticsSlice";
import StatCard from "../components/cards/StatCard";
import TransactionChart from "../components/charts/TransactionChart";
import RevenuePieChart from "../components/charts/RevenuePieChart";
import LoadingSpinner from "../components/common/LoadingSpinner";
import api from "../services/api";

interface PieDataItem {
  name: string;
  value: number;
  color: string;
  icon: React.ReactElement;
}

interface ChartDataItem {
  date: string;
  volume: number;
  count: number;
  success_count: number;
  failed_count: number;
}

interface Transaction {
  id: string;
  transaction_id: string;
  amount: number;
  transaction_type: string;
  counterparty: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const summary = useAppSelector(selectAnalyticsSummary);
  const trends = useAppSelector(selectTrends);
  const loading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);

  // Local state
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState<PieDataItem[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Mock pie data (fallback)
  const mockPieData: PieDataItem[] = [
    { name: "Send Money", value: 12500, color: "#6366f1", icon: <Send /> },
    { name: "Pay Bill", value: 8300, color: "#10b981", icon: <ReceiptIcon /> },
    {
      name: "Buy Airtime",
      value: 4200,
      color: "#f59e0b",
      icon: <PhoneIphone />,
    },
    {
      name: "Withdraw",
      value: 2800,
      color: "#ec4899",
      icon: <AccountBalance />,
    },
    { name: "Buy Goods", value: 1900, color: "#8b5cf6", icon: <Store /> },
  ];

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const data = await api.fetchTransactions(0, 1000);
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  // Fetch transaction types
  const fetchTransactionTypes = useCallback(async () => {
    setLoadingTypes(true);
    try {
      console.log("📊 Fetching transaction types...");
      const data = await api.fetchTransactionTypes();
      console.log("📊 Transaction types data:", data);

      const colors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
      const icons = [
        <Send />,
        <ReceiptIcon />,
        <PhoneIphone />,
        <AccountBalance />,
        <Store />,
      ];

      const transformedData = data.map((item: any, index: number) => ({
        name: item.type
          .split("_")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: item.amount,
        color: colors[index % colors.length],
        icon: icons[index % icons.length],
      }));

      setTransactionTypes(transformedData);
    } catch (err) {
      console.error("Failed to fetch transaction types:", err);
      // Fallback to mock data
      setTransactionTypes(mockPieData);
    } finally {
      setLoadingTypes(false);
    }
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchAnalyticsSummary()).unwrap(),
        dispatch(fetchTrends(period)).unwrap(),
        fetchTransactions(),
        fetchTransactionTypes(),
      ]);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  }, [dispatch, period, fetchTransactions, fetchTransactionTypes]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate derived values
  const transactionCount = summary?.transaction_count || 0;
  const totalSent = summary?.total_sent || 0;
  const averageTransaction =
    transactionCount > 0 ? totalSent / transactionCount : 0;

  // Calculate unique customers from transactions
  const uniqueCustomers = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    const uniqueCounterparties = new Set(
      transactions.map((tx) => tx.counterparty)
    );
    return uniqueCounterparties.size;
  }, [transactions]);

  // Transform trends data
  const chartData: ChartDataItem[] = Array.isArray(trends)
    ? trends.map((item) => ({
        date: item?.date || "",
        volume: item?.volume || item?.amount || 0,
        count: item?.count || 0,
        success_count: 0,
        failed_count: 0,
      }))
    : [];

  // Loading state
  if (
    loading.summary ||
    loading.trends ||
    refreshing ||
    loadingTransactions ||
    loadingTypes
  ) {
    return <LoadingSpinner message="Refreshing dashboard data..." />;
  }

  // Error state
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton color="inherit" size="small" onClick={loadData}>
            <Refresh />
          </IconButton>
        }
        sx={{ m: 4 }}
      >
        Failed to load dashboard data: {error}
      </Alert>
    );
  }

  // Stat cards
  const statCards = [
    {
      title: "Total Transactions",
      value: transactionCount.toLocaleString(),
      icon: <Receipt fontSize="large" />,
      trend: 12.5,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },
    {
      title: "Total Volume",
      value: `KES ${totalSent.toLocaleString()}`,
      icon: <AttachMoney fontSize="large" />,
      trend: 8.2,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    },
    {
      title: "Average Transaction",
      value: `KES ${averageTransaction.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
      icon: <TrendingUp fontSize="large" />,
      trend: -2.4,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    },
    {
      title: "Active Customers",
      value: uniqueCustomers.toLocaleString(),
      icon: <People fontSize="large" />,
      trend: 15.8,
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    },
  ];

  // Use real transaction types if available, otherwise fallback to mock
  const displayPieData =
    transactionTypes.length > 0 ? transactionTypes : mockPieData;

  // Pie data calculations
  const totalPieValue = displayPieData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const mostPopular =
    displayPieData.length > 0
      ? displayPieData.reduce(
          (max, item) => (item.value > max.value ? item : max),
          displayPieData[0]
        )
      : { name: "N/A" };
  const leastPopular =
    displayPieData.length > 0
      ? displayPieData.reduce(
          (min, item) => (item.value < min.value ? item : min),
          displayPieData[0]
        )
      : { name: "N/A" };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 5,
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time insights into your M-Pesa transactions
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as typeof period)}
              sx={{
                borderRadius: 3,
                bgcolor: "background.paper",
                "& .MuiSelect-select": { py: 1 },
              }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            size="small"
            startIcon={<BugReportIcon />}
            onClick={() => navigate("/debug")}
            sx={{ mr: 1 }}
          >
            Debug
          </Button>

          <IconButton
            onClick={loadData}
            disabled={refreshing}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              "&:hover": { bgcolor: alpha("#6366f1", 0.12) },
            }}
          >
            <Refresh className={refreshing ? "spin" : ""} />
          </IconButton>
        </Stack>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              color={card.color}
              gradient={card.gradient}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Transaction Trends */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 4,
              border: `1px solid ${alpha("#6366f1", 0.08)}`,
              height: "100%",
              minHeight: 420,
            }}
          >
            {chartData.length > 0 ? (
              <TransactionChart
                data={chartData}
                title={`Transaction Trends (${period})`}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography color="text.secondary">
                  No transaction data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Revenue Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 4,
              border: `1px solid ${alpha("#6366f1", 0.08)}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <RevenuePieChart
              data={
                transactionTypes.length > 0 ? transactionTypes : mockPieData
              } // Changed pieData to mockPieData
              title="Transaction Distribution by Type"
              height={420}
              isLoading={loading.summary || loadingTypes}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Summary Statistics
            </Typography>

            <Stack spacing={2.5}>
              {[
                {
                  label: "Total Volume",
                  value: `KES ${totalPieValue.toLocaleString()}`,
                },
                {
                  label: "Average per Type",
                  value: `KES ${(
                    totalPieValue / (displayPieData.length || 1)
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                },
                {
                  label: "Most Popular",
                  value: mostPopular.name,
                },
                {
                  label: "Least Popular",
                  value: leastPopular.name,
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
