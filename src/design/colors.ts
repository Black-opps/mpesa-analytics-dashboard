// src/design/colors.ts

export const colors = {
  bg: "var(--bg)",
  bgSecondary: "var(--bg-secondary)",

  card: "var(--card)",
  cardSecondary: "var(--card-secondary)",

  // backward compatibility
  cardLight: "var(--card-secondary)",

  border: "var(--border)",
  borderLight: "var(--border-light)",

  text: {
    primary: "var(--text-primary)",
    secondary: "var(--text-secondary)",
    muted: "var(--text-muted)",
    accent: "var(--text-accent)",
  },

  status: {
    success: "#3CE6AE",
    danger: "#EF4444",
    warning: "#FACC15",
    info: "#8B5CF6",
  },

  overlay: "rgba(0,0,0,0.4)",

  glass: {
    success: "rgba(60,230,174,0.12)",
    warning: "rgba(250,204,21,0.12)",
    danger: "rgba(239,68,68,0.12)",
    info: "rgba(139,92,246,0.12)",
  },
};

export default colors;
