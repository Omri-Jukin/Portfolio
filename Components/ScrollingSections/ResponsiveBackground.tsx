import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollPosition } from "../../lib/hooks/useScrollPosition";

interface ResponsiveBackgroundProps {
  children: React.ReactNode;
}

const BackgroundContainer = styled(Box, {
  shouldForwardProp: (prop) => !["scrollProgress"].includes(prop as string),
})<{
  scrollProgress: number;
}>(({ theme, scrollProgress }) => ({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxSizing: "border-box",

  // Single continuous gradient background that spans the entire page - more intense
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.primary.main}08 15%, 
    ${theme.palette.secondary.main}08 30%, 
    ${theme.palette.background.paper} 45%, 
    ${theme.palette.primary.main}08 60%, 
    ${theme.palette.secondary.main}08 75%, 
    ${theme.palette.background.default} 90%, 
    ${theme.palette.background.paper} 100%)`,

  // Dynamic overlay that changes based on scroll position - more visible
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(${45 + scrollProgress * 90}deg, 
      transparent 0%, 
      ${theme.palette.primary.main}06 20%, 
      transparent 40%, 
      ${theme.palette.secondary.main}06 60%, 
      transparent 80%, 
      ${theme.palette.primary.main}04 100%)`,
    opacity: 0.6 + Math.abs(scrollProgress - 0.5) * 0.6, // Increased opacity range
    pointerEvents: "none",
    zIndex: 0,
    willChange: "opacity, background",
    transform: "translateZ(0)", // Force GPU acceleration
    transition: "opacity 0.3s ease-out",
  },

  // Subtle animated overlay for depth - more prominent
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at ${20 + scrollProgress * 60}% ${
      30 + scrollProgress * 40
    }%, 
      ${theme.palette.primary.main}04 0%, 
      transparent 50%)`,
    opacity: 0.4, // Increased from 0.2
    pointerEvents: "none",
    zIndex: 0,
    willChange: "background",
    transform: "translateZ(0)",
    transition: "background 0.5s ease-out",
  },

  // Responsive design
  [theme.breakpoints.down("md")]: {
    minHeight: "auto",
    padding: theme.spacing(8, 0),
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "100vw",
    overflow: "hidden",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(6, 0),
    width: "100%",
    maxWidth: "100vw",
    overflow: "hidden",
  },

  // Ensure content is above background effects
  "& > *": {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "100vw",
    overflow: "hidden",
  },

  // Mobile-specific viewport constraints
  [theme.breakpoints.down("sm")]: {
    "& .swiper": {
      width: "100% !important",
      maxWidth: "100vw !important",
      overflow: "hidden !important",
    },
    "& .swiper-slide": {
      width: "100% !important",
      maxWidth: "100vw !important",
    },
    "& .swiper-button-next, & .swiper-button-prev": {
      display: "none !important",
    },
  },
}));

const ResponsiveBackground: React.FC<ResponsiveBackgroundProps> = React.memo(
  ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const { scrollProgress } = useScrollPosition();

    useEffect(() => {
      // Only set mounted to true when window is defined
      if (typeof window !== "undefined") {
        setMounted(true);
      }
    }, []);

    // Don't render anything until window is defined
    if (typeof window === "undefined" || !mounted) {
      return (
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
            maxWidth: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxSizing: "border-box",
            background: (theme) => `linear-gradient(135deg, 
              ${theme.palette.background.default} 0%, 
              ${theme.palette.primary.main}08 15%, 
              ${theme.palette.secondary.main}08 30%, 
              ${theme.palette.background.paper} 45%, 
              ${theme.palette.primary.main}08 60%, 
              ${theme.palette.secondary.main}08 75%, 
              ${theme.palette.background.default} 90%, 
              ${theme.palette.background.paper} 100%)`,
          }}
        >
          {children}
        </Box>
      );
    }

    return (
      <BackgroundContainer scrollProgress={scrollProgress}>
        {children}
      </BackgroundContainer>
    );
  }
);

ResponsiveBackground.displayName = "ResponsiveBackground";

export default ResponsiveBackground;
