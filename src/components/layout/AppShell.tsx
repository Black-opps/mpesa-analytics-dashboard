// src/components/layout/AppShell.tsx
import React from "react";
import { colors } from "../../design/colors";

interface AppShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ sidebar, topbar, children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg }}>
      {/* Sidebar */}
      <aside style={{ flexShrink: 0 }}>{sidebar}</aside>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ flexShrink: 0 }}>{topbar}</header>
        
        {/* Main Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
};
