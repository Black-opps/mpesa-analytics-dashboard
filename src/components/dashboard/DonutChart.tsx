// src/components/dashboard/DonutChart.tsx
import React from "react";
import { SpendingCategory } from "../../services/dashboard.service";
import { Card } from "../ui/Card";
import { colors } from "../../design/colors";

interface DonutChartProps {
  categories: SpendingCategory[];
  totalSpent?: number;
  loading?: boolean;
}

const categoryColors: Record<string, string> = {
  Food: "#3CE6AE",
  Transport: "#EF4444",
  Bills: "#8B5CF6",
  Shopping: "#F59E0B",
  Entertainment: "#EC4899",
  Other: "#64748B",
};

export const DonutChart: React.FC<DonutChartProps> = ({
  categories,
  totalSpent,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card
        style={{
          padding: "30px",
          background: colors.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ color: colors.text.secondary }}>
          Loading spending breakdown...
        </div>
      </Card>
    );
  }

  // Calculate total spent from categories if not provided
  const calculatedTotal = categories.reduce((sum, c) => sum + c.amount, 0);
  const displayTotal = totalSpent ?? calculatedTotal;
  const items = categories.slice(0, 4);
  const remainingTotal = categories
    .slice(4)
    .reduce((sum, c) => sum + c.amount, 0);
  if (remainingTotal > 0) {
    items.push({
      name: "Other",
      amount: remainingTotal,
      percentage: Math.round((remainingTotal / displayTotal) * 100),
    });
  }

  return (
    <Card
      style={{
        padding: "30px",
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            color: colors.text.primary,
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          Spending Breakdown
        </div>
        <div style={{ color: colors.text.secondary, fontSize: "13px" }}>
          Your spending distribution over the last 30 days
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: "240px", height: "240px" }}>
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="82"
              fill="none"
              stroke={colors.borderLight}
              strokeWidth="30"
            />
            {items.map((item, index) => {
              const circumference = 2 * Math.PI * 82;
              const dashArray = (item.percentage / 100) * circumference;
              let currentAngle = -90;
              for (let i = 0; i < index; i++) {
                currentAngle += (items[i].percentage / 100) * 360;
              }
              return (
                <circle
                  key={item.name}
                  cx="120"
                  cy="120"
                  r="82"
                  fill="none"
                  stroke={categoryColors[item.name] || colors.text.muted}
                  strokeWidth="30"
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset={-currentAngle * (circumference / 360)}
                  transform={`rotate(${currentAngle} 120 120)`}
                  strokeLinecap="round"
                />
              );
            })}
            <text
              x="120"
              y="114"
              textAnchor="middle"
              fontSize="34"
              fontWeight="800"
              fill={colors.text.primary}
            >
              {Math.round(displayTotal / 1000)}K
            </text>
            <text
              x="120"
              y="138"
              textAnchor="middle"
              fontSize="13"
              fill={colors.text.secondary}
            >
              total spent
            </text>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: "220px" }}>
          {items.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
                paddingBottom: "16px",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: categoryColors[item.name] || colors.text.muted,
                    boxShadow: `0 0 14px ${
                      categoryColors[item.name] || colors.text.muted
                    }`,
                  }}
                />
                <span
                  style={{
                    color: colors.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.name}
                </span>
              </div>
              <span
                style={{
                  color: colors.text.primary,
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                KES {item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
