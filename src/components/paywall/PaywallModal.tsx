// src/components/paywall/PaywallModal.tsx

import React from "react";
import { Modal } from "../ui/Modal";
import { colors } from "../../design/colors";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onPay,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="fade-in"
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 20px",
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, rgba(60,230,174,0.2), rgba(60,230,174,0.05))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            border: `1px solid ${colors.border}`,
          }}
        >
          🔓
        </div>

        <h2
          style={{
            fontSize: "28px",
            marginBottom: "10px",
            color: colors.text.primary,
          }}
        >
          Unlock Pro Intelligence
        </h2>

        <p
          style={{
            color: colors.text.secondary,
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          Access counterparty intelligence, relationship tracking, financial
          behavior analysis, premium insights, and advanced reports.
        </p>

        <div
          style={{
            background: "rgba(60,230,174,0.08)",
            border: `1px solid rgba(60,230,174,0.2)`,
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              color: colors.text.secondary,
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            Monthly Subscription
          </div>

          <div
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: colors.status.success,
            }}
          >
            KES 699
          </div>
        </div>

        <button
          onClick={onPay}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: colors.status.success,
            color: "#000",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "14px",
          }}
        >
          Continue with M-PESA
        </button>

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: colors.text.muted,
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Maybe later
        </button>
      </div>
    </Modal>
  );
};
