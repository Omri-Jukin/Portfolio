import { useTranslations } from "next-intl";
import { Box, Link } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
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
        <ScrollingSectionTitle>{t("title")}</ScrollingSectionTitle>
        <SectionSubtitle>{t("subtitle")}</SectionSubtitle>
      </MotionWrapper>

      <MotionWrapper variant="fadeInUp" duration={1.0} delay={0.3}>
        <ProjectsSwiperContainer>
          <Swiper
            modules={[Navigation, Pagination, EffectFade]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              600: {
                slidesPerView: 1,
                spaceBetween: 25,
              },
              900: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1400: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            navigation={{
              enabled: true,
              hideOnClick: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={true}
            centeredSlides={false}
            grabCursor={true}
            effect="slide"
            speed={400}
            style={{
              paddingBottom: "60px", // Space for pagination dots
              width: "100%",
              maxWidth: "100vw",
            }}
            className="projects-swiper"
          >
            {t
              .raw("projects")
              .map(
                (
                  project: { title: string; description: string; link: string },
                  index: number
                ) => (
                  <SwiperSlide key={project.title}>
                    <MotionWrapper
                      variant="fadeInUp"
                      duration={PROJECTS_CONSTANTS.ANIMATION.DURATION}
                      delay={
                        index * PROJECTS_CONSTANTS.ANIMATION.DELAY_INCREMENT
                      }
                    >
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
                    </MotionWrapper>
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
