"use client";

import React, { useState, useEffect } from "react";
import { CssBaseline, Box } from "@mui/material";
import Header, { TLayout } from "~/Header";

import Footer from "~/Footer";
import { useLocale } from "next-intl";
import createEmotionCache from "@/app/mui-emotion-cache";
import { CacheProvider } from "@emotion/react";
import ResponsiveLayout from "&/ResponsiveLayout";
import { ResponsiveLayout as TResponsiveLayout } from "&/ResponsiveLayout";
import { TRPCProvider } from "$/trpc/provider";
import Calendly from "#/Components/Calendly";
import Cookies from "#/Components/Cookies";
import DynamicThemeProvider from "./DynamicThemeProvider";

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

  const clientSideEmotionCache = createEmotionCache();

  // Always render the providers, but conditionally render the content
  return (
    <TRPCProvider>
      <CacheProvider value={clientSideEmotionCache}>
        <DynamicThemeProvider
          isRTL={isRTL}
          isDarkMode={isDarkMode}
          mounted={mounted}
        >
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
              <Calendly
                url="https://calendly.com/omrijukin/30min"
                text="Let's Talk!"
                position="bottom-right"
              />
              <Cookies />
            </Box>
          </Box>
        </DynamicThemeProvider>
      </CacheProvider>
    </TRPCProvider>
  );
}
