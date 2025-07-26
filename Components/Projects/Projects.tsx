import { useTranslations } from "next-intl";
import { Box, Link } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  ScrollingSectionTitle,
  SectionSubtitle,
} from "../ScrollingSections/ScrollingSections.style";
import {
  ProjectsContainer,
  ProjectsGrid,
  ProjectCard,
  ProjectTitle,
  ProjectDescription,
  ProjectButton,
} from "./Projects.style";
import { PROJECTS_CONSTANTS } from "./Projects.const";
import type { ProjectsProps } from "./Projects.type";

const Projects: React.FC<ProjectsProps> = () => {
  const t = useTranslations("projects");

  return (
    <ProjectsContainer id={PROJECTS_CONSTANTS.SECTION_ID}>
      <MotionWrapper variant="fadeInUp" duration={1.0}>
        <ScrollingSectionTitle>{t("title")}</ScrollingSectionTitle>
        <SectionSubtitle>{t("subtitle")}</SectionSubtitle>
      </MotionWrapper>

      <ProjectsGrid>
        {t
          .raw("projects")
          .map(
            (
              project: { title: string; description: string; link: string },
              index: number
            ) => (
              <MotionWrapper
                variant="fadeInUp"
                duration={PROJECTS_CONSTANTS.ANIMATION.DURATION}
                delay={index * PROJECTS_CONSTANTS.ANIMATION.DELAY_INCREMENT}
                key={project.title}
              >
                <ProjectCard>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <ProjectButton
                        className="outlined"
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                      >
                        {PROJECTS_CONSTANTS.BUTTONS.VIEW_CODE}
                      </ProjectButton>
                    </Link>
                  </Box>
                </ProjectCard>
              </MotionWrapper>
            )
          )}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export default Projects;
