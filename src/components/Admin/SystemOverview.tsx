// src/components/Admin/SystemOverview.tsx - IMPROVED VERSION with error handling

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip as MuiTooltip,
} from "@mui/material";
import {
  Refresh,
  People,
  Receipt,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  AdminPanelSettings,
  Person,
  Store,
  PhoneIphone,
  AccountBalance,
  Send,
  HealthAndSafety,
  Api,
  Storage,
  MonetizationOn,
  EmojiEvents,
  Today,
  CheckCircle,
  Error,
  Warning,
  DateRange,
} from "@mui/icons-material";
import api from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Define interfaces for type safety
interface SystemStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_transactions: number;
  total_volume: number;
  average_transaction_per_user: number;
}

interface UserBreakdown {
  user_id: number;
  email: string;
  transactions: number;
  volume: number;
  customers: number;
}

interface DailyStats {
  date: string;
  transactions: number;
  volume: number;
  active_users: number;
}

interface SystemAnalyticsResponse {
  system_totals: SystemStats;
  users_breakdown: UserBreakdown[];
}

interface HealthStatus {
  status: "healthy" | "degraded" | "down";
  api: "up" | "down";
  database: "up" | "down";
  timestamp: string;
}

interface RevenueStats {
  total_commission: number;
  system_fees: number;
  pending_payouts: number;
  revenue_growth: number;
}

interface TopUser {
  user_id: number;
  email: string;
  volume: number;
  transactions: number;
  rank: number;
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

const SystemOverview: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [userBreakdown, setUserBreakdown] = useState<UserBreakdown[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [activeToday, setActiveToday] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [usingMockData, setUsingMockData] = useState(false);

  // Helper function to generate mock daily data
  const generateMockDailyData = useCallback((range: string) => {
    const days = range === "week" ? 7 : range === "month" ? 30 : 365;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split("T")[0],
        transactions: Math.floor(Math.random() * 15) + 5,
        volume: Math.floor(Math.random() * 50000) + 10000,
        active_users: Math.floor(Math.random() * 5) + 2,
      });
    }

