"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function CareerPage() {
  const t = useTranslations("career");

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {t("title")}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {t("description")}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {t("experience")}
      </Typography>
    </Box>
  );
}
