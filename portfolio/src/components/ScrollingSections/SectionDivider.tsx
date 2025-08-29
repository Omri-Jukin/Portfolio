import React from "react";
import { Box } from "@mui/material";
import { Marquee } from "../Typography";

interface SectionDividerProps {
  text?: string;
  height?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  text = "SCROLLING PROGRESSION",
  height = "100px",
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Marquee text={text} />
    </Box>
  );
};

export default SectionDivider;
