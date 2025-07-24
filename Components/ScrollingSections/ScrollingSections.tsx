import React, { useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import SkillShowcase from "../SkillShowcase";
import Hero from "../Hero";
import About from "../About";
import QA from "../QA";
import Services from "../Services";
import Projects from "../Projects";
import Contact from "../Contact";
import type { ScrollingSectionsProps } from "./ScrollingSections.type";

const ScrollingSections: React.FC<ScrollingSectionsProps> = ({
  locale = "en",
}) => {
  const t = useTranslations("about");
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
      return t.raw(`skillDetails.${selectedSkill}`);
    } catch {
      return null;
    }
  };

  const skillDetail = getSkillDetail();

  // Event handlers for components
  const handleExploreClick = () => scrollToSection("projects-section");
  const handleAboutClick = () => scrollToSection("about-section");
  const handleServiceClick = (serviceIndex: number) => {
    if (serviceIndex === 0) {
      scrollToSection("projects-section");
    } else if (serviceIndex === 1) {
      navigateToPage("/resume");
    } else {
      scrollToSection("contact-section");
    }
  };
  const handleContactClick = () => {
    // Additional contact logic if needed
  };

  return (
    <Box>
      {/* Hero Section */}
      <Hero
        onExploreClick={handleExploreClick}
        onAboutClick={handleAboutClick}
      />

      {/* About Section */}
      <About onSkillClick={handleSkillClick} />

      {/* Rapid Q&A Section */}
      <QA />

      {/* Services Section */}
      <Services onServiceClick={handleServiceClick} />

      {/* Projects Section */}
      <Projects />

      {/* Contact Section */}
      <Contact locale={locale} onContactClick={handleContactClick} />

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
