"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  CardContent,
  Chip,
  Link,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "#/Components/MotionWrapper";
import { api } from "$/trpc/client";
import {
  OpenInNew as OpenInNewIcon,
  Verified as VerifiedIcon,
  School as SchoolIcon,
  WorkOutline as WorkIcon,
  EmojiEvents as AwardIcon,
} from "@mui/icons-material";
import dynamic from "next/dynamic";

// Dynamically import heavy components to improve build performance
const GalaxyCard = dynamic(
  () =>
    import("#/Components/HeavyComponents").then((mod) => ({
      default: mod.GalaxyCard,
    })),
  { ssr: false }
);
import type { Certification } from "$/db/schema/schema.types";

export default function CertificationsPage() {
  const t = useTranslations("certifications");

  // Fetch certifications from database
  const {
    data: certifications = [],
    isLoading,
    error,
  } = api.certifications.getAll.useQuery({
    visibleOnly: true,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return <SchoolIcon />;
      case "cloud":
        return <WorkIcon />;
      case "security":
        return <VerifiedIcon />;
      default:
        return <AwardIcon />;
    }
  };

  const getCategoryColor = (
    category: string
  ): "primary" | "secondary" | "success" | "warning" | "error" | "info" => {
    switch (category) {
      case "technical":
        return "primary";
      case "cloud":
        return "warning";
      case "security":
        return "error";
      case "project-management":
        return "success";
      case "design":
        return "secondary";
      default:
        return "info";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
        }}
      >
        <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ color: "text.secondary", mb: 3 }}
            >
              Loading certifications...
            </Typography>
          </Box>
        </MotionWrapper>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
        }}
      >
        <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ color: "text.secondary", mb: 3 }}
            >
              Unable to load certifications. Please try again later.
            </Typography>
          </Box>
        </MotionWrapper>
      </Container>
    );
  }

  // Show empty state
  if (!certifications || certifications.length === 0) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
        }}
      >
        <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ color: "text.secondary", mb: 3 }}
            >
              No certifications available at the moment.
            </Typography>
          </Box>
        </MotionWrapper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        mx: "auto",
        width: "100%",
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Header */}
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: "bold",
              mb: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
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
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            {t("subtitle")}
          </Typography>
        </Box>
      </MotionWrapper>

      {/* Certifications List */}
      <Stack spacing={4}>
        {certifications.map((certification: Certification, index: number) => (
          <MotionWrapper
            key={certification.id}
            variant="slideUp"
            duration={0.6}
            delay={0.2 + index * 0.1}
          >
            <GalaxyCard>
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: "300px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main}20`,
                        }}
                      >
                        {certification.icon || "🏆"}
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          component="h2"
                          sx={{
                            fontWeight: "bold",
                            mb: 0.5,
                            fontSize: { xs: "1.5rem", md: "2rem" },
                          }}
                        >
                          {certification.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontWeight: "medium",
                          }}
                        >
                          {certification.issuer}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        mb: 1,
                        fontWeight: "medium",
                      }}
                    >
                      {formatDate(certification.issueDate)}
                      {certification.expiryDate &&
                        ` - ${formatDate(certification.expiryDate)}`}
                    </Typography>
                  </Box>

                  <Chip
                    label={t(`categories.${certification.category}`)}
                    color={getCategoryColor(certification.category)}
                    icon={getCategoryIcon(certification.category)}
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.7,
                    fontSize: "1.1rem",
                    mb: 3,
                  }}
                >
                  {certification.description}
                </Typography>

                {/* Skills */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "semibold",
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    Skills & Technologies
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {certification.skills.map(
                      (skill: string, skillIndex: number) => (
                        <Chip
                          key={skillIndex}
                          label={skill}
                          size="small"
                          variant="filled"
                          sx={{
                            backgroundColor: (theme) =>
                              `${theme.palette.primary.main}15`,
                            color: "primary.main",
                            fontWeight: "medium",
                          }}
                        />
                      )
                    )}
                  </Box>
                </Box>

                {/* Verification and Credential */}
                {(certification.verificationUrl ||
                  certification.credentialId) && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.02)"
                          : "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      {certification.verificationUrl && (
                        <Link
                          href={certification.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            color: "primary.main",
                            textDecoration: "none",
                            fontWeight: "medium",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <VerifiedIcon fontSize="small" />
                          {t("verify")}
                          <OpenInNewIcon fontSize="small" />
                        </Link>
                      )}

                      {certification.credentialId && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <strong>{t("credentialId")}:</strong>{" "}
                          {certification.credentialId}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                )}
              </CardContent>
            </GalaxyCard>
          </MotionWrapper>
        ))}
      </Stack>

      {/* Call to Action */}
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.6}>
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <GalaxyCard sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: "bold",
                mb: 2,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Continuous Learning & Growth
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              I believe in continuous learning and staying up-to-date with the
              latest technologies and best practices. These certifications
              represent my commitment to professional growth and technical
              excellence.
            </Typography>
          </GalaxyCard>
        </Box>
      </MotionWrapper>
    </Container>
  );
}
