import { useTranslations } from "next-intl";
import { Box, Link } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCube } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import {
  ScrollingSectionTitle,
  SectionSubtitle,
} from "../ScrollingSections/ScrollingSections.style";
import {
  ProjectsContainer,
  ProjectsSwiperContainer,
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
        <ScrollingSectionTitle id="projects-title">
          {t("title")}
        </ScrollingSectionTitle>
        <SectionSubtitle id="projects-subtitle">
          {t("subtitle")}
        </SectionSubtitle>
      </MotionWrapper>

      <MotionWrapper variant="fadeInUp" duration={1.0} delay={0.3}>
        <ProjectsSwiperContainer id="projects-swiper">
          <Swiper
            id="projects-swiper-container"
            modules={[Navigation, Pagination, EffectCube]}
            slidesPerView={1}
            navigation={{
              enabled: true,
              hideOnClick: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={true}
            grabCursor={true}
            effect="cube"
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            speed={600}
            style={{
              paddingBottom: "60px", // Space for pagination dots
              width: "100%",
              maxWidth: "100%",
            }}
            className="projects-swiper"
          >
            {t
              .raw("projects")
              .map(
                (project: {
                  title: string;
                  description: string;
                  link: string;
                }) => (
                  <SwiperSlide key={project.title}>
                    <ProjectCard>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectDescription>
                        {project.description}
                      </ProjectDescription>
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
                  </SwiperSlide>
                )
              )}
          </Swiper>
        </ProjectsSwiperContainer>
      </MotionWrapper>
    </ProjectsContainer>
  );
};

export default Projects;
