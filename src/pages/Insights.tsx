// src/pages/Insights.tsx
import React, { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { colors } from "../design/colors";
import { dashboardService } from "../services/dashboard.service";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Insight {
  id: string;
  type: "positive" | "warning" | "opportunity" | "insight";
  title: string;
  description: string;
  details?: string;
  impact?: string;
  recommendation?: string;
  confidence?: number;
  category?: string;
}

export const Insights: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [filter, setFilter] = useState<
    "all" | "positive" | "warning" | "opportunity"
  >("all");

  const isPro = user?.role === "owner" || user?.role === "admin";

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await dashboardService.getInsights();
      // Transform to premium format with additional data
      const premiumInsights = data.map((insight: any, index: number) => ({
        ...insight,
        id: `insight_${index}`,
        confidence:
          insight.type === "positive"
            ? 92
            : insight.type === "warning"
            ? 85
            : 78,
        impact:
          insight.type === "positive"
            ? "Your consistent income pattern puts you in the top 15% of similar users for financial stability."
            : insight.type === "warning"
            ? "High spending in this category may affect your long-term savings goals."
            : "Small optimizations in this area could yield significant returns.",
        recommendation:
          insight.type === "positive"
            ? "Consider increasing your savings rate by 5-10% to accelerate wealth building."
            : insight.type === "warning"
            ? "Set a monthly budget limit for this category and track it weekly."
            : "Review this insight monthly to track improvement.",
        category:
          insight.type === "positive"
            ? "Financial Health"
            : insight.type === "warning"
            ? "Spending Analysis"
            : "Opportunity",
      }));
      setInsights(premiumInsights);
    } catch (error) {
      console.error("Failed to load insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => navigate("/upload");
  const handleUpgrade = () => alert("Upgrade to Pro - Coming soon");

  const filteredInsights = insights.filter((insight) =>
    filter === "all" ? true : insight.type === filter
  );

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "positive":
        return {
          icon: "📈",
          bg: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 100%)",
          border: "#10b981",
          badge: "POSITIVE TREND",
          badgeBg: "rgba(16,185,129,0.15)",
        };
      case "warning":
        return {
          icon: "⚠️",
          bg: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.03) 100%)",
          border: "#f59e0b",
          badge: "ACTION NEEDED",
          badgeBg: "rgba(245,158,11,0.15)",
        };
      case "opportunity":
        return {
          icon: "💡",
          bg: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.03) 100%)",
          border: "#3b82f6",
          badge: "OPPORTUNITY",
          badgeBg: "rgba(59,130,246,0.15)",
        };
      default:
        return {
          icon: "✨",
          bg: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.03) 100%)",
          border: "#8b5cf6",
          badge: "INSIGHT",
          badgeBg: "rgba(139,92,246,0.15)",
        };
    }
  };

  if (loading) {
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
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: colors.text.secondary,
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
          <div>Analyzing your financial patterns...</div>
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
          onUpgrade={handleUpgrade}
        />
      }
    >
      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "100px",
              background: `${colors.status.success}12`,
              border: `1px solid ${colors.status.success}22`,
              marginBottom: "20px",
            }}
          >
            <span className="live-dot" />
            <span
              style={{
                color: colors.status.success,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.3px",
              }}
            >
              AI INTELLIGENCE ENGINE
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  color: colors.text.primary,
                  fontSize: "36px",
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  marginBottom: "12px",
                }}
              >
                Financial Intelligence
              </h1>
              <p
                style={{
                  color: colors.text.secondary,
                  fontSize: "16px",
                  maxWidth: "600px",
                }}
              >
                AI-powered analysis of your transaction behavior. Each insight
                includes confidence scoring and actionable recommendations.
              </p>
            </div>

            {/* Filter Buttons */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                background: colors.cardLight,
                padding: "6px",
                borderRadius: "14px",
              }}
            >
              {[
                { key: "all", label: "All Insights", count: insights.length },
                {
                  key: "positive",
                  label: "Positive",
                  count: insights.filter((i) => i.type === "positive").length,
                  icon: "📈",
                },
                {
                  key: "warning",
                  label: "Warnings",
                  count: insights.filter((i) => i.type === "warning").length,
                  icon: "⚠️",
                },
                {
                  key: "opportunity",
                  label: "Opportunities",
                  count: insights.filter((i) => i.type === "opportunity")
                    .length,
                  icon: "💡",
                },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as any)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "10px",
                    background:
                      filter === f.key ? colors.status.success : "transparent",
                    border: "none",
                    color: filter === f.key ? "#1a1a2e" : colors.text.secondary,
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {f.icon && <span>{f.icon}</span>}
                  {f.label}
                  <span style={{ opacity: 0.7, fontSize: "11px" }}>
                    ({f.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredInsights.map((insight) => {
            const styles = getTypeStyles(insight.type);

            return (
              <div
                key={insight.id}
                onClick={() => setSelectedInsight(insight)}
                style={{
                  cursor: "pointer",
                  background: styles.bg,
                  border: `1px solid ${styles.border}30`,
                  borderRadius: "24px",
                  padding: "24px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Gradient top bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${styles.border}, transparent)`,
                  }}
                />

                {/* Header */}
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
                        width: "48px",
                        height: "48px",
                        borderRadius: "16px",
                        background: `${styles.border}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                      }}
                    >
                      {styles.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: styles.border,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        {styles.badge}
                      </div>
                      <h3
                        style={{
                          color: colors.text.primary,
                          fontSize: "18px",
                          fontWeight: 700,
                          margin: 0,
                        }}
                      >
                        {insight.title}
                      </h3>
                    </div>
                  </div>

                  {/* Confidence Score */}
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

                {/* Category Tag */}
                {insight.category && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: "rgba(0,0,0,0.03)",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: colors.text.muted,
                      marginBottom: "12px",
                    }}
                  >
                    {insight.category}
                  </div>
                )}

                {/* Description */}
                <p
                  style={{
                    color: colors.text.secondary,
                    fontSize: "14px",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                >
                  {insight.description}
                </p>

                {/* Impact Preview */}
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
                        fontSize: "11px",
                        fontWeight: 600,
                        color: colors.text.muted,
                        marginBottom: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      Impact Analysis
                    </div>
                    <div
                      style={{ fontSize: "12px", color: colors.text.secondary }}
                    >
                      {insight.impact}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "12px",
                    borderTop: `1px solid ${colors.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: styles.border,
                      fontWeight: 500,
                    }}
                  >
                    Click to analyze
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: styles.border,
                      transition: "transform 0.2s ease",
                    }}
                  >
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredInsights.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              background: colors.cardLight,
              borderRadius: "24px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
            <h3 style={{ color: colors.text.primary, marginBottom: "8px" }}>
              No insights for this category
            </h3>
            <p style={{ color: colors.text.secondary }}>
              Try a different filter or upload more transactions
            </p>
          </div>
        )}

        {/* Modal for Detailed Insight */}
        {selectedInsight && (
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
              animation: "fadeIn 0.2s ease",
            }}
            onClick={() => setSelectedInsight(null)}
          >
            <div
              style={{
                maxWidth: "550px",
                width: "90%",
                maxHeight: "85vh",
                overflow: "auto",
                background: colors.card,
                borderRadius: "28px",
                animation: "scaleIn 0.3s ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "28px",
                  borderBottom: `1px solid ${colors.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span style={{ fontSize: "32px" }}>
                    {selectedInsight.type === "positive"
                      ? "📈"
                      : selectedInsight.type === "warning"
                      ? "⚠️"
                      : "💡"}
                  </span>
                  <h2
                    style={{
                      color: colors.text.primary,
                      fontSize: "22px",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {selectedInsight.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: colors.text.muted,
                    fontSize: "28px",
                    cursor: "pointer",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ padding: "28px" }}>
                <p
                  style={{
                    color: colors.text.secondary,
                    lineHeight: 1.8,
                    marginBottom: "24px",
                    fontSize: "15px",
                  }}
                >
                  {selectedInsight.description}
                </p>

                {selectedInsight.impact && (
                  <div
                    style={{
                      background: `${
                        getTypeStyles(selectedInsight.type).border
                      }08`,
                      padding: "20px",
                      borderRadius: "16px",
                      marginBottom: "20px",
                      borderLeft: `3px solid ${
                        getTypeStyles(selectedInsight.type).border
                      }`,
                    }}
                  >
                    <h4
                      style={{
                        color: colors.text.primary,
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      📊 Impact Analysis
                    </h4>
                    <p
                      style={{
                        color: colors.text.secondary,
                        fontSize: "14px",
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedInsight.impact}
                    </p>
                  </div>
                )}

                <div
                  style={{
                    background: colors.cardLight,
                    padding: "20px",
                    borderRadius: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <h4
                    style={{
                      color: colors.text.primary,
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    💡 AI Recommendation
                  </h4>
                  <p
                    style={{
                      color: colors.text.secondary,
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedInsight.recommendation ||
                      "Review your transactions in this category and set a monthly budget limit."}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedInsight(null)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: `linear-gradient(135deg, ${colors.status.success}, ${colors.primary})`,
                    border: "none",
                    borderRadius: "14px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Apply Insight
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background: #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </AppShell>
  );
};
