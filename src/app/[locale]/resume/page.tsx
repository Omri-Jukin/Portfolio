"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import { Typography } from "~/Typography";

export default function ResumePage() {
  const t = useTranslations("resume");
  return (
    <Box sx={{ p: 2 }}>
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          data-aos="fade-down"
          data-aos-duration="250"
        >
          {t("title")}
        </Typography>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.3}>
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          weight="normal"
          margin={{ bottom: "3rem" }}
          data-aos="fade-up"
          data-aos-duration="300"
        >
          {t("networkingSummary")}
        </Typography>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
        <Typography
          variant="body1"
          component="p"
          gutterBottom
          data-aos="fade-up"
          data-aos-duration="250"
          data-aos-delay="200"
        >
          {t("experience")}
        </Typography>
      </MotionWrapper>
    </Box>
  );
}
