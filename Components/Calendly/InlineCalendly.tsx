"use client";

import React, { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { useTheme } from "@mui/material/styles";

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
    <div className={className} style={{ width: "100%", height: "600px" }}>
      <InlineWidget
        url={url}
        pageSettings={{
          backgroundColor: theme.palette.calendly.background,
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: theme.palette.calendly.primary.replace("#", ""),
          textColor: theme.palette.text.primary.replace("#", ""),
          hideGdprBanner: true,
        }}
        styles={{
          height: "600px",
          width: "100%",
        }}
        prefill={{
          name: "",
          email: "",
          firstName: "",
          lastName: "",
        }}
      />
    </div>
  );
};

export default InlineCalendly;
