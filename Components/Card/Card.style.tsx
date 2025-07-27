import { styled } from "@mui/material/styles";
import {
  Card as MuiCard,
  Box,
  Typography,
  IconButton as MuiIconButton,
} from "@mui/material";

export const StyledCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "transparent",
})<{ transparent?: boolean }>(({ theme, transparent }) => ({
  background: transparent ? "transparent" : theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1), // Add padding to prevent hover cutoff
}));

export const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) =>
    prop !== "gradient" && prop !== "glow" && prop !== "transparent",
})<{
  gradient?: boolean;
  glow?: boolean;
  transparent?: boolean;
}>(({ theme, gradient, glow, transparent }) => ({
  borderRadius: theme.spacing(2),
  background: transparent
    ? "transparent"
    : gradient
    ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
    : theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.05)"
    : theme.palette.background.paper,
  border: `2px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.12)"
  }`,
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "visible",
  overflowX: "hidden",
  // Enhanced glow effect matching contact page
  boxShadow: glow
    ? theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)"
    : theme.palette.mode === "dark"
    ? "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2), 1px 1px 4px rgba(0, 0, 0, 0.15)"
    : "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08), 1px 1px 4px rgba(0, 0, 0, 0.06)",
  ...(glow && {
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
      borderRadius: theme.spacing(2),
      zIndex: -1,
    },
  }),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: glow
      ? theme.palette.mode === "dark"
        ? "0 12px 36px rgba(150, 206, 180, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4), 3px 3px 12px rgba(0, 0, 0, 0.25)"
        : "0 12px 36px rgba(78, 205, 196, 0.3), 0 6px 18px rgba(0, 0, 0, 0.15), 3px 3px 12px rgba(0, 0, 0, 0.1)"
      : theme.palette.mode === "dark"
      ? "0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  },
  "&:focus-within": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const StyledCardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

export const StyledCardTagline = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 500,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

export const StyledCardDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  lineHeight: 1.6,
}));

export const StyledCardDate = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.8,
});

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
  width: "fit-content",
  height: "fit-content",
  maxWidth: "2rem",
  maxHeight: "2rem",
  padding: 0,
  margin: 0,
  borderRadius: "50%",
  backgroundColor: theme.palette.background.paper,
  border: "none",
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg) scale(1)",
    },
    "100%": {
      transform: "rotate(360deg) scale(1.2)",
    },
  },
  "&:hover": {
    transform: "rotate(360deg)",
    transition: "transform 1s linear",
    animation: "spin 1s linear infinite",
    animationDirection: "alternate",
  },
}));

// Photo Card styles
export const PhotoCardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  width: "100%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

export const PhotoCardImage = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size" && prop !== "photoposition",
})<{
  size: string;
  photoposition: string;
}>(({ theme, size, photoposition }) => ({
  flexShrink: 0,
  width: size === "small" ? "120px" : size === "medium" ? "180px" : "240px",
  height: size === "small" ? "120px" : size === "medium" ? "180px" : "240px",
  borderRadius: theme.spacing(1.5),
  overflow: "hidden",
  border: `3px solid ${theme.palette.primary.main}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  order: photoposition === "left" ? 0 : 1,
  [theme.breakpoints.down("md")]: {
    order: 0,
    alignSelf: "center",
    marginBottom: theme.spacing(2),
  },
}));

export const PhotoCardContent = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: 0,
}));

export const PhotoCardImageElement = styled(Box)({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  transition: "transform 0.3s ease",
  display: "block",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

// Enhanced animations
export const AnimatedCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "animation",
})<{ animation: string }>(({ animation }) => ({
  ...(animation === "fade" && {
    animation: "fadeIn 0.6s ease-in-out",
  }),
  ...(animation === "slide" && {
    animation: "slideIn 0.6s ease-in-out",
  }),
  ...(animation === "scale" && {
    animation: "scaleIn 0.6s ease-in-out",
  }),
  ...(animation === "bounce" && {
    animation: "bounceIn 0.8s ease-in-out",
  }),
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "@keyframes slideIn": {
    from: { transform: "translateY(20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  "@keyframes scaleIn": {
    from: { transform: "scale(0.9)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  },
  "@keyframes bounceIn": {
    "0%": { transform: "scale(0.3)", opacity: 0 },
    "50%": { transform: "scale(1.05)" },
    "70%": { transform: "scale(0.9)" },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
}));
