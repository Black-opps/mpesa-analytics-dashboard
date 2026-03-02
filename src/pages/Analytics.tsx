import React, { useEffect } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCustomerSegments,
  fetchTopCustomers,
} from "../store/slices/analyticsSlice";
import CustomerGrowthChart from "../components/charts/CustomerGrowthChart";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MetricCard from "../components/cards/MetricCard";

const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customerSegments, topCustomers, loading } = useAppSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchCustomerSegments());
    dispatch(fetchTopCustomers(10));
  }, [dispatch]);

  if (loading.segments || loading.topCustomers) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  const growthData = [
    {
      date: "2024-01",
      new_customers: 45,
      total_customers: 1200,
      active_customers: 980,
    },
    {
      date: "2024-02",
      new_customers: 52,
      total_customers: 1252,
      active_customers: 1020,
    },
    {
      date: "2024-03",
      new_customers: 61,
      total_customers: 1313,
      active_customers: 1080,
    },
    {
      date: "2024-04",
      new_customers: 48,
      total_customers: 1361,
      active_customers: 1120,
    },
    {
      date: "2024-05",
      new_customers: 55,
      total_customers: 1416,
      active_customers: 1180,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Advanced Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12} component="div">
          <Paper sx={{ p: 2 }}>
            <CustomerGrowthChart
              data={growthData}
              title="Customer Growth Trends"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Customer Segments
            </Typography>
            <Grid container spacing={2}>
              {customerSegments.map((segment) => (
                <Grid size={12} key={segment.segment} component="div">
                  <MetricCard
                    label={segment.segment}
                    value={segment.percentage}
                    max={100}
                    unit="%"
                    color="primary"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Customers
            </Typography>
            {topCustomers.map((customer) => (
              <Box
                key={customer.id}
                sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}
              >
                <Typography variant="subtitle1">
                  {customer.name || customer.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Transactions: {customer.transaction_count} | Volume: KES{" "}
                  {customer.total_volume.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
