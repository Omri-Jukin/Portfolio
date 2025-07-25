import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  AboutContainer,
  AboutTitle,
  AboutSubtitle,
  AboutDescription,
  SkillsContainer,
  SkillsTagsContainer,
  SkillTag,
} from "./About.style";
import { ABOUT_CONSTANTS } from "./About.const";
import type { AboutProps } from "./About.type";
import { CTA1Button } from "../Button/Button.style";
import { useRouter } from "next/navigation";
import Typography from "../Typography";

const About: React.FC<AboutProps> = ({ onSkillClick }) => {
  const t = useTranslations("about");
  const router = useRouter();

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
          <SkillsTagsContainer>
            <SkillTag
              label={t("skills.codeConjurer")}
              onClick={() =>
                onSkillClick?.(ABOUT_CONSTANTS.SKILLS.CODE_CONJURER)
              }
              variant="outlined"
            />
            <SkillTag
              label={t("skills.brandArchitect")}
              onClick={() =>
                onSkillClick?.(ABOUT_CONSTANTS.SKILLS.BRAND_ARCHITECT)
              }
              variant="outlined"
            />
            <SkillTag
              label={t("skills.designDreamer")}
              onClick={() =>
                onSkillClick?.(ABOUT_CONSTANTS.SKILLS.DESIGN_DREAMER)
              }
              variant="outlined"
            />
          </SkillsTagsContainer>
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
