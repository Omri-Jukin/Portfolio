"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Tab,
  Tabs,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import MotionWrapper from "~/MotionWrapper";
import {
  Portfolio,
  FEATURED_PORTFOLIO_PROJECT_IDS,
  FullResumeTab,
  ResumePdfToolbar,
} from "#/Components";
import PublicPageShell from "~/PublicPageShell";
import { RESUME_TEMPLATE_MAPPING } from "#/lib/constants";
import type { PDFTheme } from "#/lib/types";
import { extractResumeData } from "#/lib/utils/resumeDataExtractor";
import { RESUME_DATA_EN } from "#/lib/data/resumeData";

const CASE_STUDIES_TAB_INDEX = 1;

const DEFAULT_RESUME_TEMPLATE = "indigo" as const;
const mapTemplateToPDFTheme = (): PDFTheme =>
  RESUME_TEMPLATE_MAPPING[DEFAULT_RESUME_TEMPLATE];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resume-tabpanel-${index}`}
      aria-labelledby={`resume-tab-${index}`}
    >
      {value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null}
    </div>
  );
}

function scrollToHashTarget(hash: string) {
  if (!hash) {
    return;
  }

  requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

export default function ResumePage() {
  const t = useTranslations("resume");
  const skillsT = useTranslations("skills");
  const projectsT = useTranslations("projects");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState(0);
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

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      return;
    }

    setActiveTab(CASE_STUDIES_TAB_INDEX);
    scrollToHashTarget(hash);
  }, []);

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
        message: `${t("languageSelector.download")} (${selectedLanguage.toUpperCase()})`,
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

  const pdfToolbar = (
    <ResumePdfToolbar
      selectedLanguage={selectedLanguage}
      onLanguageChange={setSelectedLanguage}
      onDownload={handleDownloadResume}
      isGenerating={isGenerating}
      languageLabel={t("languageSelector.title")}
      downloadLabel={t("languageSelector.download")}
      generatingLabel={t("languageSelector.generating")}
    />
  );

  const fullResumeTabContent = resumeData ? (
    <>
      {pdfToolbar}
      <FullResumeTab
        resumeData={resumeData}
        locale={locale}
        headerProfileLinks={headerProfileLinks}
        letsBuildTogether={t("letsBuildTogether")}
        readyToDiscuss={t("readyToDiscuss")}
        getInTouch={t("getInTouch")}
      />
    </>
  ) : (
    <>
      {pdfToolbar}
      <LegacyResumeFallback skillsT={skillsT} projectsT={projectsT} />
    </>
  );

  return (
    <PublicPageShell>
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: "bold", mb: 1 }}
          >
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {t("pageSubtitle")}
          </Typography>
        </Box>
      </MotionWrapper>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        aria-label={t("tabs.label")}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={t("tabs.fullResume")} id="resume-tab-0" />
        <Tab label={t("tabs.caseStudies")} id="resume-tab-1" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        {fullResumeTabContent}
      </TabPanel>

      <TabPanel value={activeTab} index={CASE_STUDIES_TAB_INDEX}>
        <Portfolio
          preferStatic
          expandFromHash
          featuredProjectIds={[...FEATURED_PORTFOLIO_PROJECT_IDS]}
          showHeader={false}
        />
      </TabPanel>

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
    </PublicPageShell>
  );
}

type TechnicalSkill = {
  name: string;
  level: number;
  technologies: string[];
};

type SoftSkill = { name: string; level: number; description: string };
type Project = { title: string; description: string; link: string };

function LegacyResumeFallback({
  skillsT,
  projectsT,
}: {
  skillsT: ReturnType<typeof useTranslations>;
  projectsT: ReturnType<typeof useTranslations>;
}) {
  return (
    <>
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
          <Box sx={{ flex: { xs: "1", md: "1 1 calc(50% - 16px)" } }} key={index}>
            <Card sx={{ height: "100%", backgroundColor: "background.paper" }}>
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
    </>
  );
}
