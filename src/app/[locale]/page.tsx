"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useLocale } from "next-intl";
import ScrollingSections from "~/ScrollingSections";

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
        width: "100%",
      }}
    >
      <ScrollingSections locale={locale} />
    </Box>
  );
}
