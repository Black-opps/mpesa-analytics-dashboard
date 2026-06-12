// src/components/dashboard/InsightCard.tsx

import React, { useState } from "react";
import { colors } from "../../design/colors";

export interface InsightData {
  id: string;
  type: "warning" | "positive" | "opportunity" | "pattern";
  title: string;
  summary: string;
  detail: string;
  impact?: string;
  recommendation?: string;
  confidence?: number;
  actionLabel?: string;
  actionable?: boolean;
}

interface InsightCardProps {
  insight?: InsightData;
  title?: string;
  description?: string;
  type?: "success" | "warning" | "info";
  locked?: boolean;
  onUnlock?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  title,
  description,
  type,
  locked,
  onUnlock,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (insight) {
    const getTypeStyles = () => {
      switch (insight.type) {
        case "warning":
          return {
            bg: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.02) 100%)",
            border: "#f59e0b",
            icon: "⚠️",
            gradient: "linear-gradient(135deg, #f59e0b, #ea580c)",
          };
        case "positive":
          return {
            bg: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)",
            border: "#10b981",
            icon: "📈",
            gradient: "linear-gradient(135deg, #10b981, #059669)",
          };
        case "opportunity":
          return {
            bg: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)",
            border: "#3b82f6",
            icon: "💡",
            gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          };
        default:
          return {
            bg: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.02) 100%)",
            border: "#8b5cf6",
            icon: "📊",
            gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          };
      }
    };

    const styles = getTypeStyles();

    return (
      <div
        className="insight-card-premium"
        style={{
          background: styles.bg,
          border: `1px solid ${styles.border}20`,
          borderRadius: "20px",
          marginBottom: "16px",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Animated gradient border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: styles.gradient,
            opacity: 0.8,
          }}
        />

        <div style={{ padding: "20px" }}>
          {/* Header with icon and badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
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
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: `${styles.border}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                {styles.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: styles.border,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  {insight.type === "warning" && "ALERT"}
                  {insight.type === "positive" && "INSIGHT"}
                  {insight.type === "opportunity" && "OPPORTUNITY"}
                  {insight.type === "pattern" && "PATTERN"}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: colors.text.primary,
                    lineHeight: 1.3,
                  }}
                >
                  {insight.title}
                </div>
              </div>
            </div>

            {insight.confidence && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background:
                      insight.confidence >= 85
                        ? "#10b981"
                        : insight.confidence >= 70
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: colors.text.muted,
                  }}
                >
                  {insight.confidence}% confidence
                </span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div
            style={{
              fontSize: "14px",
              color: colors.text.secondary,
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            {insight.summary}
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div
              style={{
                animation: "slideDown 0.3s ease",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: colors.text.muted,
                  lineHeight: 1.6,
                  marginBottom: "16px",
                }}
              >
                {insight.detail}
              </div>

              {insight.impact && (
                <div
                  style={{
                    background: "rgba(0,0,0,0.02)",
                    padding: "12px",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: colors.text.primary,
                      marginBottom: "4px",
                    }}
                  >
                    📊 Impact Analysis
                  </div>
                  <div
                    style={{ fontSize: "13px", color: colors.text.secondary }}
                  >
                    {insight.impact}
                  </div>
                </div>
              )}

              {insight.recommendation && (
                <div
                  style={{
                    background: `${styles.border}08`,
                    padding: "12px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    borderLeft: `3px solid ${styles.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: styles.border,
                      marginBottom: "4px",
                    }}
                  >
                    💡 Smart Recommendation
                  </div>
                  <div
                    style={{ fontSize: "13px", color: colors.text.secondary }}
                  >
                    {insight.recommendation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              style={{
                background: "none",
                border: "none",
                color: styles.border,
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 0",
              }}
            >
              {isExpanded ? "Show less" : "Analyze deeper"}
              <span
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                ↓
              </span>
            </button>

            {insight.actionLabel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle action
                }}
                style={{
                  background: styles.gradient,
                  border: "none",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "8px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {insight.actionLabel} →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Legacy render for PRO features (keep existing)
  const accent =
    type === "success"
      ? colors.status.success
      : type === "warning"
      ? colors.status.warning
      : colors.status.info;

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "18px",
        padding: "18px",
        marginBottom: "14px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",
      }}
    >
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
      {locked && (
        <button
          onClick={onUnlock}
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
          }}
        >
          Unlock Insight →
        </button>
      )}
    </div>
  );
};

export default InsightCard;
