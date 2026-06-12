// src/components/dashboard/SummaryCards.tsx
import React from "react";
import CountUp from "react-countup";
import { colors } from "../../design/colors";
import { Card } from "../ui/Card";

interface SummaryCardsProps {
  moneyIn: string | number;
  moneyOut: string | number;
  netFlow: string | number;
  loading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  moneyIn,
  moneyOut,
  netFlow,
  loading = false,
}) => {
  const cards = [
    {
      label: "Money In",
      value: Number(moneyIn),
      color: colors.status.success,
      icon: "↗",
      glow: "rgba(60,230,174,0.16)",
      trend: "+12.4%",
      trendColor: colors.status.success,
    },
    {
      label: "Money Out",
      value: Number(moneyOut),
      color: colors.status.danger,
      icon: "↘",
      glow: "rgba(239,68,68,0.16)",
      trend: "+4.8%",
      trendColor: colors.status.warning,
    },
    {
      label: "Net Flow",
      value: Number(netFlow),
      color: colors.text.primary,
      icon: "◎",
      glow: "rgba(139,92,246,0.16)",
      trend: "+18.2%",
      trendColor: colors.status.success,
    },
  ];

  if (loading) {
    return (
      <div
        className="summary-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            style={{
              padding: "30px",
              background: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={{ color: colors.text.secondary }}>Loading...</div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className="summary-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "24px",
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          style={{
            padding: "30px",
            position: "relative",
            background: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            className="hover-lift glow kpi-card"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <div
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: card.glow,
                top: "-70px",
                right: "-70px",
                filter: "blur(30px)",
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
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
                      color: colors.text.secondary,
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: `${card.trendColor}12`,
                      color: card.trendColor,
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {card.trend}
                  </div>
                </div>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "14px",
                    background: colors.cardLight,
                    border: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    fontWeight: 800,
                    fontSize: "18px",
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: 800,
                  color: card.color,
                  letterSpacing: "-2px",
                  marginBottom: "14px",
                  lineHeight: 1,
                }}
              >
                <CountUp
                  end={card.value}
                  duration={2.2}
                  separator=","
                  prefix="KES "
                />
              </div>
              <div
                style={{
                  height: "48px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "6px",
                  marginBottom: "18px",
                }}
              >
                {[20, 35, 28, 44, 40, 56, 72, 68].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${height}%`,
                      borderRadius: "999px",
                      background: i === 7 ? card.color : `${card.color}30`,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: colors.text.muted, fontSize: "12px" }}>
                  Updated just now
                </div>
                <div
                  style={{
                    color: colors.text.secondary,
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Real-time
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
