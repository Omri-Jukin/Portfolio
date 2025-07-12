"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ReactNode, useMemo } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  isDarkMode?: boolean;
}

export default function ThemeProvider({
  children,
  isDarkMode = false,
}: ThemeProviderProps) {
  const theme = useMemo(() => {
    return createTheme({
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
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: "8px 24px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            },
            contained: {
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
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
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
      },
    });
  }, [isDarkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
