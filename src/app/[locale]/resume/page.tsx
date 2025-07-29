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
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MotionWrapper from "~/MotionWrapper";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import ResumeLanguageSelector from "#/Components/ResumeLanguageSelector";
import { generateResumePDF } from "#/lib/utils/pdfGenerator";
import { extractResumeData } from "#/lib/utils/resumeDataExtractor";

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

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleDownload = async (languageCode: string) => {
    try {
      setIsGenerating(true);

      // Extract resume data for the selected language
      const resumeData = extractResumeData(languageCode);

      // Generate PDF
      const pdf = await generateResumePDF(resumeData, languageCode);

      // Download the PDF
      const filename = `Omri_Jukin_Resume_${languageCode.toUpperCase()}.pdf`;
      pdf.save(filename);

      setSnackbar({
        open: true,
        message: `Resume downloaded successfully in ${languageCode.toUpperCase()}!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbar({
        open: true,
        message: "Error generating PDF. Please try again.",
        severity: "error",
      });
    } finally {
      setIsGenerating(false);
    }
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
        onDownload={handleDownload}
        isLoading={isGenerating}
        selectedLanguage={selectedLanguage}
      />

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

      {/* Call to Action */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={2.0}>
        <Box
          sx={{
            mt: 6,
            p: 4,
            textAlign: "center",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            component="p"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {t("letsBuildTogether")}
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            {t("readyToDiscuss")}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
            onClick={() => router.push("/contact")}
          >
            {t("getInTouch")}
          </Button>
        </Box>
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
