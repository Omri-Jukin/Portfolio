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
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  "& .globe-canvas-container": {
    // Positioning is now handled by the component using grid system
    // This class is kept for backward compatibility and styling overrides
    width: "100vw",
    display: "flex",
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
    display: "flex",
    flexDirection: "column",
    pointerEvents: "auto",
    background: "transparent",
  },
}));

export const StyledCanvas = styled("canvas", {
  shouldForwardProp: (prop) => !["isDark"].includes(prop as string),
})<{
  isDark: boolean;
}>(({ isDark }) => {
  return {
    aspectRatio: "1 / 1",
    // Render a full circle that touches the smaller viewport edge
    width: `100vmin`,
    height: `100vmin`,
    maxWidth: "100vmin",
    maxHeight: "100vmin",
    objectFit: "contain",
    filter: isDark
      ? "drop-shadow(0 0 40px rgba(16, 185, 129, 0.4)) brightness(1.2)"
      : "drop-shadow(0 0 30px rgba(59, 130, 246, 0.3)) brightness(1.1)",
  };
});
