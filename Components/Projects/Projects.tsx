import { useTranslations } from "next-intl";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import {
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  ScrollingSectionTitle,
  SectionSubtitle,
} from "../ScrollingSections/ScrollingSections.style";
import {
  ProjectsContainer,
  ProjectsGrid,
  ProjectCard,
  ProjectMetaLabel,
  ProjectTitle,
  ProjectButton,
} from "./Projects.style";
import { PROJECTS_CONSTANTS } from "./Projects.const";
import type { FeaturedProject } from "./Projects.type";

const Projects: React.FC = () => {
  const t = useTranslations("projects");
  const projects = t.raw("projects") as FeaturedProject[];

  return (
    <ProjectsContainer id={PROJECTS_CONSTANTS.SECTION_ID}>
      <MotionWrapper variant="fadeInUp" duration={0.6}>
        <ScrollingSectionTitle id="projects-title">
          {t("title")}
        </ScrollingSectionTitle>
        <SectionSubtitle id="projects-subtitle">
          {t("subtitle")}
        </SectionSubtitle>
      </MotionWrapper>

      <ProjectsGrid>
        {projects.map((project, index) => (
          <MotionWrapper
            key={project.id}
            variant="fadeInUp"
            duration={0.6}
            delay={0.05 * index}
          >
            <ProjectCard elevation={0}>
              <ProjectTitle variant="h6">{project.title}</ProjectTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {project.summary} · {project.audience}
              </Typography>

              <ProjectMetaLabel>{t("labels.problem")}</ProjectMetaLabel>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                {project.problem}
              </Typography>

              <ProjectMetaLabel>{t("labels.stack")}</ProjectMetaLabel>
              <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 1.5 }}>
                {project.stack.map((tech) => (
                  <Chip key={tech} label={tech} size="small" variant="outlined" />
                ))}
              </Stack>

              <ProjectMetaLabel>{t("labels.architecture")}</ProjectMetaLabel>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                {project.architecture}
              </Typography>

              <ProjectMetaLabel>{t("labels.role")}</ProjectMetaLabel>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                {project.role}
              </Typography>

              <ProjectMetaLabel>{t("labels.proof")}</ProjectMetaLabel>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {project.proof}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: "auto" }}>
                {project.githubUrl && !project.githubUrl.includes("[") && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <ProjectButton
                      className="outlined"
                      variant="outlined"
                      size="small"
                      startIcon={<GitHubIcon />}
                    >
                      {t("viewCode")}
                    </ProjectButton>
                  </Link>
                )}
                {project.liveUrl && !project.liveUrl.includes("[") && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <ProjectButton
                      className="outlined"
                      variant="outlined"
                      size="small"
                      startIcon={<LaunchIcon />}
                    >
                      {t("viewLive")}
                    </ProjectButton>
                  </Link>
                )}
                <Link
                  href={project.caseStudyUrl}
                  style={{ textDecoration: "none" }}
                >
                  <ProjectButton
                    className="contained"
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                  >
                    {t("viewCaseStudy")}
                  </ProjectButton>
                </Link>
              </Box>
            </ProjectCard>
          </MotionWrapper>
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export default Projects;
