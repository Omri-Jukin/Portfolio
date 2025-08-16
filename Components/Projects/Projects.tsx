import { useTranslations } from "next-intl";
import { Box, Link } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
  SwiperContainer,
  SwiperSlideContainer,
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
          <SwiperContainer
            id="projects-swiper-container"
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={3}
            centeredSlides={true}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true,
              },
              600: {
                slidesPerView: 1,
                spaceBetween: 25,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 30,
                centeredSlides: true,
              },
              900: {
                slidesPerView: 2,
                spaceBetween: 40,
                centeredSlides: true,
              },
              1200: {
                slidesPerView: 2,
                spaceBetween: 50,
                centeredSlides: true,
              },
              1400: {
                slidesPerView: 3,
                spaceBetween: 60,
                centeredSlides: true,
              },
              1600: {
                slidesPerView: 3,
                spaceBetween: 70,
                centeredSlides: true,
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
            grabCursor={true}
            effect="slide"
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
                (
                  project: { title: string; description: string; link: string },
                  index: number
                ) => (
                  <SwiperSlideContainer key={project.title}>
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
                  </SwiperSlideContainer>
                )
              )}
          </SwiperContainer>
        </ProjectsSwiperContainer>
      </MotionWrapper>
    </ProjectsContainer>
  );
};

export default Projects;
