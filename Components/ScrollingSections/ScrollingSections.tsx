import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Code as CodeIcon,
  Star as StarIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import AnimatedText from "~/AnimatedText";
import type { ScrollingSectionsProps } from "./ScrollingSections.type";
import Section from "./Section";
import {
  ScrollingHeroTitle,
  HeroSubtitle,
  CTAButton,
  ScrollingSectionTitle,
  SectionSubtitle,
  SkillTag,
  QACard,
  QAQuestion,
  QAAnswer,
  ServiceCard,
  ServiceIcon,
  ServiceTitle,
  ServiceDescription,
  ServiceButton,
  ProjectCard,
  ProjectTitle,
  ProjectDescription,
  ProjectButton,
  ContactForm,
  ContactInput,
} from "./ScrollingSections.style";

const ScrollingSections: React.FC<ScrollingSectionsProps> = ({
  locale = "en",
}) => {
  const t = useTranslations("scrollingSections");

  return (
    <Box>
      {/* Hero Section */}
      <Section
        variant="hero"
        aria-labelledby="hero-title"
        // backgroundElements={<HeroBackgroundElements />}
      >
        <MotionWrapper variant="fadeInUp" duration={1.2} delay={0.2}>
          <ScrollingHeroTitle id="hero-title">
            <AnimatedText
              type="scaleUp"
              length={t("hero.title").length}
              scale={1.2}
            >
              {t("hero.title")}
            </AnimatedText>
          </ScrollingHeroTitle>
        </MotionWrapper>

        <MotionWrapper variant="fadeInUp" duration={1.0} delay={0.6}>
          <HeroSubtitle>{t("hero.subtitle")}</HeroSubtitle>
        </MotionWrapper>

        <MotionWrapper variant="fadeInUp" duration={0.8} delay={1.0}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <CTAButton
              className="primary"
              endIcon={<ArrowForwardIcon />}
              aria-label="Explore my work and projects"
            >
              {t("hero.exploreButton")}
            </CTAButton>
            <CTAButton className="secondary" aria-label="Learn more about me">
              {t("hero.aboutButton")}
            </CTAButton>
          </Box>
        </MotionWrapper>
      </Section>

      {/* About Section */}
      <Section variant="about" aria-labelledby="about-title">
        <MotionWrapper variant="fadeIn" duration={0.8}>
          <ScrollingSectionTitle id="about-title">
            {t("about.title")}
          </ScrollingSectionTitle>
          <SectionSubtitle>{t("about.subtitle")}</SectionSubtitle>
        </MotionWrapper>

        <MotionWrapper variant="slideUp" duration={0.8} delay={0.2}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {t("about.subtitle")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <SkillTag>{t("about.skills.codeConjurer")}</SkillTag>
              <SkillTag>{t("about.skills.brandArchitect")}</SkillTag>
              <SkillTag>{t("about.skills.designDreamer")}</SkillTag>
            </Box>
          </Box>
        </MotionWrapper>

        <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "800px", margin: "0 auto", lineHeight: 1.8 }}
          >
            {t("about.description")}
          </Typography>
        </MotionWrapper>
      </Section>

      {/* Rapid Q&A Section */}
      <Section variant="qa">
        <MotionWrapper variant="fadeInUp" duration={1.0}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 1,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {t("qa.subtitle")}
          </Typography>
          <ScrollingSectionTitle>{t("qa.title")}</ScrollingSectionTitle>
          <SectionSubtitle>{t("qa.subtitle")}</SectionSubtitle>
        </MotionWrapper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {t
            .raw("qa.questions")
            .map((qa: { question: string; answer: string }, index: number) => (
              <MotionWrapper
                variant="fadeInUp"
                duration={0.8}
                delay={index * 0.15}
                key={qa.question}
              >
                <QACard>
                  <QAQuestion>{qa.question}</QAQuestion>
                  <QAAnswer>{qa.answer}</QAAnswer>
                </QACard>
              </MotionWrapper>
            ))}
        </Box>
      </Section>

      {/* Services Section */}
      <Section variant="services">
        <MotionWrapper variant="fadeInUp" duration={1.0}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 1,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {t("services.subtitle")}
          </Typography>
        </MotionWrapper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
            mt: 6,
          }}
        >
          {t.raw("services.services").map(
            (
              service: {
                title: string;
                description: string;
                buttonText: string;
                buttonVariant: string;
              },
              index: number
            ) => (
              <MotionWrapper
                variant="bounce"
                duration={0.8}
                delay={index * 0.2}
                key={service.title}
              >
                <ServiceCard>
                  <ServiceIcon>
                    {index === 0 ? (
                      <CodeIcon />
                    ) : index === 1 ? (
                      <StarIcon />
                    ) : (
                      <EmailIcon />
                    )}
                  </ServiceIcon>
                  <ServiceTitle>{service.title}</ServiceTitle>
                  <ServiceDescription>{service.description}</ServiceDescription>
                  <ServiceButton
                    className={service.buttonVariant}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                  >
                    {service.buttonText}
                  </ServiceButton>
                </ServiceCard>
              </MotionWrapper>
            )
          )}
        </Box>
      </Section>

      {/* Projects Section */}
      <Section variant="projects">
        <MotionWrapper variant="fadeInUp" duration={1.0}>
          <ScrollingSectionTitle>{t("projects.title")}</ScrollingSectionTitle>
          <SectionSubtitle>{t("projects.subtitle")}</SectionSubtitle>
        </MotionWrapper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 4,
            mt: 6,
          }}
        >
          {t
            .raw("projects.projects")
            .map(
              (
                project: { title: string; description: string; link: string },
                index: number
              ) => (
                <MotionWrapper
                  variant="fadeInUp"
                  duration={0.8}
                  delay={index * 0.3}
                  key={project.title}
                >
                  <ProjectCard>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>
                      {project.description}
                    </ProjectDescription>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <ProjectButton
                          className="outlined"
                          variant="outlined"
                          startIcon={<GitHubIcon />}
                        >
                          View Code
                        </ProjectButton>
                      </Link>
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <ProjectButton
                          className="contained"
                          variant="contained"
                          startIcon={<LaunchIcon />}
                        >
                          Live Demo
                        </ProjectButton>
                      </Link>
                    </Box>
                  </ProjectCard>
                </MotionWrapper>
              )
            )}
        </Box>
      </Section>

      {/* Contact Section */}
      <Section variant="contact">
        <MotionWrapper variant="fadeInUp" duration={1.0}>
          <ScrollingSectionTitle sx={{ mb: 4 }}>
            {t("contact.title")}
          </ScrollingSectionTitle>
          <SectionSubtitle sx={{ mb: 4 }}>
            {t("contact.subtitle")}
          </SectionSubtitle>
        </MotionWrapper>

        <MotionWrapper variant="fadeInUp" duration={0.8} delay={0.4}>
          <ContactForm>
            <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
              {t("contact.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
            >
              {t("contact.description")}
            </Typography>
            <Link
              href={`/${locale}/contact`}
              style={{ textDecoration: "none" }}
            >
              <ContactInput endIcon={<ArrowForwardIcon />}>
                {t("contact.button")}
              </ContactInput>
            </Link>
          </ContactForm>
        </MotionWrapper>
      </Section>
    </Box>
  );
};

export default ScrollingSections;
