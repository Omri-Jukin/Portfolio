"use client";

import React from "react";
import { Container, CardContent, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  Person as PersonIcon,
  Email as ContactIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
  Article as BlogIcon,
  Token as TokenIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import {
  StyledPageContainer,
  StyledHeroContainer,
  StyledHeroTitle,
  StyledHeroDescription,
  StyledButtonContainer,
  StyledHeroButton,
  StyledSectionCard,
  StyledIconContainer,
  StyledSectionIcon,
  StyledSectionTitle,
  StyledSectionDescription,
} from "~/HomePage/HomePage.style";
import { PortfolioSection } from "~/HomePage";
import { IconButton } from "~/Card";
import { Logo } from "#/public/logo";

export default function HomePage() {
  const t = useTranslations("home");

  // Function to render icons based on section type
  const renderIcon = (sectionType: string) => {
    switch (sectionType) {
      case "about":
        return <PersonIcon />;
      case "career":
        return <WorkIcon />;
      case "resume":
        return <ResumeIcon />;
      case "blog":
        return <BlogIcon />;
      case "contact":
        return <ContactIcon />;
      default:
        return null;
    }
  };

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
    <StyledPageContainer
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <Container
        maxWidth="lg"
        sx={{ pt: 8, pb: 6, position: "relative", zIndex: 1 }}
      >
        <StyledHeroContainer>
          <MotionWrapper variant="fadeIn" duration={0.5} delay={0.2}>
            <StyledHeroTitle variant="h2" gutterBottom>
              {t("hero.title")}
            </StyledHeroTitle>
          </MotionWrapper>

          <MotionWrapper variant="slideUp" duration={0.5} delay={0.4}>
            <StyledHeroDescription variant="h5" color="text.secondary">
              {t("hero.description")}
            </StyledHeroDescription>
          </MotionWrapper>

          <MotionWrapper variant="slideUp" duration={0.5} delay={0.6}>
            <StyledButtonContainer>
              <StyledHeroButton
                href="/about"
                variant="contained"
                size="large"
                endIcon={<PersonIcon />}
                aria-label={t("hero.cards.about.button")}
              >
                {t("hero.cards.about.button")}
              </StyledHeroButton>
              <StyledHeroButton
                href="/contact"
                variant="contained"
                size="large"
                endIcon={<ContactIcon />}
                aria-label={t("hero.cards.contact.button")}
              >
                {t("hero.cards.contact.button")}
              </StyledHeroButton>
            </StyledButtonContainer>
          </MotionWrapper>
        </StyledHeroContainer>

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
              <StyledSectionCard
                sx={{
                  background: "rgba(255,255,255,0.0)",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <StyledIconContainer>
                    <MotionWrapper
                      variant="scale"
                      duration={0.5}
                      delay={index * 0.1}
                    >
                      <StyledSectionIcon
                        sx={{ color: `${section.color}.main` }}
                      >
                        <IconButton>
                          <Logo />
                        </IconButton>
                      </StyledSectionIcon>
                    </MotionWrapper>
                    <StyledSectionTitle variant="h6">
                      {section.title}
                    </StyledSectionTitle>
                  </StyledIconContainer>

                  <StyledSectionDescription
                    variant="body2"
                    color="text.secondary"
                  >
                    {section.description}
                  </StyledSectionDescription>
                </CardContent>

                <Box sx={{ p: 3, pt: 0 }}>
                  <StyledHeroButton
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
                  </StyledHeroButton>
                </Box>
              </StyledSectionCard>
            </MotionWrapper>
          );
        })}
      </Container>
    </StyledPageContainer>
  );
}
