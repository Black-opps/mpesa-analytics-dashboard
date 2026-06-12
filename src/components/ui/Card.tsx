// src/components/ui/Card.tsx

import React from "react";
import { colors } from "../../design/colors";
import { theme } from "../../design/theme";
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        padding: "20px",
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
