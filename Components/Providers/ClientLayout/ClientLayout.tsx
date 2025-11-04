"use client";

import React, { useState, useEffect, useMemo } from "react";
import { baseTheme } from "!/theme";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import { applyTextColorVariables } from "#/theme";
import Header, { TLayout } from "~/Header";

import Footer from "~/Footer";
import { useLocale } from "next-intl";
import ResponsiveLayout from "&/ResponsiveLayout";
import { ResponsiveLayout as TResponsiveLayout } from "&/ResponsiveLayout";
import { TRPCProvider } from "$/trpc/provider";
import Cookies from "#/Components/Cookies";
import Calendly from "#/Components/Calendly";
import GlobeBackground, { ALL_MARKERS } from "~/GlobeBackground";
import { usePathname } from "next/navigation";
import { SnackbarProvider } from "~/SnackbarProvider";
import { useScrollPosition } from "$/hooks/useScrollPosition";

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
  const pathname = usePathname();
  const isRTL = locale === "he";

  // Opacity is a percentage of scroll progress: 0.2 at top, 0.05 at bottom
  const progress = useScrollPosition().scrollProgress;
  const scrollProgress = 0.2 - 0.15 * progress; // 0.2 (top) -> 0.05 (bottom)

  // Check if current page is an example page
  const isExamplePage = pathname?.includes("/examples");

  // Create static initial theme to prevent hydration mismatches
  const initialTheme = createTheme({
    ...baseTheme,
    direction: "ltr", // Always start with LTR to prevent hydration mismatch
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
        primary: "#0a0a0a",
        secondary: "#1a1a1a",
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
  // Memoize to prevent unnecessary re-creations and re-renders
  const appTheme = useMemo(
    () =>
      mounted
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
        : initialTheme,
    // initialTheme is intentionally static and doesn't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted, isRTL, isDarkMode]
  );

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

  // Apply CSS variables after mount and when theme changes to prevent hydration mismatches
  useEffect(() => {
    if (!mounted) return;
    applyTextColorVariables(appTheme);
  }, [mounted, appTheme]);

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
        <SnackbarProvider>
          {/* Global Globe Background with Content */}
          {!isExamplePage && (
            <GlobeBackground
              markers={ALL_MARKERS}
              opacity={scrollProgress}
              rotationSpeed={0.002}
            />
          )}

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
              width: "100%",
              marginTop: "4rem",
              maxWidth: "calc(100vw - 4rem)",
              mx: "auto",
              background: "transparent",
            }}
          >
            {/* Main Content Area */}
            <ResponsiveLayout isMobile={isMobile} forceLayout={forceLayout}>
              {children}
            </ResponsiveLayout>

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
        </SnackbarProvider>
      </ThemeProvider>
    </TRPCProvider>
  );
}
