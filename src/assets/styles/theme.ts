import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1", // Indigo
      light: "#8183f4",
      dark: "#4f52e0",
    },
    secondary: {
      main: "#ec4899", // Pink
      light: "#f472b6",
      dark: "#db2777",
    },
    success: {
      main: "#10b981", // Emerald
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b", // Amber
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444", // Red
      light: "#f87171",
      dark: "#dc2626",
    },
    info: {
      main: "#3b82f6", // Blue
      light: "#60a5fa",
      dark: "#2563eb",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 16,
  },

  // Breakpoints – use current MUI defaults unless you have a strong reason to change
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900, // ← corrected from 960
      lg: 1200,
      xl: 1536,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "10px 20px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(99, 102, 241, 0.2)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f52e0 0%, #7c3aed 100%)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15)",
          },
          // Responsive override example
          [createTheme().breakpoints.down("sm")]: {
            // ← use a temp createTheme() or define breakpoints first
            borderRadius: 16,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
        elevation1: {
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
        filled: {
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "white",
        },
      },
    },

    // Responsive Container padding on mobile
    MuiContainer: {
      styleOverrides: {
        root: {
          // Use string media query or helper if needed
          "@media (max-width:599.95px)": {
            // equivalent to down('sm')
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
  },
});

export default theme;
