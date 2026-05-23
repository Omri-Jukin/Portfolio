import React from "react";
import { Box } from "@mui/material";
import { HOME_SECTION_WIDTH } from "$/constants";

export interface PublicPageShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

const PublicPageShell: React.FC<PublicPageShellProps> = ({
  children,
  maxWidth = HOME_SECTION_WIDTH,
}) => (
  <Box
    component="main"
    sx={{
      width: "100%",
      maxWidth,
      mx: "auto",
      px: { xs: 2, md: 4 },
      py: { xs: 4, md: 6 },
      boxSizing: "border-box",
    }}
  >
    {children}
  </Box>
);

export default PublicPageShell;
