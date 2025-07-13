"use client";

import { Container, CardContent, CardActions } from "@mui/material";
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
  ContactPhone as ContactIcon,
  Article as BlogIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";
import { PortfolioSection } from "./HomePage.types";
import {
  StyledPageContainer,
  StyledHeroContainer,
  StyledHeroTitle,
  StyledHeroDescription,
  StyledButtonContainer,
  StyledHeroButton,
  StyledSectionCard,
  StyledGridContainer,
  StyledIconContainer,
  StyledSectionIcon,
  StyledSectionTitle,
  StyledSectionDescription,
  StyledSectionButton,
} from "./HomePage.styles";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  const portfolioSections: PortfolioSection[] = [
    {
      title: t("hero.cards.about.title"),
      description: t("hero.cards.about.description"),
      href: "/about",
      icon: PersonIcon,
      color: "primary",
      untranslatedSection: "about",
    },
    {
      title: t("hero.cards.career.title"),
      description: t("hero.cards.career.description"),
      href: "/career",
      icon: WorkIcon,
      color: "secondary",
      untranslatedSection: "career",
    },
    {
      title: t("hero.cards.resume.title"),
      description: t("hero.cards.resume.description"),
      href: "/resume",
      icon: ResumeIcon,
      color: "success",
      untranslatedSection: "resume",
    },
    {
      title: t("hero.cards.blog.title"),
      description: t("hero.cards.blog.description"),
      href: "/blog",
      icon: BlogIcon,
      color: "info",
      untranslatedSection: "blog",
    },
    {
      title: t("hero.cards.contact.title"),
      description: t("hero.cards.contact.description"),
      href: "/contact",
      icon: ContactIcon,
      color: "warning",
      untranslatedSection: "contact",
    },
  ];
  return (
    <StyledPageContainer>
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <StyledHeroContainer>
          <StyledHeroTitle variant="h2" gutterBottom>
            {t("hero.title")}
          </StyledHeroTitle>

          <StyledHeroDescription variant="h5" color="text.secondary">
            {t("hero.description")}
          </StyledHeroDescription>

          <StyledButtonContainer>
            <StyledHeroButton
              href="/about"
              variant="contained"
              size="large"
              endIcon={<PersonIcon />}
            >
              {t("hero.cards.about.button")}
            </StyledHeroButton>
            <StyledHeroButton
              href="/contact"
              variant="contained"
              size="large"
              endIcon={<ContactIcon />}
            >
              {t("hero.cards.contact.button")}
            </StyledHeroButton>
          </StyledButtonContainer>
        </StyledHeroContainer>

        <StyledGridContainer>
          {portfolioSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <StyledSectionCard key={section.title}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <StyledIconContainer>
                    <StyledSectionIcon sx={{ color: `${section.color}.main` }}>
                      <IconComponent />
                    </StyledSectionIcon>
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

                <CardActions>
                  <StyledSectionButton
                    href={section.href}
                    variant="contained"
                    color={section.color}
                    endIcon={<LaunchIcon />}
                    fullWidth
                  >
                    {t(`hero.cards.${section.untranslatedSection}.button`)}
                  </StyledSectionButton>
                </CardActions>
              </StyledSectionCard>
            );
          })}
        </StyledGridContainer>
      </Container>
    </StyledPageContainer>
  );
}
