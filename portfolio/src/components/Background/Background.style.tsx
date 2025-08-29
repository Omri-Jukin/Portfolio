import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const BackgroundContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  zIndex: 0,
});

export const BackgroundCanvas = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
});

export const FloatingElement = styled(Box, {
  shouldForwardProp: (prop) =>
    !["size", "opacity", "rotation"].includes(prop as string),
})<{ size: number; opacity: number; rotation: number }>(
  ({ size, opacity, rotation }) => ({
    position: "absolute",
    width: size,
    height: size,
    opacity,
    transform: `rotate(${rotation}deg)`,
    transition: "all 0.3s ease",
  })
);

export const Particle = styled(Box, {
  shouldForwardProp: (prop) =>
    !["size", "opacity", "color"].includes(prop as string),
})<{ size: number; opacity: number; color: string }>(
  ({ size, opacity, color }) => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: color,
    opacity,
    pointerEvents: "none",
  })
);

export const WaveContainer = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
});

export const Wave = styled(Box, {
  shouldForwardProp: (prop) =>
    !["amplitude", "frequency", "phase", "color", "opacity"].includes(
      prop as string
    ),
})<{
  amplitude: number;
  frequency: number;
  phase: number;
  color: string;
  opacity: number;
}>(({ amplitude, phase, color, opacity }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: `${amplitude}px`,
  background: `linear-gradient(45deg, ${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")}, transparent)`,
  transform: `translateY(${phase}px)`,
  transition: "all 0.3s ease",
}));

export const ContentContainer = styled(Box)({
  position: "relative",
  zIndex: 1,
  width: "100%",
  height: "100%",
});
