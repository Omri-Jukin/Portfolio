import { createTheme } from "@mui/material/styles";

export interface ThemeProps {
  isDarkMode: boolean;
  isRTL: boolean;
}

export const theme = ({ isDarkMode, isRTL }: ThemeProps) =>
  createTheme({
    direction: isRTL ? "rtl" : "ltr",
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#dc004e",
        light: "#ff5983",
        dark: "#9a0036",
        contrastText: "#ffffff",
      },
      success: {
        main: "#2e7d32",
        light: "#4caf50",
        dark: "#1b5e20",
      },
      warning: {
        main: "#ed6c02",
        light: "#ff9800",
        dark: "#e65100",
      },
      info: {
        main: "#0288d1",
        light: "#03a9f4",
        dark: "#01579b",
      },
      error: {
        main: "#d32f2f",
        light: "#f44336",
        dark: "#c62828",
      },
      background: {
        default: isDarkMode ? "#0a0a0a" : "#fafafa",
        paper: isDarkMode ? "#1a1a1a" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#212121",
        secondary: isDarkMode ? "#b0b0b0" : "#757575",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.25rem",
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 500,
        fontSize: "1.125rem",
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    shadows: [
      "none",
      "0 2px 4px rgba(0, 0, 0, 0.1)",
      "0 4px 8px rgba(0, 0, 0, 0.1)",
      "0 4px 12px rgba(0, 0, 0, 0.15)",
      "0 6px 16px rgba(0, 0, 0, 0.2)",
      "0 8px 20px rgba(0, 0, 0, 0.25)",
      "0 12px 24px rgba(0, 0, 0, 0.3)",
      "0 16px 32px rgba(0, 0, 0, 0.35)",
      "0 20px 40px rgba(0, 0, 0, 0.4)",
      "0 24px 48px rgba(0, 0, 0, 0.45)",
      "0 28px 56px rgba(0, 0, 0, 0.5)",
      "0 32px 64px rgba(0, 0, 0, 0.55)",
      "0 36px 72px rgba(0, 0, 0, 0.6)",
      "0 40px 80px rgba(0, 0, 0, 0.65)",
      "0 44px 88px rgba(0, 0, 0, 0.7)",
      "0 48px 96px rgba(0, 0, 0, 0.75)",
      "0 52px 104px rgba(0, 0, 0, 0.8)",
      "0 56px 112px rgba(0, 0, 0, 0.85)",
      "0 60px 120px rgba(0, 0, 0, 0.9)",
      "0 64px 128px rgba(0, 0, 0, 0.95)",
      "0 68px 136px rgba(0, 0, 0, 1)",
      "0 72px 144px rgba(0, 0, 0, 1)",
      "0 76px 152px rgba(0, 0, 0, 1)",
      "0 80px 160px rgba(0, 0, 0, 1)",
      "0 84px 168px rgba(0, 0, 0, 1)",
    ],
    components: {
      MuiButton: {
        variants: [
          {
            props: { variant: "rounded" },
            style: {
              borderRadius: 8,
              padding: "8px 24px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            },
          },
          {
            props: { variant: "pill" },
            style: {
              borderRadius: 50,
              padding: "10px 32px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { variant: "square" },
            style: {
              borderRadius: 4,
              padding: "8px 24px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { size: "xs" },
            style: {
              padding: "4px 12px",
              fontSize: "0.75rem",
              minHeight: 28,
            },
          },
          {
            props: { size: "xl" },
            style: {
              padding: "12px 36px",
              fontSize: "1rem",
              minHeight: 48,
            },
          },
        ],
      },
      MuiCard: {
        variants: [
          {
            props: { variant: "elevated" },
            style: {
              borderRadius: 16,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                : "0 4px 20px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: isDarkMode
                  ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                  : "0 8px 32px rgba(0, 0, 0, 0.15)",
              },
            },
          },
          {
            props: { variant: "flat" },
            style: {
              borderRadius: 12,
              boxShadow: "none",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              border: `1px solid ${isDarkMode ? "#333" : "#e0e0e0"}`,
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              borderRadius: 8,
              boxShadow: "none",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              border: `2px solid ${isDarkMode ? "#444" : "#ddd"}`,
            },
          },
          {
            props: { variant: "soft" },
            style: {
              borderRadius: 20,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isDarkMode
                ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                : "0 2px 8px rgba(0, 0, 0, 0.08)",
            },
          },
        ],
      },
      MuiPaper: {
        variants: [
          {
            props: { variant: "rounded" },
            style: {
              borderRadius: 12,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { variant: "soft" },
            style: {
              borderRadius: 20,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { variant: "square" },
            style: {
              borderRadius: 4,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { variant: "pill" },
            style: {
              borderRadius: 50,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
        ],
      },
      MuiChip: {
        variants: [
          {
            props: { variant: "rounded" },
            style: {
              borderRadius: 8,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { variant: "square" },
            style: {
              borderRadius: 4,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { variant: "pill" },
            style: {
              borderRadius: 50,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          {
            props: { size: "xs" },
            style: {
              height: 20,
              fontSize: "0.625rem",
              "& .MuiChip-label": {
                padding: "0 6px",
              },
            },
          },
          {
            props: { size: "xl" },
            style: {
              height: 40,
              fontSize: "0.875rem",
              "& .MuiChip-label": {
                padding: "0 16px",
              },
            },
          },
        ],
      },
      MuiTypography: {
        variants: [
          {
            props: { variant: "h1" },
            style: {
              fontSize: "2.5rem",
              fontWeight: 700,
              lineHeight: 1.2,
            },
          },
          {
            props: { variant: "h2" },
            style: {
              fontSize: "2rem",
              fontWeight: 600,
              lineHeight: 1.3,
            },
          },
          {
            props: { variant: "h3" },
            style: {
              fontSize: "1.75rem",
              fontWeight: 600,
              lineHeight: 1.4,
            },
          },
          {
            props: { variant: "h4" },
            style: {
              fontSize: "1.5rem",
              fontWeight: 600,
              lineHeight: 1.4,
            },
          },
          {
            props: { variant: "h5" },
            style: {
              fontSize: "1.25rem",
              fontWeight: 500,
              lineHeight: 1.5,
            },
          },
          {
            props: { variant: "h6" },
            style: {
              fontSize: "1.125rem",
              fontWeight: 500,
              lineHeight: 1.5,
            },
          },
          {
            props: { variant: "body1" },
            style: {
              fontSize: "1rem",
              lineHeight: 1.6,
            },
          },
          {
            props: { variant: "body2" },
            style: {
              fontSize: "0.875rem",
              lineHeight: 1.6,
            },
          },
        ],
      },
    },
  });
