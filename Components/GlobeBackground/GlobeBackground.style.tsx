import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledGlobeContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !["opacity", "scrollProgress"].includes(prop as string),
})<{
  opacity: number;
  scrollProgress: number;
}>(({ theme, opacity, scrollProgress }) => ({
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",

  // Fixed globe canvas container - always visible in viewport
  "& .globe-canvas-container": {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1, // Behind all content
    pointerEvents: "none",

    // Dynamic opacity based on scroll position - higher in dark mode
    opacity: opacity * (0.9 - scrollProgress * 0.2), // More visible, less fade on scroll

    // Subtle movement based on scroll - reduced for better readability
    transform: `translateY(${scrollProgress * 10}px) scale(${
      1 + scrollProgress * 0.05
    })`,

    // Smooth transitions
    transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
    willChange: "opacity, transform",

    // Responsive adjustments
    [theme.breakpoints.down("md")]: {
      transform: `translateY(${scrollProgress * 8}px) scale(${
        1 + scrollProgress * 0.03
      })`,
    },

    [theme.breakpoints.down("sm")]: {
      transform: `translateY(${scrollProgress * 5}px) scale(${
        1 + scrollProgress * 0.02
      })`,
    },
  },

  // Content container - positioned relatively above globe
  "& .content-container": {
    position: "relative",
    zIndex: 1,
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    pointerEvents: "auto",
    background: "transparent",
  },
}));

export const StyledCanvas = styled("canvas", {
  shouldForwardProp: (prop) => !["size", "isDark"].includes(prop as string),
})<{
  size: number;
  isDark: boolean;
}>(({ theme, size, isDark }) => ({
  width: size,
  height: size,
  maxWidth: "80vw",
  maxHeight: "80vh",
  aspectRatio: "1",

  // Enhanced glow effect for better visibility
  filter: isDark
    ? "drop-shadow(0 0 40px rgba(16, 185, 129, 0.4)) brightness(1.2)"
    : "drop-shadow(0 0 30px rgba(59, 130, 246, 0.3)) brightness(1.1)",

  // Responsive sizing - larger on bigger screens
  [theme.breakpoints.up("xl")]: {
    width: size * 1.2,
    height: size * 1.2,
    maxWidth: "90vw",
    maxHeight: "90vh",
  },

  [theme.breakpoints.down("lg")]: {
    width: size * 0.9,
    height: size * 0.9,
    maxWidth: "75vw",
    maxHeight: "75vh",
  },

  [theme.breakpoints.down("md")]: {
    width: size * 0.7,
    height: size * 0.7,
    maxWidth: "70vw",
    maxHeight: "70vh",
  },

  [theme.breakpoints.down("sm")]: {
    width: size * 0.6,
    height: size * 0.6,
    maxWidth: "65vw",
    maxHeight: "65vh",
  },
}));
