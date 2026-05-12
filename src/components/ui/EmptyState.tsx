import React from "react";
import { colors } from "../../design/colors";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
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
      <div style={{ fontSize: "42px", marginBottom: "12px" }}>📭</div>

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

      <div
        style={{
          color: colors.text.secondary,
          fontSize: "14px",
          maxWidth: "400px",
          margin: "0 auto",
          lineHeight: 1.6,
        }}
      >
        {description}
      </div>
    </div>
  );
};
