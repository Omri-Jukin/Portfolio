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
import Cookies from "#/Components/Cookies";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [forceLayout, setForceLayout] = useState<TResponsiveLayout>("auto");
  const [manualOverride, setManualOverride] = useState(false); // Track if user manually overrode animation
  const locale = useLocale();
  const isRTL = locale === "he";

  useEffect(() => {
    // Set mounted to true after hydration
    if (typeof window !== "undefined" && !mounted) {
      setMounted(true);
    }

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
  }, [mounted]);

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
        primary: isDarkMode ? "#FFEAA7" : "#2C3E50",
        secondary: isDarkMode ? "#FFFFFF" : "#34495E",
      },
      primary: {
        ...baseTheme.palette.primary,
        main: isDarkMode ? "#64B5F6" : "#4ECDC4",
        light: isDarkMode ? "#45B7D1" : "#64B5F6",
        dark: isDarkMode ? "#4ECDC4" : "#45B7D1",
      },
      secondary: {
        ...baseTheme.palette.secondary,
        main: "#FF6B6B",
        light: "#F06292",
        dark: "#9575CD",
      },
    },
    breakpoints: {
      ...baseTheme.breakpoints,
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        ml: 1920,
        xxl: 2560,
        xxxl: 3840,
        xxxxl: 5120,
      },
    },
  });

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
              {/* Cookies */}
              <Cookies />
            </Box>
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </TRPCProvider>
  );
}
