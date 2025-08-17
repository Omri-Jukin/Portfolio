import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledGlobeContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !["opacity", "scrollProgress"].includes(prop as string),
})<{
  opacity: number;
  scrollProgress: number;
}>(({ opacity }) => ({
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // Ensure content is contained

  // Fixed globe canvas container - covers entire viewport
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

    // Fixed opacity - always visible in background
    opacity: opacity,

    // No scroll-based transforms - let globe animate independently
    transform: "none",

    // Remove transitions that interfere with globe animation
    transition: "none",
    willChange: "auto",
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
  aspectRatio: "1",

  // Enhanced glow effect for better visibility
  filter: isDark
    ? "drop-shadow(0 0 40px rgba(16, 185, 129, 0.4)) brightness(1.2)"
    : "drop-shadow(0 0 30px rgba(59, 130, 246, 0.3)) brightness(1.1)",

  // Responsive sizing - maintain full globe visibility
  [theme.breakpoints.up("xl")]: {
    width: size * 1.2,
    height: size * 1.2,
  },

  [theme.breakpoints.down("lg")]: {
    width: size * 0.9,
    height: size * 0.9,
  },

  [theme.breakpoints.down("md")]: {
    width: size * 0.7,
    height: size * 0.7,
  },

  [theme.breakpoints.down("sm")]: {
    width: size * 0.6,
    height: size * 0.6,
  },
}));
