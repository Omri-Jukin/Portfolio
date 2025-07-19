"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "#/Components/MotionWrapper";

export default function AboutPage() {
  const t = useTranslations("about");
  const interestsT = useTranslations("interests");

  // Parse the profile text into bullet points
  const profilePoints = t("profile")
    .split("•")
    .filter((point) => point.trim())
    .map((point) => point.trim());

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
          }}
        >
          {t("title")}
        </Typography>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
        <Typography
          variant="h5"
          component="p"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mb: 4,
            fontWeight: "normal",
          }}
        >
          {t("description")}
        </Typography>
      </MotionWrapper>

      {/* Professional Profile */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.6}>
        <Card sx={{ mb: 4, backgroundColor: "background.paper" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Professional Profile
            </Typography>
            <Stack spacing={2}>
              {profilePoints.map((point, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      mt: 1,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {point}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Professional Interests & Additional Activities */}
      <Grid container spacing={4}>
        {/* Professional Interests */}
        <Grid component="div">
          <MotionWrapper variant="slideUp" duration={0.8} delay={0.8}>
            <Card sx={{ height: "100%", backgroundColor: "background.paper" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ color: "secondary.main" }}
                >
                  {interestsT("title")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {interestsT
                    .raw("professional")
                    .map((interest: string, index: number) => (
                      <Chip
                        key={index}
                        label={interest}
                        variant="outlined"
                        sx={{
                          borderColor: "secondary.main",
                          color: "secondary.main",
                          "&:hover": {
                            backgroundColor: "secondary.main",
                            color: "secondary.contrastText",
                          },
                        }}
                      />
                    ))}
                </Box>
              </CardContent>
            </Card>
          </MotionWrapper>
        </Grid>

        {/* Additional Activities */}
        <Grid component="div">
          <MotionWrapper variant="slideUp" duration={0.8} delay={1.0}>
            <Card sx={{ height: "100%", backgroundColor: "background.paper" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ color: "info.main" }}
                >
                  Additional Activities
                </Typography>
                <Stack spacing={2}>
                  {interestsT
                    .raw("additional")
                    .map((activity: string, index: number) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "flex-start" }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "info.main",
                            mt: 1,
                            mr: 2,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {activity}
                        </Typography>
                      </Box>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </MotionWrapper>
        </Grid>
      </Grid>
    </Box>
  );
}
