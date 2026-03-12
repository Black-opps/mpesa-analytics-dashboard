import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
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
  isLoading?: boolean;
}

const COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#f97316", // orange
];

const CustomActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
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

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 24) * cos;
  const my = cy + (outerRadius + 24) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 28;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
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
        outerRadius={outerRadius + 12}
        fill={fill}
        opacity={0.35}
      />
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontWeight={700}
        fontSize={16}
      >
        {payload.name}
      </text>
      <text
        x={ex}
        y={ey}
        dy={-6}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={13}
        fontWeight={600}
      >
        {`${payload.value.toLocaleString()} KES`}
      </text>
      <text
        x={ex}
        y={ey}
        dy={12}
        textAnchor={textAnchor}
        fill="#777"
        fontSize={12}
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  const percent = entry.percent ? (entry.percent * 100).toFixed(1) : "0.0";

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        minWidth: 220,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {entry.name}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Amount:
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          KES {Number(entry.value).toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Share:
        </Typography>
        <Typography variant="body1" fontWeight={600} color="primary.main">
          {percent}%
        </Typography>
      </Box>
    </Paper>
  );
};

const RevenuePieChart: React.FC<RevenuePieChartProps> = ({
  data = [],
  title = "Transaction Distribution",
  height = 420,
  sx,
  isLoading = false,
}) => {
  const theme = useTheme();

  // Loading state
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 4, ...sx }}>
        <Skeleton
          variant="rectangular"
          height={height}
          sx={{ borderRadius: 3 }}
        />
      </Paper>
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <Paper
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 4,
          bgcolor: alpha(theme.palette.divider, 0.04),
          ...sx,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No transaction distribution data available
        </Typography>
      </Paper>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.value ?? 0), 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Box sx={{ flex: 1, minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Center label when nothing is hovered */}
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill={theme.palette.text.primary}
              fontSize={18}
              fontWeight={700}
            >
              KES {total.toLocaleString()}
            </text>

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
              isAnimationActive={true}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                  stroke={theme.palette.background.paper}
                  strokeWidth={1.5}
                />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
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

      {/* Total summary footer */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="subtitle2" color="text.secondary">
          Total Transactions:{" "}
          <Box component="span" fontWeight={700} color="primary.main">
            KES {total.toLocaleString()}
          </Box>
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenuePieChart;
