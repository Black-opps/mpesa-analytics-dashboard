import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  CalendarToday,
  ShowChart,
  Timeline,
  Info,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import {
  Area,
  AreaChart,
  Bar,
  ComposedChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TransactionTrend } from "../../types";

interface EnhancedTrendChartProps {
  data: TransactionTrend[];
  title?: string;
  isLoading?: boolean; // optional: if parent passes loading state
}

interface MetricCardProps {
  label: string;
  value: string | number;
  change: number;
  color: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        minWidth: 220,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {label}
      </Typography>
      <Stack spacing={1}>
        {payload.map((entry: any) => (
          <Box
            key={entry.name}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: entry.color || entry.fill,
                }}
              />
              <Typography variant="body2">{entry.name}</Typography>
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {entry.name.includes("Volume")
                ? `KES ${Number(entry.value).toLocaleString()}`
                : Number(entry.value).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

const MetricCard = ({ label, value, change, color }: MetricCardProps) => {
  const theme = useTheme();
  const isPositive = change >= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 3,
        bgcolor: alpha(color, 0.05),
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "all 0.22s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: `0 16px 40px ${alpha(color, 0.22)}`,
        },
      }}
    >
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {label}
      </Typography>

      <Typography variant="h5" fontWeight={800} sx={{ my: 1 }}>
        {value}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        {isPositive ? (
          <TrendingUp
            fontSize="small"
            sx={{ color: theme.palette.success.main }}
          />
        ) : (
          <TrendingDown
            fontSize="small"
            sx={{ color: theme.palette.error.main }}
          />
        )}
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{ color: isPositive ? "success.main" : "error.main" }}
        >
          {Math.abs(change)}% vs prev
        </Typography>
      </Stack>
    </Paper>
  );
};

