// src/components/ui/Button.tsx
import React from "react";
import { colors } from "../../design/colors";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
}) => {
  const primary = variant === "primary";

  return (
    <button
      onClick={onClick}
      style={{
        width: fullWidth ? "100%" : "auto",
        height: "48px",
        padding: "0 20px",
        borderRadius: "14px",
        border: primary ? "none" : `1px solid ${colors.border}`,
        background: primary
          ? "linear-gradient(135deg,#3CE6AE 0%, #7CF7CC 100%)"
          : "rgba(255,255,255,0.03)",
        color: primary ? "#04110B" : colors.text.primary,
        fontWeight: 700,
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: primary ? "0 10px 24px rgba(60,230,174,0.22)" : "none",
      }}
    >
      {children}
    </button>
  );
};
