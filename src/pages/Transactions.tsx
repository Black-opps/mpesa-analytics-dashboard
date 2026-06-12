// src/pages/Transactions.tsx
import React, { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { TransactionExplorer } from "../components/transactions/TransactionExplorer";
import { dashboardService } from "../services/dashboard.service";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Transactions: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalSent, setTotalSent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);

  const isPro = user?.role === "owner" || user?.role === "admin";
  const PAGE_SIZE = 50;

  useEffect(() => {
    loadStats();
    loadTransactions(0, true);
  }, []);

  const loadStats = async () => {
    try {
      const summary = await dashboardService.getSummary();
      setTotalSent(summary.money_out);
      setTotalReceived(summary.money_in);
      setTotalTransactions(summary.total_transactions);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadTransactions = async (page: number, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const offset = page * PAGE_SIZE;
      const data = await dashboardService.getTransactions(PAGE_SIZE, offset);

      if (reset) {
        setTransactions(data);
      } else {
        setTransactions((prev) => [...prev, ...data]);
      }

      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const hasMore = (currentPage + 1) * PAGE_SIZE < totalTransactions;

    if (hasMore && !loadingMore) {
      loadTransactions(nextPage, false);
    }
  };

  const handleUpload = () => navigate("/upload");
  const handleUpgrade = () => alert("Upgrade to Pro - Coming soon");

  const displayedCount = transactions.length;
  const hasMore = displayedCount < totalTransactions;

  return (
    <AppShell
      sidebar={<Sidebar isPro={isPro} />}
      topbar={
        <Topbar
          onUpload={handleUpload}
          isPro={isPro}
          onUpgrade={handleUpgrade}
        />
      }
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #334155",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Total Sent
            </div>
            <div
              style={{ color: "#f87171", fontSize: "28px", fontWeight: "bold" }}
            >
              -KES {totalSent.toLocaleString()}
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #334155",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Total Received
            </div>
            <div
              style={{ color: "#4ade80", fontSize: "28px", fontWeight: "bold" }}
            >
              +KES {totalReceived.toLocaleString()}
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #334155",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Net Flow
            </div>
            <div
              style={{
                color: totalReceived - totalSent >= 0 ? "#4ade80" : "#f87171",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              {totalReceived - totalSent >= 0 ? "+" : "-"}KES{" "}
              {Math.abs(totalReceived - totalSent).toLocaleString()}
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #334155",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Total Transactions
            </div>
            <div
              style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold" }}
            >
              {totalTransactions.toLocaleString()}
            </div>
          </div>
        </div>

        <TransactionExplorer
          transactions={transactions}
          isLoading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          displayedCount={displayedCount}
          totalCount={totalTransactions}
        />
      </div>
    </AppShell>
  );
};
