"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";

export default function ContactPage() {
  const t = useTranslations("common");
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
          {t("contact")}
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
          {t("contactDescription")}
        </Typography>
      </MotionWrapper>
    </Box>
  );
}
