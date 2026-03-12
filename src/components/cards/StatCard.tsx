import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  SvgIconProps,
  alpha,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactElement<SvgIconProps>;
  trend?: number;
  color?: string;
  subtitle?: string;
  gradient?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "150px",
    height: "150px",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "50%",
    transform: "translate(50px, -50px)",
  },
}));

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "#6366f1",
  subtitle,
  gradient = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
}) => {
  const trendIcon = trend && trend > 0 ? <TrendingUp /> : <TrendingDown />;
  const trendColor = trend && trend > 0 ? "#10b981" : "#ef4444";

  return (
    <StyledCard sx={{ background: gradient, color: "white" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ opacity: 0.8, mb: 1, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: alpha("#ffffff", 0.2),
                borderRadius: "16px",
                p: 1.5,
                display: "flex",
                backdropFilter: "blur(4px)",
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 28 } })}
            </Box>
          )}
        </Box>
        {trend !== undefined && (
          <Box display="flex" alignItems="center" mt={2}>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                backgroundColor: alpha(trendColor, 0.2),
                borderRadius: "20px",
                px: 1,
                py: 0.5,
                color: "white",
              }}
            >
              {trendIcon}
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatCard;
