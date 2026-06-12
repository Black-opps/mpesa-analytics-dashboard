// src/components/people/PeopleAndBusinesses.tsx - FULL PREMIUM VERSION
import React, { useState, useEffect } from "react";
import { colors } from "../../design/colors";

interface PeopleAndBusinessesProps {
  isPro: boolean;
  onUnlock: () => void;
  onSearch: (query: string) => void;
  searchResults?: any;
  isLoading?: boolean;
}

export const PeopleAndBusinesses: React.FC<PeopleAndBusinessesProps> = ({
  isPro,
  onUnlock,
  onSearch,
  searchResults,
  isLoading,
}) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<
    Array<{ name: string; phone: string; avatar?: string }>
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  const saveSearch = (name: string, phone: string) => {
    const newSearch = { name, phone, avatar: getAvatarForName(name) };
    const updated = [
      newSearch,
      ...recentSearches.filter((s) => s.name !== name),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const getAvatarForName = (name: string): string => {
    const avatars = [
      "🏪",
      "👤",
      "🏢",
      "🛒",
      "📱",
      "💼",
      "🏦",
      "🍔",
      "🚗",
      "⚡",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    return avatars[Math.abs(hash) % avatars.length];
  };

  const handleSearch = () => {
    if (query.trim() && isPro) {
      onSearch(query);
      if (searchResults?.name) {
        saveSearch(searchResults.name, searchResults.phone);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getRelationshipScore = () => {
    if (!searchResults) return 0;
    let score = 0;
    if (searchResults.transactionCount > 10) score += 30;
    else if (searchResults.transactionCount > 5) score += 20;
    else if (searchResults.transactionCount > 0) score += 10;
    if (searchResults.totalSent > 100000) score += 35;
    else if (searchResults.totalSent > 50000) score += 25;
    else if (searchResults.totalSent > 10000) score += 15;
    if (searchResults.totalReceived > 0) score += 15;
    return Math.min(100, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "High Value";
    if (score >= 40) return "Regular";
    return "Emerging";
  };

  const getFlowDirection = () => {
    if (!searchResults) return "neutral";
    if (searchResults.totalSent > searchResults.totalReceived * 2)
      return "outgoing";
    if (searchResults.totalReceived > searchResults.totalSent * 2)
      return "incoming";
    return "balanced";
  };

  const getFlowIcon = () => {
    const direction = getFlowDirection();
    if (direction === "outgoing") return "📤";
    if (direction === "incoming") return "📥";
    return "🔄";
  };

  const getFlowText = () => {
    const direction = getFlowDirection();
    if (direction === "outgoing") return "Net Sender";
    if (direction === "incoming") return "Net Receiver";
    return "Balanced Flow";
  };

  // Format phone number for display
  const formatPhone = (phone: string) => {
    if (!phone) return "No phone number";
    if (phone.length === 10)
      return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    return phone;
  };

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Premium Animated Gradient Border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${colors.status.success}, ${colors.primary}, ${colors.status.success})`,
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s ease infinite",
        }}
      />

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div style={{ padding: "28px" }}>
        {/* Header with Premium Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  background: `${colors.status.success}12`,
                  border: `1px solid ${colors.status.success}25`,
                }}
              >
                <span className="live-dot" />
                <span
                  style={{
                    color: colors.status.success,
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  RELATIONSHIP INTELLIGENCE
                </span>
              </div>

              {!isPro && (
                <div
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    background: `linear-gradient(135deg, ${colors.status.warning}20, ${colors.status.warning}10)`,
                    border: `1px solid ${colors.status.warning}30`,
                    color: colors.status.warning,
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  🔒 PREMIUM FEATURE
                </div>
              )}
            </div>

            <h2
              style={{
                margin: 0,
                color: colors.text.primary,
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
              }}
            >
              People & Businesses
            </h2>
            <p
              style={{
                margin: "6px 0 0 0",
                color: colors.text.secondary,
                fontSize: "13px",
                maxWidth: "500px",
              }}
            >
              Analyze transaction patterns, relationships, and financial
              behavior
            </p>
          </div>

          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "18px",
              background: `linear-gradient(135deg, ${colors.cardLight}, ${colors.bg})`,
              border: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            👥
          </div>
        </div>

        {/* Search Section */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                  color: colors.text.muted,
                }}
              >
                🔍
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isPro
                    ? "Search by name, business, or phone..."
                    : "Upgrade to PRO to unlock search"
                }
                disabled={!isPro}
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "18px",
                  border: `1px solid ${
                    isPro ? colors.border : `${colors.border}80`
                  }`,
                  background: isPro ? colors.card : `${colors.card}80`,
                  color: colors.text.primary,
                  padding: "0 18px 0 48px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!isPro || !query.trim()}
              style={{
                padding: "0 28px",
                height: "52px",
                borderRadius: "18px",
                border: "none",
                background:
                  isPro && query
                    ? `linear-gradient(135deg, ${colors.status.success}, ${colors.primary})`
                    : colors.cardLight,
                color: isPro && query ? "#1a1a2e" : colors.text.muted,
                fontWeight: 700,
                fontSize: "14px",
                cursor: isPro && query ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (isPro && query) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(60,230,174,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isLoading ? (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className="spinner-small" /> Analyzing
                </span>
              ) : (
                "Search →"
              )}
            </button>
          </div>

          {/* Recent Searches - Premium */}
          {isPro &&
            recentSearches.length > 0 &&
            !searchResults &&
            !isLoading && (
              <div style={{ marginTop: "16px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: colors.text.muted,
                    marginBottom: "10px",
                    letterSpacing: "0.5px",
                  }}
                >
                  RECENT SEARCHES
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(search.name);
                        onSearch(search.name);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: colors.cardLight,
                        border: `1px solid ${colors.border}`,
                        borderRadius: "24px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        color: colors.text.secondary,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.card;
                        e.currentTarget.style.borderColor =
                          colors.status.success;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = colors.cardLight;
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    >
                      <span>{search.avatar || "👤"}</span>
                      <span>{search.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Upgrade Block (Non-Pro) */}
        {!isPro && (
          <div
            style={{
              marginTop: "28px",
              background: `linear-gradient(135deg, ${colors.cardLight}, ${colors.bg})`,
              border: `1px solid ${colors.border}`,
              borderRadius: "20px",
              padding: "24px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${colors.status.success}, ${colors.primary})`,
              }}
            />
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
            <div
              style={{
                color: colors.text.primary,
                fontWeight: 700,
                fontSize: "18px",
                marginBottom: "4px",
              }}
            >
              Unlock Counterparty Intelligence
            </div>
            <div
              style={{
                color: colors.text.secondary,
                fontSize: "13px",
                marginBottom: "20px",
                maxWidth: "280px",
                margin: "0 auto 20px auto",
              }}
            >
              Analyze relationships, recurring payments, and financial patterns
            </div>
            <button
              onClick={onUnlock}
              style={{
                border: "none",
                background: `linear-gradient(135deg, ${colors.status.success}, ${colors.primary})`,
                color: "#1a1a2e",
                padding: "12px 28px",
                borderRadius: "14px",
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
              Upgrade to Pro →
            </button>
          </div>
        )}

        {/* PREMIUM RESULTS DISPLAY */}
        {searchResults && isPro && (
          <div
            style={{
              marginTop: "28px",
              background: colors.cardLight,
              borderRadius: "24px",
              overflow: "hidden",
              animation: "slideUp 0.4s ease",
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Hero Section with Avatar */}
            <div
              style={{
                padding: "24px",
                background: `linear-gradient(135deg, ${colors.card}, ${colors.bg})`,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "28px",
                    background: `linear-gradient(135deg, ${colors.status.success}20, ${colors.primary}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "44px",
                  }}
                >
                  {getAvatarForName(searchResults.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text.primary,
                        fontSize: "24px",
                        fontWeight: 700,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {searchResults.name}
                    </h3>
                    <div
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        background: `${getScoreColor(
                          getRelationshipScore()
                        )}15`,
                        border: `1px solid ${getScoreColor(
                          getRelationshipScore()
                        )}30`,
                        color: getScoreColor(getRelationshipScore()),
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {getScoreLabel(getRelationshipScore())}
                    </div>
                  </div>
                  {searchResults.phone && (
                    <div
                      style={{
                        color: colors.text.secondary,
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>📞</span>
                      {formatPhone(searchResults.phone)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Relationship Score Card */}
            <div
              style={{
                margin: "20px",
                background: colors.card,
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: colors.text.muted,
                      letterSpacing: "0.5px",
                    }}
                  >
                    RELATIONSHIP SCORE
                  </div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: 800,
                      color: getScoreColor(getRelationshipScore()),
                    }}
                  >
                    {getRelationshipScore()}%
                  </div>
                </div>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "30px",
                    background: `${getScoreColor(getRelationshipScore())}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}
                >
                  {getFlowIcon()}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{ fontSize: "12px", color: colors.text.secondary }}
                >
                  Flow Direction
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  {getFlowText()}
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  background: colors.border,
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${getRelationshipScore()}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${getScoreColor(
                      getRelationshipScore()
                    )}, ${colors.status.success})`,
                    borderRadius: "3px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* Stats Grid - Premium */}
            <div style={{ padding: "0 20px 20px 20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "12px",
                }}
              >
                {[
                  {
                    label: "Transactions",
                    value: searchResults.transactionCount,
                    icon: "🔄",
                    color: colors.primary,
                  },
                  {
                    label: "Total Sent",
                    value: `KES ${searchResults.totalSent.toLocaleString()}`,
                    icon: "📤",
                    color: "#ef4444",
                  },
                  {
                    label: "Total Received",
                    value: `KES ${searchResults.totalReceived.toLocaleString()}`,
                    icon: "📥",
                    color: "#10b981",
                  },
                  {
                    label: "First Seen",
                    value: searchResults.firstSeen,
                    icon: "📅",
                    color: colors.text.muted,
                  },
                  {
                    label: "Last Activity",
                    value: searchResults.lastSeen,
                    icon: "🕐",
                    color: colors.text.muted,
                  },
                  {
                    label: "Net Flow",
                    value: `KES ${(
                      searchResults.totalSent - searchResults.totalReceived
                    ).toLocaleString()}`,
                    icon: getFlowIcon(),
                    color: getScoreColor(getRelationshipScore()),
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "16px",
                      padding: "16px",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{stat.icon}</span>
                      <span
                        style={{
                          color: colors.text.muted,
                          fontSize: "10px",
                          fontWeight: 600,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {stat.label}
                      </span>
                    </div>
                    <div
                      style={{
                        color: stat.color || colors.text.primary,
                        fontWeight: 700,
                        fontSize: "18px",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                padding: "20px",
                borderTop: `1px solid ${colors.border}`,
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  background: "none",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "14px",
                  padding: "10px 20px",
                  color: colors.text.secondary,
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.cardLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                📊 Export Analysis
              </button>
              <button
                style={{
                  background: `linear-gradient(135deg, ${colors.status.success}, ${colors.primary})`,
                  border: "none",
                  borderRadius: "14px",
                  padding: "10px 24px",
                  color: "#1a1a2e",
                  fontWeight: 700,
                  fontSize: "12px",
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
                🔍 Deep Analysis →
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isPro && !searchResults && !isLoading && !query && (
          <div
            style={{
              marginTop: "28px",
              textAlign: "center",
              padding: "48px 32px",
              background: `linear-gradient(135deg, ${colors.cardLight}, ${colors.bg})`,
              borderRadius: "24px",
              border: `1px dashed ${colors.border}`,
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "40px",
                background: `${colors.status.success}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "40px",
              }}
            >
              🔍
            </div>
            <div
              style={{
                color: colors.text.primary,
                fontWeight: 600,
                fontSize: "16px",
                marginBottom: "6px",
              }}
            >
              Search for a counterparty
            </div>
            <div
              style={{
                color: colors.text.secondary,
                fontSize: "13px",
                maxWidth: "280px",
                margin: "0 auto",
              }}
            >
              Enter a name or phone number to analyze transaction patterns and
              relationships
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && isPro && (
          <div
            style={{
              marginTop: "28px",
              textAlign: "center",
              padding: "48px",
              background: colors.cardLight,
              borderRadius: "24px",
            }}
          >
            <div
              className="spinner"
              style={{ width: "40px", height: "40px", margin: "0 auto 16px" }}
            />
            <div style={{ color: colors.text.secondary }}>
              Analyzing counterparty relationships...
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .spinner {
          border: 3px solid rgba(60,230,174,0.1);
          border-top: 3px solid #3CE6AE;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        .spinner-small {
          border: 2px solid rgba(60,230,174,0.2);
          border-top: 2px solid #3CE6AE;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
    </div>
  );
};
