// src/components/ui/EmptyState.tsx

import React from "react";
import { colors } from "../../design/colors";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string; // Optional custom icon
  actionText?: string; // Optional action button text
  onAction?: () => void; // Optional action handler
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = "📭", // Default icon (matches your design)
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        border: `1px dashed ${colors.border}`,
        borderRadius: "20px",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "12px" }}>{icon}</div>

      <div
        style={{
          color: colors.text.primary,
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      {description && (
        <div
          style={{
            color: colors.text.secondary,
            fontSize: "14px",
            maxWidth: "400px",
            margin: "0 auto",
            lineHeight: 1.6,
            marginBottom: actionText ? "20px" : 0,
          }}
        >
          {description}
        </div>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            background: colors.primary,
            color: "white",
            border: "none",
            padding: "10px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {actionText} →
        </button>
      )}
    </div>
  );
};
