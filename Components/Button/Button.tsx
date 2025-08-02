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

const GlassButton = styled(MuiButton)(() => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 25,
  color: "white",
  padding: "10px 30px",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transform: "translateY(-1px)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
  },
  transition: "all 0.3s ease",
}));

export default function Button({
  children,
  variant = "contained",
  gradient,
  neonColor,
  opacity,
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
        <GlassButton variant="contained" {...props}>
          {children}
        </GlassButton>
      );
    default:
      return (
        <MuiButton variant="contained" {...props}>
          {children}
        </MuiButton>
      );
  }
}
