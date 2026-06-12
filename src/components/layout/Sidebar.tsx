// src/components/layout/Sidebar.tsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  premium: boolean;
  adminOnly?: boolean;
}

// src/components/layout/Sidebar.tsx
const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "◉",
    path: "/dashboard",
    premium: false,
  }, // ← Changed from "/" to "/dashboard"
  {
    id: "insights",
    label: "Insights",
    icon: "✦",
    path: "/insights",
    premium: false,
  },
  {
    id: "people",
    label: "People & Businesses",
    icon: "◎",
    path: "/people",
    premium: true,
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: "◈",
    path: "/transactions",
    premium: false,
  },
  {
    id: "reports",
    label: "Reports",
    icon: "⬢",
    path: "/reports",
    premium: true,
  },
  {
    id: "users",
    label: "Users",
    icon: "◌",
    path: "/users",
    premium: false,
    adminOnly: true,
  },
];

interface SidebarProps {
  isPro?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isPro = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const isAdmin = user?.role === "owner" || user?.role === "admin";

  const visibleItems = sidebarItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const handleNavigation = (item: SidebarItem) => {
    if (item.adminOnly && !isAdmin) return;

    if (item.premium && !isPro) {
      alert("Upgrade to Pro to access this feature");
      return;
    }

    navigate(item.path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        height: "100vh",
        background: "#0f172a",
        borderRight: "1px solid #1e293b",

        display: "flex",
        flexDirection: "column",

        position: "sticky",
        top: 0,

        overflow: "hidden",

        zIndex: 20,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.5px",

            background: "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)",

            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Edrace
        </h1>

        <p
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#64748b",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Financial Intelligence
        </p>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
        }}
      >
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;

          const locked = item.premium && !isPro;

          return (
            <div
              key={item.id}
              onClick={() => handleNavigation(item)}
              style={{
                display: "flex",
                alignItems: "center",

                gap: "14px",

                padding: "14px 16px",
                marginBottom: "8px",

                borderRadius: "14px",

                cursor: locked ? "not-allowed" : "pointer",

                transition: "all 0.2s ease",

                background: active
                  ? "linear-gradient(135deg, rgba(60,230,174,0.12) 0%, rgba(34,197,94,0.08) 100%)"
                  : "transparent",

                border: active
                  ? "1px solid rgba(60,230,174,0.18)"
                  : "1px solid transparent",

                opacity: locked ? 0.45 : 1,
              }}
            >
              {/* ICON */}
              <div
                style={{
                  width: "36px",
                  height: "36px",

                  borderRadius: "12px",

                  background: active ? "rgba(60,230,174,0.12)" : "#111827",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  fontSize: "16px",

                  color: active ? "#3CE6AE" : "#94a3b8",
                }}
              >
                {item.icon}
              </div>

              {/* LABEL */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: active ? "#ffffff" : "#cbd5e1",
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "2px",
                  }}
                >
                  {item.id === "dashboard" && "Core analytics"}

                  {item.id === "insights" && "AI intelligence"}

                  {item.id === "people" && "Counterparty analysis"}

                  {item.id === "transactions" && "Transaction explorer"}

                  {item.id === "reports" && "Export & reporting"}

                  {item.id === "users" && "User management"}
                </div>
              </div>

              {/* BADGES */}
              {item.premium && !isPro && (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,

                    background: "#374151",

                    color: "#f3f4f6",

                    padding: "4px 8px",

                    borderRadius: "999px",
                  }}
                >
                  PRO
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",

            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",

              borderRadius: "14px",

              background: "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontWeight: 700,
              color: "#0f172a",

              fontSize: "16px",
            }}
          >
            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#f8fafc",
              }}
            >
              {user?.full_name || user?.email?.split("@")[0] || "User"}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#3CE6AE",
                marginTop: "2px",
              }}
            >
              {user?.role?.toUpperCase() || "USER"}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",

            padding: "12px",

            borderRadius: "12px",

            border: "1px solid rgba(239,68,68,0.2)",

            background: "rgba(239,68,68,0.08)",

            color: "#ef4444",

            fontWeight: 600,

            cursor: "pointer",

            transition: "0.2s",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
