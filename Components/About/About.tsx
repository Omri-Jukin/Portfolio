import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  AboutContainer,
  AboutTitle,
  AboutSubtitle,
  AboutDescription,
} from "./About.style";
import { ABOUT_CONSTANTS } from "./About.const";
import type { AboutProps } from "./About.type";
import { CTA1Button } from "../Button/Button.style";

const About: React.FC<AboutProps> = () => {
  const t = useTranslations("about");
  const router = useRouter();

  const handleResumeClick = () => {
    router.push("/resume");
  };

  return (
    <AboutContainer id={ABOUT_CONSTANTS.SECTION_ID}>
      <MotionWrapper variant="fadeIn" duration={0.6} delay={0.1}>
        <AboutTitle variant="h2">{t("title")}</AboutTitle>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.6} delay={0.2}>
        <AboutSubtitle variant="h5">{t("subtitle")}</AboutSubtitle>
        <AboutDescription variant="body1">{t("description")}</AboutDescription>
      </MotionWrapper>

      <MotionWrapper variant="slideUp" duration={0.6} delay={0.3}>
        <CTA1Button
          onClick={handleResumeClick}
          sx={{
            mt: 1.5,
            px: 3,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {t("ctaButton")}
        </CTA1Button>
      </MotionWrapper>
    </AboutContainer>
  );
};

export default About;
