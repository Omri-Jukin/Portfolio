import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import AnimatedHeroTitle from "./AnimatedHeroTitle";
import {
  HeroContainer,
  HeroSubtitle,
  HeroButtonsContainer,
  HeroButton,
  HeroTitleContainer,
  ProfilePhotoWrapper,
  ProfilePhotoImg,
} from "./Hero.style";
import { HERO_CONSTANTS } from "./Hero.const";
import type { HeroProps } from "./Hero.type";

const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onAboutClick,
  onCareerClick: onExamplesClick,
  profileSrc = "/profile-photo.jpg",
  ownerName,
}) => {
  const t = useTranslations("hero");

  const alt = ownerName ? `${ownerName} profile photo` : "Profile photo";

  return (
    <HeroContainer aria-labelledby="hero-title">
      <MotionWrapper
        variant="fadeInUp"
        duration={HERO_CONSTANTS.ANIMATION.TITLE_DURATION}
        delay={HERO_CONSTANTS.ANIMATION.TITLE_DELAY}
      >
        <ProfilePhotoWrapper role="img" aria-label={alt}>
          <ProfilePhotoImg src={profileSrc} alt="" />
        </ProfilePhotoWrapper>
        <HeroTitleContainer>
          <AnimatedHeroTitle text={t("titleRow1")} className="hero-title-row" />
          <AnimatedHeroTitle text={t("titleRow2")} className="hero-title-row" />
        </HeroTitleContainer>
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
            className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
            aria-label={HERO_CONSTANTS.ACCESSIBILITY.RESUME_LABEL}
            onClick={onAboutClick}
          >
            {t("resumeButton")}
          </HeroButton>
          <HeroButton
            className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
            aria-label={HERO_CONSTANTS.ACCESSIBILITY.CAREER_LABEL}
            onClick={onExamplesClick}
          >
            {t("careerButton")}
          </HeroButton>
          <HeroButton
            className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
            endIcon={<ArrowForwardIcon />}
            aria-label={HERO_CONSTANTS.ACCESSIBILITY.EXPLORE_LABEL}
            onClick={onExploreClick}
          >
            {t("exploreButton")}
          </HeroButton>
        </HeroButtonsContainer>
      </MotionWrapper>
    </HeroContainer>
  );
};

export default Hero;
