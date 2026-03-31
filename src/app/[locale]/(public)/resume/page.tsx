"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Link,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import GradientButton from "~/Button/Button";
import { useRouter } from "next/navigation";
import { Download as DownloadIcon } from "@mui/icons-material";
import { RESUME_TEMPLATE_MAPPING } from "#/lib/constants";
import type { PDFTheme } from "#/lib/types";
import { extractResumeData } from "#/lib/utils/resumeDataExtractor";
import { RESUME_DATA_EN } from "#/lib/data/resumeData";
import dynamic from "next/dynamic";

const DEFAULT_RESUME_TEMPLATE = "indigo" as const;
const mapTemplateToPDFTheme = (): PDFTheme =>
  RESUME_TEMPLATE_MAPPING[DEFAULT_RESUME_TEMPLATE];

const GalaxyCard = dynamic(
  () =>
    import("#/Components/HeavyComponents").then((mod) => ({
      default: mod.GalaxyCard,
    })),
  { ssr: false },
);

const RESUME_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "he", label: "עברית" },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="h6"
      component="h2"
      sx={{
        color: "primary.main",
        fontWeight: 600,
        mb: 2,
        "&:not(:first-of-type)": { mt: 4 },
      }}
    >
      {children}
    </Typography>
  );
}

export default function ResumePage() {
  const t = useTranslations("resume");
  const skillsT = useTranslations("skills");
  const projectsT = useTranslations("projects");
  const router = useRouter();
  const locale = useLocale();

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

  const resumeData = useMemo(
    () => (locale === "en" ? RESUME_DATA_EN : null),
    [locale],
  );

  const headerProfileLinks = useMemo(() => {
    if (!resumeData) {
      return [];
    }

    const linksByLabel = new Map(
      (resumeData.links ?? []).map((link) => [link.label.toLowerCase(), link.url]),
    );

    const portfolio = linksByLabel.get("portfolio") ?? resumeData.person.contacts.portfolio;
    const linkedin = linksByLabel.get("linkedin") ?? resumeData.person.contacts.linkedin;
    const github = linksByLabel.get("github") ?? resumeData.person.contacts.github;

    return [
      { label: "Portfolio", url: portfolio },
      { label: "LinkedIn", url: linkedin },
      { label: "GitHub", url: github },
    ].filter(
      (item): item is { label: string; url: string } =>
        Boolean(item.url && item.url.trim().length > 0),
    );
  }, [resumeData]);

  const handleDownloadResume = async () => {
    try {
      setIsGenerating(true);
      const data = await extractResumeData(selectedLanguage);
      const { renderResumePDF } = await import("#/lib/utils/pdfGenerator");
      const pdf = await renderResumePDF(data, {
        rtl: selectedLanguage === "he",
        theme: mapTemplateToPDFTheme(),
        maxBulletsPerRole: 5,
        maxProjects: 4,
        excludeSections: ["Professional Summary"],
      });
      pdf.save("Omri Jukin - Resume.pdf");
      setSnackbar({
        open: true,
        message:
          t("languageSelector.download") +
          " (" +
          selectedLanguage.toUpperCase() +
          ")",
        severity: "success",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      setSnackbar({
        open: true,
        message: "Error generating resume. Please try again.",
        severity: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // English: render full resume from typed data
  if (resumeData) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", mx: "auto" }}>
        <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: "bold", mb: 1 }}
            >
              {t("title")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t("description")}
            </Typography>
          </Box>
        </MotionWrapper>

        <MotionWrapper variant="slideUp" duration={0.5} delay={0.3}>
          <Card
            sx={{
              mb: 4,
              backgroundColor: "background.paper",
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <FormControl sx={{ minWidth: 180 }} size="medium">
                  <InputLabel id="resume-language-label">
                    {t("languageSelector.title")}
                  </InputLabel>
                  <Select
                    labelId="resume-language-label"
                    value={selectedLanguage}
                    label={t("languageSelector.title")}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {RESUME_LANGUAGES.map(({ code, label }) => (
                      <MenuItem key={code} value={code}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <DownloadIcon />
                    )
                  }
                  onClick={handleDownloadResume}
                  disabled={isGenerating}
                  sx={{
                    px: 3,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {isGenerating
                    ? t("languageSelector.generating")
                    : t("languageSelector.download")}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </MotionWrapper>

        <Box component="article" sx={{ mb: 6 }}>
          {/* Header */}
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.4}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                {resumeData.person.name}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.5, sm: 2 }}
                sx={{ mb: 0.5 }}
              >
                <Typography variant="body2">Phone: {resumeData.person.contacts.phone}</Typography>
                <Typography variant="body2">Email: {resumeData.person.contacts.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {headerProfileLinks.map((profileLink) => {
                  const href = profileLink.url.startsWith("http")
                    ? profileLink.url
                    : `https://${profileLink.url}`;

                  return (
                    <Link
                      key={profileLink.label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                    >
                      {profileLink.label}: {profileLink.url}
                    </Link>
                  );
                })}
              </Stack>
            </Box>
          </MotionWrapper>

          {/* Headline */}
          {resumeData.headline && (
            <MotionWrapper variant="slideUp" duration={0.6} delay={0.5}>
              <Typography
                variant="subtitle1"
                sx={{ color: "primary.main", fontWeight: 600, mb: 2 }}
              >
                {resumeData.headline}
              </Typography>
            </MotionWrapper>
          )}

          {/* Summary */}
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.55}>
            <SectionTitle>Summary</SectionTitle>
            <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
              {resumeData.summary}
            </Typography>
          </MotionWrapper>

          {/* Core Skills */}
          {resumeData.coreSkills && resumeData.coreSkills.length > 0 && (
            <MotionWrapper variant="slideUp" duration={0.6} delay={0.6}>
              <SectionTitle>Core Skills</SectionTitle>
              <Stack spacing={1}>
                {resumeData.coreSkills.map((cat, i) => (
                  <Box key={i}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 0.25 }}>
                      {cat.category}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {cat.items.map((item, j) => (
                        <Chip
                          key={j}
                          label={item}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </MotionWrapper>
          )}

          {/* Professional Experience */}
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.65}>
            <SectionTitle>Professional Experience</SectionTitle>
            <Stack spacing={3}>
              {resumeData.experience.map((exp, i) => (
                <Box key={i}>
                  <Typography variant="subtitle1" fontWeight="600">
                    {exp.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company} | {exp.period}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1 }}>
                    {exp.bullets.map((bullet, j) => (
                      <Typography
                        key={j}
                        component="li"
                        variant="body2"
                        sx={{ mb: 0.5, lineHeight: 1.6 }}
                      >
                        {bullet}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </MotionWrapper>

          {/* Selected Projects */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <MotionWrapper variant="slideUp" duration={0.6} delay={0.7}>
              <SectionTitle>Selected Projects</SectionTitle>
              <Stack spacing={2.25}>
                {resumeData.projects.map((proj, i) => (
                  <Box key={i}>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.25 }}>
                      {proj.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Personal Project
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {proj.line}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 0.5 }}>
                      {proj.bullets?.map((bullet, j) => (
                        <Typography
                          key={j}
                          component="li"
                          variant="body2"
                          sx={{ mb: 0.5, lineHeight: 1.6 }}
                        >
                          {bullet}
                        </Typography>
                      ))}
                    </Box>
                    {proj.url && (
                      <Link
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{ display: "inline-block" }}
                      >
                        {proj.url}
                      </Link>
                    )}
                  </Box>
                ))}
              </Stack>
            </MotionWrapper>
          )}

          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <MotionWrapper variant="slideUp" duration={0.6} delay={0.75}>
              <SectionTitle>Education</SectionTitle>
              <Stack spacing={2}>
                {resumeData.education.map((edu, i) => (
                  <Box key={i}>
                    <Typography variant="subtitle1" fontWeight="600">
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.institution} | {edu.period}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </MotionWrapper>
          )}

          {/* Additional Experience */}
          {resumeData.additionalExperience &&
            resumeData.additionalExperience.length > 0 && (
              <MotionWrapper variant="slideUp" duration={0.6} delay={0.8}>
                <SectionTitle>Additional Experience</SectionTitle>
                <Stack spacing={2}>
                  {resumeData.additionalExperience.map((exp, i) => (
                    <Box key={i}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {exp.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.company} | {exp.period}
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1 }}>
                        {exp.bullets.map((bullet, j) => (
                          <Typography
                            key={j}
                            component="li"
                            variant="body2"
                            sx={{ mb: 0.5, lineHeight: 1.6 }}
                          >
                            {bullet}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </MotionWrapper>
            )}

          {/* Links */}
        </Box>

        <MotionWrapper variant="slideUp" duration={0.8} delay={0.9}>
          <GalaxyCard sx={{ minHeight: "fit-content", height: "fit-content" }}>
            <MotionWrapper variant="slideUp" duration={0.8} delay={1}>
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  background: "transparent",
                  color: "#fff",
                  boxShadow: "0 4px 32px 0 rgba(58,28,113,0.25)",
                  "& > *": { position: "relative", zIndex: 1 },
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

  // Non-English: fallback to legacy layout (skills + projects from translations)
  type TechnicalSkill = {
    name: string;
    level: number;
    technologies: string[];
  };
  type SoftSkill = { name: string; level: number; description: string };
  type Project = { title: string; description: string; link: string };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: "bold", mb: 2 }}
          >
            {t("title")}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ color: "text.secondary", fontWeight: "normal", mb: 3 }}
          >
            {t("description")}
          </Typography>
        </Box>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.5} delay={0.3}>
        <Card
          sx={{
            mb: 6,
            backgroundColor: "background.paper",
            opacity: isGenerating ? 0.7 : 1,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <FormControl sx={{ minWidth: 180 }} size="medium">
                <InputLabel id="resume-language-label">
                  {t("languageSelector.title")}
                </InputLabel>
                <Select
                  labelId="resume-language-label"
                  value={selectedLanguage}
                  label={t("languageSelector.title")}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {RESUME_LANGUAGES.map(({ code, label }) => (
                    <MenuItem key={code} value={code}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  isGenerating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={handleDownloadResume}
                disabled={isGenerating}
                sx={{
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {isGenerating
                  ? t("languageSelector.generating")
                  : t("languageSelector.download")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </MotionWrapper>

      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ color: "primary.main", mb: 4 }}
      >
        {skillsT("title")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 6,
        }}
      >
        <Box sx={{ flex: 1 }}>
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
              <Stack spacing={2}>
                {skillsT
                  .raw("categories.technical.skills")
                  .map((skill: TechnicalSkill, index: number) => (
                    <Box key={index}>
                      <Typography variant="body2" fontWeight="medium">
                        {skill.name}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
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
        </Box>
        <Box sx={{ flex: 1 }}>
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
                    <Box key={index}>
                      <Typography variant="body1" fontWeight="medium">
                        {skill.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skill.description}
                      </Typography>
                    </Box>
                  ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ color: "primary.main", mb: 2 }}
      >
        {projectsT("title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {projectsT("subtitle")}
      </Typography>

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
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                >
                  {project.link}
                </Link>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

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
