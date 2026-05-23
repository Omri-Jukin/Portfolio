"use client";

import React from "react";
import {
  Box,
  Typography,
  CardContent,
  CircularProgress,
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
  ExperienceTimeline,
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

  // Public homepage uses resume-aligned locale content (same source as /career page).
  // CMS work experiences in /dashboard are for admin editing, not placeholder/demo rows.
  const experiences = t.raw("experiences") as Experience[];

  if (!experiences?.length) {
    return (
      <CareerContainer id={CAREER_CONSTANTS.SECTION_ID}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="240px"
        >
          <CircularProgress />
        </Box>
      </CareerContainer>
    );
  }

  return (
    <CareerContainer id={CAREER_CONSTANTS.SECTION_ID}>
      <MotionWrapper variant="fadeIn" duration={0.6} delay={0.1}>
        <CareerTitle variant="h2">{t("title")}</CareerTitle>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.6} delay={0.2}>
        <CareerSubtitle variant="h5">{t("subtitle")}</CareerSubtitle>
        <CareerDescription variant="body1">{t("description")}</CareerDescription>
      </MotionWrapper>

      <ExperienceTimeline>
        {experiences.map((experience: Experience, index: number) => {
          const role = experience.role;
          const company = experience.company;
          const timeRange = experience.time;
          const details = experience.details;

          return (
            <MotionWrapper
              key={`${role}-${company}-${index}`}
              variant="fadeInUp"
              duration={0.6}
              delay={0.05 * index}
            >
              <ExperienceCard elevation={0}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 1.5,
                    }}
                  >
                    <BusinessIcon sx={{ color: "primary.main", mt: 0.25 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="h6" component="h3" fontWeight={700}>
                          {role}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        {company}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          mt: 0.75,
                        }}
                      >
                        <CalendarIcon
                          sx={{ fontSize: "1rem", color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {timeRange}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <ExperienceDetails>
                    {details.slice(0, 4).map((detail: string, i: number) => (
                      <Typography
                        key={i}
                        variant="body2"
                        sx={{ mb: 1, lineHeight: 1.65 }}
                      >
                        • {detail}
                      </Typography>
                    ))}
                  </ExperienceDetails>
                </CardContent>
              </ExperienceCard>
            </MotionWrapper>
          );
        })}
      </ExperienceTimeline>

      <CallToActionBox>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t("checkOutResume")}
        </Typography>
        <CallToActionButton
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={handleResumeClick}
        >
          {t("viewResume")}
        </CallToActionButton>
      </CallToActionBox>
    </CareerContainer>
  );
};

export default Career;
