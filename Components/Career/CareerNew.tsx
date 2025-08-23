"use client";

import React from "react";
import {
  Box,
  Typography,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCube } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import {
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
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
  CareerSwiperContainer,
} from "./Career.style";
import { CAREER_CONSTANTS } from "./Career.const";
import type { CareerProps } from "./Career.type";
import { api } from "$/trpc/client";
import { format } from "date-fns";

export type Experience = {
  role: string;
  company: string;
  time: string;
  details: string[];
};

const Career: React.FC<CareerProps> = () => {
  const t = useTranslations("career");
  const router = useRouter();

  // Fetch work experiences from database
  const {
    data: workExperiences = [],
    isLoading,
    error,
  } = api.workExperiences.getAll.useQuery({
    visibleOnly: true,
  });

  const handleResumeClick = () => {
    router.push("/resume");
  };

  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = format(new Date(startDate), "MMM yyyy");
    const end = endDate ? format(new Date(endDate), "MMM yyyy") : "Present";
    return `${start} - ${end}`;
  };

  const getEmploymentTypeColor = (type: string) => {
    const colors = {
      "full-time": "primary",
      "part-time": "secondary",
      contract: "warning",
      freelance: "info",
      internship: "success",
    };
    return colors[type as keyof typeof colors] || "default";
  };

  if (isLoading) {
    return (
      <CareerContainer id={CAREER_CONSTANTS.SECTION_ID}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </CareerContainer>
    );
  }

  // Determine data source - use database if available, fallback to static
  const experiences =
    workExperiences.length > 0 ? workExperiences : t.raw("experiences");
  const isUsingDatabase = workExperiences.length > 0;

  if (error) {
    console.error("Error loading work experiences:", error);
  }

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

      {/* Experience Timeline - SwiperJS */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.8}>
        <CareerSwiperContainer>
          <Swiper
            modules={[Navigation, Pagination, EffectCube]}
            spaceBetween={20}
            centeredSlides={true}
            slidesPerView={1}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              600: {
                slidesPerView: 1,
                spaceBetween: 25,
              },
              900: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              1400: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
            }}
            navigation={{
              enabled: true,
              hideOnClick: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={true}
            grabCursor={true}
            effect="cube"
            cubeEffect={{
              slideShadows: true,
              shadow: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            speed={600}
            style={{
              paddingBottom: "60px", // Space for pagination dots
              width: "100%",
              maxWidth: "768px",
            }}
            className="career-swiper"
          >
            {experiences.map((experience: any, index: number) => {
              // Handle both static and database formats
              const role = experience.role;
              const company = experience.company;
              const location = isUsingDatabase ? experience.location : null;
              const timeRange = isUsingDatabase
                ? formatDateRange(experience.startDate, experience.endDate)
                : experience.time;
              const details = isUsingDatabase
                ? [
                    ...(experience.achievements || []),
                    ...(experience.responsibilities || []),
                  ]
                : experience.details;
              const employmentType = isUsingDatabase
                ? experience.employmentType
                : null;
              const technologies = isUsingDatabase
                ? experience.technologies || []
                : [];

              return (
                <SwiperSlide key={`${role}-${company}-${index}`}>
                  <MotionWrapper
                    variant="slideUp"
                    duration={0.8}
                    delay={0.8 + index * 0.2}
                  >
                    <ExperienceCard>
                      <CardContent sx={{ p: 4 }}>
                        {/* Role and Company */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <BusinessIcon
                            sx={{ color: "primary.main", fontSize: "2rem" }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="h5"
                                component="h3"
                                sx={{
                                  color: "primary.main",
                                  fontWeight: "bold",
                                }}
                              >
                                {role}
                              </Typography>
                              {employmentType && (
                                <Chip
                                  label={employmentType.replace("-", " ")}
                                  size="small"
                                  color={
                                    getEmploymentTypeColor(
                                      employmentType
                                    ) as any
                                  }
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "text.secondary",
                                fontWeight: "medium",
                              }}
                            >
                              {company}
                            </Typography>
                            {location && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  mt: 0.5,
                                }}
                              >
                                <LocationIcon
                                  sx={{
                                    fontSize: "1rem",
                                    color: "text.secondary",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {location}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>

                        {/* Time Period */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 3,
                          }}
                        >
                          <CalendarIcon
                            sx={{ color: "text.secondary", fontSize: "1.2rem" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontWeight: "medium",
                            }}
                          >
                            {timeRange}
                          </Typography>
                        </Box>

                        {/* Technologies */}
                        {technologies.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                mb: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <WorkIcon sx={{ fontSize: "1rem" }} />
                              Technologies
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {technologies
                                .slice(0, 6)
                                .map((tech: string, techIndex: number) => (
                                  <Chip
                                    key={techIndex}
                                    label={tech}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                  />
                                ))}
                              {technologies.length > 6 && (
                                <Chip
                                  label={`+${technologies.length - 6} more`}
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                />
                              )}
                            </Box>
                          </Box>
                        )}

                        {/* Experience Details */}
                        <ExperienceDetails>
                          {details
                            .slice(0, 4)
                            .map((detail: string, i: number) => (
                              <Typography
                                key={i}
                                variant="body2"
                                sx={{
                                  mb: 2,
                                  lineHeight: 1.6,
                                  color: "text.primary",
                                }}
                              >
                                • {detail}
                              </Typography>
                            ))}
                        </ExperienceDetails>

                        <Divider sx={{ my: 3 }} />

                        {/* Call-to-Action */}
                        <CallToActionBox>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            Learn more about my professional background
                          </Typography>
                          <CallToActionButton
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                            onClick={handleResumeClick}
                            size="small"
                          >
                            View Resume
                          </CallToActionButton>
                        </CallToActionBox>
                      </CardContent>
                    </ExperienceCard>
                  </MotionWrapper>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </CareerSwiperContainer>
      </MotionWrapper>
    </CareerContainer>
  );
};

export default Career;
