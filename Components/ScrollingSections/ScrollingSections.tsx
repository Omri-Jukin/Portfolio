import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
import SkillShowcase from "../SkillShowcase";
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
  const router = useRouter();

  // State for skill showcase modal
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Navigation functions
  const scrollToSection = (sectionId: string) => {
    // Update URL hash for better UX and accessibility
    window.location.hash = sectionId;

    // Ensure smooth scrolling to the section with retry logic
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return true;
      }
      return false;
    };

    // Try immediately, then retry after a short delay if needed
    if (!scrollToElement()) {
      setTimeout(scrollToElement, 100);
    }
  };

  const navigateToPage = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  // Skill showcase handlers
  const handleSkillClick = (skillKey: string) => {
    setSelectedSkill(skillKey);
    setShowSkillModal(true);
  };

  const handleCloseSkillModal = () => {
    setShowSkillModal(false);
    setSelectedSkill(null);
  };

  // Get skill details for the selected skill
  const getSkillDetail = () => {
    if (!selectedSkill) return null;
    try {
      return t.raw(`about.skillDetails.${selectedSkill}`);
    } catch {
      return null;
    }
  };

  const skillDetail = getSkillDetail();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "16px", md: "20px 40px" },
        }}
        aria-labelledby="hero-title"
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
              onClick={() => scrollToSection("projects-section")}
            >
              {t("hero.exploreButton")}
            </CTAButton>
            <CTAButton
              className="secondary"
              aria-label="Learn more about me"
              onClick={() => scrollToSection("about-section")}
            >
              {t("hero.aboutButton")}
            </CTAButton>
          </Box>
        </MotionWrapper>
      </Box>

      {/* About Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "16px", md: "20px 40px" },
        }}
        aria-labelledby="about-title"
        id="about-section"
      >
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
              <SkillTag onClick={() => handleSkillClick("codeConjurer")}>
                {t("about.skills.codeConjurer")}
              </SkillTag>
              <SkillTag onClick={() => handleSkillClick("brandArchitect")}>
                {t("about.skills.brandArchitect")}
              </SkillTag>
              <SkillTag onClick={() => handleSkillClick("designDreamer")}>
                {t("about.skills.designDreamer")}
              </SkillTag>
            </Box>
          </Box>
        </MotionWrapper>

        <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: 1.8,
              textAlign: "center",
              fontSize: "1.1rem",
            }}
          >
            {t("about.description")}
          </Typography>
        </MotionWrapper>
      </Box>

      {/* Rapid Q&A Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "16px", md: "20px 40px" },
        }}
      >
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
            maxWidth: "1200px", // Limit maximum width
            width: "100%", // Take full width up to maxWidth
            margin: "0 auto", // Center the grid
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
      </Box>

      {/* Services Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "16px", md: "20px 40px" },
        }}
      >
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
            maxWidth: "1200px", // Limit maximum width
            width: "100%", // Take full width up to maxWidth
            margin: "0 auto", // Center the grid
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
                    onClick={() => {
                      if (index === 0) {
                        scrollToSection("projects-section");
                      } else if (index === 1) {
                        navigateToPage("/resume");
                      } else {
                        scrollToSection("contact-section");
                      }
                    }}
                  >
                    {service.buttonText}
                  </ServiceButton>
                </ServiceCard>
              </MotionWrapper>
            )
          )}
        </Box>
      </Box>

      {/* Projects Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "16px", md: "20px 40px" },
        }}
        id="projects-section"
      >
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
            maxWidth: "1200px", // Limit maximum width
            width: "100%", // Take full width up to maxWidth
            margin: "0 auto", // Center the grid
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
                      <ProjectButton
                        className="contained"
                        variant="contained"
                        startIcon={<LaunchIcon />}
                        onClick={() => {
                          // For now, show a placeholder message
                          // In the future, this could link to actual demo URLs
                          alert(`Demo for ${project.title} - Coming soon!`);
                        }}
                      >
                        Live Demo
                      </ProjectButton>
                    </Box>
                  </ProjectCard>
                </MotionWrapper>
              )
            )}
        </Box>
      </Box>

      {/* Contact Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "16px", md: "20px 40px" },
        }}
        id="contact-section"
      >
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
      </Box>

      {/* Skill Showcase Modal */}
      {showSkillModal && skillDetail && (
        <SkillShowcase
          skillDetail={skillDetail}
          open={showSkillModal}
          onClose={handleCloseSkillModal}
        />
      )}
    </Box>
  );
};

export default ScrollingSections;
