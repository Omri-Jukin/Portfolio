"use client";

import Link from "next/link";
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

const portfolioSections: PortfolioSection[] = [
  {
    title: "About",
    description:
      "Learn a little about me, my background, skills, and professional journey",
    href: "/about",
    icon: PersonIcon,
    color: "primary",
  },
  {
    title: "Career",
    description: "Explore my professional experience and career timeline",
    href: "/career",
    icon: WorkIcon,
    color: "secondary",
  },
  {
    title: "Resume",
    description: "View and download my complete resume and qualifications",
    href: "/resume",
    icon: ResumeIcon,
    color: "success",
  },
  {
    title: "Blog",
    description:
      "Read my thoughts on technology, development, and industry insights",
    href: "/blog",
    icon: BlogIcon,
    color: "info",
  },
  {
    title: "Contact",
    description: "Get in touch for opportunities, collaborations, or questions",
    href: "/contact",
    icon: ContactIcon,
    color: "warning",
  },
];

export default function HomePage() {
  return (
    <StyledPageContainer>
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <StyledHeroContainer>
          <StyledHeroTitle variant="h2" gutterBottom>
            Welcome to My Portfolio
          </StyledHeroTitle>

          <StyledHeroDescription variant="h5" color="text.secondary">
            I'm a passionate developer who loves creating amazing web
            experiences.
          </StyledHeroDescription>

          <StyledButtonContainer>
            <StyledHeroButton
              href="/about"
              variant="contained"
              size="large"
              startIcon={<PersonIcon />}
            >
              About
            </StyledHeroButton>
            <StyledHeroButton
              href="/contact"
              variant="outlined"
              size="large"
              startIcon={<ContactIcon />}
            >
              Contact
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
                    Visit {section.title}
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
