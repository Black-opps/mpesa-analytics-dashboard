// src/components/charts/index.tsx - FIXED VERSION

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
  PieLabelRenderProps,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

interface PieChartProps {
  data: any[];
  nameKey: string;
  valueKey: string;
  title: string;
  height?: number;
  isLoading?: boolean;
}

// Custom label render function with proper typing
const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const { name, value, percent } = props;
  const formattedValue =
    typeof value === "number" ? `KES ${value.toLocaleString()}` : "";
  const formattedPercent =
    typeof percent === "number" ? `${(percent * 100).toFixed(0)}%` : "";

  return `${name}: ${formattedValue} (${formattedPercent})`;
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  nameKey,
  valueKey,
  title,
  height = 400,
}) => {
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
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => `KES ${value.toLocaleString()}`}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
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
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#82ca9d" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Paper>
  );
};
