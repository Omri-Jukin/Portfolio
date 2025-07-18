"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import MobileLayout from "../MobileLayout";
import RegularLayout from "../RegularLayout";
import { ResponsiveLayoutProps } from "./ResponsiveLayout.type";

export default function ResponsiveLayout({
  children,
  isMobile,
  forceLayout = "auto",
}: ResponsiveLayoutProps) {
  const theme = useTheme();
  const mediaQueryIsMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      // Use isMobile prop if provided, otherwise fall back to media query
      shouldUseMobileLayout =
        isMobile !== undefined ? isMobile : mediaQueryIsMobile;
      break;
  }

  return shouldUseMobileLayout ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <RegularLayout>{children}</RegularLayout>
  );
}
