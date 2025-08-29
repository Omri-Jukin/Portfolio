import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const AnimatedBackgroundContainer = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: -1,
  background: "transparent",
}));

export const CanvasContainer = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  background: "transparent",
}));
