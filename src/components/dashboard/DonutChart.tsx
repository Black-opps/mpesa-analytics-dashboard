// src/components/dashboard/DonutChart.tsx

import React from "react";
import { colors } from "../../design/colors";

export const DonutChart: React.FC = () => {
  const items = [
    {
      label: "Food",
      value: "KES 9K",
      color: "#3CE6AE",
    },
    {
      label: "Bills",
      value: "KES 7K",
      color: "#8B5CF6",
    },
    {
      label: "Transport",
      value: "KES 5K",
      color: "#EF4444",
    },
    {
      label: "Other",
      value: "KES 2K",
      color: "#64748B",
    },
  ];

  return (
    <div
      className="card-hover fade-in"
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "26px",
        padding: "30px",
        boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
        transition: "all 0.25s ease",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "28px",
        }}
      >
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

        <div
          style={{
            color: colors.text.secondary,
            fontSize: "13px",
          }}
        >
          Your spending distribution over the last 30 days
        </div>
      </div>

      <div className="donut-wrapper">
        {/* DONUT */}
        <div
          style={{
            position: "relative",
            width: "240px",
            height: "240px",
          }}
        >
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="82"
              fill="none"
              stroke={colors.borderLight}
              strokeWidth="30"
            />

            <circle
              cx="120"
              cy="120"
              r="82"
              fill="none"
              stroke="#3CE6AE"
              strokeWidth="30"
              strokeDasharray="190 325"
              transform="rotate(-90 120 120)"
              strokeLinecap="round"
            />

            <circle
              cx="120"
              cy="120"
              r="82"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="30"
              strokeDasharray="120 400"
              strokeDashoffset="-200"
              transform="rotate(-90 120 120)"
              strokeLinecap="round"
            />

            <circle
              cx="120"
              cy="120"
              r="82"
              fill="none"
              stroke="#EF4444"
              strokeWidth="30"
              strokeDasharray="90 430"
              strokeDashoffset="-330"
              transform="rotate(-90 120 120)"
              strokeLinecap="round"
            />

            <text
              x="120"
              y="114"
              textAnchor="middle"
              fontSize="34"
              fontWeight="800"
              fill={colors.text.primary}
            >
              23K
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

        {/* LEGEND */}
        <div
          style={{
            flex: 1,
            minWidth: "220px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.label}
              className="hover-lift"
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: item.color,
                    boxShadow: `0 0 14px ${item.color}`,
                  }}
                />

                <span
                  style={{
                    color: colors.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
              </div>

              <span
                style={{
                  color: colors.text.primary,
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
