"use client";

import React, { useState, useEffect } from "react";
import { baseTheme } from "!/theme";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Header, TLayout } from "~/Header";
import AnimatedBackground, { AnimationType } from "~/AnimatedBackground";
import Footer from "@/app/[locale]/Footer";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import createEmotionCache from "@/app/mui-emotion-cache";
import { CacheProvider } from "@emotion/react";
import ResponsiveLayout from "&/ResponsiveLayout";
import { ResponsiveLayout as TResponsiveLayout } from "&/ResponsiveLayout";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [animationType, setAnimationType] = useState<AnimationType>("dna"); // Default to DNA for impressive visual
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [forceLayout, setForceLayout] = useState<TResponsiveLayout>("auto");
  const [manualOverride, setManualOverride] = useState(false); // Track if user manually overrode animation
  const locale = useLocale();
  const isRTL = locale === "he";
  const currentPath = usePathname();

  useEffect(() => {
    // Load theme preferences
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(stored === "dark" || (!stored && prefersDark));

    // Load animation type preference
    const storedAnimation = localStorage.getItem(
      "animationType"
    ) as AnimationType | null;
    if (storedAnimation) {
      setAnimationType(storedAnimation);
    }

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
    }

    setMounted(true);
  }, [isMobile]);

  // Reset manual override when path changes (user navigates to new page)
  useEffect(() => {
    if (manualOverride) {
      setManualOverride(false);
      localStorage.removeItem("manualOverride");
    }
  }, [currentPath, manualOverride]);

  if (!mounted) {
    // Optionally, render a loader or just null
    return null;
  }

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleAnimationChange = (newAnimationType: AnimationType) => {
    setAnimationType(newAnimationType);
    setManualOverride(true); // Mark that user manually overrode the animation
    localStorage.setItem("animationType", newAnimationType);
    localStorage.setItem("manualOverride", "true");
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
        primary: isDarkMode ? "#ffffff" : "#000000",
        secondary: isDarkMode ? "#b0b0b0" : "#757575",
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any);

  const clientSideEmotionCache = createEmotionCache();

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {/* Fixed Header */}
        <Header
          animationType={animationType}
          onAnimationTypeChange={handleAnimationChange}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          isMobile={isMobile}
          forceLayout={forceLayout}
          onLayoutChange={handleLayoutChange}
        />

        {/* Animated Background - Path-dependent animations */}
        <AnimatedBackground
          animationType={animationType}
          isMobile={isMobile}
          path={currentPath}
          manualOverride={manualOverride}
          key={`background-${currentPath}-${manualOverride}`}
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
              overflow: "hidden", // Prevent scrolling in main content
            }}
          >
            <ResponsiveLayout isMobile={isMobile} forceLayout={forceLayout}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto", // Allow scrolling only within content area
                }}
              >
                {children}
              </Box>
            </ResponsiveLayout>
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
