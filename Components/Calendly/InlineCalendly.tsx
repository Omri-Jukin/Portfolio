"use client";

import React, { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";

interface InlineCalendlyProps {
  url?: string;
  className?: string;
}

const InlineCalendly = ({
  url = "https://calendly.com/omrijukin/30min",
  className = "inline-calendly",
}: InlineCalendlyProps) => {
  const theme = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until we're on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Box
      className={className}
      sx={{
        width: "100%",
        height: { xs: "800px", sm: "1000px", md: "1200px" },
        minHeight: { xs: "800px", sm: "1000px", md: "1200px" },
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <InlineWidget
        url={url}
        pageSettings={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: theme.palette.primary.main.replace("#", ""),
          textColor: theme.palette.text.primary.replace("#", ""),
          hideGdprBanner: true,
        }}
        styles={{
          width: "100%",
          height: "100%",
          minHeight: "fit-content",
          border: "none",
        }}
        prefill={{
          name: "",
          email: "",
          firstName: "",
          lastName: "",
        }}
      />
    </Box>
  );
};

export default InlineCalendly;
