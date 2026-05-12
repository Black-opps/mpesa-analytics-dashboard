// src/components/layout/Topbar.tsx

import React from "react";
import { colors } from "../../design/colors";
import { useTheme } from "../../theme/ThemeContext";

interface TopbarProps {
  onUpload: () => void;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onUpload,
  isPro = false,
  onUpgrade,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="topbar-mobile"
      style={{
        height: "82px",
        width: "100%",
        background: colors.bgSecondary,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "28px",
              lineHeight: 1,
              letterSpacing: "-1px",
              color: colors.text.primary,
            }}
          >
            Edrace
          </div>

          <div
            style={{
              fontSize: "12px",
              color: colors.text.secondary,
              marginTop: "6px",
            }}
          >
            Financial Intelligence Platform
          </div>
        </div>
      </div>

      {/* CENTER */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <div
          className="glass"
          style={{
            width: "100%",
            maxWidth: "520px",
            height: "48px",
            borderRadius: "16px",
            background: colors.cardLight,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: "12px",
          }}
        >
          <span
            style={{
              color: colors.text.muted,
              fontSize: "14px",
            }}
          >
            ⌕
          </span>

          <input
            placeholder="Search transactions, businesses, phone numbers..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: colors.text.primary,
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="hover-lift"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            border: `1px solid ${colors.border}`,
            background: colors.cardLight,
            cursor: "pointer",
            color: colors.text.primary,
            fontSize: "16px",
            transition: "all 0.25s ease",
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Upload */}
        <button
          onClick={onUpload}
          className="hover-lift"
          style={{
            height: "46px",
            padding: "0 22px",
            borderRadius: "14px",
            border: "none",
            background: "linear-gradient(135deg, #3CE6AE 0%, #2DD4BF 100%)",
            color: "#03120D",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(60,230,174,0.18)",
            transition: "all 0.25s ease",
          }}
        >
          + Upload Statement
        </button>

        {/* Upgrade */}
        {!isPro && (
          <button
            onClick={onUpgrade}
            className="hover-lift"
            style={{
              height: "42px",
              padding: "0 18px",
              borderRadius: "12px",
              border: `1px solid ${colors.status.warning}22`,
              background: `${colors.status.warning}12`,
              color: colors.status.warning,
              fontWeight: 700,
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            Upgrade to Pro
          </button>
        )}

        {/* Avatar */}
        <div
          className="hover-lift"
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(60,230,174,0.18), rgba(60,230,174,0.06))",
            border: "1px solid rgba(60,230,174,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 700,
            color: colors.status.success,
            cursor: "pointer",
          }}
        >
          JK
        </div>
      </div>
    </div>
  );
};
