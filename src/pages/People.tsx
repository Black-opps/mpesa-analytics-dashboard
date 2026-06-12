// src/pages/People.tsx
import React, { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { colors } from "../design/colors";
import { dashboardService } from "../services/dashboard.service";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Counterparty {
  name: string;
  phone: string;
  totalSent: number;
  totalReceived: number;
  transactionCount: number;
  firstSeen: string;
  lastSeen: string;
}

export const People: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Counterparty | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentCounterparties, setRecentCounterparties] = useState<
    Counterparty[]
  >([]);

  const isPro = user?.role === "owner" || user?.role === "admin";

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) return;
    setIsSearching(true);
    try {
      const results = await dashboardService.searchEntities(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpload = () => navigate("/upload");
  const handleUpgrade = () => alert("Upgrade to Pro - Coming soon");

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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              color: colors.text.primary,
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            👥 People & Businesses
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Analyze transaction patterns, relationships, and financial behavior
          </p>
        </div>

        {/* Search Bar */}
        <Card style={{ marginBottom: "24px", padding: "20px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search by name or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1,
                padding: "14px 18px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                background: colors.cardLight,
                color: colors.text.primary,
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={{
                padding: "14px 24px",
                borderRadius: "12px",
                background: colors.status.success,
                border: "none",
                color: "#1a1a2e",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </Card>

        {/* Search Results */}
        {searchResults && (
          <Card style={{ marginBottom: "24px", padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <h2 style={{ color: colors.text.primary, marginBottom: "4px" }}>
                  {searchResults.name}
                </h2>
                <p style={{ color: colors.text.secondary, fontSize: "13px" }}>
                  {searchResults.phone}
                </p>
              </div>
              {!isPro && (
                <span
                  style={{
                    background: colors.status.warning,
                    color: "#1a1a2e",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  PRO Feature
                </span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: colors.cardLight,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: colors.status.danger,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES {searchResults.totalSent.toLocaleString()}
                </div>
                <div style={{ color: colors.text.secondary, fontSize: "12px" }}>
                  Total Sent
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: colors.cardLight,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: colors.status.success,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES {searchResults.totalReceived.toLocaleString()}
                </div>
                <div style={{ color: colors.text.secondary, fontSize: "12px" }}>
                  Total Received
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: colors.cardLight,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: colors.text.primary,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {searchResults.transactionCount}
                </div>
                <div style={{ color: colors.text.secondary, fontSize: "12px" }}>
                  Transactions
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "16px",
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <div>
                <div style={{ color: colors.text.secondary, fontSize: "11px" }}>
                  First seen
                </div>
                <div style={{ color: colors.text.primary, fontSize: "13px" }}>
                  {searchResults.firstSeen}
                </div>
              </div>
              <div>
                <div style={{ color: colors.text.secondary, fontSize: "11px" }}>
                  Last seen
                </div>
                <div style={{ color: colors.text.primary, fontSize: "13px" }}>
                  {searchResults.lastSeen}
                </div>
              </div>
            </div>

            {!isPro && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background: `${colors.status.warning}10`,
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: colors.text.secondary, fontSize: "13px" }}>
                  🔒 Upgrade to Pro to see relationship strength, recurring
                  patterns, and risk analysis
                </p>
              </div>
            )}
          </Card>
        )}

        {!searchResults && !isSearching && (
          <Card style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ color: colors.text.primary, marginBottom: "8px" }}>
              Search for a counterparty
            </h3>
            <p style={{ color: colors.text.secondary }}>
              Enter a name or phone number to analyze transaction patterns
            </p>
          </Card>
        )}
      </div>
    </AppShell>
  );
};
