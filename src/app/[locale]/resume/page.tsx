"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Stack,
  Link,
  Button,
  Divider,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import {
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

export type Skill = {
  name: string;
  level: number;
};

export type Language = {
  name: string;
  level: string;
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

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
            }}
          >
            {t("networkingSummary")}
          </Button>
        </Box>
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
              Professional Summary
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

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Technical Skills */}
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
                  {skillsT("categories.technical.title")}
                </Typography>
                <Stack spacing={3}>
                  {skillsT
                    .raw("categories.technical.items")
                    .map((skill: Skill, index: number) => (
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
                      </Box>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </MotionWrapper>
        </Grid>

        {/* Programming Languages */}
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
                  {skillsT("categories.programming.title")}
                </Typography>
                <Stack spacing={2}>
                  {skillsT
                    .raw("categories.programming.items")
                    .map((lang: Language, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {lang.name}
                        </Typography>
                        <Chip
                          label={lang.level}
                          size="small"
                          sx={{
                            backgroundColor:
                              lang.level === "מומחה" ||
                              lang.level === "Expert" ||
                              lang.level === "Experto"
                                ? "success.main"
                                : "warning.main",
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
        </Grid>

        {/* Languages */}
        <Grid component="div">
          <MotionWrapper variant="slideUp" duration={0.8} delay={1.2}>
            <Card sx={{ height: "100%", backgroundColor: "background.paper" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ color: "warning.main" }}
                >
                  {skillsT("categories.languages.title")}
                </Typography>
                <Stack spacing={2}>
                  {skillsT
                    .raw("categories.languages.items")
                    .map((language: Language, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {language.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {language.level}
                        </Typography>
                      </Box>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </MotionWrapper>
        </Grid>
      </Grid>

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
          {projectsT("description")}
        </Typography>
      </MotionWrapper>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {projectsT.raw("list").map((project: Project, index: number) => (
          <Grid component="div" key={index}>
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
                      View Code
                    </Button>
                    <Button
                      component={Link}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      startIcon={<LaunchIcon />}
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      Live Demo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </MotionWrapper>
          </Grid>
        ))}
      </Grid>

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
            Let&apos;s Build Something Amazing Together
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Ready to discuss your next project or opportunity?
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
          >
            Get In Touch
          </Button>
        </Box>
      </MotionWrapper>
    </Box>
  );
}
