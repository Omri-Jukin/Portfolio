import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

export const GalaxyContainer = styled(Box)({
  position: "relative",
  width: "100%",
  minHeight: "fit-content",
  overflow: "hidden",
});

export const Canvas = styled("canvas")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
});

export const ContentContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  width: "100%",
  height: "100%",

  // Enhanced background overlay for text readability
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(
      135deg,
      ${
        theme.palette.mode === "dark"
          ? "rgba(0, 0, 0, 0.7)"
          : "rgba(0, 0, 0, 0.6)"
      } 0%,
      ${
        theme.palette.mode === "dark"
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(0, 0, 0, 0.4)"
      } 50%,
      ${
        theme.palette.mode === "dark"
          ? "rgba(0, 0, 0, 0.7)"
          : "rgba(0, 0, 0, 0.6)"
      } 100%
    )`,
    zIndex: -1,
    pointerEvents: "none",
  },

  // Enhanced text styling for all children
  "& *": {
    textShadow: `
      2px 2px 4px rgba(0, 0, 0, 0.8),
      1px 1px 2px rgba(0, 0, 0, 0.9),
      0 0 8px rgba(0, 0, 0, 0.5),
      0 0 16px rgba(0, 0, 0, 0.3)
    `,
    position: "relative",
    zIndex: 1,
  },

  // Special enhancement for headings
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    textShadow: `
      3px 3px 6px rgba(0, 0, 0, 0.9),
      2px 2px 4px rgba(0, 0, 0, 1),
      1px 1px 2px rgba(0, 0, 0, 1),
      0 0 12px rgba(0, 0, 0, 0.6),
      0 0 24px rgba(0, 0, 0, 0.4)
    `,
    fontWeight: "bold",
  },

  // Enhanced buttons and interactive elements
  "& button, & a": {
    textShadow: `
      2px 2px 4px rgba(0, 0, 0, 0.8),
      1px 1px 2px rgba(0, 0, 0, 0.9),
      0 0 8px rgba(0, 0, 0, 0.5)
    `,
    "& *": {
      textShadow: "inherit",
    },
  },
}));
