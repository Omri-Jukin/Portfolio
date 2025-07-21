"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import ProfilePhoto from "^/profile-photo.jpg";
import {
  Person as PersonIcon,
  Email as ContactIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import {
  PageContainer,
  HeroContainer,
  HeroTitle,
  HeroDescription,
  ButtonContainer,
  HeroButton,
  PortfolioSection,
} from "~/Common";
import AnimatedText from "~/AnimatedText";
import Card from "~/Card";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // Force re-render when locale changes
  useEffect(() => {
    setMounted(true);
  }, [locale]);

  // Don't render until mounted to prevent hydration mismatches
  if (!mounted) {
    return null;
  }

  const portfolioSections: PortfolioSection[] = [
    {
      title: t("hero.cards.about.title"),
      tagline: "About Me",
      description: t("hero.cards.about.description"),
      href: `/${locale}/about`,
      color: "#1976d2",
      icon: <PersonIcon />,
      buttonText: t("hero.cards.about.button"),
      photoUrl: ProfilePhoto.src,
      photoAlt: "Omri Jukin",
      photoPosition: "left" as const,
      photoSize: "large" as const,
      animation: "bounce" as const,
      transparent: true,
      gradient: true,
      glow: true,
    },
    {
      title: t("hero.cards.career.title"),
      tagline: "Professional Journey",
      description: t("hero.cards.career.description"),
      href: `/${locale}/career`,
      color: "#dc004e",
      icon: <WorkIcon />,
      buttonText: t("hero.cards.career.button"),
      animation: "fade" as const,
      transparent: true,
      gradient: true,
      glow: true,
    },
    {
      title: t("hero.cards.resume.title"),
      tagline: "Skills & Experience",
      description: t("hero.cards.resume.description"),
      href: `/${locale}/resume`,
      color: "#2e7d32",
      icon: <DescriptionIcon />,
      buttonText: t("hero.cards.resume.button"),
      animation: "scale" as const,
      transparent: true,
      gradient: true,
      glow: true,
    },
    {
      title: t("hero.cards.blog.title"),
      tagline: "Thoughts & Insights",
      description: t("hero.cards.blog.description"),
      href: `/${locale}/blog`,
      color: "#0288d1",
      icon: <ArticleIcon />,
      buttonText: t("hero.cards.blog.button"),
      animation: "bounce" as const,
      transparent: true,
      gradient: true,
      glow: true,
    },
    {
      title: t("hero.cards.contact.title"),
      tagline: "Get In Touch",
      description: t("hero.cards.contact.description"),
      href: `/${locale}/contact`,
      color: "#ed6c02",
      icon: <ContactIcon />,
      buttonText: t("hero.cards.contact.button"),
      animation: "fade" as const,
      transparent: true,
      gradient: true,
      glow: true,
    },
  ];

  return (
    <PageContainer
      key={locale} // Force re-render when locale changes
      style={{ position: "relative", minHeight: "100vh", overflow: "visible" }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: 8, pb: 6, position: "relative", zIndex: 1 }}
      >
        <HeroContainer>
          <MotionWrapper variant="fadeIn" duration={0.5} delay={0.2}>
            <HeroTitle variant="h2" gutterBottom>
              <AnimatedText
                type="scaleUp"
                length={t("hero.title").length}
                scale={1.3}
              >
                {t("hero.title")}
              </AnimatedText>
            </HeroTitle>
          </MotionWrapper>

          <MotionWrapper variant="slideUp" duration={0.5} delay={0.4}>
            <HeroDescription variant="h5" color="text.primary">
              {t("hero.description")}
            </HeroDescription>
          </MotionWrapper>

          <MotionWrapper variant="slideUp" duration={0.5} delay={0.6}>
            <ButtonContainer>
              <HeroButton
                href={`/${locale}/about`}
                variant="contained"
                size="large"
                endIcon={<PersonIcon />}
                aria-label={t("hero.cards.about.button")}
              >
                {t("hero.cards.about.button")}
              </HeroButton>
              <HeroButton
                href={`/${locale}/contact`}
                variant="contained"
                size="large"
                endIcon={<ContactIcon />}
                aria-label={t("hero.cards.contact.button")}
              >
                {t("hero.cards.contact.button")}
              </HeroButton>
            </ButtonContainer>
          </MotionWrapper>
        </HeroContainer>

        {portfolioSections.map((section, index: number) => (
          <MotionWrapper
            key={`${section.title}-${locale}`}
            variant="slideUp"
            duration={0.5}
            delay={index * 0.1}
            style={{
              margin: "2vh 0",
            }}
          >
            <Card {...section} />
          </MotionWrapper>
        ))}
      </Container>
    </PageContainer>
  );
}
