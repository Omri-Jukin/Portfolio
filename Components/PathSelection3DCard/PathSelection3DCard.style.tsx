import { styled } from "@mui/material/styles";
import { BackgroundVariant } from "./PathSelection3DCard.type";

interface StyledCardProps {
  backgroundVariant: BackgroundVariant;
  backgroundColor?: string;
  glowIntensity?: number;
}

const getBackgroundStyle = (
  variant: BackgroundVariant,
  backgroundColor?: string
) => {
  const baseColor = backgroundColor || "rgba(255, 255, 255, 0.1)";

  switch (variant) {
    case "glassmorphism":
      return {
        background: baseColor,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      };

    case "gradient":
      return {
        background: backgroundColor
          ? `linear-gradient(135deg, ${backgroundColor}dd 0%, ${backgroundColor}44 100%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
      };

    case "solid":
      return {
        background: baseColor,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      };

    case "neon":
      return {
        background: backgroundColor
          ? `${backgroundColor}40`
          : "rgba(0, 255, 255, 0.2)",
        backdropFilter: "blur(15px)",
        border: `2px solid ${backgroundColor || "rgba(0, 255, 255, 0.5)"}`,
        boxShadow: `0 0 20px ${
          backgroundColor || "rgba(0, 255, 255, 0.5)"
        }, 0 0 40px ${backgroundColor || "rgba(0, 255, 255, 0.3)"}`,
      };

    case "holographic":
      return {
        background:
          "linear-gradient(135deg, rgba(255,0,150,0.3) 0%, rgba(0,255,255,0.3) 50%, rgba(255,200,0,0.3) 100%)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow:
          "0 8px 32px rgba(255, 0, 150, 0.3), 0 0 20px rgba(0, 255, 255, 0.2)",
        backgroundSize: "200% 200%",
        animation: "holographicShift 5s ease infinite",
      };

    case "metal":
      return {
        background:
          "linear-gradient(135deg, rgba(200,200,200,0.4) 0%, rgba(100,100,100,0.4) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow:
          "inset 0 2px 4px rgba(255,255,255,0.3), 0 8px 32px rgba(0, 0, 0, 0.3)",
      };

    case "glow":
      return {
        background: baseColor,
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: `0 0 30px ${
          backgroundColor || "rgba(255, 255, 255, 0.3)"
        }, 0 8px 32px rgba(0, 0, 0, 0.2)`,
      };

    default:
      return {
        background: baseColor,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      };
  }
};

export const StyledCardContainer = styled("div")<StyledCardProps>(
  ({ backgroundVariant, backgroundColor, glowIntensity = 0.8 }) => ({
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    ...getBackgroundStyle(backgroundVariant, backgroundColor),

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: "inherit",
      background:
        backgroundVariant === "glassmorphism"
          ? `
          linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 31%, transparent 31%),
          linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.05) 30%, rgba(255, 255, 255, 0.05) 31%, transparent 31%)
        `
          : "none",
      backgroundSize: "30px 30px, 25px 25px",
      animation: "glassShift 8s ease-in-out infinite",
      zIndex: 1,
      pointerEvents: "none",
    },

    "&::after": {
      content: '""',
      position: "absolute",
      top: "10%",
      left: "15%",
      right: "15%",
      bottom: "10%",
      borderRadius: "inherit",
      background:
        backgroundVariant === "glassmorphism"
          ? `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
        `
          : "none",
      zIndex: 2,
      pointerEvents: "none",
    },

    "@keyframes glassShift": {
      "0%, 100%": {
        backgroundPosition: "0% 0%, 0% 0%",
      },
      "50%": {
        backgroundPosition: "100% 100%, 100% 100%",
      },
    },

    "@keyframes holographicShift": {
      "0%": {
        backgroundPosition: "0% 50%",
      },
      "50%": {
        backgroundPosition: "100% 50%",
      },
      "100%": {
        backgroundPosition: "0% 50%",
      },
    },

    "&:hover": {
      ...(glowIntensity > 0 && {
        boxShadow: `0 0 40px ${
          backgroundColor || "rgba(255, 255, 255, 0.4)"
        }, 0 12px 48px rgba(0, 0, 0, 0.3)`,
      }),
    },
  })
);

export const HoverEffectStyles = {
  neon: (color: string, intensity: number) => ({
    boxShadow: `0 0 ${20 * intensity}px ${color}, 0 0 ${
      40 * intensity
    }px ${color}, 0 0 ${60 * intensity}px ${color}`,
    filter: `drop-shadow(0 0 ${10 * intensity}px ${color})`,
  }),
  glow: (color: string, intensity: number) => ({
    boxShadow: `0 0 ${30 * intensity}px ${color}40, 0 0 ${
      60 * intensity
    }px ${color}20`,
  }),
  pulse: (intensity: number) => ({
    animation: `pulse ${1 / intensity}s ease-in-out infinite`,
  }),
  shake: (intensity: number) => ({
    animation: `shake ${0.5 / intensity}s ease-in-out infinite`,
  }),
};
