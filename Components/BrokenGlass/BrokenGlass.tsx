import React from "react";
import { styled } from "@mui/material/styles";

interface BrokenGlassProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: "low" | "medium" | "high";
  animation?: boolean;
}

const GlassContainer = styled("div")<{ intensity: string; animation: boolean }>(
  ({ intensity, animation }) => ({
    position: "relative",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",

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
      borderRadius: "8px",
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
  })
);

const ContentWrapper = styled("div")({
  position: "relative",
  zIndex: 3,
  padding: "20px",
});

const CrackLines = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2,
  pointerEvents: "none",

  "&::before": {
    content: '""',
    position: "absolute",
    top: "20%",
    left: "10%",
    width: "2px",
    height: "60%",
    background:
      "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent)",
    transform: "rotate(15deg)",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: "30%",
    right: "20%",
    width: "1px",
    height: "40%",
    background:
      "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transform: "rotate(-25deg)",
  },
});

export const BrokenGlass: React.FC<BrokenGlassProps> = ({
  children,
  className,
  style,
  intensity = "medium",
  animation = true,
}) => {
  return (
    <GlassContainer
      intensity={intensity}
      animation={animation}
      className={className}
      style={style}
    >
      <CrackLines />
      <ContentWrapper>{children}</ContentWrapper>
    </GlassContainer>
  );
};

export default BrokenGlass;
