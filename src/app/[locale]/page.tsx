"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useLocale } from "next-intl";
import ScrollingSections from "~/ScrollingSections";
import PerformanceOptimizations from "./performance-optimizations";

export default function HomePage() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [locale]);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        background: "transparent",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <PerformanceOptimizations />
      <ScrollingSections locale={locale} />
    </Box>
  );
}
