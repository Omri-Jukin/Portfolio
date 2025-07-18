import { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize:
    | "xs"
    | "sm"
    | "md"
    | "ml"
    | "lg"
    | "xl"
    | "xxl"
    | "xxxl"
    | "xxxxl";
  width: number;
  height: number;
}

export function useDeviceDetection(): DeviceInfo {
  const theme = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Media queries for different breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  // Determine screen size
  const getScreenSize = (): DeviceInfo["screenSize"] => {
    if (isXs) return "xs";
    if (isSm) return "sm";
    if (isMd) return "md";
    if (isLg) return "lg";
    if (isXl) return "xl";
    return "lg"; // fallback
  };

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const screenSize = getScreenSize();
  const isMobile = isXs || isSm;
  const isTablet = isMd;
  const isDesktop = isLg || isXl;

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    width: dimensions.width,
    height: dimensions.height,
  };
}
