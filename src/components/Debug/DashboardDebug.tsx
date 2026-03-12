// src/components/Debug/DashboardDebug.tsx - FIXED

import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button, // Add this missing import
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAnalyticsSummary,
  fetchTrends,
  selectAnalyticsSummary,
  selectTrends,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from "../../store/slices/analyticsSlice";
import api from "../../services/api";

const DashboardDebug: React.FC = () => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectAnalyticsSummary);
  const trends = useAppSelector(selectTrends);
  const loading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);

  const [apiHealth, setApiHealth] = useState<boolean | null>(null);
  const [rawApiData, setRawApiData] = useState<any>(null);
  const [loadingRaw, setLoadingRaw] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Check API health
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await api.checkHealth();
      setApiHealth(health);
    } catch (error) {
      setApiHealth(false);
    }
  };

  const fetchRawData = async () => {
    setLoadingRaw(true);
    setApiError(null);
    try {
      // Test different endpoints
      const endpoints = [
        { name: "Root", url: "/" },
        { name: "Health", url: "/health" },
        { name: "Analytics", url: "/analytics" },
        { name: "Daily Analytics", url: "/analytics/daily?days=7" },
        { name: "Transactions", url: "/transactions?skip=0&limit=5" },
      ];

      const results: any = {};

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://localhost:8000${endpoint.url}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          results[endpoint.name] = {
            status: response.status,
            data: data,
            ok: response.ok,
          };
        } catch (err: any) {
          results[endpoint.name] = {
            status: "Error",
            error: err.message,
          };
        }
      }

      setRawApiData(results);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoadingRaw(false);
    }
  };

  const refreshData = () => {
    dispatch(fetchAnalyticsSummary());
    dispatch(fetchTrends("daily"));
    fetchRawData();
    checkApiHealth();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            🔍 Dashboard Debug Panel
          </Typography>
          <Chip
            icon={<RefreshIcon />}
            label="Refresh Data"
            onClick={refreshData}
            color="primary"
            clickable
          />
        </Box>

        {/* API Health Status */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">API Connection Status</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Typography>API Health:</Typography>
              {apiHealth === null ? (
                <CircularProgress size={20} />
              ) : apiHealth ? (
                <Chip label="Connected" color="success" size="small" />
              ) : (
                <Chip label="Disconnected" color="error" size="small" />
              )}
              <Typography variant="body2" color="text.secondary">
                API URL:{" "}
                {process.env.REACT_APP_API_URL || "http://localhost:8000"}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Redux State */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Redux State</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Error: {error || "None"}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Loading States:
            </Typography>
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip
                label={`Summary: ${loading.summary ? "Loading" : "Done"}`}
                color={loading.summary ? "warning" : "success"}
                size="small"
              />
              <Chip
                label={`Trends: ${loading.trends ? "Loading" : "Done"}`}
                color={loading.trends ? "warning" : "success"}
                size="small"
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Analytics Summary:
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, mb: 2, bgcolor: "#fafafa", overflow: "auto" }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(summary, null, 2)}
              </pre>
            </Paper>

            <Typography variant="subtitle2" gutterBottom>
              Trends Data (first 3 items):
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "#fafafa", overflow: "auto" }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(trends.slice(0, 3), null, 2)}
              </pre>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* Raw API Data */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Raw API Responses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {loadingRaw ? (
              <CircularProgress />
            ) : apiError ? (
              <Alert severity="error">{apiError}</Alert>
            ) : (
              <Box>
                <Button
                  variant="outlined"
                  onClick={fetchRawData}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  Fetch Raw Data
                </Button>

                {rawApiData && (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Endpoint</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Data Preview</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(rawApiData).map(
                          ([name, result]: [string, any]) => (
                            <TableRow key={name}>
                              <TableCell>{name}</TableCell>
                              <TableCell>
                                <Chip
                                  label={result.status}
                                  color={result.ok ? "success" : "error"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="caption"
                                  component="pre"
                                  sx={{
                                    maxWidth: 300,
                                    overflow: "auto",
                                    margin: 0,
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {JSON.stringify(
                                    result.data || result.error,
                                    null,
                                    2
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Token Status */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Authentication Status</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Token Present:{" "}
              {localStorage.getItem("access_token") ? "✅ Yes" : "❌ No"}
            </Typography>
            {localStorage.getItem("access_token") && (
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  mt: 1,
                  p: 1,
                  bgcolor: "#eee",
                  borderRadius: 1,
                  overflow: "auto",
                }}
              >
                Token: {localStorage.getItem("access_token")?.substring(0, 20)}
                ...
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default DashboardDebug;
