"use-client";

import React, { useEffect, useState } from "react";
import { PopupButton } from "react-calendly";
import { CalendlyProps } from ".";
import { useTheme } from "@mui/material/styles";
import "./Calendly.css";
import { Box } from "@mui/system";

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

  // Generate positioning styles based on position prop
  const getPositionStyles = () => {
    if (!position) return {};

    const baseStyles = {
      position: "fixed" as const,
      zIndex: 1000,
    };

    switch (position) {
      case "top-left":
        return { ...baseStyles, top: "1.25rem", left: "1.25rem" };
      case "top-center":
        return {
          ...baseStyles,
          top: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "top-right":
        return { ...baseStyles, top: "1.25rem", right: "1.25rem" };
      case "center-left":
        return {
          ...baseStyles,
          top: "50%",
          left: "1.25rem",
          transform: "translateY(-50%)",
        };
      case "center":
        return {
          ...baseStyles,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
      case "center-right":
        return {
          ...baseStyles,
          top: "50%",
          right: "1.25rem",
          transform: "translateY(-50%)",
        };
      case "bottom-left":
        return { ...baseStyles, bottom: "1.25rem", left: "1.25rem" };
      case "bottom-center":
        return {
          ...baseStyles,
          bottom: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom-right":
        return { ...baseStyles, bottom: "1.25rem", right: "1.25rem" };
      default:
        return {};
    }
  };

  // Don't render until we're on the client side
  if (!isClient) {
    return (
      <Box
        className={`calendly-container ${className}`}
        style={getPositionStyles()}
        sx={{
          width: "fit-content",
          height: "fit-content",
        }}
      >
        <button
          style={{
            background: gradientStyles.background,
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            boxShadow: gradientStyles.shadow,
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = gradientStyles.hoverBackground;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = gradientStyles.hoverShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = gradientStyles.background;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = gradientStyles.shadow;
          }}
        >
          {text}
        </button>
      </Box>
    );
  }

  return (
    <Box
      className={`calendly-container ${className}`}
      style={getPositionStyles()}
      sx={{
        width: "fit-content",
        height: "fit-content",
      }}
    >
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
          color: "#ffffff",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          boxShadow: gradientStyles.shadow,
          transform: "translateY(0)",
          width: "fit-content",
          height: "fit-content",
        }}
        prefill={{
          name: "",
          email: "",
          firstName: "",
          lastName: "",
        }}
      />
    </Box>
  );
};

export default CalendlyBadge;
