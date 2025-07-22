"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "#/Components/MotionWrapper";
import {
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

export type Experience = {
  role: string;
  company: string;
  time: string;
  details: string[];
};

export default function CareerPage() {
  const t = useTranslations("career");

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
            mb: 2,
            fontWeight: "normal",
          }}
        >
          {t("description")}
        </Typography>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.6}>
        <Typography
          variant="body1"
          component="p"
          sx={{
            textAlign: "center",
            mb: 6,
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          {t("experience")}
        </Typography>
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
            <Card
              sx={{
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Role and Company Header */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      color: "primary.main",
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    {experience.role}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon
                        sx={{ color: "text.secondary", fontSize: "1.2rem" }}
                      />
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        {experience.company}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  </Box>
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
                  Key Achievements & Responsibilities
                </Typography>

                <Stack spacing={2}>
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
                </Stack>
              </CardContent>
            </Card>
          </MotionWrapper>
        ))}
      </Stack>

      {/* Call to Action */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.4}>
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
            Interested in Learning More?
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Check out my detailed resume or get in touch to discuss
            opportunities and collaborations.
          </Typography>
        </Box>
      </MotionWrapper>
    </Box>
  );
}
