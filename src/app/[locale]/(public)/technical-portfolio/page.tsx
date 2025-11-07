"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import { useRouter } from "next/navigation";
import {
  Code as CodeIcon,
  Architecture as ArchitectureIcon,
  BugReport as ChallengeIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  GitHub as GitHubIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ResponsiveBackground } from "~/ScrollingSections";
import { Typography as CustomTypography } from "~/Typography";
import TagChip from "~/TagChip";

export type Examples = {
  title: string;
  description: string;
  language: string;
  code: string;
  explanation: string;
}[];

export default function TechnicalPortfolioPage() {
  const t = useTranslations("technicalPortfolio");
  const router = useRouter();

  const centered = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ResponsiveBackground>
      <Box
        sx={{
          width: "100%",
          maxWidth: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MotionWrapper>
          <Box
            sx={{
              p: { xs: 2, md: 4 },
              maxWidth: "1400px",
              mx: "auto",
              width: "100%",
              flexDirection: "column",
              borderRadius: "12px",
              ...centered,
            }}
          >
            {/* Professional Header */}
            <Card
              sx={{
                mb: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <CustomTypography
                    variant="h1"
                    color="textPrimary"
                    sx={{
                      height: "100%",
                    }}
                  >
                    {t("title")}
                  </CustomTypography>
                  <CustomTypography
                    variant="h5"
                    color="textSecondary"
                    sx={{
                      maxWidth: "800px",
                      mx: "auto",
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {t("description")}
                  </CustomTypography>
                </Box>

                <Divider
                  sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }}
                />

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                  flexWrap="wrap"
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push("/resume")}
                    startIcon={<ViewIcon />}
                    sx={{
                      background:
                        "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "8px 8px 32px rgba(102, 126, 234, 0.3)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "12px 12px 40px rgba(102, 126, 234, 0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    View Resume
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<GitHubIcon />}
                    onClick={() =>
                      window.open("https://github.com/Omri-Jukin", "_blank")
                    }
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "text.primary",
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.6)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    GitHub
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Technical Portfolio Content */}
            <Grid container spacing={4} sx={{ ...centered }}>
              {/* Professional Overview Section */}
              <Grid columns={1} rowSpacing={2}>
                <Card
                  sx={{
                    mb: 4,
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    boxShadow: "16px 16px 32px rgba(0, 0, 0, 0.1)",
                    ...centered,
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <ArchitectureIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "primary.main",
                            filter:
                              "drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))",
                          }}
                        />
                        <CustomTypography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            background:
                              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("overview.title")}
                        </CustomTypography>
                      </Stack>

                      <CustomTypography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                          maxWidth: "900px",
                          mx: "auto",
                          lineHeight: 1.7,
                          fontWeight: 400,
                        }}
                      >
                        {t("overview.description")}
                      </CustomTypography>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                        },
                        gap: 3,
                        mt: 4,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow:
                              "20px 20px 40px rgba(102, 126, 234, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                          <StarIcon
                            sx={{ color: "primary.main", opacity: 0.3 }}
                          />
                        </Box>
                        <Typography
                          variant="h3"
                          color="primary"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("overview.stats.projects")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Featured Projects
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(34, 197, 94, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "20px 20px 40px rgba(34, 197, 94, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                          <SpeedIcon
                            sx={{ color: "success.main", opacity: 0.3 }}
                          />
                        </Box>
                        <Typography
                          variant="h3"
                          color="success.main"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("overview.stats.technologies")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Technologies
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "20px 20px 40px rgba(239, 68, 68, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                          <ChallengeIcon
                            sx={{ color: "error.main", opacity: 0.3 }}
                          />
                        </Box>
                        <Typography
                          variant="h3"
                          color="error.main"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("overview.stats.challenges")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Challenges Solved
                        </Typography>
                      </Paper>

                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(168, 85, 247, 0.2)",
                          borderRadius: "12px",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "20px 20px 40px rgba(168, 85, 247, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                          <CodeIcon
                            sx={{ color: "secondary.main", opacity: 0.3 }}
                          />
                        </Box>
                        <Typography
                          variant="h3"
                          color="secondary.main"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {t("overview.stats.languages")}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Languages
                        </Typography>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Professional Code Examples Section */}
              <Grid columns={1} rowSpacing={2}>
                <Card
                  sx={{
                    mb: 4,
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    boxShadow: "16px 16px 32px rgba(0, 0, 0, 0.1)",
                    ...centered,
                  }}
                >
                  <CardContent sx={{ borderRadius: "12px" }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <CodeIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "primary.main",
                            filter:
                              "drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))",
                          }}
                        />
                        <CustomTypography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            background:
                              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("codeExamples.title")}
                        </CustomTypography>
                      </Stack>

                      <CustomTypography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                          maxWidth: "900px",
                          mx: "auto",
                          lineHeight: 1.7,
                          fontWeight: 400,
                        }}
                      >
                        {t("codeExamples.description")}
                      </CustomTypography>
                    </Box>

                    {/* Professional Code Examples Accordion */}
                    <Box sx={{ borderRadius: "12px", overflow: "hidden" }}>
                      {Object.entries(t.raw("codeExamples.projects") || {}).map(
                        ([projectKey, projectData], index) => {
                          const project = projectData as {
                            title: string;
                            description: string;
                            technologies: string[];
                            examples: Examples;
                          };
                          return (
                            <Accordion
                              key={projectKey}
                              sx={{
                                background: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius:
                                  index === 0
                                    ? "12px 12px 0 0"
                                    : index ===
                                      Object.entries(
                                        t.raw("codeExamples.projects") || {}
                                      ).length -
                                        1
                                    ? "0 0 12px 12px"
                                    : "0",
                                "&:before": { display: "none" },
                                "&.Mui-expanded": {
                                  margin: 0,
                                },
                                "& + .MuiAccordion-root": {
                                  marginTop: 0,
                                },
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreIcon
                                    sx={{ color: "primary.main" }}
                                  />
                                }
                                sx={{
                                  background:
                                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                                  borderRadius: "12px",
                                  "&.Mui-expanded": {
                                    minHeight: "auto",
                                  },
                                  "& .MuiAccordionSummary-content": {
                                    margin: "16px 0",
                                  },
                                }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                  sx={{ width: "100%" }}
                                >
                                  <CodeIcon color="primary" />
                                  <Box sx={{ flex: 1 }}>
                                    <CustomTypography
                                      variant="h5"
                                      sx={{ fontWeight: 600, mb: 0.5 }}
                                    >
                                      {project.title}
                                    </CustomTypography>
                                    <CustomTypography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={{ mb: 1 }}
                                    >
                                      {project.description}
                                    </CustomTypography>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      flexWrap="wrap"
                                    >
                                      {project.technologies.map(
                                        (tech, index) => (
                                          <Chip
                                            key={index}
                                            label={tech}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: "0.7rem" }}
                                          />
                                        )
                                      )}
                                    </Stack>
                                  </Box>
                                  <Chip
                                    label={`${
                                      Array.isArray(project.examples)
                                        ? project.examples.length
                                        : 0
                                    } examples`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                </Stack>
                              </AccordionSummary>
                              <AccordionDetails
                                sx={{ p: 4, borderRadius: "12px" }}
                              >
                                <Grid container spacing={3}>
                                  {Array.isArray(project.examples) &&
                                    project.examples.map(
                                      (
                                        example: {
                                          title: string;
                                          description: string;
                                          language: string;
                                          code: string;
                                          explanation: string;
                                        },
                                        index: number
                                      ) => (
                                        <Grid key={index}>
                                          <Paper
                                            sx={{
                                              p: 4,
                                              height: "100%",
                                              background:
                                                "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                                              backdropFilter: "blur(10px)",
                                              border:
                                                "1px solid rgba(255, 255, 255, 0.1)",
                                              borderRadius: "12px",
                                              position: "relative",
                                              overflow: "hidden",
                                              "&:hover": {
                                                transform: "translateY(-2px)",
                                                boxShadow:
                                                  "12px 12px 24px rgba(0, 0, 0, 0.1)",
                                              },
                                              transition: "all 0.3s ease",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                position: "absolute",
                                                top: 16,
                                                right: 16,
                                              }}
                                            >
                                              <TagChip
                                                tag={example.language}
                                                style={{
                                                  background:
                                                    "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                                                  color: "white",
                                                  fontWeight: 600,
                                                }}
                                              />
                                            </Box>

                                            <CustomTypography
                                              variant="h6"
                                              sx={{
                                                fontWeight: 700,
                                                mb: 2,
                                                pr: 8,
                                                lineHeight: 1.3,
                                              }}
                                            >
                                              {example.title}
                                            </CustomTypography>

                                            <CustomTypography
                                              variant="body2"
                                              color="textSecondary"
                                              sx={{
                                                mb: 3,
                                                lineHeight: 1.6,
                                                fontWeight: 400,
                                              }}
                                            >
                                              {example.description}
                                            </CustomTypography>

                                            <Box
                                              component="pre"
                                              sx={{
                                                background:
                                                  "linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)",
                                                color: "text.primary",
                                                p: 3,
                                                borderRadius: "12px",
                                                overflow: "auto",
                                                fontSize: "0.8rem",
                                                maxHeight: 250,
                                                border:
                                                  "1px solid rgba(255, 255, 255, 0.1)",
                                                fontFamily:
                                                  "'Fira Code', 'Monaco', 'Consolas', monospace",
                                                lineHeight: 1.5,
                                                position: "relative",
                                                "&::-webkit-scrollbar": {
                                                  width: "6px",
                                                },
                                                "&::-webkit-scrollbar-track": {
                                                  background:
                                                    "rgba(255, 255, 255, 0.1)",
                                                  borderRadius: "3px",
                                                },
                                                "&::-webkit-scrollbar-thumb": {
                                                  background:
                                                    "rgba(102, 126, 234, 0.3)",
                                                  borderRadius: "3px",
                                                },
                                              }}
                                            >
                                              {example.code}
                                            </Box>

                                            <CustomTypography
                                              variant="body2"
                                              sx={{
                                                mt: 3,
                                                fontStyle: "italic",
                                                color: "text.secondary",
                                                lineHeight: 1.6,
                                                fontWeight: 400,
                                              }}
                                            >
                                              💡 {example.explanation}
                                            </CustomTypography>
                                          </Paper>
                                        </Grid>
                                      )
                                    )}
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          );
                        }
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Professional Technical Challenges Section */}
              <Grid columns={1} rowSpacing={2}>
                <Card
                  sx={{
                    mb: 4,
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent sx={{ p: 5, borderRadius: "12px" }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mb: 3 }}
                      >
                        <ChallengeIcon
                          sx={{
                            fontSize: "2.5rem",
                            color: "error.main",
                            filter:
                              "drop-shadow(0 0 10px rgba(239, 68, 68, 0.3))",
                          }}
                        />
                        <CustomTypography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            background:
                              "linear-gradient(45deg, #ef4444 0%, #dc2626 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("technicalChallenges.title")}
                        </CustomTypography>
                      </Stack>

                      <CustomTypography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                          maxWidth: "900px",
                          mx: "auto",
                          lineHeight: 1.7,
                          fontWeight: 400,
                        }}
                      >
                        {t("technicalChallenges.description")}
                      </CustomTypography>
                    </Box>

                    {/* Professional Challenges List */}
                    <Box sx={{ mt: 4, borderRadius: "12px" }}>
                      {t.raw("technicalChallenges.challenges")?.map(
                        (
                          challenge: {
                            title: string;
                            problem: string;
                            solution: string;
                            impact: string;
                            technologies?: string[];
                          },
                          index: number
                        ) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 5,
                              mb: 4,
                              background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                              backdropFilter: "blur(15px)",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              borderRadius: "12px",
                              position: "relative",
                              overflow: "hidden",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "20px 20px 40px rgba(0, 0, 0, 0.15)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            {/* Challenge Number Badge */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 20,
                                right: 20,
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(45deg, #ef4444 0%, #dc2626 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                boxShadow:
                                  "4px 4px 12px rgba(239, 68, 68, 0.3)",
                              }}
                            >
                              {index + 1}
                            </Box>

                            <CustomTypography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                mb: 3,
                                pr: 6,
                                color: "primary.main",
                                lineHeight: 1.3,
                              }}
                            >
                              {challenge.title}
                            </CustomTypography>

                            <Grid container spacing={4} sx={{ mb: 3 }}>
                              <Grid columns={2} rowSpacing={2}>
                                <Box
                                  sx={{
                                    p: 3,
                                    background:
                                      "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ mb: 2 }}
                                  >
                                    <ChallengeIcon
                                      color="error"
                                      sx={{ fontSize: "1.2rem" }}
                                    />
                                    <CustomTypography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        color: "error.main",
                                      }}
                                    >
                                      Problem
                                    </CustomTypography>
                                  </Stack>
                                  <CustomTypography
                                    variant="body2"
                                    sx={{
                                      lineHeight: 1.6,
                                      fontWeight: 400,
                                      color: "text.primary",
                                    }}
                                  >
                                    {challenge.problem}
                                  </CustomTypography>
                                </Box>
                              </Grid>

                              <Grid columns={2} rowSpacing={2}>
                                <Box
                                  sx={{
                                    p: 3,
                                    background:
                                      "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(34, 197, 94, 0.2)",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ mb: 2 }}
                                  >
                                    <SecurityIcon
                                      color="success"
                                      sx={{ fontSize: "1.2rem" }}
                                    />
                                    <CustomTypography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        color: "success.main",
                                      }}
                                    >
                                      Solution
                                    </CustomTypography>
                                  </Stack>
                                  <CustomTypography
                                    variant="body2"
                                    sx={{
                                      lineHeight: 1.6,
                                      fontWeight: 400,
                                      color: "text.primary",
                                    }}
                                  >
                                    {challenge.solution}
                                  </CustomTypography>
                                </Box>
                              </Grid>
                            </Grid>

                            <Box
                              sx={{
                                p: 3,
                                background:
                                  "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                borderRadius: "12px",
                                border: "1px solid rgba(102, 126, 234, 0.2)",
                                mb: 3,
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ mb: 2 }}
                              >
                                <TrendingUpIcon
                                  color="primary"
                                  sx={{ fontSize: "1.2rem" }}
                                />
                                <CustomTypography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: "primary.main",
                                  }}
                                >
                                  Impact
                                </CustomTypography>
                              </Stack>
                              <CustomTypography
                                variant="body2"
                                sx={{
                                  lineHeight: 1.6,
                                  fontWeight: 400,
                                  color: "text.primary",
                                  fontStyle: "italic",
                                }}
                              >
                                {challenge.impact}
                              </CustomTypography>
                            </Box>

                            {challenge.technologies &&
                              challenge.technologies.length > 0 && (
                                <Box>
                                  <CustomTypography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      mb: 2,
                                      color: "text.primary",
                                    }}
                                  >
                                    Technologies Used:
                                  </CustomTypography>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    gap={1}
                                  >
                                    {challenge.technologies.map(
                                      (tech: string, techIndex: number) => (
                                        <TagChip
                                          key={techIndex.toString()}
                                          tag={tech}
                                          sx={{
                                            background:
                                              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                                            color: "white",
                                            fontWeight: 600,
                                            "&:hover": {
                                              transform: "scale(1.05)",
                                            },
                                            transition: "all 0.2s ease",
                                          }}
                                        />
                                      )
                                    )}
                                  </Stack>
                                </Box>
                              )}
                          </Paper>
                        )
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
    </ResponsiveBackground>
  );
}
