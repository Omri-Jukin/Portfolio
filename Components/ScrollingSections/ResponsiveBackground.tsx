import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollPosition } from "../../lib/hooks/useScrollPosition";

interface ResponsiveBackgroundProps {
  variant: string;
  children: React.ReactNode;
}

const BackgroundContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !["scrollProgress", "variant"].includes(prop as string),
})<{
  scrollProgress: number;
  variant: string;
}>(({ theme, scrollProgress, variant }) => ({
  position: "relative",
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "calc(-50vw + 50%)",
  marginRight: "calc(-50vw + 50%)",
  overflow: "hidden",

  // Base gradient based on variant
  background: (() => {
    switch (variant) {
      case "hero":
        return `linear-gradient(135deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.primary.main}05 50%, 
          ${theme.palette.background.default} 100%)`;
      case "about":
        return `linear-gradient(45deg, 
          ${theme.palette.background.paper} 0%, 
          ${theme.palette.secondary.main}06 25%, 
          ${theme.palette.background.paper} 50%, 
          ${theme.palette.primary.main}06 75%, 
          ${theme.palette.background.paper} 100%)`;
      case "qa":
        return `linear-gradient(135deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.primary.main}08 25%, 
          ${theme.palette.secondary.main}08 50%, 
          ${theme.palette.background.default} 100%)`;
      case "services":
        return `linear-gradient(225deg, 
          ${theme.palette.background.paper} 0%, 
          ${theme.palette.primary.main}08 33%, 
          ${theme.palette.background.paper} 66%, 
          ${theme.palette.secondary.main}08 100%)`;
      case "projects":
        return `linear-gradient(315deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.secondary.main}06 25%, 
          ${theme.palette.background.default} 50%, 
          ${theme.palette.primary.main}06 75%, 
          ${theme.palette.background.default} 100%)`;
      case "contact":
        return `linear-gradient(180deg, 
          ${theme.palette.background.paper} 0%, 
          ${theme.palette.primary.main}04 25%, 
          ${theme.palette.background.paper} 50%, 
          ${theme.palette.secondary.main}04 75%, 
          ${theme.palette.background.paper} 100%)`;
      default:
        return theme.palette.background.default;
    }
  })(),

  // Scroll-triggered overlay
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, 
      transparent 0%, 
      ${theme.palette.secondary.main}03 25%, 
      transparent 50%, 
      ${theme.palette.primary.main}03 75%, 
      transparent 100%)`,
    opacity: Math.abs(scrollProgress - 0.5) * 0.4, // More opacity at scroll extremes
    pointerEvents: "none",
    zIndex: 0,
    willChange: "opacity",
    transform: "translateZ(0)", // Force GPU acceleration
  },

  // Responsive design
  [theme.breakpoints.down("md")]: {
    minHeight: "auto",
    padding: theme.spacing(8, 0),
    alignItems: "flex-start",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(6, 0),
  },

  // Ensure content is above background effects
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
}));

const ResponsiveBackground: React.FC<ResponsiveBackgroundProps> = React.memo(
  ({ variant, children }) => {
    const { scrollProgress } = useScrollPosition();

    return (
      <BackgroundContainer scrollProgress={scrollProgress} variant={variant}>
        {children}
      </BackgroundContainer>
    );
  }
);

ResponsiveBackground.displayName = "ResponsiveBackground";

export default ResponsiveBackground;
