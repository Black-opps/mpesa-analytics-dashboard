import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Sector, // ← added this
} from "recharts";
import { Box, Typography, Paper, useTheme, alpha } from "@mui/material"; // ← added alpha here
import type { SxProps, Theme } from "@mui/material/styles";

interface PieDataItem {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface RevenuePieChartProps {
  data: PieDataItem[];
  title?: string;
  height?: number | string;
  sx?: SxProps<Theme>;
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#3b82f6",
  "#f97316",
];

const CustomActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontWeight={600}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
        opacity={0.4}
      />
      <text x={ex} y={ey} textAnchor={textAnchor} fill="#333" fontSize={14}>
        {`${payload.name}: ${payload.value.toLocaleString()}`}
      </text>
      <text
        x={ex}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={12}
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const RevenuePieChart: React.FC<RevenuePieChartProps> = ({
  data = [],
  title = "Transaction Distribution",
  height = 420,
  sx,
}) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, ...sx }}>
        <Typography color="text.secondary">
          No distribution data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        height: "100%",
        ...sx,
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Box sx={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              nameKey="name"
              activeShape={CustomActiveShape}
              paddingAngle={2}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="name"
                position="outside"
                offset={12}
                fontSize={12}
                fill={theme.palette.text.primary}
              />
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
                boxShadow: theme.shadows[6],
              }}
              formatter={(value: number | undefined) => [
                value !== undefined ? `KES ${value.toLocaleString()}` : "N/A",
                null,
              ]}
            />

            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              wrapperStyle={{
                paddingTop: 16,
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Quick total summary */}
      <Box sx={{ mt: 3, px: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Total: KES{" "}
          {data
            .reduce((sum, item) => sum + (item.value ?? 0), 0)
            .toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenuePieChart;
