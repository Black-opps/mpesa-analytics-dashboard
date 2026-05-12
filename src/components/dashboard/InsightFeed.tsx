// src/components/dashboard/InsightFeed.tsx

import React from "react";
import { colors } from "../../design/colors";
import { InsightCard } from "./InsightCard";

interface InsightFeedProps {
  insights: any[];
  onUnlock: () => void;
}

export const InsightFeed: React.FC<InsightFeedProps> = ({
  insights,
  onUnlock,
}) => {
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "24px",
        padding: "24px",
        height: "100%",
        transition: "all 0.25s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              color: colors.text.primary,
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            AI Insights
          </div>

          <div
            style={{
              color: colors.text.secondary,
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            Personalized intelligence from transaction behavior
          </div>
        </div>

        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: `${colors.status.success}15`,
            border: `1px solid ${colors.status.success}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.status.success,
            fontSize: "16px",
          }}
        >
          ✨
        </div>
      </div>

      {insights.map((insight, idx) => (
        <InsightCard
          key={idx}
          title={insight.title}
          description={insight.description}
          type={insight.type}
          locked={insight.locked}
          onUnlock={onUnlock}
        />
      ))}
    </div>
  );
};
