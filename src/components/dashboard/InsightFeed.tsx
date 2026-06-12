// src/components/dashboard/InsightFeed.tsx

import React from "react";
import { colors } from "../../design/colors";
import InsightCard, { InsightData } from "./InsightCard";
import { EmptyState } from "../ui/EmptyState";

interface InsightFeedProps {
  insights?: InsightData[];
  isLoading?: boolean;
  transactionCount?: number;
  onUpload?: () => void;
  onUnlock?: () => void;
}

export const InsightFeed: React.FC<InsightFeedProps> = ({
  insights = [],
  isLoading = false,
  transactionCount = 0,
  onUpload,
  onUnlock,
}) => {
  // Loading State (keep existing)
  if (isLoading) {
    return (
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "24px",
          padding: "24px",
          height: "100%",
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
              AI Intelligence
            </div>
            <div
              style={{
                color: colors.text.secondary,
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Personalized financial insights powered by AI
            </div>
          </div>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${colors.status.success}20, ${colors.primary}20)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ✨
          </div>
        </div>

        {/* Skeleton loaders... */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: colors.background,
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                height: "20px",
                width: "60%",
                background: colors.border,
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            />
            <div
              style={{
                height: "40px",
                width: "90%",
                background: colors.border,
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Low Transaction Count State
  if (transactionCount < 10) {
    return (
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "24px",
          padding: "24px",
          height: "100%",
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
              AI Intelligence
            </div>
            <div
              style={{
                color: colors.text.secondary,
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Personalized financial insights powered by AI
            </div>
          </div>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${colors.status.success}20, ${colors.primary}20)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ✨
          </div>
        </div>

        <EmptyState
          title="Learning your financial patterns"
          description={`We've analyzed ${transactionCount} transactions so far. More data = smarter insights.`}
          icon="⟳"
          actionText="Upload Statement"
          onAction={onUpload}
        />

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: colors.background,
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "12px",
              color: colors.text.secondary,
            }}
          >
            <span>🧠 Intelligence building</span>
            <span>
              {Math.min(100, Math.round((transactionCount / 30) * 100))}%
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: `${colors.border}`,
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (transactionCount / 30) * 100)}%`,
                background: `linear-gradient(90deg, ${colors.status.success}, ${colors.primary})`,
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "11px",
              color: colors.text.muted,
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            {transactionCount}/30 transactions • More data = deeper insights
          </div>
        </div>
      </div>
    );
  }

  // No Insights State
  if (insights.length === 0) {
    return (
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "24px",
          padding: "24px",
          height: "100%",
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
              AI Intelligence
            </div>
            <div
              style={{
                color: colors.text.secondary,
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Personalized financial insights powered by AI
            </div>
          </div>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${colors.status.success}20, ${colors.primary}20)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ✨
          </div>
        </div>

        <EmptyState
          title="All caught up!"
          description="Your financial patterns look stable. Check back after more transactions."
          icon="✨"
        />
      </div>
    );
  }

  // Default - Show Insights
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
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{
              color: colors.text.primary,
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            AI Intelligence
          </div>
          <div
            style={{
              color: colors.text.secondary,
              fontSize: "13px",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "3px",
                background: "#10b981",
                animation: "pulse 2s infinite",
              }}
            />
            Live Intelligence • {insights.length} active insights
          </div>
        </div>

        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: `linear-gradient(135deg, ${colors.status.success}15, ${colors.primary}15)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          🧠
        </div>
      </div>

      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} onUnlock={onUnlock} />
      ))}
    </div>
  );
};
