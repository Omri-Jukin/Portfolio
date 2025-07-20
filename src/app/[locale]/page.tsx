"use client";

import React, { useEffect, useState } from "react";
import { Container, CardContent, Box } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import {
  Person as PersonIcon,
  Email as ContactIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import {
  PageContainer,
  HeroContainer,
  HeroTitle,
  HeroDescription,
  ButtonContainer,
  HeroButton,
  SectionCard,
  IconContainer,
  SectionIcon,
  SectionTitle,
  SectionDescription,
  CardsButton,
} from "~/Common";
import AnimatedText from "~/AnimatedText";
import { PortfolioSection } from "~/Common";
import { IconButton } from "~/Card";
import { Logo } from "^/logo";

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
      description: t("hero.cards.about.description"),
      href: `/${locale}/about`,
      color: "primary" as const,
      untranslatedSection: "about",
    },
    {
      title: t("hero.cards.career.title"),
      description: t("hero.cards.career.description"),
      href: `/${locale}/career`,
      color: "secondary" as const,
      untranslatedSection: "career",
    },
    {
      title: t("hero.cards.resume.title"),
      description: t("hero.cards.resume.description"),
      href: `/${locale}/resume`,
      color: "success" as const,
      untranslatedSection: "resume",
    },
    {
      title: t("hero.cards.blog.title"),
      description: t("hero.cards.blog.description"),
      href: `/${locale}/blog`,
      color: "info" as const,
      untranslatedSection: "blog",
    },
    {
      title: t("hero.cards.contact.title"),
      description: t("hero.cards.contact.description"),
      href: `/${locale}/contact`,
      color: "warning" as const,
      untranslatedSection: "contact",
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
            <HeroTitle
              variant="h2"
              gutterBottom
              onClick={() => {
                console.log("Clicked title:", t("hero.title"));
              }}
            >
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

        {portfolioSections.map((section, index: number) => {
          return (
            <MotionWrapper
              key={`${section.title}-${locale}`} // Include locale in key
              variant="slideUp"
              duration={0.5}
              delay={index * 0.1}
              style={{
                margin: "2vh 0",
              }}
            >
              <SectionCard
                sx={{
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <IconContainer>
                    <MotionWrapper
                      variant="scale"
                      duration={0.5}
                      delay={index * 0.1}
                    >
                      <SectionIcon sx={{ color: `${section.color}.main` }}>
                        <IconButton>
                          <Logo />
                        </IconButton>
                      </SectionIcon>
                    </MotionWrapper>
                  </IconContainer>
                  <SectionTitle
                    variant="h5"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                  >
                    {section.title}
                  </SectionTitle>
                  <SectionDescription
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: "center", mb: 2 }}
                  >
                    {section.description}
                  </SectionDescription>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <CardsButton
                      href={section.href}
                      variant="contained"
                      color={section.color}
                      sx={{ borderRadius: 1 }}
                    >
                      {t(`hero.cards.${section.untranslatedSection}.button`)}
                    </CardsButton>
                  </Box>
                </CardContent>
              </SectionCard>
            </MotionWrapper>
          );
        })}
      </Container>
    </PageContainer>
  );
}
