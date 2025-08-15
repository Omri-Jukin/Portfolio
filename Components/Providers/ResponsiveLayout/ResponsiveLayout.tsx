"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import MobileLayout from "../MobileLayout";
import RegularLayout from "../RegularLayout";
import { ResponsiveLayoutProps } from "./ResponsiveLayout.type";

export default function ResponsiveLayout({
  children,
  isMobile,
  forceLayout = "auto",
}: ResponsiveLayoutProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const mediaQueryIsMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Only set mounted to true when window is defined
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  // Determine which layout to use based on props
  let shouldUseMobileLayout: boolean;

  switch (forceLayout) {
    case "mobile":
      shouldUseMobileLayout = true;
      break;
    case "desktop":
      shouldUseMobileLayout = false;
      break;
    case "auto":
    default:
      // Use isMobile prop if provided, otherwise fall back to media query only after mounted
      shouldUseMobileLayout =
        isMobile !== undefined
          ? isMobile
          : mounted
          ? mediaQueryIsMobile
          : false;
      break;
  }

  return shouldUseMobileLayout ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <RegularLayout>{children}</RegularLayout>
  );
}
