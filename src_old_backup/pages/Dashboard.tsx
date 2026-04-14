import React, { useEffect, useState } from "react";
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
import api from "../services/api";

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

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, dailyRes, typesRes, customersRes] =
        await Promise.all([
          api.get("/analytics"),
          api.get("/analytics/daily?days=7"),
          api.get("/analytics/transaction-types"),
          api.get("/analytics/top-customers?limit=5"),
        ]);

      setAnalytics(analyticsRes.data);
      setDailyData(dailyRes.data);
      setTransactionTypes(typesRes.data);
      setTopCustomers(customersRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to fetch dashboard data");
      // Use mock data as fallback
      setDailyData(generateMockDailyData());
      setTransactionTypes(generateMockTransactionTypes());
      setTopCustomers(generateMockTopCustomers());
      if (analyticsRes) setAnalytics(analyticsRes.data);
    } finally {
      setLoading(false);
    }
  };

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

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Real-time insights into your M-Pesa transactions
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">
                {analytics?.transaction_count || 0}
              </Typography>
              <Typography variant="caption" color="success.main">
                ↑ 12.5% vs last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Volume
              </Typography>
              <Typography variant="h4">
                KES {(analytics?.total_sent || 0).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.main">
                ↑ 8.2% vs last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Transaction
              </Typography>
              <Typography variant="h4">
                KES{" "}
                {Math.round(
                  (analytics?.total_sent || 0) /
                    (analytics?.transaction_count || 1)
                ).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="error.main">
                ↓ 2.4% vs last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Customers
              </Typography>
              <Typography variant="h4">{topCustomers.length}</Typography>
              <Typography variant="caption" color="success.main">
                ↑ 15.8% vs last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <BarChart
            data={dailyData}
            xKey="date"
            yKey="amount"
            title="Transaction Trends"
            height={400}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <PieChart
            data={transactionTypes}
            title="Transaction Distribution by Type"
            height={400}
          />
        </Grid>
      </Grid>

      {/* Top Customers Table */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Top Customers
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {topCustomers.map((customer, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  borderBottom:
                    index < topCustomers.length - 1 ? "1px solid #eee" : "none",
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
                <Typography variant="body1" fontWeight="bold">
                  KES {customer.total.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
