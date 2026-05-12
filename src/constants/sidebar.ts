// src/constants/sidebar.ts

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  roles: string[];
  premium: boolean;
  description: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "◉",
    roles: ["owner", "admin", "analyst", "viewer"],
    premium: false,
    description: "Core analytics",
  },

  {
    id: "insights",
    label: "Insights",
    icon: "✦",
    roles: ["owner", "admin", "analyst"],
    premium: false,
    description: "AI intelligence",
  },

  {
    id: "people",
    label: "People & Businesses",
    icon: "◎",
    roles: ["owner", "admin"],
    premium: true,
    description: "Counterparty analysis",
  },

  {
    id: "transactions",
    label: "Transactions",
    icon: "◈",
    roles: ["owner", "admin", "analyst"],
    premium: false,
    description: "Transaction explorer",
  },

  {
    id: "reports",
    label: "Reports",
    icon: "⬢",
    roles: ["owner", "admin"],
    premium: true,
    description: "Export & reporting",
  },

  {
    id: "users",
    label: "Users",
    icon: "◌",
    roles: ["owner", "admin"],
    premium: false,
    description: "User management",
  },
];
