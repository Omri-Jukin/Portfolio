import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import type { AnimatedTextProps, AnimationTypes } from "./AnimatedText.type";

// Container with background and grid
export const AnimatedTextContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "type",
})<AnimatedTextProps>(({ length }) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${length || 1}, 1fr)`,
  width: "100%",
  gap: 0,
}));

export const HoverWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  "&:hover": {
    "& > *": {
      transform: "scale(1.5)",
      color: "var(--hover-color, #fff)", // Fill the inside
      WebkitTextStroke: "2px var(--hover-color, #fff)", // Stroke the outline
      WebkitTextFillColor: "var(--hover-color, #fff)", // Ensure fill color
      textShadow: theme.shadows[7],
    },
  },
}));

export const StyledAnimatedText = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== "type" &&
    prop !== "hoverColor" &&
    prop !== "fontSize" &&
    prop !== "fontWeight" &&
    prop !== "scale" &&
    prop !== "opacity" &&
    prop !== "translateY",
})<AnimatedTextProps>(
  ({
    theme,
    type,
    hoverColor,
    fontSize,
    fontWeight,
    scale,
    opacity,
    translateY,
  }) => {
    // Base styles
    const base = {
      color: "transparent",
      WebkitTextStroke: `${
        theme.palette.mode === "dark" ? "3px #fff" : "3px #000"
      }`,
      textShadow: theme.shadows[7],
      transition: "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      fontSize: fontSize || "4rem", // Use prop or default
      fontWeight: fontWeight || 600, // Extra bold
      letterSpacing: `calc((${
        typeof fontSize === "number" ? fontSize + "px" : fontSize || "4rem"
      }) * 0.05)`, // 5% of font size
      textAlign: "center" as const,
      userSelect: "none" as const,
      lineHeight: 1,
      fontFamily: '"Arial Black", "Helvetica", sans-serif',
      // Set CSS custom property for hover color
      "--hover-color": hoverColor || "#fff",
      // Responsive scaling based on the fontSize prop
      "@media (max-width: 1200px)": {
        fontSize: fontSize
          ? `calc(${
              typeof fontSize === "number" ? fontSize + "px" : fontSize
            } * 0.75)`
          : "3rem",
      },
      "@media (max-width: 768px)": {
        fontSize: fontSize
          ? `calc(${
              typeof fontSize === "number" ? fontSize + "px" : fontSize
            } * 0.5)`
          : "2rem",
      },
      "@media (max-width: 480px)": {
        fontSize: fontSize
          ? `calc(${
              typeof fontSize === "number" ? fontSize + "px" : fontSize
            } * 0.375)`
          : "1.5rem",
      },
    };

    // Animation variants using props

    const types: AnimationTypes = {
      scale: (s = 1.5) => ({
        "&:hover": {
          transform: `scale(${s})`,
        },
      }),
      fade: (o = 0.3) => ({
        "&:hover": {
          opacity: o,
        },
      }),
      scaleUp: (s = 2.5) => ({
        "&:hover": {
          transform: `scale(${s})`,
        },
      }),
      scaleDown: (s = 0.5) => ({
        "&:hover": {
          transform: `scale(${s})`,
        },
      }),
      fadeIn: (o = 1) => ({
        "&:hover": {
          opacity: o,
        },
      }),
      fadeOut: (o = 0) => ({
        "&:hover": {
          opacity: o,
        },
      }),
      slideUp: (y = -20) => ({
        "&:hover": {
          transform: `translateY(${y}px)`,
        },
      }),
      slideDown: (y = 20) => ({
        "&:hover": {
          transform: `translateY(${y}px)`,
        },
      }),
    };

    // Merge animation styles if type is an array
    let combinedStyles = {};
    const getAnimValue = (anim: string) => {
      switch (anim) {
        case "scale":
        case "scaleUp":
        case "scaleDown":
          return scale;
        case "fade":
        case "fadeIn":
        case "fadeOut":
          return opacity;
        case "slideUp":
          return translateY !== undefined ? -Math.abs(translateY) : undefined;
        case "slideDown":
          return translateY !== undefined ? Math.abs(translateY) : undefined;
        default:
          return undefined;
      }
    };

    if (Array.isArray(type)) {
      type.forEach((anim) => {
        if (types[anim]) {
          Object.assign(combinedStyles, types[anim](getAnimValue(anim)));
        }
      });
    } else if (type && types[type]) {
      combinedStyles = types[type](getAnimValue(type));
    }

    return {
      ...base,
      ...combinedStyles,
    };
  }
);
