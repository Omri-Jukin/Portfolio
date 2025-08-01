import { styled } from "@mui/material/styles";

export const GalaxyContainer = styled("div")({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
});

export const Canvas = styled("canvas")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
});

export const ContentContainer = styled("div")({
  position: "relative",
  zIndex: 1,
  width: "100%",
  height: "100%",
});