const EnhancedTrendChart: React.FC<EnhancedTrendChartProps> = ({
  data = [],
  title = "Transaction Trends",
  isLoading = false,
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");
  const [selectedMetric, setSelectedMetric] = useState<
    "all" | "count" | "volume"
  >("all");

  if (isLoading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Paper>
    );
  }

  if (!data.length) {
    return (
      <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No transaction data available for the selected period
        </Typography>
      </Paper>
    );
  }

  // Aggregates
  const totalCount = data.reduce((sum, item) => sum + (item.count ?? 0), 0);
  const totalVolume = data.reduce((sum, item) => sum + (item.volume ?? 0), 0);
  const totalSuccess = data.reduce(
    (sum, item) => sum + (item.success_count ?? 0),
    0
  );
  const totalFailed = data.reduce(
    (sum, item) => sum + (item.failed_count ?? 0),
    0
  );

  const successRate =
    totalCount > 0 ? ((totalSuccess / totalCount) * 100).toFixed(1) : "0.0";
  const failedRate =
    totalCount > 0 ? ((totalFailed / totalCount) * 100).toFixed(1) : "0.0";

  const metrics = [
    {
      label: "Total Transactions",
      value: totalCount.toLocaleString(),
      change: 12.5,
      color: theme.palette.primary.main,
    },
    {
      label: "Total Volume",
      value: `KES ${totalVolume.toLocaleString()}`,
      change: 8.3,
      color: theme.palette.success.main,
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      change: 2.1,
      color: theme.palette.info.main,
    },
    {
      label: "Failed Rate",
      value: `${failedRate}%`,
      change: -1.5,
      color: theme.palette.error.main,
    },
  ];

  const renderChart = () => {
    const common = {
      data,
      margin: { top: 24, right: 32, left: 24, bottom: 60 },
    };

    const axisProps = {
      tick: { fontSize: 12, fill: theme.palette.text.secondary },
      axisLine: { stroke: alpha(theme.palette.divider, 0.5) },
      tickLine: { stroke: alpha(theme.palette.divider, 0.3) },
    };

    switch (chartType) {
      case "bar":
        return (
          <ComposedChart {...common}>
            <defs>
              <linearGradient id="barCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.85}
                />
                <stop
                  offset="95%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.15}
                />
              </linearGradient>
              <linearGradient id="barVolume" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.success.main}
                  stopOpacity={0.85}
                />
                <stop
                  offset="95%"
                  stopColor={theme.palette.success.main}
                  stopOpacity={0.15}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={alpha(theme.palette.divider, 0.35)}
            />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={70}
              {...axisProps}
            />
            <YAxis yAxisId="left" {...axisProps} />
            <YAxis yAxisId="right" orientation="right" {...axisProps} />
            <RechartsTooltip
              content={<CustomTooltip />}
              cursor={{ fill: alpha(theme.palette.primary.main, 0.08) }}
            />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
            {(selectedMetric === "all" || selectedMetric === "count") && (
              <Bar
                yAxisId="left"
                dataKey="count"
                name="Count"
                fill="url(#barCount)"
                barSize={28}
                radius={[6, 6, 0, 0]}
              />
            )}
            {(selectedMetric === "all" || selectedMetric === "volume") && (
              <Bar
                yAxisId="right"
                dataKey="volume"
                name="Volume (KES)"
                fill="url(#barVolume)"
                barSize={28}
                radius={[6, 6, 0, 0]}
              />
            )}
          </ComposedChart>
        );

      case "line":
        return (
          <ComposedChart {...common}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={alpha(theme.palette.divider, 0.35)}
            />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={70}
              {...axisProps}
            />
            <YAxis yAxisId="left" {...axisProps} />
            <YAxis yAxisId="right" orientation="right" {...axisProps} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
            {(selectedMetric === "all" || selectedMetric === "count") && (
              <Line
                yAxisId="left"
                type="monotoneX"
                dataKey="count"
                name="Count"
                stroke={theme.palette.primary.main}
                strokeWidth={2.8}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 3 }}
              />
            )}
            {(selectedMetric === "all" || selectedMetric === "volume") && (
              <Line
                yAxisId="right"
                type="monotoneX"
                dataKey="volume"
                name="Volume (KES)"
                stroke={theme.palette.success.main}
                strokeWidth={2.8}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 3 }}
              />
            )}
          </ComposedChart>
        );

      default: // area
        return (
          <AreaChart {...common}>
            <defs>
              <linearGradient id="areaCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="areaVolume" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.success.main}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={theme.palette.success.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={alpha(theme.palette.divider, 0.35)}
            />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={70}
              {...axisProps}
            />
            <YAxis yAxisId="left" {...axisProps} />
            <YAxis yAxisId="right" orientation="right" {...axisProps} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
            {(selectedMetric === "all" || selectedMetric === "count") && (
              <Area
                yAxisId="left"
                type="monotoneX"
                dataKey="count"
                name="Count"
                stroke={theme.palette.primary.main}
                fill="url(#areaCount)"
                strokeWidth={2.2}
              />
            )}
            {(selectedMetric === "all" || selectedMetric === "volume") && (
              <Area
                yAxisId="right"
                type="monotoneX"
                dataKey="volume"
                name="Volume (KES)"
                stroke={theme.palette.success.main}
                fill="url(#areaVolume)"
                strokeWidth={2.2}
              />
            )}
          </AreaChart>
        );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {metrics.map((metric) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={metric.label}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <ToggleButtonGroup
            size="small"
            value={chartType}
            exclusive
            onChange={(_, val) => val && setChartType(val)}
          >
            <ToggleButton value="area" aria-label="Area chart view">
              <Timeline fontSize="small" />
            </ToggleButton>
            <ToggleButton value="bar" aria-label="Bar chart view">
              <BarChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="line" aria-label="Line chart view">
              <ShowChart fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            size="small"
            value={selectedMetric}
            exclusive
            onChange={(_, val) => val && setSelectedMetric(val)}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="count">Count</ToggleButton>
            <ToggleButton value="volume">Volume</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            icon={<CalendarToday fontSize="small" />}
            label="Last 30 Days"
            size="small"
            variant="outlined"
          />
          <Tooltip title="Data refreshes automatically every 5 minutes">
            <IconButton size="small" color="inherit">
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Chart */}
      <Box sx={{ width: "100%", height: { xs: 340, sm: 400, md: 460 } }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default EnhancedTrendChart;
