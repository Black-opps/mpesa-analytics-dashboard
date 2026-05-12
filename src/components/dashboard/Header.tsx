// src/components/dashboard/Header.tsx
import React from "react";
import { colors } from "../../design/colors";
import { Button } from "../ui/Button";
interface HeaderProps { onUpload: () => void; }
export const Header: React.FC<HeaderProps> = ({ onUpload }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
    <div><h1 style={{ fontSize: "28px", fontWeight: "bold", color: colors.text.primary, margin: 0 }}>Your Financial Story</h1><p style={{ color: colors.text.secondary, marginTop: "8px" }}>AI-powered insights from your transactions</p></div>
    <Button onClick={onUpload}>+ Upload</Button>
  </div>
);
