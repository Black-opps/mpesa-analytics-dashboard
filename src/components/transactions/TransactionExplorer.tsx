// src/components/transactions/TransactionExplorer.tsx
import React, { useState, useMemo } from "react";
import { colors } from "../../design/colors";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "sent" | "received";
  counterparty: string;
  description: string;
  reference: string;
}

interface TransactionExplorerProps {
  transactions: Transaction[];
  isLoading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  displayedCount?: number;
  totalCount?: number;
}

export const TransactionExplorer: React.FC<TransactionExplorerProps> = ({
  transactions,
  isLoading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  displayedCount = 0,
  totalCount = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sent" | "received">(
    "all"
  );
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.counterparty?.toLowerCase().includes(query) ||
          tx.description?.toLowerCase().includes(query) ||
          tx.reference?.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    filtered.sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortDirection === "desc"
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
    });

    return filtered;
  }, [transactions, searchQuery, typeFilter, sortField, sortDirection]);

  const stats = useMemo(() => {
    const sent = filteredTransactions
      .filter((tx) => tx.type === "sent")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const received = filteredTransactions
      .filter((tx) => tx.type === "received")
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { sent, received, net: received - sent };
  }, [filteredTransactions]);

  if (isLoading) {
    return (
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "24px",
          padding: "48px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "16px" }}>📋</div>
        <div style={{ color: colors.text.secondary }}>
          Loading transactions...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "28px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px",
          borderBottom: `1px solid ${colors.border}`,
          background: `linear-gradient(135deg, ${colors.card}, ${colors.bgSecondary})`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "20px",
                  background: `linear-gradient(135deg, ${colors.status.success}, ${colors.primary})`,
                  borderRadius: "2px",
                }}
              />
              <span
                style={{
                  color: colors.status.success,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                TRANSACTION EXPLORER
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                color: colors.text.primary,
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
              }}
            >
              Transaction Explorer
            </h2>
            <p
              style={{
                margin: "6px 0 0 0",
                color: colors.text.secondary,
                fontSize: "13px",
              }}
            >
              Search, filter, and analyze all your transactions
            </p>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: colors.text.muted }}>
                Total Sent
              </div>
              <div
                style={{ fontSize: "22px", fontWeight: 700, color: "#ef4444" }}
              >
                -KES {stats.sent.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: colors.text.muted }}>
                Total Received
              </div>
              <div
                style={{ fontSize: "22px", fontWeight: 700, color: "#10b981" }}
              >
                +KES {stats.received.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: colors.text.muted }}>
                Net Flow
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: stats.net >= 0 ? "#10b981" : "#ef4444",
                }}
              >
                {stats.net >= 0 ? "+" : "-"}KES{" "}
                {Math.abs(stats.net).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction count info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            padding: "12px 0",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
            Showing {displayedCount} of {totalCount} transactions
          </div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
            Page {Math.ceil(displayedCount / 50)} of{" "}
            {Math.ceil(totalCount / 50)}
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, position: "relative", minWidth: "250px" }}>
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "14px",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by counterparty, description, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                height: "46px",
                borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                background: colors.card,
                color: colors.text.primary,
                padding: "0 16px 0 42px",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { value: "all", label: "All Types", icon: "📋" },
              { value: "sent", label: "Sent", icon: "📤" },
              { value: "received", label: "Received", icon: "📥" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value as any)}
                style={{
                  padding: "0 20px",
                  height: "46px",
                  borderRadius: "14px",
                  border: `1px solid ${
                    typeFilter === filter.value
                      ? colors.status.success
                      : colors.border
                  }`,
                  background:
                    typeFilter === filter.value
                      ? `${colors.status.success}15`
                      : colors.card,
                  color:
                    typeFilter === filter.value
                      ? colors.status.success
                      : colors.text.secondary,
                  fontWeight: typeFilter === filter.value ? 700 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Bar */}
      <div
        style={{
          padding: "14px 28px",
          background: colors.bgSecondary,
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              background: colors.status.success,
            }}
          />
          <span style={{ color: colors.text.secondary, fontSize: "13px" }}>
            {filteredTransactions.length} transactions found
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => {
              setSortField("date");
              setSortDirection(sortDirection === "desc" ? "asc" : "desc");
            }}
            style={{
              background: "none",
              border: "none",
              color:
                sortField === "date"
                  ? colors.status.success
                  : colors.text.secondary,
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Date{" "}
            {sortField === "date" && (sortDirection === "desc" ? "↓" : "↑")}
          </button>
          <button
            onClick={() => {
              setSortField("amount");
              setSortDirection(sortDirection === "desc" ? "asc" : "desc");
            }}
            style={{
              background: "none",
              border: "none",
              color:
                sortField === "amount"
                  ? colors.status.success
                  : colors.text.secondary,
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Amount{" "}
            {sortField === "amount" && (sortDirection === "desc" ? "↓" : "↑")}
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <th
                style={{
                  padding: "16px 20px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: colors.text.muted,
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: "16px 20px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: colors.text.muted,
                }}
              >
                Amount
              </th>
              <th
                style={{
                  padding: "16px 20px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: colors.text.muted,
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: "16px 20px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: colors.text.muted,
                }}
              >
                Counterparty
              </th>
              <th
                style={{
                  padding: "16px 20px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: colors.text.muted,
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "16px 20px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: colors.text.muted,
                }}
              >
                Reference
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr
                key={tx.id || index}
                onClick={() => setSelectedTransaction(tx)}
                style={{
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                  background:
                    selectedTransaction?.id === tx.id
                      ? `${colors.status.success}10`
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${colors.status.success}05`;
                }}
                onMouseLeave={(e) => {
                  if (selectedTransaction?.id !== tx.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <td
                  style={{
                    padding: "16px 20px",
                    fontSize: "13px",
                    color: colors.text.primary,
                  }}
                >
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td
                  style={{
                    padding: "16px 20px",
                    textAlign: "right",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: tx.type === "sent" ? "#ef4444" : "#10b981",
                  }}
                >
                  {tx.type === "sent" ? "-" : "+"} KES{" "}
                  {tx.amount.toLocaleString()}
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      background:
                        tx.type === "sent"
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(16,185,129,0.1)",
                      color: tx.type === "sent" ? "#ef4444" : "#10b981",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {tx.type === "sent" ? "📤 Sent" : "📥 Received"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "16px 20px",
                    fontSize: "13px",
                    color: colors.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {tx.counterparty}
                </td>
                <td
                  style={{
                    padding: "16px 20px",
                    fontSize: "12px",
                    color: colors.text.secondary,
                  }}
                >
                  {tx.description || "—"}
                </td>
                <td
                  style={{
                    padding: "16px 20px",
                    fontSize: "12px",
                    color: colors.text.muted,
                    fontFamily: "monospace",
                  }}
                >
                  {tx.reference || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div style={{ padding: "60px 28px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <div
            style={{
              color: colors.text.primary,
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            No transactions found
          </div>
          <div style={{ color: colors.text.secondary, fontSize: "13px" }}>
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div
          style={{ textAlign: "center", marginTop: "24px", padding: "20px" }}
        >
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              background: loadingMore ? "#334155" : "#3b82f6",
              border: "none",
              color: "white",
              fontWeight: "600",
              cursor: loadingMore ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {loadingMore
              ? "Loading more..."
              : `Load More Transactions (${
                  totalCount - displayedCount
                } remaining)`}
          </button>
        </div>
      )}

      {!hasMore && transactions.length > 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            padding: "20px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          ✓ Loaded all {totalCount} transactions
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "90%",
              background: colors.card,
              borderRadius: "28px",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0, color: colors.text.primary }}>
                Transaction Details
              </h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: colors.text.muted,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ color: colors.text.muted, fontSize: "12px" }}>
                  Date
                </div>
                <div style={{ color: colors.text.primary, fontWeight: 500 }}>
                  {new Date(selectedTransaction.date).toLocaleDateString()}
                </div>
                <div style={{ color: colors.text.muted, fontSize: "12px" }}>
                  Amount
                </div>
                <div
                  style={{
                    color:
                      selectedTransaction.type === "sent"
                        ? "#ef4444"
                        : "#10b981",
                    fontWeight: 700,
                    fontSize: "18px",
                  }}
                >
                  {selectedTransaction.type === "sent" ? "-" : "+"} KES{" "}
                  {selectedTransaction.amount.toLocaleString()}
                </div>
                <div style={{ color: colors.text.muted, fontSize: "12px" }}>
                  Counterparty
                </div>
                <div style={{ color: colors.text.primary, fontWeight: 500 }}>
                  {selectedTransaction.counterparty}
                </div>
                <div style={{ color: colors.text.muted, fontSize: "12px" }}>
                  Reference
                </div>
                <div
                  style={{ color: colors.text.muted, fontFamily: "monospace" }}
                >
                  {selectedTransaction.reference || "—"}
                </div>
                <div style={{ color: colors.text.muted, fontSize: "12px" }}>
                  Description
                </div>
                <div style={{ color: colors.text.secondary }}>
                  {selectedTransaction.description || "—"}
                </div>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: `linear-gradient(135deg, ${colors.status.success}, ${colors.primary})`,
                  border: "none",
                  borderRadius: "14px",
                  color: "#1a1a2e",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
