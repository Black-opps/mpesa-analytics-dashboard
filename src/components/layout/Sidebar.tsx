// src/components/layout/Sidebar.tsx

import React from "react";
import { colors } from "../../design/colors";
import { sidebarItems, SidebarItem } from "../../constants/sidebar";
import { usePermissions } from "../../hooks/usePermissions";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isPro?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = "dashboard",
  onTabChange,
  isPro = false,
}) => {
  const { hasRole, role } = usePermissions();

  const visibleItems = sidebarItems.filter((item) => hasRole(item.roles));

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: "340px",
        minWidth: "340px",
        height: "100vh",
        background: colors.bgSecondary,
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        overflow: "hidden",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Ambient Glow */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: colors.glass.success,
          top: "-180px",
          left: "-180px",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* BRAND */}
      <div
        style={{
          padding: "42px 32px 30px",
          borderBottom: `1px solid ${colors.border}`,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: "40px",
            fontWeight: 800,
            letterSpacing: "-2px",
            color: colors.text.primary,
            marginBottom: "10px",
            lineHeight: 1,
          }}
        >
          Edrace
        </div>

        <div
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: colors.text.secondary,
          }}
        >
          Financial Intelligence
        </div>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          flex: 1,
          padding: "24px 16px",
          position: "relative",
          zIndex: 2,
          overflowY: "auto",
        }}
      >
        {visibleItems.map((item: SidebarItem) => {
          const active = activeTab === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className="hover-lift card-hover"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                background: active
                  ? "linear-gradient(135deg, rgba(60,230,174,0.12), rgba(60,230,174,0.03))"
                  : "transparent",
                border: active
                  ? `1px solid ${colors.status.success}25`
                  : `1px solid transparent`,
              }}
            >
              {/* LEFT */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* ICON */}
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "16px",
                    background: active
                      ? colors.glass.success
                      : colors.cardSecondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: active
                      ? colors.status.success
                      : colors.text.secondary,
                    fontWeight: 700,
                    fontSize: "18px",
                    transition: "all 0.25s ease",
                  }}
                >
                  {item.icon}
                </div>

                {/* TEXT */}
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: active ? 700 : 600,
                      color: active
                        ? colors.text.primary
                        : colors.text.secondary,
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "11px",
                      color: colors.text.muted,
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {/* PREMIUM BADGE */}
              {item.premium && (
                <div
                  style={{
                    padding: "5px 10px",
                    borderRadius: "999px",
                    background: colors.glass.warning,
                    color: colors.status.warning,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  PRO
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* USER PANEL */}
      <div
        style={{
          padding: "22px",
          borderTop: `1px solid ${colors.border}`,
          background: colors.cardSecondary,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* AVATAR */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, rgba(60,230,174,0.18), rgba(60,230,174,0.05))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.status.success,
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            JK
          </div>

          {/* USER INFO */}
          <div>
            <div
              style={{
                color: colors.text.primary,
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              John Kamau
            </div>

            <div
              style={{
                color: colors.text.secondary,
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              {role.toUpperCase()}
            </div>

            <div
              style={{
                color: colors.text.muted,
                fontSize: "11px",
              }}
            >
              {isPro ? "Pro Intelligence Plan" : "Free Starter Plan"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
