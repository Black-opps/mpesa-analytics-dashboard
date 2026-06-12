// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";

import { SummaryCards } from "../components/dashboard/SummaryCards";
import { InsightFeed } from "../components/dashboard/InsightFeed";
import { DonutChart } from "../components/dashboard/DonutChart";
import { RecentActivity } from "../components/dashboard/RecentActivity";

import { PeopleAndBusinesses } from "../components/people/PeopleAndBusinesses";
import { PaywallModal } from "../components/paywall/PaywallModal";
import UploadWizard from "../components/upload/UploadWizard";

import { colors } from "../design/colors";
import { useAuth } from "../features/auth/hooks/useAuth";
import { generateInsights, InsightData } from "../services/insightEngine";
import { dashboardService } from "../services/dashboard.service";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // UI State
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Data State
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [legacyInsights, setLegacyInsights] = useState<any[]>([]);

  // NEW: Intelligence insights from engine
  const [intelligenceInsights, setIntelligenceInsights] = useState<
    InsightData[]
  >([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ledger verification state
  const [ledgerVerified, setLedgerVerified] = useState(false);
  const [verifyingLedger, setVerifyingLedger] = useState(true);

  const isPro = useMemo(
    () => user?.role === "owner" || user?.role === "admin",
    [user]
  );

  // Calculate total spent for donut chart
  const totalSpent = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.amount, 0);
  }, [categories]);

  // ========================
  // HELPER: Calculate Spending Categories from Transactions
  // ========================
  const calculateSpendingCategories = (transactions: any[]) => {
    const categoryMap: { [key: string]: number } = {};

    // Only count sent transactions (expenses)
    const sentTransactions = transactions.filter(
      (tx) => tx.type === "sent" || tx.transaction_type === "sent"
    );

    sentTransactions.forEach((tx) => {
      let category = "Other";
      const counterparty = (tx.counterparty || "").toLowerCase();
      const description = (tx.description || "").toLowerCase();
      const searchText = `${counterparty} ${description}`;

      // Food & Dining
      if (
        searchText.includes("naivas") ||
        searchText.includes("supermarket") ||
        searchText.includes("food") ||
        searchText.includes("restaurant") ||
        searchText.includes("cafe") ||
        searchText.includes("kfc") ||
        searchText.includes("java") ||
        searchText.includes("mama mboga")
      ) {
        category = "Food";
      }
      // Transport
      else if (
        searchText.includes("uber") ||
        searchText.includes("taxi") ||
        searchText.includes("fuel") ||
        searchText.includes("petrol") ||
        searchText.includes("transport") ||
        searchText.includes("bolt")
      ) {
        category = "Transport";
      }
      // Bills & Utilities
      else if (
        searchText.includes("kplc") ||
        searchText.includes("water") ||
        searchText.includes("electricity") ||
        searchText.includes("bill") ||
        searchText.includes("token") ||
        searchText.includes("internet")
      ) {
        category = "Bills";
      }
      // Shopping
      else if (
        searchText.includes("shop") ||
        searchText.includes("mall") ||
        searchText.includes("store") ||
        searchText.includes("amazon")
      ) {
        category = "Shopping";
      }
      // Entertainment
      else if (
        searchText.includes("netflix") ||
        searchText.includes("spotify") ||
        searchText.includes("cinema") ||
        searchText.includes("movie")
      ) {
        category = "Entertainment";
      }
      // Large transfers (over 10,000 KES)
      else if (tx.amount >= 10000) {
        category = "Large Transfers";
      }

      categoryMap[category] = (categoryMap[category] || 0) + tx.amount;
    });

    // Convert to array format expected by DonutChart
    const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);

    return Object.entries(categoryMap).map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));
  };

  // ========================
  // LOAD DASHBOARD DATA
  // ========================
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all dashboard data
      const data = await dashboardService.getDashboardData();

      setSummary(data.summary);
      setTransactions(data.recent_transactions || []);

      // ✅ FIX: Calculate categories from transactions if API doesn't provide them
      if (data.spending_breakdown && data.spending_breakdown.length > 0) {
        setCategories(data.spending_breakdown);
      } else if (
        data.recent_transactions &&
        data.recent_transactions.length > 0
      ) {
        // Calculate categories locally
        const calculatedCategories = calculateSpendingCategories(
          data.recent_transactions
        );
        setCategories(calculatedCategories);
      } else {
        setCategories([]);
      }

      // Generate insights from the summary data (for backward compatibility)
      const generatedInsights: any[] = [];
      if (data.summary.money_in > 0) {
        generatedInsights.push({
          type: "positive",
          title: "Your income is stable",
          description: `You received KES ${data.summary.money_in.toLocaleString()} in payments.`,
        });
      }
      if (data.summary.money_out > 0) {
        generatedInsights.push({
          type: "warning",
          title: "Track your spending",
          description: `Your total expenses are KES ${data.summary.money_out.toLocaleString()}.`,
        });
      }
      if (generatedInsights.length === 0) {
        generatedInsights.push({
          type: "insight",
          title: "Upload your first statement",
          description:
            "Upload an M-PESA statement to see personalized financial insights.",
        });
      }
      setLegacyInsights(generatedInsights);

      // Generate INTELLIGENCE insights from transaction data
      if (data.recent_transactions && data.recent_transactions.length > 0) {
        setIsInsightsLoading(true);
        const intelligence = generateInsights(data.recent_transactions);
        setIntelligenceInsights(intelligence);
        setIsInsightsLoading(false);
      } else {
        setIntelligenceInsights([]);
        setIsInsightsLoading(false);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ========================
  // LEDGER VERIFICATION - FIXED VERSION
  // ========================
  useEffect(() => {
    const verifyLedger = async () => {
      try {
        setVerifyingLedger(true);
        const token = localStorage.getItem("auth_token");

        if (!token) {
          console.warn("No token found for ledger verification");
          setLedgerVerified(false);
          return;
        }

        // Direct call to transaction service (bypass gateway to avoid React Router)
        const response = await fetch(
          "http://localhost:8006/api/v1/transactions/reconcile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Ledger verification:", data);
          setLedgerVerified(
            data.status === "verified" || data.integrity?.is_consistent === true
          );
        } else {
          console.warn("Ledger verification returned status:", response.status);
          setLedgerVerified(false);
        }
      } catch (error) {
        console.warn("Ledger verification skipped:", error);
        setLedgerVerified(false);
      } finally {
        setVerifyingLedger(false);
      }
    };
    verifyLedger();
  }, []);

  // ========================
  // HEALTH SCORE
  // ========================
  const financialHealth = useMemo(() => {
    return {
      score: summary?.financial_health_score ?? 0,
      status: summary?.grade ?? "Building",
      trend: "+6%",
    };
  }, [summary]);

  // ========================
  // ACTIONS
  // ========================
  const handleUpload = useCallback(() => setShowUploader(true), []);

  const handleUploadComplete = useCallback(() => {
    setShowUploader(false);
    loadDashboardData(); // Refresh all data
  }, [loadDashboardData]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const handlePay = () => {
    alert("M-PESA Payment Flow - Coming Soon");
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await dashboardService.searchEntities(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Decide which insights to show (prioritize intelligence engine, fallback to legacy)
  const displayInsights = useMemo(() => {
    if (intelligenceInsights.length > 0) {
      return intelligenceInsights;
    }
    return legacyInsights;
  }, [intelligenceInsights, legacyInsights]);

  // ========================
  // LOADING STATE
  // ========================
  if (loading) {
    return (
      <AppShell
        sidebar={<Sidebar isPro={isPro} />}
        topbar={
          <Topbar
            onUpload={handleUpload}
            isPro={isPro}
            onUpgrade={() => setShowPaywall(true)}
          />
        }
      >
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: colors.text.secondary,
          }}
        >
          Loading dashboard...
        </div>
      </AppShell>
    );
  }

  // ========================
  // ERROR STATE
  // ========================
  if (error) {
    return (
      <AppShell
        sidebar={<Sidebar isPro={isPro} />}
        topbar={
          <Topbar
            onUpload={handleUpload}
            isPro={isPro}
            onUpgrade={() => setShowPaywall(true)}
          />
        }
      >
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: colors.status.danger,
          }}
        >
          {error}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      sidebar={<Sidebar isPro={isPro} />}
      topbar={
        <Topbar
          onUpload={handleUpload}
          isPro={isPro}
          onUpgrade={() => setShowPaywall(true)}
        />
      }
    >
      <div
        className="fade-in main-padding"
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        {/* HEADER ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* LEDGER VERIFICATION BADGE - IMPROVED MESSAGE */}
            {!verifyingLedger && ledgerVerified && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  background: "rgba(34,197,94,0.1)",
                  borderRadius: "100px",
                  color: "#22C55E",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                <span>✓</span> FINANCIAL INTELLIGENCE ACTIVE
              </div>
            )}
            {!verifyingLedger && !ledgerVerified && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  background: "rgba(245,158,11,0.1)",
                  borderRadius: "100px",
                  color: "#F59E0B",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                <span>⟳</span> BUILDING FINANCIAL PROFILE
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                color: colors.text.secondary,
                fontSize: "14px",
              }}
            >
              {user?.full_name || user?.email}
            </div>

            <button
              onClick={handleLogout}
              style={{
                height: "44px",
                padding: "0 18px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: colors.text.primary,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* HERO */}
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          {/* LEFT HERO */}
          <div
            style={{
              flex: 1,
              minWidth: "320px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 14px",
                borderRadius: "999px",
                background: `${colors.status.success}12`,
                border: `1px solid ${colors.status.success}22`,
                marginBottom: "18px",
              }}
            >
              <div className="live-dot" />

              <span
                style={{
                  color: colors.status.success,
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                }}
              >
                LIVE FINANCIAL INTELLIGENCE
              </span>
            </div>

            <div
              style={{
                fontSize: "44px",
                fontWeight: 800,
                color: colors.text.primary,
                letterSpacing: "-2px",
                lineHeight: 1.05,
                marginBottom: "18px",
                maxWidth: "900px",
              }}
            >
              Financial Intelligence Dashboard
            </div>

            <div
              style={{
                color: colors.text.secondary,
                fontSize: "16px",
                maxWidth: "760px",
                lineHeight: 1.8,
              }}
            >
              Analyze transaction behavior, uncover AI-powered spending
              insights, monitor counterparties, and build a complete financial
              operating system for mobile money intelligence.
            </div>
          </div>

          {/* HEALTH SCORE */}
          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: "26px",
              padding: "30px",
              width: "340px",
              minWidth: "340px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "rgba(60,230,174,0.10)",
                filter: "blur(40px)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  color: colors.text.secondary,
                  fontSize: "13px",
                  marginBottom: "16px",
                  fontWeight: 600,
                }}
              >
                AI Financial Health
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    fontSize: "64px",
                    fontWeight: 800,
                    lineHeight: 1,
                    color:
                      financialHealth.score >= 70
                        ? colors.status.success
                        : financialHealth.score >= 40
                        ? colors.status.warning
                        : colors.status.danger,
                    letterSpacing: "-3px",
                  }}
                >
                  {financialHealth.score}
                </div>

                <div
                  style={{
                    paddingBottom: "10px",
                    color: colors.text.secondary,
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  /100
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    color: colors.text.primary,
                    fontWeight: 700,
                    fontSize: "18px",
                  }}
                >
                  {financialHealth.status}
                </div>

                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: `${colors.status.success}14`,
                    color: colors.status.success,
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {financialHealth.trend}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  {
                    label: "Income consistency",
                    value: transactions.length > 20 ? "Strong" : "Building",
                  },
                  {
                    label: "Spending discipline",
                    value: summary?.spending_discipline || "Learning",
                  },
                  {
                    label: "Savings behavior",
                    value: transactions.length > 30 ? "Detected" : "Analyzing",
                  },
                  {
                    label: "Transaction stability",
                    value: transactions.length > 15 ? "Stable" : "Building",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: colors.text.secondary,
                        fontSize: "13px",
                      }}
                    >
                      {item.label}
                    </span>

                    <span
                      style={{
                        color: colors.text.primary,
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <SummaryCards
          moneyIn={summary?.money_in ?? 0}
          moneyOut={summary?.money_out ?? 0}
          netFlow={summary?.net_flow ?? 0}
        />

        {/* GRID */}
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "24px",
            marginTop: "24px",
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <DonutChart categories={categories} totalSpent={totalSpent} />
            <RecentActivity transactions={transactions} />
            <PeopleAndBusinesses
              isPro={isPro}
              onUnlock={() => setShowPaywall(true)}
              onSearch={handleSearch}
              searchResults={searchResults}
              isLoading={isSearching}
            />
          </div>

          {/* RIGHT COLUMN - INTELLIGENCE FEED */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <InsightFeed
              insights={displayInsights}
              isLoading={isInsightsLoading}
              transactionCount={transactions.length}
              onUpload={handleUpload}
              onUnlock={() => setShowPaywall(true)}
            />
          </div>
        </div>

        {/* UPLOAD WIZARD MODAL */}
        {showUploader && (
          <UploadWizard
            token={localStorage.getItem("auth_token") || ""}
            onUploadComplete={handleUploadComplete}
            onClose={() => setShowUploader(false)}
          />
        )}

        {/* PAYWALL MODAL */}
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onPay={handlePay}
        />
      </div>
    </AppShell>
  );
};

export default Dashboard;
