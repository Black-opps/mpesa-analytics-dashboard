// src/components/Admin/SystemStats.tsx - FIXED

import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  People,
  Receipt,
  AttachMoney,
  TrendingUp,
  Refresh,
} from "@mui/icons-material";
import api from "../../services/api";

// Define the interface for the stats
interface SystemStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_transactions: number;
  total_volume: number;
  average_transaction_per_user: number;
}

const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Type the API response
      const data = await api.get<SystemStats>("/admin/users/statistics");
      setStats(data); // Now TypeScript knows 'data' is of type SystemStats
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch stats");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={fetchStats}>
            <Refresh />
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        System Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Total Users Card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
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
                </Box>
                <People sx={{ fontSize: 40, color: "#6366f1" }} />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {stats?.active_users || 0} active, {stats?.inactive_users || 0}{" "}
                inactive
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Transactions Card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
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
                <Receipt sx={{ fontSize: 40, color: "#10b981" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Volume Card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
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
                    KES {stats?.total_volume?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: "#f59e0b" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Average per User Card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
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
                    KES{" "}
                    {stats?.average_transaction_per_user?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: "#ec4899" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SystemStats;
