"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import Header, { TLayout } from "~/Header";

// Footer moved to TerminalHero component
import { useLocale } from "next-intl";
import ResponsiveLayout from "&/ResponsiveLayout";
import { ResponsiveLayout as TResponsiveLayout } from "&/ResponsiveLayout";
import { TRPCProvider } from "$/trpc/provider";
import Cookies from "#/Components/Cookies";
import Calendly from "#/Components/Calendly";
// GlobeBackground removed for cleaner terminal-focused design
// import { usePathname } from "next/navigation";
import { SnackbarProvider } from "~/SnackbarProvider";
// import { useScrollPosition } from "$/hooks/useScrollPosition";
import BackToTop from "~/BackToTop";
import { scrollToSection } from "$/utils/scrollToSection";
import { useActiveSection } from "$/hooks/useActiveSection";
import { SECTION_IDS } from "#/lib";
import { createPortfolioTheme } from "#/theme";
import PerformanceMonitor from "~/PerformanceMonitor";
import BundleAnalyzer from "~/BundleAnalyzer";
import {
  registerServiceWorker,
  preloadCriticalResources,
  addResourceHints,
} from "$/utils/performance";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [forceLayout, setForceLayout] = useState<TResponsiveLayout>("auto");
  const [manualOverride, setManualOverride] = useState(false);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  // const pathname = usePathname();
  const isRTL = locale === "he";

  // Opacity is a percentage of scroll progress: 0.2 at top, 0.05 at bottom
  // const progress = useScrollPosition().scrollProgress;
  // const scrollProgress = 0.2 - 0.15 * progress; // 0.2 (top) -> 0.05 (bottom)

  // // Check if current page is an example page
  // const isExamplePage = pathname?.includes("/examples");

  const sectionOrder = useMemo(
    () => [
      SECTION_IDS.HERO,
      SECTION_IDS.ABOUT,
      SECTION_IDS.CAREER,
      SECTION_IDS.PROJECTS,
      SECTION_IDS.CONTACT,
    ],
    []
  );

  const activeSection = useActiveSection(sectionOrder);

  const handleSectionNavigate = useCallback((sectionId: string) => {
    scrollToSection(sectionId);
  }, []);
  // Use SSR-safe theme snapshots to avoid hydration flicker
  const initialTheme = useMemo(() => createPortfolioTheme("dark", "ltr"), []);

  const appTheme = useMemo(() => {
    if (!mounted) {
      return initialTheme;
    }

    return createPortfolioTheme(
      isDarkMode ? "dark" : "light",
      isRTL ? "rtl" : "ltr"
    );
  }, [initialTheme, isDarkMode, isRTL, mounted]);

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

    // Initialize performance optimizations
    preloadCriticalResources();
    addResourceHints();
    registerServiceWorker();
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
        <SnackbarProvider>
          {/* Fixed Header */}
          <Header
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
            isMobile={isMobile}
            forceLayout={forceLayout}
            onLayoutChange={handleLayoutChange}
            activeSection={activeSection}
            onNavigateToSection={handleSectionNavigate}
          />

          {/* Main Layout Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginTop: "4rem",
              maxWidth: "calc(100vw - 4rem)",
              background: "transparent",
            }}
          >
            {/* Main Content Area */}
            <ResponsiveLayout isMobile={isMobile} forceLayout={forceLayout}>
              {children}
            </ResponsiveLayout>

            {/* Footer moved to TerminalHero component */}
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
          <BackToTop />
          <PerformanceMonitor />
          <BundleAnalyzer />
        </SnackbarProvider>
      </ThemeProvider>
    </TRPCProvider>
  );
}
