"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "#/Components/MotionWrapper";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <Box sx={{ p: 2 }}>
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          {t("title")}
        </Typography>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          {t("description")}
        </Typography>
      </MotionWrapper>
    </Box>
  );
}
