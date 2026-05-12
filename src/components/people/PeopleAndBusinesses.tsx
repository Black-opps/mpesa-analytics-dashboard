// src/components/people/PeopleAndBusinesses.tsx
import React, { useState } from "react";
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

  return (
    <div
      style={{
        background: colors.bgSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: "24px",
        padding: "28px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(60,230,174,0.08)",
          filter: "blur(80px)",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: colors.text.primary,
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              People & Businesses
            </h2>

            <div
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                background: `${colors.status.warning}15`,
                border: `1px solid ${colors.status.warning}33`,
                color: colors.status.warning,
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              PRO
            </div>
          </div>

          <p
            style={{
              margin: 0,
              color: colors.text.secondary,
              fontSize: "13px",
              lineHeight: 1.6,
              maxWidth: "560px",
            }}
          >
            Search counterparties by name or phone number to analyze transaction
            frequency, money flow, behavioral trends, and financial
            relationships.
          </p>
        </div>

        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            background: colors.cardLight,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.status.success,
            fontSize: "20px",
          }}
        >
          👥
        </div>
      </div>

      {/* SEARCH */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or phone number..."
          disabled={!isPro}
          style={{
            flex: 1,
            height: "52px",
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            background: colors.card,
            color: colors.text.primary,
            padding: "0 16px",
            fontSize: "14px",
            outline: "none",
          }}
        />

        <button
          disabled={!isPro}
          onClick={() => onSearch(query)}
          style={{
            padding: "0 22px",
            borderRadius: "14px",
            border: "none",
            background: isPro ? colors.status.success : colors.cardLight,
            color: isPro ? "#04110B" : colors.text.muted,
            fontWeight: 700,
            cursor: isPro ? "pointer" : "not-allowed",
            minWidth: "120px",
            height: "52px",
          }}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* UPGRADE BLOCK */}
      {!isPro && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          <div>
            <div
              style={{
                color: colors.text.primary,
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              Unlock Counterparty Intelligence
            </div>

            <div
              style={{
                color: colors.text.secondary,
                fontSize: "12px",
              }}
            >
              Analyze relationships, recurring payments, and financial patterns.
            </div>
          </div>

          <button
            onClick={onUnlock}
            style={{
              border: "none",
              background: colors.status.success,
              color: "#04110B",
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Upgrade →
          </button>
        </div>
      )}

      {/* RESULTS */}
      {searchResults && isPro && (
        <div
          style={{
            marginTop: "24px",
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  color: colors.text.primary,
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                {searchResults.name}
              </div>

              <div
                style={{
                  color: colors.text.secondary,
                  fontSize: "13px",
                  marginTop: "4px",
                }}
              >
                {searchResults.phone}
              </div>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                background: `${colors.status.success}15`,
                color: colors.status.success,
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              ACTIVE
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "16px",
            }}
          >
            {[
              {
                label: "Transactions",
                value: searchResults.transactionCount,
              },
              {
                label: "Total Sent",
                value: `KES ${searchResults.totalSent.toLocaleString()}`,
              },
              {
                label: "Received",
                value: `KES ${searchResults.totalReceived.toLocaleString()}`,
              },
              {
                label: "Last Seen",
                value: searchResults.lastSeen,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    color: colors.text.muted,
                    fontSize: "11px",
                    marginBottom: "8px",
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    color: colors.text.primary,
                    fontWeight: 700,
                    fontSize: "15px",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
