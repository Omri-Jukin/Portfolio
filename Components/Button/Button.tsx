import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ButtonProps as CustomButtonProps } from "./Button.type";

// Styled button variants with props
const GradientButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "gradient",
})<{ gradient?: string }>(({ gradient }) => ({
  background: gradient || "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
  border: 0,
  borderRadius: 25,
  color: "white",
  padding: "10px 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  "&:hover": {
    background: gradient || "linear-gradient(45deg, #ff5252, #26a69a)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px 2px rgba(255, 105, 135, .4)",
  },
  transition: "all 0.3s ease",
}));

const NeonButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "neonColor" && prop !== "opacity",
})<{ neonColor?: string; opacity?: string }>(({ neonColor, opacity }) => {
  const baseColor = neonColor || "#00ff88";
  const opacityValue = opacity ? parseFloat(opacity) : 1;

  // Convert hex to rgb for rgba usage
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 255, b: 136 };
  };

  const rgb = hexToRgb(baseColor);
  const colorWithOpacity = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue})`;

  return {
    background: "transparent",
    border: `2px solid ${colorWithOpacity}`,
    borderRadius: 25,
    color: colorWithOpacity,
    padding: "10px 30px",
    textShadow: `0 0 10px ${colorWithOpacity}`,
    boxShadow: `0 0 20px ${colorWithOpacity}`,
    "&:hover": {
      background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityValue * 0.1})`,
      border: `2px solid ${colorWithOpacity}`,
      color: colorWithOpacity,
      boxShadow: `0 0 30px ${colorWithOpacity}`,
      transform: "scale(1.05)",
    },
    transition: "all 0.3s ease",
  };
});

const GlassButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "intensity",
})<{ intensity?: "low" | "medium" | "high" }>(({ intensity = "medium" }) => ({
  position: "relative",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 25,
  color: "white",
  padding: "10px 30px",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 31%, transparent 31%),
      linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.05) 30%, rgba(255, 255, 255, 0.05) 31%, transparent 31%),
      linear-gradient(90deg, transparent 30%, rgba(255, 255, 255, 0.08) 30%, rgba(255, 255, 255, 0.08) 31%, transparent 31%),
      linear-gradient(0deg, transparent 30%, rgba(255, 255, 255, 0.06) 30%, rgba(255, 255, 255, 0.06) 31%, transparent 31%)
    `,
    backgroundSize:
      intensity === "high"
        ? "20px 20px, 15px 15px, 25px 25px, 18px 18px"
        : intensity === "medium"
        ? "30px 30px, 25px 25px, 35px 35px, 28px 28px"
        : "40px 40px, 35px 35px, 45px 45px, 38px 38px",
    animation: "glassShift 8s ease-in-out infinite",
    zIndex: 1,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: "10%",
    left: "15%",
    right: "15%",
    bottom: "10%",
    background: `
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
    `,
    borderRadius: "20px",
    zIndex: 2,
  },

  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transform: "translateY(-1px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
  },

  "& > span": {
    position: "relative",
    zIndex: 3,
  },

  "@keyframes glassShift": {
    "0%, 100%": {
      transform: "translateX(0) translateY(0)",
      opacity: 0.8,
    },
    "25%": {
      transform: "translateX(2px) translateY(-1px)",
      opacity: 0.9,
    },
    "50%": {
      transform: "translateX(-1px) translateY(2px)",
      opacity: 0.7,
    },
    "75%": {
      transform: "translateX(1px) translateY(1px)",
      opacity: 0.85,
    },
  },

  transition: "all 0.3s ease",
}));

const BrokenGlassButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "intensity" && prop !== "animation",
})<{ intensity?: "low" | "medium" | "high"; animation?: boolean }>(
  ({ intensity = "medium", animation = true }) => ({
    position: "relative",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    color: "white",
    padding: "10px 30px",
    overflow: "hidden",

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 31%, transparent 31%),
        linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.05) 30%, rgba(255, 255, 255, 0.05) 31%, transparent 31%),
        linear-gradient(90deg, transparent 30%, rgba(255, 255, 255, 0.08) 30%, rgba(255, 255, 255, 0.08) 31%, transparent 31%),
        linear-gradient(0deg, transparent 30%, rgba(255, 255, 255, 0.06) 30%, rgba(255, 255, 255, 0.06) 31%, transparent 31%)
      `,
      backgroundSize:
        intensity === "high"
          ? "20px 20px, 15px 15px, 25px 25px, 18px 18px"
          : intensity === "medium"
          ? "30px 30px, 25px 25px, 35px 35px, 28px 28px"
          : "40px 40px, 35px 35px, 45px 45px, 38px 38px",
      animation: animation
        ? "brokenGlassShift 8s ease-in-out infinite"
        : "none",
      zIndex: 1,
    },

    "&::after": {
      content: '""',
      position: "absolute",
      top: "10%",
      left: "15%",
      right: "15%",
      bottom: "10%",
      background: `
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
      `,
      borderRadius: "20px",
      zIndex: 2,
    },

    "&:hover": {
      background: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      transform: "translateY(-1px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    },

    "& > span": {
      position: "relative",
      zIndex: 3,
    },

    // Crack lines
    "& .crack-line-1": {
      position: "absolute",
      top: "20%",
      left: "10%",
      width: "2px",
      height: "60%",
      background:
        "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent)",
      transform: "rotate(15deg)",
      zIndex: 2,
    },

    "& .crack-line-2": {
      position: "absolute",
      top: "30%",
      right: "20%",
      width: "1px",
      height: "40%",
      background:
        "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent)",
      transform: "rotate(-25deg)",
      zIndex: 2,
    },

    "& .crack-line-3": {
      position: "absolute",
      top: "60%",
      left: "30%",
      width: "1.5px",
      height: "30%",
      background:
        "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.25), transparent)",
      transform: "rotate(45deg)",
      zIndex: 2,
    },

    "@keyframes brokenGlassShift": {
      "0%, 100%": {
        transform: "translateX(0) translateY(0)",
        opacity: 0.8,
      },
      "25%": {
        transform: "translateX(2px) translateY(-1px)",
        opacity: 0.9,
      },
      "50%": {
        transform: "translateX(-1px) translateY(2px)",
        opacity: 0.7,
      },
      "75%": {
        transform: "translateX(1px) translateY(1px)",
        opacity: 0.85,
      },
    },

    transition: "all 0.3s ease",
  })
);

export default function Button({
  children,
  variant = "contained",
  gradient,
  neonColor,
  opacity,
  intensity = "medium",
  animation = true,
  ...props
}: CustomButtonProps) {
  switch (variant) {
    case "gradient":
      return (
        <GradientButton gradient={gradient} variant="contained" {...props}>
          {children}
        </GradientButton>
      );
    case "neon":
      return (
        <NeonButton
          neonColor={neonColor}
          opacity={opacity}
          variant="outlined"
          {...props}
        >
          {children}
        </NeonButton>
      );
    case "glass":
      return (
        <GlassButton intensity={intensity} variant="contained" {...props}>
          <span>{children}</span>
        </GlassButton>
      );
    case "broken-glass":
      return (
        <BrokenGlassButton
          intensity={intensity}
          animation={animation}
          variant="contained"
          {...props}
        >
          <span>{children}</span>
          <div className="crack-line-1" />
          <div className="crack-line-2" />
          <div className="crack-line-3" />
        </BrokenGlassButton>
      );
    default:
      return (
        <MuiButton variant="contained" {...props}>
          {children}
        </MuiButton>
      );
  }
}
