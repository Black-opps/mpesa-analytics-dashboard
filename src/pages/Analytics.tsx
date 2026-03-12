// src/pages/Analytics.tsx - WITH SELECTORS

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
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip,
} from "@mui/material";
import { Refresh, TrendingUp, TrendingDown, Person } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCustomerSegments,
  fetchTopCustomers,
  selectCustomerSegments,
  selectTopCustomers,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from "../store/slices/analyticsSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
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
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();

  // Use selectors
  const customerSegments = useAppSelector(selectCustomerSegments) || [];
  const topCustomers = useAppSelector(selectTopCustomers) || [];
  const loading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);

  const [refreshing, setRefreshing] = useState(false);
  const [segmentType, setSegmentType] = useState<"value" | "count">("value");

  const loadData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchCustomerSegments()).unwrap(),
        dispatch(fetchTopCustomers()).unwrap(),
      ]);
    } catch (err) {
      console.error("Failed to load analytics data:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Loading state
  if (loading.segments || loading.topCustomers || refreshing) {
    return <LoadingSpinner message="Loading analytics data..." />;
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
        Failed to load analytics data: {error}
      </Alert>
    );
  }

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
            Customer Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Deep dive into customer behavior and segmentation
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={segmentType}
              onChange={(e) =>
                setSegmentType(e.target.value as "value" | "count")
              }
              sx={{ borderRadius: 3, bgcolor: "background.paper" }}
            >
              <MenuItem value="value">By Value</MenuItem>
              <MenuItem value="count">By Count</MenuItem>
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
          >
            <Refresh className={refreshing ? "spin" : ""} />
          </IconButton>
        </Stack>
      </Box>

      {/* Customer Segments Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${alpha("#6366f1", 0.08)}`,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Customer Segments
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Distribution of customers by value
            </Typography>

            {customerSegments.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => {
                        const percentage = percent
                          ? (percent * 100).toFixed(0)
                          : "0";
                        return `${name}: ${percentage}%`;
                      }}
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.id || index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <Stack spacing={2} sx={{ mt: 3 }}>
                  {customerSegments.map((segment) => (
                    <Box key={segment.id}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{segment.name}</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {segment.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={segment.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(segment.color || COLORS[0], 0.1),
                          "& .MuiLinearProgress-bar": {
                            bgcolor: segment.color || COLORS[0],
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                  No customer segment data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Top Customers List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${alpha("#6366f1", 0.08)}`,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Top Customers
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Highest transaction volume
            </Typography>

            {topCustomers.length > 0 ? (
              <Stack spacing={2}>
                {topCustomers.map((customer, index) => (
                  <Card
                    key={customer.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${alpha("#6366f1", 0.08)}`,
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(COLORS[index % COLORS.length], 0.1),
                            color: COLORS[index % COLORS.length],
                          }}
                        >
                          <Person />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {customer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {customer.transactions} transactions
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="subtitle1" fontWeight={600}>
                            KES {customer.volume?.toLocaleString() || 0}
                          </Typography>
                          <Chip
                            size="small"
                            icon={
                              customer.trend >= 0 ? (
                                <TrendingUp />
                              ) : (
                                <TrendingDown />
                              )
                            }
                            label={`${Math.abs(customer.trend || 0)}%`}
                            color={customer.trend >= 0 ? "success" : "error"}
                            sx={{ height: 24 }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                  No top customers data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Customer Growth Chart */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${alpha("#6366f1", 0.08)}`,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Customer Growth Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              New customer acquisition over time
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { month: "Jan", customers: 45 },
                  { month: "Feb", customers: 52 },
                  { month: "Mar", customers: 48 },
                  { month: "Apr", customers: 61 },
                  { month: "May", customers: 55 },
                  { month: "Jun", customers: 67 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="customers" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
