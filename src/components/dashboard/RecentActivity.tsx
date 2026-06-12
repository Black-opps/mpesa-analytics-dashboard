// src/components/dashboard/RecentActivity.tsx
import React from "react";
import { colors } from "../../design/colors";
import { Card } from "../ui/Card";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "sent" | "received";
  counterparty: string;
  description?: string;
  reference?: string;
  time_ago?: string;
}

interface RecentActivityProps {
  transactions: Transaction[];
  loading?: boolean;
}

const getTimeAgo = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } catch {
    return "Recently";
  }
};

const getIcon = (type: string): string => {
  if (type === "sent") return "↑";
  if (type === "received") return "↓";
  return "◉";
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  transactions,
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
          Loading transactions...
        </div>
      </Card>
    );
  }

  const displayTransactions = transactions?.slice(0, 5) || [];

  return (
    <Card
      style={{
        padding: "30px",
        background: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            color: colors.text.primary,
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          Recent Activity
        </div>
        <div style={{ color: colors.text.secondary, fontSize: "13px" }}>
          Real-time transaction activity
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {displayTransactions.map((tx, idx) => {
          const isSent = tx.type === "sent";
          return (
            <div
              key={tx.id || idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "16px",
                borderBottom:
                  idx < displayTransactions.length - 1
                    ? `1px solid ${colors.border}`
                    : "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "14px",
                    background: isSent
                      ? "rgba(239,68,68,0.08)"
                      : "rgba(34,197,94,0.08)",
                    border: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    color: isSent
                      ? colors.status.danger
                      : colors.status.success,
                  }}
                >
                  {getIcon(tx.type)}
                </div>
                <div>
                  <div
                    style={{
                      color: colors.text.primary,
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    {isSent ? "Sent" : "Received"} KES{" "}
                    {tx.amount.toLocaleString()}
                  </div>
                  <div
                    style={{ color: colors.text.secondary, fontSize: "13px" }}
                  >
                    {tx.counterparty}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    color: colors.text.primary,
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {tx.time_ago || getTimeAgo(tx.date)}
                </div>
                {tx.description && (
                  <div style={{ color: colors.text.muted, fontSize: "11px" }}>
                    {tx.description.substring(0, 30)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {displayTransactions.length === 0 && (
          <div
            style={{
              color: colors.text.secondary,
              textAlign: "center",
              padding: "20px",
            }}
          >
            No recent transactions. Upload a statement to get started.
          </div>
        )}
      </div>
    </Card>
  );
};
