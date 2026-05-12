// src/pages/Dashboard.tsx

import React, { useMemo, useState } from "react";

import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";

import { SummaryCards } from "../components/dashboard/SummaryCards";
import { InsightFeed } from "../components/dashboard/InsightFeed";
import { DonutChart } from "../components/dashboard/DonutChart";
import { RecentActivity } from "../components/dashboard/RecentActivity";

import { PeopleAndBusinesses } from "../components/people/PeopleAndBusinesses";

import { PaywallModal } from "../components/paywall/PaywallModal";

import { Card } from "../components/ui/Card";

import { colors } from "../design/colors";

const insights = [
  {
    title: "Your income is stable",
    description:
      "You received consistent payments this month with predictable inflows.",
    type: "success" as const,
    locked: false,
  },
  {
    title: "Transport spending is high",
    description:
      "Uber expenses increased 40% week-over-week from your normal baseline.",
    type: "warning" as const,
    locked: true,
  },
  {
    title: "Top expense: Food",
    description: "Food spending now represents 35% of total monthly outflows.",
    type: "info" as const,
    locked: false,
  },
];

const mockSearchResults = {
  name: "Jane Mwangi",
  phone: "0712345678",
  totalSent: 84000,
  totalReceived: 15000,
  transactionCount: 42,
  firstSeen: "Jan 15, 2024",
  lastSeen: "May 7, 2026",
};

export const Dashboard: React.FC = () => {
  const [showPaywall, setShowPaywall] = useState(false);

  const [isPro] = useState(false);

  const [searchResults, setSearchResults] = useState<any>(null);

  const [isSearching, setIsSearching] = useState(false);

  const financialHealth = useMemo(() => {
    return {
      score: 82,
      status: "Excellent",
      trend: "+6%",
    };
  }, []);

  const handleUpload = () => {
    alert("Upload M-PESA Statement");
  };

  const handlePay = () => {
    alert("M-PESA Payment Flow");
  };

  const handleSearch = async (query: string) => {
    console.log("Searching:", query);

    setIsSearching(true);

    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
    }, 1200);
  };

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
          <Card
            style={{
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
                    color: colors.status.success,
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
                  "Income consistency",
                  "Spending discipline",
                  "Savings behavior",
                  "Transaction stability",
                ].map((item) => (
                  <div
                    key={item}
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
                      {item}
                    </span>

                    <span
                      style={{
                        color: colors.text.primary,
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      Strong
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* KPI */}
        <SummaryCards moneyIn="150000" moneyOut="23000" netFlow="127000" />

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
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <DonutChart />

            <RecentActivity />

            <PeopleAndBusinesses
              isPro={isPro}
              onUnlock={() => setShowPaywall(true)}
              onSearch={handleSearch}
              searchResults={searchResults}
              isLoading={isSearching}
            />
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <InsightFeed
              insights={insights}
              onUnlock={() => setShowPaywall(true)}
            />
          </div>
        </div>

        {/* PAYWALL */}
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
