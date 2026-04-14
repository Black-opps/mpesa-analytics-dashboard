import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

interface CustomerGrowthData {
  date: string;
  new_customers: number;
  total_customers: number;
  active_customers: number;
}

interface CustomerGrowthChartProps {
  data: CustomerGrowthData[];
  title?: string;
}

const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({
  data,
  title,
}) => {
  const theme = useTheme();

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total_customers"
            name="Total Customers"
            stackId="1"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.light}
          />
          <Area
            type="monotone"
            dataKey="active_customers"
            name="Active Customers"
            stackId="2"
            stroke={theme.palette.success.main}
            fill={theme.palette.success.light}
          />
          <Area
            type="monotone"
            dataKey="new_customers"
            name="New Customers"
            stackId="3"
            stroke={theme.palette.info.main}
            fill={theme.palette.info.light}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CustomerGrowthChart;
