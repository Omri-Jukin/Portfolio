import React from "react";
import { Box } from "@mui/material";

export const SkeletonText = () => {
  return (
    <Box
      sx={{
        display: "block",
        mt: 0.5,
        width: 160,
        height: 6,
        bgcolor: "grey.300",
      }}
    />
  );
};
