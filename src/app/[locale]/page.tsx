"use client";

import React from "react";
import { Container, CardContent, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  Person as PersonIcon,
  Email as ContactIcon,
  Token as TokenIcon,
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

  const portfolioSections: PortfolioSection[] = [
    {
      title: t("hero.cards.about.title"),
      description: t("hero.cards.about.description"),
      href: "/about",
      color: "primary" as const,
      untranslatedSection: "about",
    },
    {
      title: t("hero.cards.career.title"),
      description: t("hero.cards.career.description"),
      href: "/career",
      color: "secondary" as const,
      untranslatedSection: "career",
    },
    {
      title: t("hero.cards.resume.title"),
      description: t("hero.cards.resume.description"),
      href: "/resume",
      color: "success" as const,
      untranslatedSection: "resume",
    },
    {
      title: t("hero.cards.blog.title"),
      description: t("hero.cards.blog.description"),
      href: "/blog",
      color: "info" as const,
      untranslatedSection: "blog",
    },
    {
      title: t("hero.cards.contact.title"),
      description: t("hero.cards.contact.description"),
      href: "/contact",
      color: "warning" as const,
      untranslatedSection: "contact",
    },
  ];

  return (
    <PageContainer
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
                href="/about"
                variant="contained"
                size="large"
                endIcon={<PersonIcon />}
                aria-label={t("hero.cards.about.button")}
              >
                {t("hero.cards.about.button")}
              </HeroButton>
              <HeroButton
                href="/contact"
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
              key={section.title}
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
                    <SectionTitle variant="h6">{section.title}</SectionTitle>
                  </IconContainer>

                  <SectionDescription variant="body2" color="text.secondary">
                    {section.description}
                  </SectionDescription>
                </CardContent>

                <Box sx={{ p: 3, pt: 0 }}>
                  <CardsButton
                    href={section.href}
                    variant="outlined"
                    size="small"
                    endIcon={
                      <TokenIcon sx={{ color: `${section.color}.main` }} />
                    }
                    aria-label={t(
                      `hero.cards.${section.untranslatedSection}.button`
                    )}
                  >
                    {t(`hero.cards.${section.untranslatedSection}.button`)}
                  </CardsButton>
                </Box>
              </SectionCard>
            </MotionWrapper>
          );
        })}
      </Container>
    </PageContainer>
  );
}
