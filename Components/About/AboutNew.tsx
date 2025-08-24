import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { CircularProgress, Box } from "@mui/material";
import {
  AboutContainer,
  AboutTitle,
  AboutSubtitle,
  AboutDescription,
  SkillsContainer,
  SkillsSwiperContainer,
  SkillTag,
} from "./About.style";
import { ABOUT_CONSTANTS } from "./About.const";
import type { AboutProps } from "./About.type";
import { CTA1Button } from "../Button/Button.style";
import { useRouter } from "next/navigation";
import { Typography } from "../Typography";
import { api } from "$/trpc/client";

const About: React.FC<AboutProps> = ({ onSkillClick }) => {
  const t = useTranslations("about");
  const router = useRouter();

  // Fetch skills from database
  const {
    data: skills = [],
    isLoading,
    error,
  } = api.skills.getAll.useQuery({
    visibleOnly: true,
  });

  // Static fallback skills
  const staticSkills = [
    {
      key: ABOUT_CONSTANTS.SKILLS.CODE_CONJURER,
      icon: "🧙‍♂️",
      label: "Code Conjurer",
      description: "Transforming complex requirements into elegant solutions",
    },
    {
      key: ABOUT_CONSTANTS.SKILLS.BRAND_ARCHITECT,
      icon: "🏗️",
      label: "Innovation Architect",
      description:
        "Building scalable systems that push technological boundaries",
    },
    {
      key: ABOUT_CONSTANTS.SKILLS.DESIGN_DREAMER,
      icon: "📖",
      label: "Digital Storyteller",
      description:
        "Crafting compelling user experiences through intuitive design",
    },
    {
      key: ABOUT_CONSTANTS.SKILLS.CODE_CONJURER,
      icon: "🔧",
      label: "Problem Solver",
      description:
        "Turning challenges into opportunities for growth and learning",
    },
    {
      key: ABOUT_CONSTANTS.SKILLS.TEAM_PLAYER,
      icon: "🤝",
      label: "Team Player",
      description:
        "Collaborating effectively to achieve shared goals and vision",
    },
  ];

  const handleContactClick = () => {
    router.push("/contact");
  };

  // Transform database skills to match static format
  const transformedSkills =
    skills.length > 0
      ? skills.slice(0, 8).map((skill) => ({
          key: skill.id,
          icon: skill.icon || "⚡",
          label: skill.name,
          description:
            skill.description ||
            `${skill.category} skill with ${skill.yearsOfExperience} years experience`,
        }))
      : staticSkills;

  if (error) {
    console.error("Error loading skills:", error);
  }

  return (
    <AboutContainer id={ABOUT_CONSTANTS.SECTION_ID}>
      {/* Header */}
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <AboutTitle variant="h1">{t("title")}</AboutTitle>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
        <AboutSubtitle variant="h5">{t("subtitle")}</AboutSubtitle>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.8} delay={0.6}>
        <AboutDescription variant="body1">{t("description")}</AboutDescription>
      </MotionWrapper>

      {/* Skills Showcase */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.8}>
        <SkillsContainer>
          <Typography
            variant="h3"
            component="h2"
            sx={{ mb: 4, textAlign: "center" }}
          >
            {t("skillsTitle")}
          </Typography>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <SkillsSwiperContainer>
              <Swiper
                modules={[Navigation, Pagination, EffectFade]}
                spaceBetween={20}
                centeredSlides={true}
                slidesPerView={1}
                breakpoints={{
                  480: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                  },
                  900: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  1200: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                  },
                  1400: {
                    slidesPerView: 5,
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
                grabCursor={true}
                speed={600}
                style={{
                  paddingBottom: "60px", // Space for pagination dots
                }}
              >
                {transformedSkills.map((skill, index) => (
                  <SwiperSlide key={skill.key}>
                    <MotionWrapper
                      variant="slideUp"
                      duration={0.6}
                      delay={index * 0.2}
                    >
                      <SkillTag
                        label={
                          <div style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontSize: "2rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {skill.icon}
                            </div>
                            <div
                              style={{
                                fontWeight: "bold",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {skill.label}
                            </div>
                            <div
                              style={{
                                fontSize: "0.9rem",
                                opacity: 0.8,
                                lineHeight: 1.4,
                              }}
                            >
                              {skill.description}
                            </div>
                          </div>
                        }
                        onClick={() => onSkillClick?.(skill.key)}
                        variant="outlined"
                        sx={{
                          height: "100%",
                          minHeight: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      />
                    </MotionWrapper>
                  </SwiperSlide>
                ))}
              </Swiper>
            </SkillsSwiperContainer>
          )}
        </SkillsContainer>
      </MotionWrapper>

      {/* Call to Action */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.0}>
        <CTA1Button
          onClick={handleContactClick}
          sx={{
            mt: 4,
            px: 4,
            py: 2,
            fontSize: "1.1rem",
            borderRadius: "50px",
            textTransform: "none",
            fontWeight: "600",
          }}
        >
          {t("ctaButton")}
        </CTA1Button>
      </MotionWrapper>
    </AboutContainer>
  );
};

export default About;
