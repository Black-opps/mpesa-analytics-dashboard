// src/components/ui/Card.tsx

import React from "react";
import { colors } from "../../design/colors";
import { theme } from "../../design/theme";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <div
      className="card-hover fade-in"
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.md,
        transition: theme.transitions.normal,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
