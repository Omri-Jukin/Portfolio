"use client";

import React from "react";
import { ThemeProvider } from "@mui/material";
import { baseTheme } from "!/theme";

interface DynamicThemeProviderProps {
  children: React.ReactNode;
  isRTL: boolean;
  isDarkMode: boolean;
  mounted: boolean;
}

export default function DynamicThemeProvider({
  children,
}: DynamicThemeProviderProps) {
  // For now, just use the base theme to avoid hydration issues
  // The theme switching can be handled by CSS variables or a different approach

  return <ThemeProvider theme={baseTheme}>{children}</ThemeProvider>;
}
