"use-client";

import React, { useEffect, useState } from "react";
import { PopupButton } from "react-calendly";
import { CalendlyProps } from ".";
import { useTheme } from "@mui/material/styles";
import { CalendlyContainer } from "./Calendly.style";

const CalendlyBadge = ({
  url,
  text,
  backgroundColor,
  textColor,
  position,
  className = "",
}: CalendlyProps) => {
  const theme = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use theme colors as defaults, fallback to props if provided
  const buttonBackground = backgroundColor || theme.palette.calendly.primary;
  const buttonTextColor = textColor || theme.palette.calendly.contrastText;
  const pageBackground = theme.palette.calendly.background;
  const pageTextColor = theme.palette.text.primary;

  // Theme-aware gradient styles
  const isDarkMode = theme.palette.mode === "dark";

  const getGradientStyles = () => {
    if (isDarkMode) {
      return {
        background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
        hoverBackground: "linear-gradient(135deg, #FF5252, #FF7043)",
        shadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
        hoverShadow: "0 6px 16px rgba(255, 107, 107, 0.4)",
      };
    } else {
      return {
        background: "linear-gradient(135deg, #4ECDC4, #44A08D)",
        hoverBackground: "linear-gradient(135deg, #3DB5AC, #3A8F7A)",
        shadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
        hoverShadow: "0 6px 16px rgba(78, 205, 196, 0.4)",
      };
    }
  };

  const gradientStyles = getGradientStyles();

  // No need for complex positioning logic - handled by styled component

  // Don't render until we're on the client side
  if (!isClient) {
    return null;
  }

  return (
    <CalendlyContainer className={className} calendlyPosition={position}>
      <PopupButton
        url={url}
        pageSettings={{
          backgroundColor: pageBackground,
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: buttonBackground.replace("#", ""),
          textColor: pageTextColor.replace("#", ""),
          hideGdprBanner: true,
        }}
        rootElement={document.getElementById("root") || document.body}
        text={text}
        styles={{
          background: gradientStyles.background,
          color: buttonTextColor,
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          boxShadow: gradientStyles.shadow,
          transform: "translateY(0)",
          width: "90vw",
          height: "90vh",
        }}
        prefill={{
          name: "",
          email: "",
          firstName: "",
          lastName: "",
        }}
      />
    </CalendlyContainer>
  );
};

export default CalendlyBadge;
