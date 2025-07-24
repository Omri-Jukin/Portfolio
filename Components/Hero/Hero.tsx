import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import AnimatedText from "../AnimatedText/AnimatedText";
import {
  HeroContainer,
  HeroTitle,
  HeroSubtitle,
  HeroButtonsContainer,
  HeroButton,
} from "./Hero.style";
import { HERO_CONSTANTS } from "./Hero.const";
import type { HeroProps } from "./Hero.type";

const Hero: React.FC<HeroProps> = ({ onExploreClick, onAboutClick }) => {
  const t = useTranslations("hero");

  return (
    <HeroContainer aria-labelledby="hero-title">
      <MotionWrapper
        variant="fadeInUp"
        duration={HERO_CONSTANTS.ANIMATION.TITLE_DURATION}
        delay={HERO_CONSTANTS.ANIMATION.TITLE_DELAY}
      >
        <HeroTitle id="hero-title">
          <AnimatedText type="scaleUp" length={t("title").length} scale={1.2}>
            {t("title")}
          </AnimatedText>
        </HeroTitle>
      </MotionWrapper>

      <MotionWrapper
        variant="fadeInUp"
        duration={HERO_CONSTANTS.ANIMATION.SUBTITLE_DURATION}
        delay={HERO_CONSTANTS.ANIMATION.SUBTITLE_DELAY}
      >
        <HeroSubtitle>{t("subtitle")}</HeroSubtitle>
      </MotionWrapper>

      <MotionWrapper
        variant="fadeInUp"
        duration={HERO_CONSTANTS.ANIMATION.BUTTONS_DURATION}
        delay={HERO_CONSTANTS.ANIMATION.BUTTONS_DELAY}
      >
        <HeroButtonsContainer>
          <HeroButton
            className={HERO_CONSTANTS.BUTTONS.PRIMARY_CLASS}
            endIcon={<ArrowForwardIcon />}
            aria-label={HERO_CONSTANTS.ACCESSIBILITY.EXPLORE_LABEL}
            onClick={onExploreClick}
          >
            {t("exploreButton")}
          </HeroButton>
          <HeroButton
            className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
            aria-label={HERO_CONSTANTS.ACCESSIBILITY.ABOUT_LABEL}
            onClick={onAboutClick}
          >
            {t("aboutButton")}
          </HeroButton>
        </HeroButtonsContainer>
      </MotionWrapper>
    </HeroContainer>
  );
};

export default Hero;