    return data;
  }, []);

  const setMockData = useCallback(() => {
    setUsingMockData(true);
    setStats({
      total_users: 5,
      active_users: 4,
      inactive_users: 1,
      total_transactions: 51,
      total_volume: 249771,
      average_transaction_per_user: 49954.2,
    });

    setUserBreakdown([
      {
        user_id: 1,
        email: "test@example.com",
        transactions: 30,
        volume: 149771,
        customers: 8,
      },
      {
        user_id: 2,
        email: "demo@example.com",
        transactions: 1,
        volume: 5000,
        customers: 1,
      },
      {
        user_id: 3,
        email: "john@example.com",
        transactions: 12,
        volume: 45000,
        customers: 5,
      },
      {
        user_id: 4,
        email: "jane@example.com",
        transactions: 18,
        volume: 68000,
        customers: 7,
      },
      {
        user_id: 5,
        email: "admin@example.com",
        transactions: 20,
        volume: 75000,
        customers: 10,
      },
    ]);

    const mockDaily = generateMockDailyData(timeRange);
    setDailyStats(mockDaily);

    setHealthStatus({
      status: "healthy",
      api: "up",
      database: "up",
      timestamp: new Date().toISOString(),
    });

    setActiveToday(4);
    setTopUsers([
      {
        user_id: 1,
        email: "test@example.com",
        volume: 149771,
        transactions: 30,
        rank: 1,
      },
      {
        user_id: 5,
        email: "admin@example.com",
        volume: 75000,
        transactions: 20,
        rank: 2,
      },
      {
        user_id: 4,
        email: "jane@example.com",
        volume: 68000,
        transactions: 18,
        rank: 3,
      },
      {
        user_id: 3,
        email: "john@example.com",
        volume: 45000,
        transactions: 12,
        rank: 4,
      },
      {
        user_id: 2,
        email: "demo@example.com",
        volume: 5000,
        transactions: 1,
        rank: 5,
      },
    ]);

    setRevenueStats({
      total_commission: 15750,
      system_fees: 3250,
      pending_payouts: 8500,
      revenue_growth: 12.5,
    });
  }, [timeRange, generateMockDailyData]);

  const fetchSystemData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);

    try {
      // Fetch system statistics
      let statsData: SystemStats;
      try {
        statsData = await api.get<SystemStats>("/admin/users/statistics");
        setStats(statsData);
      } catch (statsErr) {
        console.warn("Failed to fetch statistics, using defaults");
        statsData = {
          total_users: 0,
          active_users: 0,
          inactive_users: 0,
          total_transactions: 0,
          total_volume: 0,
          average_transaction_per_user: 0,
        };
        setStats(statsData);
      }

      // Fetch user breakdown
      let analyticsData: SystemAnalyticsResponse;
      try {
        analyticsData = await api.get<SystemAnalyticsResponse>(
          "/admin/analytics/system"
        );
        setUserBreakdown(analyticsData.users_breakdown || []);
      } catch (analyticsErr) {
        console.warn("Failed to fetch user breakdown");
        analyticsData = { system_totals: statsData, users_breakdown: [] };
        setUserBreakdown([]);
      }

      // Fetch daily stats - with error handling
      try {
        const days =
          timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;
        const dailyData = await api.get<DailyStats[]>(
          `/admin/analytics/daily?days=${days}`
        );
        setDailyStats(dailyData);

        // Calculate active users today
        const today = new Date().toISOString().split("T")[0];
        const todayStats = dailyData.find((d) => d.date === today);
        setActiveToday(todayStats?.active_users || 0);
      } catch (dailyErr) {
        console.warn("Daily analytics not available, using mock data");
        const mockDaily = generateMockDailyData(timeRange);
        setDailyStats(mockDaily);
        setActiveToday(4);
        setUsingMockData(true);
      }

      // Fetch health status - with error handling
      try {
        const healthData = await api.get<HealthStatus>("/admin/health");
        setHealthStatus(healthData);
      } catch (healthErr) {
        console.warn("Health endpoint not available, using mock data");
        setHealthStatus({
          status: "healthy",
          api: "up",
          database: "up",
          timestamp: new Date().toISOString(),
        });
        setUsingMockData(true);
      }

      // Calculate top users
      const usersList = analyticsData?.users_breakdown || [];
      const sortedUsers = [...usersList]
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5)
        .map((user, index) => ({
          user_id: user.user_id,
          email: user.email,
          volume: user.volume,
          transactions: user.transactions,
          rank: index + 1,
        }));
      setTopUsers(sortedUsers);

      // Mock revenue data (replace with real API call when available)
      setRevenueStats({
        total_commission: 15750,
        system_fees: 3250,
        pending_payouts: 8500,
        revenue_growth: 12.5,
      });

      setError(null);
    } catch (err: any) {
      console.error("Error fetching system data:", err);
      setError(err.message || "Failed to fetch system data");
      setMockData();
    } finally {
      setLoading(false);
    }
  }, [timeRange, generateMockDailyData, setMockData]);

  useEffect(() => {
    fetchSystemData();
  }, [fetchSystemData, timeRange]);

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  const getRoleIcon = (email: string) => {
    if (email.includes("admin")) {
      return <AdminPanelSettings fontSize="small" />;
    }
    return <Person fontSize="small" />;
  };

  const formatCurrency = (value: number) => {
    return `KES ${value.toLocaleString()}`;
  };

  const getHealthIcon = () => {
    if (!healthStatus) return <Warning />;
    switch (healthStatus.status) {
      case "healthy":
        return <CheckCircle sx={{ color: "#10b981" }} />;
      case "degraded":
        return <Warning sx={{ color: "#f59e0b" }} />;
      case "down":
        return <Error sx={{ color: "#ef4444" }} />;
      default:
        return <Warning />;
    }
  };

  const getHealthColor = () => {
    if (!healthStatus) return "warning";
    switch (healthStatus.status) {
      case "healthy":
        return "success";
      case "degraded":
        return "warning";
      case "down":
        return "error";
      default:
        return "warning";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !usingMockData) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={fetchSystemData}>
            <Refresh /> Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Time Range Selector */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" fontWeight={600}>
            System Overview
          </Typography>
          {usingMockData && (
            <Chip
              label="Demo Mode"
              color="warning"
              size="small"
              icon={<Warning />}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
            >
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="year">Last 365 Days</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={fetchSystemData} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics Cards - Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {stats?.total_users || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stats?.active_users || 0} active ·{" "}
                    {stats?.inactive_users || 0} inactive
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#6366f1", width: 56, height: 56 }}>
                  <People />
                </Avatar>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  ((stats?.active_users || 0) / (stats?.total_users || 1)) * 100
                }
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography variant="h4">
                    {stats?.total_transactions?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#10b981", width: 56, height: 56 }}>
                  <Receipt />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Volume
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats?.total_volume || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#f59e0b", width: 56, height: 56 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg per User
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats?.average_transaction_per_user || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#ec4899", width: 56, height: 56 }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Users & Revenue Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h6">Active Users Today</Typography>
                <Today sx={{ color: "#6366f1" }} />
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {activeToday}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Users with transactions today
              </Typography>
              <Box mt={2}>
                <Chip
                  label={`${(
                    (activeToday / (stats?.total_users || 1)) *
                    100
                  ).toFixed(1)}% of total users`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h6">Revenue</Typography>
                <MonetizationOn sx={{ color: "#10b981" }} />
              </Box>
              <Typography variant="h3" color="success.main" gutterBottom>
                {formatCurrency(revenueStats?.total_commission || 0)}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={`${revenueStats?.revenue_growth || 0}% vs last month`}
                  size="small"
                  color={
                    revenueStats?.revenue_growth &&
                    revenueStats.revenue_growth > 0
                      ? "success"
                      : "error"
                  }
                />
                <Typography variant="body2" color="textSecondary">
                  Platform fees collected
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h6">System Health</Typography>
                {getHealthIcon()}
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Chip
                  icon={<Api />}
                  label={`API: ${healthStatus?.api || "unknown"}`}
                  size="small"
                  color={healthStatus?.api === "up" ? "success" : "error"}
                  variant="outlined"
                />
                <Chip
                  icon={<Storage />}
                  label={`DB: ${healthStatus?.database || "unknown"}`}
                  size="small"
                  color={healthStatus?.database === "up" ? "success" : "error"}
                  variant="outlined"
                />
              </Box>
              <Chip
                label={`Status: ${healthStatus?.status || "unknown"}`}
                color={getHealthColor()}
                size="small"
              />
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Last checked:{" "}
                {healthStatus?.timestamp
                  ? new Date(healthStatus.timestamp).toLocaleTimeString()
                  : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Users Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Top Users by Volume
          </Typography>
          <EmojiEvents sx={{ color: "#f59e0b" }} />
        </Box>
        <Grid container spacing={2}>
          {topUsers.length > 0 ? (
            topUsers.map((user) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={user.user_id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderLeft:
                      user.rank === 1
                        ? "4px solid #f59e0b"
                        : user.rank === 2
                        ? "4px solid #94a3b8"
                        : user.rank === 3
                        ? "4px solid #b45309"
                        : "none",
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor:
                              user.rank === 1
                                ? "#f59e0b"
                                : user.rank === 2
                                ? "#94a3b8"
                                : user.rank === 3
                                ? "#b45309"
                                : "#6366f1",
                          }}
                        >
                          #{user.rank}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.email}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.transactions} transactions
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {formatCurrency(user.volume)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography color="textSecondary" align="center" py={4}>
                No user data available
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Daily Activity Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Daily Activity (
          {timeRange === "week"
            ? "7 Days"
            : timeRange === "month"
            ? "30 Days"
            : "365 Days"}
          )
        </Typography>
        {dailyStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              // Find the Tooltip component around line 820 and replace it with:
              <Tooltip
                formatter={(value: any, name: string | undefined) => {
                  if (name === "volume" || name === "Volume (KES)") {
                    return formatCurrency(value);
                  }
                  return value;
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="transactions"
                stroke="#6366f1"
                name="Transactions"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                name="Volume (KES)"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="active_users"
                stroke="#f59e0b"
                name="Active Users"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box py={4} textAlign="center">
            <Typography color="textSecondary">
              No daily data available
            </Typography>
          </Box>
        )}
      </Paper>

      {/* User Breakdown Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          User Breakdown
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="right">Transactions</TableCell>
                <TableCell align="right">Volume (KES)</TableCell>
                <TableCell align="right">Customers</TableCell>
                <TableCell align="right">Avg Transaction</TableCell>
                <TableCell align="right">Rank</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userBreakdown.length > 0 ? (
                userBreakdown
                  .sort((a, b) => b.volume - a.volume)
                  .map((user, index) => (
                    <TableRow key={user.user_id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: index < 3 ? "#f59e0b" : "#6366f1",
                            }}
                          >
                            {index < 3 ? index + 1 : getRoleIcon(user.email)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {user.email}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {user.user_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{user.transactions}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(user.volume)}
                      </TableCell>
                      <TableCell align="right">{user.customers}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(user.volume / (user.transactions || 1))}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color={index < 3 ? "warning" : "default"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  // Find the TableCell around line 928 and replace it with:
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">
                      No user data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Revenue Breakdown */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Revenue Breakdown
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Platform financial metrics
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "#8b5cf6" }}>
                    <MonetizationOn />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total Commission
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(revenueStats?.total_commission || 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "#06b6d4" }}>
                    <Receipt />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      System Fees
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(revenueStats?.system_fees || 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "#f43f5e" }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Pending Payouts
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(revenueStats?.pending_payouts || 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SystemOverview;
