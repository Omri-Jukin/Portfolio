import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ButtonProps as CustomButtonProps } from "./Button.type";

// Styled button variants
const GradientButton = styled(MuiButton)(() => ({
  background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
  border: 0,
  borderRadius: 25,
  color: "white",
  padding: "10px 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  "&:hover": {
    background: "linear-gradient(45deg, #ff5252, #26a69a)",
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px 2px rgba(255, 105, 135, .4)",
  },
  transition: "all 0.3s ease",
}));

const NeonButton = styled(MuiButton)(() => ({
  background: "transparent",
  border: "2px solid #00ff88",
  borderRadius: 25,
  color: "#00ff88",
  padding: "10px 30px",
  textShadow: "0 0 10px #00ff88",
  boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
  "&:hover": {
    background: "rgba(0, 255, 136, 0.1)",
    border: "2px solid #00ffaa",
    color: "#00ffaa",
    boxShadow: "0 0 30px rgba(0, 255, 136, 0.8)",
    transform: "scale(1.05)",
  },
  transition: "all 0.3s ease",
}));

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
  ...props
}: CustomButtonProps) {
  switch (variant) {
    case "gradient":
      return (
        <GradientButton variant="contained" {...props}>
          {children}
        </GradientButton>
      );
    case "neon":
      return (
        <NeonButton variant="outlined" {...props}>
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
        <MuiButton variant={variant} {...props}>
          {children}
        </MuiButton>
      );
  }
}
