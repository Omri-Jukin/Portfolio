"use client";

import React, { useState, useEffect } from "react";
import { baseTheme } from "!/theme";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import Header, { TLayout } from "~/Header";

import Footer from "~/Footer";
import { useLocale } from "next-intl";
import createEmotionCache from "@/app/mui-emotion-cache";
import { CacheProvider } from "@emotion/react";
import ResponsiveLayout from "&/ResponsiveLayout";
import { ResponsiveLayout as TResponsiveLayout } from "&/ResponsiveLayout";
import { TRPCProvider } from "$/trpc/provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [forceLayout, setForceLayout] = useState<TResponsiveLayout>("auto");
  const [manualOverride, setManualOverride] = useState(false); // Track if user manually overrode animation
  const locale = useLocale();
  const isRTL = locale === "he";

  useEffect(() => {
    // Load theme preferences
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(stored === "dark" || (!stored && prefersDark));

    // Load manual override preference
    const storedOverride = localStorage.getItem("manualOverride");
    setManualOverride(storedOverride === "true");

    // Get stored layout preferences
    const storedLayout = localStorage.getItem(
      "layout"
    ) as TResponsiveLayout | null;
    if (storedLayout) {
      setForceLayout(storedLayout);
      setIsMobile(storedLayout === "mobile" || storedLayout === "auto");
    } else {
      // Default mobile detection if no stored preference
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // Reset manual override when user navigates to new page
  useEffect(() => {
    if (manualOverride) {
      setManualOverride(false);
      localStorage.removeItem("manualOverride");
    }
  }, [manualOverride]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      if (forceLayout === "auto") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [forceLayout]);

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleLayoutChange = (layout: TLayout) => {
    setForceLayout(layout);
    localStorage.setItem("layout", layout);
  };

  // Create app theme with dark mode and RTL support
  const appTheme = createTheme({
    ...baseTheme,
    direction: isRTL ? "rtl" : "ltr",
    palette: {
      ...baseTheme.palette,
      mode: isDarkMode ? "dark" : "light",
      background: {
        ...baseTheme.palette.background,
        default: isDarkMode ? "#0a0a0a" : "#fafafa",
        paper: isDarkMode ? "#1a1a1a" : "#ffffff",
      },
      text: {
        ...baseTheme.palette.text,
        primary: isDarkMode ? "#FFEAA7" : "#2C3E50", // Yellow in dark, Dark blue-gray in light
        secondary: isDarkMode ? "#FFFFFF" : "#34495E", // White in dark, Dark gray in light
      },
      primary: {
        ...baseTheme.palette.primary,
        main: isDarkMode ? "#64B5F6" : "#4ECDC4", // Light blue in dark, Teal in light
        light: isDarkMode ? "#45B7D1" : "#64B5F6", // Blue in dark, Light blue in light
        dark: isDarkMode ? "#4ECDC4" : "#45B7D1", // Teal in dark, Blue in light
      },
      secondary: {
        ...baseTheme.palette.secondary,
        main: isDarkMode ? "#FF6B6B" : "#FF6B6B", // Red in both modes
        light: isDarkMode ? "#F06292" : "#F06292", // Pink in both modes
        dark: isDarkMode ? "#9575CD" : "#9575CD", // Purple in both modes
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any);

  const clientSideEmotionCache = createEmotionCache();

  // Always render the providers, but conditionally render the content
  return (
    <TRPCProvider>
      <CacheProvider value={clientSideEmotionCache}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <Box sx={{ minHeight: "100vh" }}>
            {/* Fixed Header */}
            <Header
              isDarkMode={isDarkMode}
              onThemeToggle={handleThemeToggle}
              isMobile={isMobile}
              forceLayout={forceLayout}
              onLayoutChange={handleLayoutChange}
            />

            {/* Main Layout Container */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                pt: "4rem", // Account for fixed header height
              }}
            >
              {/* Main Content Area */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ResponsiveLayout isMobile={isMobile} forceLayout={forceLayout}>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {children}
                  </Box>
                </ResponsiveLayout>
              </Box>

              {/* Footer */}
              <Footer />
            </Box>
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </TRPCProvider>
  );
}
