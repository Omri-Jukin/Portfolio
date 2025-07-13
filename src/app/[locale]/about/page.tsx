"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {t("title")}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {t("description")}
      </Typography>
    </Box>
  );
}
