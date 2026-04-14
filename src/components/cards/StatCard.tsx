import React from "react";
import { Card, CardContent, Typography, Box, alpha } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient, trend }) => {
  const isPositive = trend && trend > 0;
  const trendIcon = isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />;
  const trendColor = isPositive ? "success.main" : "error.main";

  return (
    <Card sx={{ background: gradient, color: "white", borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>{value}</Typography>
          </Box>
          <Box>{icon}</Box>
        </Box>
        {trend !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box sx={{ backgroundColor: alpha(trendColor, 0.2), borderRadius: "20px", px: 1, py: 0.5, display: "flex", alignItems: "center" }}>
              {trendIcon}
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>{Math.abs(trend)}%</Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>vs last period</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
