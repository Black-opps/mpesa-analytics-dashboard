// src/components/dashboard/InsightCard.tsx

import React from "react";
import { colors } from "../../design/colors";

interface InsightCardProps {
  title: string;
  description: string;
  type: "success" | "warning" | "info";
  locked?: boolean;
  onUnlock?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  type,
  locked,
  onUnlock,
}) => {
  const accent =
    type === "success"
      ? colors.status.success
      : type === "warning"
      ? colors.status.warning
      : colors.status.info;

  return (
    <div
      className="card-hover"
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "18px",
        padding: "18px",
        marginBottom: "14px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* Accent Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          background: accent,
        }}
      />

      {/* Soft Glow */}
      <div
        style={{
          position: "absolute",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: `${accent}12`,
          top: "-70px",
          right: "-70px",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "14px",
          marginBottom: locked ? "14px" : 0,
        }}
      >
        {/* Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: colors.text.primary,
              fontSize: "15px",
              fontWeight: 700,
              marginBottom: "8px",
              lineHeight: 1.4,
            }}
          >
            {title}
          </div>

          <div
            style={{
              color: colors.text.secondary,
              fontSize: "13px",
              lineHeight: 1.7,
              opacity: locked ? 0.55 : 1,
              filter: locked ? "blur(2px)" : "none",
            }}
          >
            {description}
          </div>
        </div>

        {/* PRO Badge */}
        {locked && (
          <div
            style={{
              padding: "5px 10px",
              borderRadius: "999px",
              background: `${colors.status.warning}15`,
              border: `1px solid ${colors.status.warning}30`,
              color: colors.status.warning,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              flexShrink: 0,
            }}
          >
            PRO
          </div>
        )}
      </div>

      {/* Unlock CTA */}
      {locked && (
        <button
          onClick={onUnlock}
          className="hover-lift"
          style={{
            marginTop: "4px",
            border: "none",
            borderRadius: "12px",
            background: colors.status.success,
            color: "#04110B",
            padding: "10px 16px",
            fontWeight: 700,
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            boxShadow: "0 8px 24px rgba(60,230,174,0.18)",
          }}
        >
          Unlock Insight →
        </button>
      )}
    </div>
  );
};
