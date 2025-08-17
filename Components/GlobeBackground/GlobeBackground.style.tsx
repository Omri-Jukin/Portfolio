import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledGlobeContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !["opacity", "scrollProgress"].includes(prop as string),
})<{
  opacity: number;
  scrollProgress: number;
}>(({ opacity, theme }) => ({
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  "& .globe-canvas-container": {
    position: "fixed",
    top: "45%",
    left: "67.5%",
    transform: "translate(-50%, -50%)",
    height: "100vh",
    width: "100vw",
    display: "flex",
    // Tablet ONLY (between md and lg breakpoints)
    [theme.breakpoints.between("md", "lg")]: {
      top: "55%",
      left: "61.25%",
      transform: "translate(-50%, -50%) scale(1.5)",
    },
    // Mobile only (below md)
    [theme.breakpoints.down("md")]: {
      top: "100%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(1.75)",
    },

    justifyContent: "center",
    zIndex: -1,
    pointerEvents: "none",

    overflow: "visible",

    opacity: opacity,

    transition: "none",
    willChange: "auto",
  },

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
}>(({ theme, size, isDark }) => {
  return {
    aspectRatio: "1 / 1",
    width: `min(${size}px, 100vw)`,
    height: `min(${size}px, 100vw)`,
    maxWidth: "100vw",
    maxHeight: "100vh",
    objectFit: "contain",
    filter: isDark
      ? "drop-shadow(0 0 40px rgba(16, 185, 129, 0.4)) brightness(1.2)"
      : "drop-shadow(0 0 30px rgba(59, 130, 246, 0.3)) brightness(1.1)",
    // Tablet only (between md and lg)
    [theme.breakpoints.between("md", "lg")]: {
      width: `min(${size}px, 95vw)`,
      height: `min(${size}px, 95vw)`,
      maxWidth: "95vw",
      maxHeight: "95vw",
    },
    // Mobile only (below md)
    [theme.breakpoints.down("md")]: {
      width: `min(${size}px, 100vw)`,
      height: `min(${size}px, 100vw)`,
      maxWidth: "100vw",
      maxHeight: "100vw",
    },
  };
});
