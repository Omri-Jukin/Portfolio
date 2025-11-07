"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Chip, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import { CTA1Button } from "~/Button/Button.style";
import { useRouter } from "next/navigation";

type SkillDetail = {
  title: string;
  description: string;
  experience: string;
  years: string;
  technologies: string[];
  examples: string[];
};

export default function AboutPage() {
  const t = useTranslations("about");
  const router = useRouter();
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
          {t("subtitle")}
        </Typography>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.6}>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            mb: 6,
            fontSize: "1.1rem",
            lineHeight: 1.6,
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          {t("description")}
        </Typography>
      </MotionWrapper>

      {/* Skills Overview */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.8}>
        <Card sx={{ mb: 6, backgroundColor: "background.paper" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ color: "primary.main", textAlign: "center", mb: 4 }}
            >
              {t("mySkills")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {Object.entries(t.raw("skills")).map(([key, skillName]) => (
                <Chip
                  key={key}
                  label={skillName as string}
                  variant="outlined"
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    fontSize: "1rem",
                    padding: 1,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Skill Details */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.0}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ color: "primary.main", textAlign: "center", mb: 4 }}
        >
          {t("skillDetailsTitle")}
        </Typography>
      </MotionWrapper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 4,
          mb: 6,
        }}
      >
        {Object.entries(t.raw("skillDetails")).map(
          ([key, skillDetail], index) => {
            const detail = skillDetail as SkillDetail;
            return (
              <MotionWrapper
                key={key}
                variant="slideUp"
                duration={0.8}
                delay={1.2 + index * 0.2}
              >
                <Card
                  sx={{ height: "100%", backgroundColor: "background.paper" }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{
                        color: "primary.main",
                        textAlign: "center",
                        mb: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {detail.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      {detail.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ mb: 1 }}
                      >
                        {t("experience")} {detail.experience}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ mb: 1 }}
                      >
                        {t("years")} {detail.years}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ mb: 1 }}
                      >
                        {t("technologies")}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {detail.technologies.map((tech, techIndex) => (
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

                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ mb: 1 }}
                      >
                        {t("examples")}
                      </Typography>
                      <Stack spacing={1}>
                        {detail.examples.map((example, exampleIndex) => (
                          <Box
                            key={exampleIndex}
                            sx={{ display: "flex", alignItems: "flex-start" }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "primary.main",
                                mt: 1,
                                mr: 1,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ lineHeight: 1.4 }}
                            >
                              {example}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </MotionWrapper>
            );
          }
        )}
      </Box>

      {/* Call to Action */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.8}>
        <Box
          sx={{
            mt: 6,
            p: 4,
            textAlign: "center",
            backgroundColor: "background.default",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{ color: "primary.main", mb: 2 }}
          >
            {t("readyToWork")}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {t("letsDiscuss")}
          </Typography>
          <CTA1Button sx={{ mt: 2 }} onClick={() => router.push("/contact")}>
            GREAT!
          </CTA1Button>
        </Box>
      </MotionWrapper>
    </Box>
  );
}
