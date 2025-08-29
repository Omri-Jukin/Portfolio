import React from "react";
import { Box } from "@mui/material";
import { GlassPaneProps } from "./GlassPane.type";

export const GlassPane: React.FC<GlassPaneProps> = ({
  children,
  width = "200px",
  height = "100px",
  rotate = "0deg",
  borderRadius = "16px",
  border = "1px solid rgba(0, 0, 0, 1)",
  backdropFilter = "blur(5.3px)",
  WebkitBackdropFilter = "blur(5.3px)",
  boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)",
  background = "rgba(0, 0, 0, 0.28)",
  opacity = 1,
  zIndex = 1,
  position = "relative",
  display = "flex",
  alignItems = "center",
  justifyContent = "center",
  transition = "all 0.3s ease-in-out",
  cursor = "pointer",
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  return (
    <Box
      sx={{
        background,
        borderRadius,
        boxShadow,
        backdropFilter,
        WebkitBackdropFilter,
        border,
        transform: `rotate(${rotate})`,
        height,
        width,
        opacity,
        zIndex,
        position,
        display,
        alignItems,
        justifyContent,
        transition,
        cursor,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GlassPane;
