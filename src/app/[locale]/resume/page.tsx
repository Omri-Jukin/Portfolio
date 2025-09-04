"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Stack,
  Link,
  Button,
  Divider,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import GradientButton from "~/Button/Button";
import { useRouter } from "next/navigation";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import ResumeLanguageSelector from "#/Components/ResumeLanguageSelector";
import { RESUME_TEMPLATE_MAPPING } from "#/lib/constants";
import { pdfThemeColors } from "#/lib/styles";
import type { ResumeTemplate, PDFTheme } from "#/lib/types";

// Map ResumeTemplate to PDFTheme using constants
const mapTemplateToPDFTheme = (template: ResumeTemplate): PDFTheme => {
  return RESUME_TEMPLATE_MAPPING[template];
};

// Import SxProps for proper typing
import type { SxProps, Theme } from "@mui/material";
import { extractResumeData } from "#/lib/utils/resumeDataExtractor";
import { GalaxyCard } from "#/Components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export type TechnicalSkill = {
  name: string;
  level: number;
  technologies: string[];
};

export type SoftSkill = {
  name: string;
  level: number;
  description: string;
};

export type Project = {
  title: string;
  description: string;
  link: string;
};

export default function ResumePage() {
  const t = useTranslations("resume");
  const skillsT = useTranslations("skills");
  const projectsT = useTranslations("projects");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate>("modern");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleGenerateDocuments = async (options: {
    language: string;
    documentTypes: string[];
    customization: {
      includeCodeExamples: boolean;
      includeTechnicalChallenges: boolean;
      includeArchitectureDetails: boolean;
    };
  }) => {
    try {
      setIsGenerating(true);

      // Extract resume data for the selected language
      const resumeData = extractResumeData(options.language);

      // Generate PDF (dynamically import to avoid edge bundling)
      const { renderResumePDF } = await import("#/lib/utils/pdfGenerator");

      // Generate documents based on selected types
      for (const docType of options.documentTypes) {
        let filename: string;

        if (docType === "condensedResume") {
          filename = `Omri_Jukin_FullStack_Developer_Resume.pdf`;
        } else if (docType === "technicalPortfolio") {
          filename = `Omri_Jukin_FullStack_Developer_Technical_Portfolio.pdf`;
        } else {
          filename = `Omri_Jukin_FullStack_Developer_${docType}.pdf`;
        }

        // Configure render options based on language and template
        const renderOptions = {
          rtl: options.language === "he",
          theme: mapTemplateToPDFTheme(selectedTemplate),
          maxBulletsPerRole: 3,
          maxProjects: 4,
        };

        const pdf = renderResumePDF(resumeData, renderOptions);

        // Download the PDF
        pdf.save(filename);
      }

      setSnackbar({
        open: true,
        message: `${
          options.documentTypes.length
        } document(s) generated successfully in ${options.language.toUpperCase()}!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error generating documents:", error);
      setSnackbar({
        open: true,
        message: "Error generating documents. Please try again.",
        severity: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // DOM-based preview style helper using PDF theme constants
  const getTemplatePreviewSx = (tpl: ResumeTemplate) => {
    const pdfTheme = mapTemplateToPDFTheme(tpl);
    const themeColors = pdfThemeColors.getThemeColors(pdfTheme);
    const isSelected = selectedTemplate === tpl;
    const base = {
      width: 200,
      height: 280,
      borderRadius: 1,
      border: "1px solid",
      borderColor: isSelected ? themeColors.accent : "divider",
      borderWidth: isSelected ? 3 : 1,
      position: "relative" as const,
      overflow: "hidden",
      bgcolor: "background.paper",
      boxShadow: isSelected
        ? `0 8px 32px ${themeColors.accent}40`
        : "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
      },
    };
    const header = {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: 40, // Match PDF header height ratio
      backgroundColor: themeColors.headerBg,
    };

    // Create template-specific styles using PDF theme constants
    const result: SxProps<Theme> = {
      ...base,
      "&::before": {
        content: '""',
        ...header,
      },
    };

    // Add accent stripe for themes that have it
    if (themeColors.headerAccent) {
      result["&::after"] = {
        content: '""',
        position: "absolute" as const,
        top: 40,
        left: 0,
        width: "100%",
        height: 2,
        backgroundColor: themeColors.headerAccent,
      };
    }

    return result;
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
      {/* Header */}
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {t("title")}
          </Typography>

          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "text.secondary",
              fontWeight: "normal",
              mb: 3,
            }}
          >
            {t("description")}
          </Typography>
        </Box>
      </MotionWrapper>

      {/* Interactive Language Selector */}
      <ResumeLanguageSelector
        onLanguageSelect={handleLanguageSelect}
        onGenerateDocuments={handleGenerateDocuments}
        isLoading={isGenerating}
        selectedLanguage={selectedLanguage}
      />

      {/* Template selector with previews */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.5}>
        <Card sx={{ mb: 6, backgroundColor: "background.paper" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ color: "primary.main", mb: 2 }}>
              {t("templateSelector.title")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              {t("templateSelector.subtitle")}
            </Typography>
            {isMobile ? (
              // Mobile SwiperJS Carousel
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  mx: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "& .swiper": {
                    width: "100%",
                    maxWidth: 320,
                    margin: "0 auto",
                  },
                  "& .swiper-slide": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              >
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination",
                  }}
                  loop={true}
                  allowSlideNext={true}
                  allowSlidePrev={true}
                  centeredSlides={true}
                  grabCursor={true}
                  effect="slide"
                  speed={400}
                  style={
                    {
                      "--swiper-navigation-color": theme.palette.primary.main,
                      "--swiper-pagination-color": theme.palette.primary.main,
                      "--swiper-navigation-size": "24px",
                      "--swiper-navigation-sides-offset": "10px",
                    } as React.CSSProperties
                  }
                >
                  {[
                    "modern",
                    "elegant",
                    "tech",
                    "creative",
                    "minimal",
                    "teal",
                    "indigo",
                    "rose",
                    "corporate",
                    "startup",
                    "academic",
                  ].map((tpl) => (
                    <SwiperSlide key={tpl}>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(tpl as ResumeTemplate);
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(tpl as ResumeTemplate);
                        }}
                        sx={{
                          p: 2,
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, textAlign: "center" }}
                        >
                          {t(`templateSelector.templateNames.${tpl}`)}
                        </Typography>
                        {/* DOM-based preview box (no PDF/iframe) */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Box sx={getTemplatePreviewSx(tpl as ResumeTemplate)}>
                            <Box
                              sx={{
                                p: 1.5,
                                position: "absolute",
                                top: 36,
                                left: "50%",
                                transform: "translateX(-50%)",
                                textAlign: "center",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("professionalSummary")}
                              </Typography>
                              <Box
                                sx={{
                                  mt: 0.5,
                                  width: 150,
                                  height: 6,
                                  bgcolor: "grey.300",
                                  mx: "auto",
                                }}
                              />
                              <Box
                                sx={{
                                  mt: 0.5,
                                  width: 120,
                                  height: 6,
                                  bgcolor: "grey.200",
                                  mx: "auto",
                                }}
                              />
                              <Box sx={{ mt: 1.5 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {projectsT("title")}
                                </Typography>
                                <Box
                                  sx={{
                                    mt: 0.5,
                                    width: 160,
                                    height: 6,
                                    bgcolor: "grey.300",
                                    mx: "auto",
                                  }}
                                />
                                <Box
                                  sx={{
                                    mt: 0.5,
                                    width: 110,
                                    height: 6,
                                    bgcolor: "grey.200",
                                    mx: "auto",
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            ) : (
              // Desktop SwiperJS Carousel with 3 cards
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 900,
                  mx: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "& .swiper": {
                    width: "100%",
                    margin: "0 auto",
                    padding: "0 20px",
                  },
                  "& .swiper-slide": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto",
                    width: "auto !important",
                  },
                  "& .swiper-wrapper": {
                    alignItems: "center",
                  },
                }}
              >
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={30}
                  slidesPerView={3}
                  breakpoints={{
                    1400: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                    1200: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                    900: {
                      slidesPerView: 2,
                      spaceBetween: 25,
                    },
                    600: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                  }}
                  navigation={{
                    nextEl: ".swiper-button-next-desktop",
                    prevEl: ".swiper-button-prev-desktop",
                  }}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-desktop",
                  }}
                  loop={true}
                  centeredSlides={false}
                  grabCursor={true}
                  effect="slide"
                  allowSlideNext={true}
                  allowSlidePrev={true}
                  speed={400}
                  style={
                    {
                      "--swiper-navigation-color": theme.palette.primary.main,
                      "--swiper-pagination-color": theme.palette.primary.main,
                      "--swiper-navigation-size": "24px",
                      "--swiper-navigation-sides-offset": "10px",
                    } as React.CSSProperties
                  }
                >
                  {[
                    "modern",
                    "elegant",
                    "tech",
                    "creative",
                    "minimal",
                    "teal",
                    "indigo",
                    "rose",
                    "corporate",
                    "startup",
                    "academic",
                  ].map((tpl) => (
                    <SwiperSlide key={tpl}>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(tpl as ResumeTemplate);
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(tpl as ResumeTemplate);
                        }}
                        sx={{
                          cursor: "pointer",
                          border:
                            selectedTemplate === tpl
                              ? "3px solid"
                              : "1px solid",
                          borderColor:
                            selectedTemplate === tpl
                              ? "primary.main"
                              : "divider",
                          borderRadius: 3,
                          p: 2,
                          width: { xs: 200, sm: 220, md: 240 },
                          minWidth: 200,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 3,
                            borderColor: "primary.light",
                          },
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          {t(`templateSelector.templateNames.${tpl}`)}
                        </Typography>
                        {/* DOM-based preview box (no PDF/iframe) */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 1,
                          }}
                        >
                          <Box sx={getTemplatePreviewSx(tpl as ResumeTemplate)}>
                            <Box
                              sx={{
                                p: 1.5,
                                position: "absolute",
                                top: 36,
                                left: "50%",
                                transform: "translateX(-50%)",
                                textAlign: "start",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("professionalSummary")}
                              </Typography>
                              <Box
                                sx={{
                                  mt: 0.5,
                                  width: 150,
                                  height: 6,
                                  bgcolor: "grey.300",
                                  mx: "auto",
                                }}
                              />
                              <Box
                                sx={{
                                  mt: 0.5,
                                  width: 120,
                                  height: 6,
                                  bgcolor: "grey.200",
                                  mx: "auto",
                                }}
                              />
                              <Box sx={{ mt: 1.5 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {projectsT("title")}
                                </Typography>
                                <Box
                                  sx={{
                                    mt: 0.5,
                                    width: 160,
                                    height: 6,
                                    bgcolor: "grey.300",
                                    mx: "auto",
                                  }}
                                />
                                <Box
                                  sx={{
                                    mt: 0.5,
                                    width: 110,
                                    height: 6,
                                    bgcolor: "grey.200",
                                    mx: "auto",
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            )}
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Professional Summary */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
        <Card sx={{ mb: 6, backgroundColor: "background.paper" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              {t("professionalSummary")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                fontSize: "1.1rem",
                whiteSpace: "pre-line",
              }}
            >
              {t("experience")}
            </Typography>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Skills Section */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.6}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ color: "primary.main", mb: 4 }}
        >
          {skillsT("title")}
        </Typography>
      </MotionWrapper>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 6,
        }}
      >
        {/* Technical Skills */}
        <Box sx={{ flex: 1 }}>
          <MotionWrapper variant="slideUp" duration={0.8} delay={0.8}>
            <Card sx={{ height: "100%", backgroundColor: "background.paper" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ color: "secondary.main" }}
                >
                  {skillsT("categories.technical.title")}
                </Typography>
                <Stack spacing={3}>
                  {skillsT
                    .raw("categories.technical.skills")
                    .map((skill: TechnicalSkill, index: number) => (
                      <Box key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {skill.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {skill.level}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={skill.level}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "grey.200",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              backgroundColor: "secondary.main",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {skill.technologies.map((tech, techIndex) => (
                            <Chip
                              key={techIndex}
                              label={tech}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem" }}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </MotionWrapper>
        </Box>

        {/* Soft Skills */}
        <Box sx={{ flex: 1 }}>
          <MotionWrapper variant="slideUp" duration={0.8} delay={1.0}>
            <Card sx={{ height: "100%", backgroundColor: "background.paper" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ color: "info.main" }}
                >
                  {skillsT("categories.soft.title")}
                </Typography>
                <Stack spacing={2}>
                  {skillsT
                    .raw("categories.soft.skills")
                    .map((skill: SoftSkill, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {skill.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {skill.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${skill.level}%`}
                          size="small"
                          sx={{
                            backgroundColor: "info.main",
                            color: "white",
                            fontWeight: "medium",
                          }}
                        />
                      </Box>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </MotionWrapper>
        </Box>
      </Box>

      {/* Projects Section */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.4}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ color: "primary.main", mb: 2 }}
        >
          {projectsT("title")}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          {projectsT("subtitle")}
        </Typography>
      </MotionWrapper>

      {/* Projects */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 6,
          flexWrap: "wrap",
        }}
      >
        {projectsT.raw("projects").map((project: Project, index: number) => (
          <Box
            sx={{ flex: { xs: "1", md: "1 1 calc(50% - 16px)" } }}
            key={index}
          >
            <MotionWrapper
              variant="slideUp"
              duration={0.8}
              delay={1.6 + index * 0.2}
            >
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease-in-out",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ color: "primary.main" }}
                  >
                    {project.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {project.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      component={Link}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      {t("viewCode")}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </MotionWrapper>
          </Box>
        ))}
      </Box>

      {/* Call to Action - Galaxy Card */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.8}>
        <GalaxyCard sx={{ minHeight: "fit-content", height: "fit-content" }}>
          <MotionWrapper variant="slideUp" duration={0.8} delay={2.0}>
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                background: `transparent`,
                color: "#fff",
                boxShadow: "0 4px 32px 0 rgba(58,28,113,0.25)",
                "& > *": {
                  position: "relative",
                  zIndex: 1,
                },
              }}
            >
              <Typography
                variant="h4"
                component="p"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  textShadow: "0 2px 8px rgba(58,28,113,0.25)",
                  letterSpacing: 1,
                }}
              >
                {t("letsBuildTogether")}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  opacity: 0.92,
                  textShadow: "0 1px 4px rgba(58,28,113,0.18)",
                }}
              >
                {t("readyToDiscuss")}
              </Typography>
              <GradientButton
                onClick={() => router.push("/contact")}
                variant="gradient"
                gradient="linear-gradient(to right, #FF0000, #000000)"
                opacity="0.8"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  position: "absolute",
                  zIndex: 1,
                  right: "1%",
                  bottom: "5%",
                }}
              >
                {t("getInTouch")}
              </GradientButton>
            </Box>
          </MotionWrapper>
        </GalaxyCard>
      </MotionWrapper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
