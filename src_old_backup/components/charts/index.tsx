import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const formatValue = (value: any): string => {
  if (value === undefined || value === null) return "KES 0";
  return `KES ${Number(value).toLocaleString()}`;
};

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  height = 400,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip formatter={formatValue} />
          <Legend />
          <Bar dataKey={yKey} fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

interface PieChartProps {
  data: Array<{ type: string; amount: number; count: number }>;
  title: string;
  height?: number;
  isLoading?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 400,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) =>
              `${entry.type}: ${formatValue(entry.amount)}`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
            nameKey="type"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={formatValue} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Paper>
  );
};
