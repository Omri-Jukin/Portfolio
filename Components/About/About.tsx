import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
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

const About: React.FC<AboutProps> = ({ onSkillClick }) => {
  const t = useTranslations("about");
  const router = useRouter();

  const skills = [
    {
      key: ABOUT_CONSTANTS.SKILLS.CODE_CONJURER,
      label: t("skills.codeConjurer"),
      description: t("skillDetails.codeConjurer.description"),
      icon: "💻",
    },
    {
      key: ABOUT_CONSTANTS.SKILLS.BRAND_ARCHITECT,
      label: t("skills.brandArchitect"),
      description: t("skillDetails.brandArchitect.description"),
      icon: "🏗️",
    },
    {
      key: ABOUT_CONSTANTS.SKILLS.DESIGN_DREAMER,
      label: t("skills.designDreamer"),
      description: t("skillDetails.designDreamer.description"),
      icon: "🎨",
    },
  ];

  return (
    <AboutContainer
      aria-labelledby="about-title"
      id={ABOUT_CONSTANTS.SECTION_ID}
    >
      <MotionWrapper
        variant="fadeIn"
        duration={ABOUT_CONSTANTS.ANIMATION.TITLE_DURATION}
      >
        <AboutTitle id="about-title">{t("title")}</AboutTitle>
        <AboutSubtitle>{t("subtitle")}</AboutSubtitle>
      </MotionWrapper>

      <MotionWrapper
        variant="slideUp"
        duration={ABOUT_CONSTANTS.ANIMATION.SKILLS_DURATION}
        delay={ABOUT_CONSTANTS.ANIMATION.SKILLS_DELAY}
      >
        <SkillsContainer>
          <SkillsSwiperContainer>
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                600: {
                  slidesPerView: 1,
                  spaceBetween: 25,
                },
                900: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1200: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1400: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
              }}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              centeredSlides={false}
              grabCursor={true}
              effect="slide"
              speed={400}
              style={{
                paddingBottom: "60px", // Space for pagination dots
              }}
            >
              {skills.map((skill, index) => (
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
                            style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
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
        </SkillsContainer>
      </MotionWrapper>

      <MotionWrapper
        variant="slideUp"
        duration={ABOUT_CONSTANTS.ANIMATION.DESCRIPTION_DURATION}
        delay={ABOUT_CONSTANTS.ANIMATION.DESCRIPTION_DELAY}
      >
        <AboutDescription>{t("description")}</AboutDescription>
      </MotionWrapper>

      <MotionWrapper
        style={{ marginTop: "20px" }}
        variant="slideUp"
        duration={ABOUT_CONSTANTS.ANIMATION.DESCRIPTION_DURATION}
        delay={ABOUT_CONSTANTS.ANIMATION.DESCRIPTION_DELAY}
      >
        <CTA1Button onClick={() => router.push("/resume")}>
          <Typography variant="body1">{t("cta")}</Typography>
        </CTA1Button>
      </MotionWrapper>
    </AboutContainer>
  );
};

export default About;
