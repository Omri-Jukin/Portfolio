"use client";

import React, { useState, useEffect } from "react";
import { baseTheme } from "!/theme";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import Header, { TLayout } from "~/Header";

import Footer from "~/Footer";
import { useLocale } from "next-intl";
import ResponsiveLayout from "&/ResponsiveLayout";
import { ResponsiveLayout as TResponsiveLayout } from "&/ResponsiveLayout";
import { TRPCProvider } from "$/trpc/provider";
import Cookies from "#/Components/Cookies";
import Calendly from "#/Components/Calendly";
import GlobeBackground, { ISRAEL_MARKERS } from "~/GlobeBackground";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [forceLayout, setForceLayout] = useState<TResponsiveLayout>("auto");
  const [manualOverride, setManualOverride] = useState(false);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "he";

  // Create static initial theme to prevent hydration mismatches
  const initialTheme = createTheme({
    ...baseTheme,
    direction: isRTL ? "rtl" : "ltr",
    palette: {
      ...baseTheme.palette,
      mode: "light", // Always start with light mode to prevent hydration mismatch
      background: {
        ...baseTheme.palette.background,
        default: "#fafafa",
        paper: "#ffffff",
      },
      text: {
        ...baseTheme.palette.text,
        primary: "#2C3E50",
        secondary: "#34495E",
      },
      primary: {
        ...baseTheme.palette.primary,
        main: "#4ECDC4",
        light: "#64B5F6",
        dark: "#45B7D1",
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

  // Create dynamic theme only after mounting
  const appTheme = mounted
    ? createTheme({
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
      })
    : initialTheme;

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Set mounted to true after hydration
    setMounted(true);

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
  }, []); // Empty dependency array since we only want this to run once

  // Reset manual override when user navigates to new page
  useEffect(() => {
    if (manualOverride) {
      setManualOverride(false);
      localStorage.removeItem("manualOverride");
    }
  }, [manualOverride]);

  // Handle window resize for mobile detection
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

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

  // Always render the providers, but conditionally render the content
  return (
    <TRPCProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {/* Global Globe Background with Content */}
        <GlobeBackground
          markers={ISRAEL_MARKERS}
          size={1400}
          opacity={0.6}
          rotationSpeed={0.002}
        >
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
              width: "100%",
              maxWidth: "100vw",
              overflow: "hidden",
              background: "transparent",
            }}
          >
            {/* Main Content Area */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "100vw",
                overflow: "hidden",
                background: "transparent",
              }}
            >
              <ResponsiveLayout isMobile={isMobile} forceLayout={forceLayout}>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    maxWidth: "100vw",
                    overflow: "hidden",
                    background: "transparent",
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
            {isMobile && (
              <Calendly
                url="https://calendly.com/omrijukin/30min"
                text="Let's Talk!"
                backgroundColor="#FF6B6B"
                textColor="#FFFFFF"
                position="bottom-right"
                className="calendly-badge"
              />
            )}
          </Box>
        </GlobeBackground>
      </ThemeProvider>
    </TRPCProvider>
  );
}
