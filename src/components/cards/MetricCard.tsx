import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";

interface MetricCardProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  max = 100,
  unit = "",
  color = "primary",
  icon,
}) => {
  const percentage = (value / max) * 100;

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="body2" color="textSecondary">
            {label}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h5" component="div" gutterBottom>
          {value.toLocaleString()}
          {unit}
        </Typography>
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            {percentage.toFixed(0)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
