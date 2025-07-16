"use client";

import React, { useState, useEffect } from "react";
import { baseTheme } from "#/theme/theme";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Header } from "~/Header";
import AnimatedBackground, { AnimationType } from "~/AnimatedBackground";
import Footer from "./Footer";
import { useLocale } from "next-intl";
import createEmotionCache from "../mui-emotion-cache";
import { CacheProvider } from "@emotion/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [animationType, setAnimationType] =
    useState<AnimationType>("torusKnot");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "he";

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(stored === "dark" || (!stored && prefersDark));
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally, render a loader or just null
    return null;
  }

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // Instead of calling createAppTheme({ isDarkMode, isRTL }), clone and modify baseTheme here
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
  });

  const clientSideEmotionCache = createEmotionCache();

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Header
          animationType={animationType}
          onAnimationTypeChange={setAnimationType}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
        />
        <AnimatedBackground animationType={animationType} />
        <Box sx={{ paddingTop: "4rem" }}>{children}</Box>
        <Footer />
      </ThemeProvider>
    </CacheProvider>
  );
}
