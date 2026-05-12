// src/components/ui/Modal.tsx

import React from "react";
import { colors } from "../../design/colors";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-in"
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "linear-gradient(180deg, #11182B 0%, #0D1322 100%)",
          border: `1px solid ${colors.border}`,
          borderRadius: "28px",
          padding: "32px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
