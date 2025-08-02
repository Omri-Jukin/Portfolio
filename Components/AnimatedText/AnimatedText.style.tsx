import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import type { AnimatedTextProps, AnimatedTextType } from "./AnimatedText.type";

// Container with background and grid
export const AnimatedTextContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "type",
})<AnimatedTextProps>(({ length }) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${length || 1}, min-content)`,
  width: "100%",
  gap: 0,
  justifyContent: "center",
  overflow: "visible",
  overflowX: "hidden",
}));

export const HoverWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  "&:hover": {
    "& > *": {
      color: "var(--hover-color, #fff)", // Fill the inside
      WebkitTextStroke: "2px var(--hover-color, #fff)", // Stroke the outline
      WebkitTextFillColor: "var(--hover-color, #fff)", // Ensure fill color
      textShadow:
        theme.palette.mode === "dark"
          ? "0 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)"
          : "0 4px 8px rgba(0, 0, 0, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.2)",
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
      textShadow:
        theme.palette.mode === "dark"
          ? "0 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)"
          : "0 4px 8px rgba(0, 0, 0, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.2)",
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
            } * 0.8)`
          : "3.2rem",
      },
      "@media (max-width: 768px)": {
        fontSize: fontSize
          ? `calc(${
              typeof fontSize === "number" ? fontSize + "px" : fontSize
            } * 0.6)`
          : "2.4rem",
      },
      "@media (max-width: 480px)": {
        fontSize: fontSize
          ? `calc(${
              typeof fontSize === "number" ? fontSize + "px" : fontSize
            } * 0.45)`
          : "1.8rem",
      },
    };

    // Animation variants using props

    const types = (
      type: AnimatedTextType | undefined,
      s?: number,
      o?: number,
      y?: number
    ) => {
      const scale: number = s || 1.2;
      const opacity: number = o || 0.3;
      const translateY: number = y || 0;
      const scaleUp = (s: number) => ({
        "&:hover": {
          transform: `scale(${s})`,
        },
      });
      const scaleDown = (s: number) => ({
        "&:hover": {
          transform: `scale(${s})`,
        },
      });
      const fadeIn = (o: number) => ({
        "&:hover": {
          opacity: o,
          transform: "scale(1.5)",
        },
      });
      const fadeOut = (o: number) => ({
        "&:hover": {
          opacity: o,
          transform: "scale(1.5)",
        },
      });
      const slideUp = (y: number) => ({
        "&:hover": {
          transform: `translateY(-${Math.abs(y) || 20}px)`,
        },
      });
      const slideDown = (y: number) => ({
        "&:hover": {
          transform: `translateY(${Math.abs(y) || 20}px) scale(1.2)`,
        },
      });

      switch (type) {
        case "scaleUp":
          return scaleUp(scale);
        case "scaleDown":
          return scaleDown(scale);
        case "fadeIn":
          return fadeIn(opacity);
        case "fadeOut":
          return fadeOut(opacity);
        case "slideUp":
          return slideUp(translateY);
        case "slideDown":
          return slideDown(translateY);
        default:
          return {};
      }
    };

    return {
      ...base,
      ...types(type, scale, opacity, translateY),
    };
  }
).withComponent("span");
