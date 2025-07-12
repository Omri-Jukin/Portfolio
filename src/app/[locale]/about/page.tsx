import React from "react";
import { Box, Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        About Me
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Welcome to my portfolio. I'm a passionate developer who loves creating
        amazing web experiences.
      </Typography>
    </Box>
  );
}
