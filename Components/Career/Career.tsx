"use client";

import React from "react";
import {
  Box,
  Typography,
  CardContent,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import {
  CareerContainer,
  CareerTitle,
  CareerSubtitle,
  CareerDescription,
  ExperienceCard,
  ExperienceDetails,
  CallToActionBox,
  CallToActionButton,
} from "./Career.style";
import { CAREER_CONSTANTS } from "./Career.const";
import type { CareerProps } from "./Career.type";

export type Experience = {
  role: string;
  company: string;
  time: string;
  details: string[];
};

const Career: React.FC<CareerProps> = () => {
  const t = useTranslations("career");
  const router = useRouter();

  const handleResumeClick = () => {
    router.push("/resume");
  };

  return (
    <CareerContainer id={CAREER_CONSTANTS.SECTION_ID}>
      {/* Header */}
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <CareerTitle variant="h1">{t("title")}</CareerTitle>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
        <CareerSubtitle variant="h5">{t("subtitle")}</CareerSubtitle>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.6}>
        <CareerDescription variant="body1">
          {t("description")}
        </CareerDescription>
      </MotionWrapper>

      {/* Experience Timeline */}
      <Stack spacing={4}>
        {t.raw("experiences").map((experience: Experience, index: number) => (
          <MotionWrapper
            key={experience.role + experience.company}
            variant="slideUp"
            duration={0.8}
            delay={0.8 + index * 0.2}
          >
            <ExperienceCard>
              <CardContent sx={{ p: 4 }}>
                {/* Role and Company */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <BusinessIcon
                    sx={{ color: "primary.main", fontSize: "2rem" }}
                  />
                  <Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        mb: 0.5,
                      }}
                    >
                      {experience.role}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        fontWeight: "medium",
                      }}
                    >
                      {experience.company}
                    </Typography>
                  </Box>
                </Box>

                {/* Time Period */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <CalendarIcon
                    sx={{ color: "text.secondary", fontSize: "1.2rem" }}
                  />
                  <Chip
                    label={experience.time}
                    size="small"
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "secondary.contrastText",
                      fontWeight: "medium",
                    }}
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Key Achievements */}
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.primary",
                    fontWeight: "semibold",
                    mb: 2,
                  }}
                >
                  {t("keyAchievements")}
                </Typography>

                <ExperienceDetails>
                  {experience.details.map(
                    (detail: string, detailIndex: number) => (
                      <Box
                        key={detailIndex}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            mt: 1,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.7,
                            fontSize: "1rem",
                          }}
                        >
                          {detail}
                        </Typography>
                      </Box>
                    )
                  )}
                </ExperienceDetails>
              </CardContent>
            </ExperienceCard>
          </MotionWrapper>
        ))}
      </Stack>

      {/* Call to Action */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.4}>
        <CallToActionBox>
          <Typography
            variant="h5"
            component="p"
            sx={{ color: "primary.main", mb: 2 }}
          >
            {t("interestedInLearning")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            {t("checkOutResume")}
          </Typography>
          <CallToActionButton
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleResumeClick}
          >
            {t("viewResume")}
          </CallToActionButton>
        </CallToActionBox>
      </MotionWrapper>
    </CareerContainer>
  );
};

export default Career;
