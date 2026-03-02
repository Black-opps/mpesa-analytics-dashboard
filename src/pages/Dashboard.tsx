import React, { useEffect, useState } from "react";
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
  Skeleton,
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
} from "../store/slices/analyticsSlice";
import StatCard from "../components/cards/StatCard";
import TransactionChart from "../components/charts/TransactionChart";
import RevenuePieChart from "../components/charts/RevenuePieChart";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { summary, trends, loading, error } = useAppSelector(
    (state) => state.analytics
  );

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchAnalyticsSummary()).unwrap(),
        dispatch(fetchTrends(period)).unwrap(),
      ]);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 600); // slight delay for UX
    }
  };

  // Loading state
  if (loading.summary || loading.trends || refreshing) {
    return <LoadingSpinner message="Refreshing dashboard data..." />;
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Failed to load dashboard data: {error}
        <IconButton
          color="inherit"
          size="small"
          onClick={loadData}
          sx={{ ml: 2 }}
        >
          <Refresh />
        </IconButton>
      </Alert>
    );
  }

  // Derive stat cards safely
  const statCards = [
    {
      title: "Total Transactions",
      value: summary?.total_transactions?.toLocaleString() ?? "0",
      icon: <Receipt fontSize="large" />,
      trend: 12.5,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },
    {
      title: "Total Volume",
      value: `KES ${summary?.total_volume?.toLocaleString() ?? "0"}`,
      icon: <AttachMoney fontSize="large" />,
      trend: 8.2,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    },
    {
      title: "Average Transaction",
      value: `KES ${summary?.average_transaction?.toLocaleString() ?? "0"}`,
      icon: <TrendingUp fontSize="large" />,
      trend: -2.4,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    },
    {
      title: "Active Customers",
      value: summary?.active_customers?.toLocaleString() ?? "0",
      icon: <People fontSize="large" />,
      trend: 15.8,
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    },
  ];

  // Sample pie data (replace with real data from API when available)
  const pieData = [
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

          <IconButton
            onClick={loadData}
            disabled={refreshing}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              "&:hover": { bgcolor: alpha("#6366f1", 0.12) },
            }}
            aria-label="Refresh dashboard"
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
        {/* Transaction Trends – main chart */}
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
            <TransactionChart data={trends} title="Transaction Trends" />
          </Paper>
        </Grid>

        {/* Revenue Distribution + Summary */}
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
            <RevenuePieChart data={pieData} title="Transaction Distribution" />

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Summary Statistics
            </Typography>

            <Stack spacing={2.5}>
              {[
                {
                  label: "Total Transactions",
                  value: pieData
                    .reduce((a, c) => a + c.value, 0)
                    .toLocaleString(),
                },
                {
                  label: "Average per Type",
                  value: (
                    pieData.reduce((a, c) => a + c.value, 0) / pieData.length ||
                    0
                  ).toLocaleString(),
                },
                {
                  label: "Most Popular",
                  value: pieData.reduce(
                    (max, item) => (item.value > max.value ? item : max),
                    pieData[0]
                  ).name,
                },
                {
                  label: "Least Popular",
                  value: pieData.reduce(
                    (min, item) => (item.value < min.value ? item : min),
                    pieData[0]
                  ).name,
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

      {/* Global spin animation – better placed in index.css */}
      {/* You can move this to src/index.css */}
      {/* 
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      */}
    </Box>
  );
};

export default Dashboard;
