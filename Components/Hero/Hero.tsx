import Image, { StaticImageData } from "next/image";
import {
  ArrowForward as ArrowForwardIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { Chip, Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { PROFILE_LINKS } from "$/constants";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  HeroContainer,
  HeroGrid,
  HeroContent,
  HeroProfileColumn,
  HeroProfileFrame,
  HeroSubtitle,
  HeroHeadline,
  HeroButtonsContainer,
  HeroButton,
  HeroTitle,
  HeroRoleLine,
  HeroStackStrip,
} from "./Hero.style";
import { HERO_CONSTANTS } from "./Hero.const";
import type { HeroProps } from "./Hero.type";

const Hero: React.FC<HeroProps> = ({
  onProjectsClick,
  onResumeClick,
  onContactClick,
  profileSrc,
  ownerName,
}) => {
  const t = useTranslations("hero");
  const stack = t.raw("stack") as string[];

  const alt = ownerName ? `${ownerName} profile photo` : t("profileAlt");

  return (
    <HeroContainer id={HERO_CONSTANTS.SECTION_ID} aria-labelledby="hero-title">
      <HeroGrid>
        {profileSrc && (
          <HeroProfileColumn>
            <MotionWrapper
              variant="fadeInUp"
              duration={HERO_CONSTANTS.ANIMATION.TITLE_DURATION}
              delay={HERO_CONSTANTS.ANIMATION.TITLE_DELAY}
            >
              <HeroProfileFrame>
                <Image
                  src={profileSrc as StaticImageData}
                  alt={alt}
                  fill
                  sizes="(max-width: 900px) 200px, 240px"
                  priority
                  style={{ objectFit: "cover" }}
                />
              </HeroProfileFrame>
            </MotionWrapper>
          </HeroProfileColumn>
        )}

        <HeroContent>
          <MotionWrapper
            variant="fadeInUp"
            duration={HERO_CONSTANTS.ANIMATION.TITLE_DURATION}
            delay={HERO_CONSTANTS.ANIMATION.TITLE_DELAY}
          >
            <HeroTitle id="hero-title">{t("name")}</HeroTitle>
            <HeroRoleLine>{t("roleLine")}</HeroRoleLine>
          </MotionWrapper>

          <MotionWrapper
            variant="fadeInUp"
            duration={HERO_CONSTANTS.ANIMATION.SUBTITLE_DURATION}
            delay={HERO_CONSTANTS.ANIMATION.SUBTITLE_DELAY}
          >
            <HeroHeadline>{t("headline")}</HeroHeadline>
            <HeroSubtitle>{t("subtitle")}</HeroSubtitle>
            <HeroStackStrip>
              {stack.map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" />
              ))}
            </HeroStackStrip>
          </MotionWrapper>

          <MotionWrapper
            variant="fadeInUp"
            duration={HERO_CONSTANTS.ANIMATION.BUTTONS_DURATION}
            delay={HERO_CONSTANTS.ANIMATION.BUTTONS_DELAY}
          >
            <HeroButtonsContainer>
              <HeroButton
                className={HERO_CONSTANTS.BUTTONS.PRIMARY_CLASS}
                aria-label={HERO_CONSTANTS.ACCESSIBILITY.RESUME_LABEL}
                onClick={onResumeClick}
              >
                {t("resumeButton")}
              </HeroButton>
              <HeroButton
                className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
                aria-label={HERO_CONSTANTS.ACCESSIBILITY.PROJECTS_LABEL}
                onClick={onProjectsClick}
              >
                {t("projectsButton")}
              </HeroButton>
              <HeroButton
                className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
                endIcon={<ArrowForwardIcon />}
                aria-label={HERO_CONSTANTS.ACCESSIBILITY.CONTACT_LABEL}
                onClick={onContactClick}
              >
                {t("contactButton")}
              </HeroButton>
              <Link
                href={PROFILE_LINKS.GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                aria-label={t("githubLabel")}
              >
                <HeroButton
                  className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
                  startIcon={<GitHubIcon />}
                >
                  {t("githubLabel")}
                </HeroButton>
              </Link>
              <Link
                href={PROFILE_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                aria-label={t("linkedinLabel")}
              >
                <HeroButton
                  className={HERO_CONSTANTS.BUTTONS.SECONDARY_CLASS}
                  startIcon={<LinkedInIcon />}
                >
                  {t("linkedinLabel")}
                </HeroButton>
              </Link>
            </HeroButtonsContainer>
          </MotionWrapper>
        </HeroContent>
      </HeroGrid>
    </HeroContainer>
  );
};

export default Hero;
