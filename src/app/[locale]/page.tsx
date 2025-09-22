"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import Hero from "~/Hero";
// import About from "~/About";
// import QA from "~/QA";
// import Services from "~/Services";
// import Career from "~/Career";
// import Certifications from "~/Certifications";
// import Projects from "~/Projects";
// import Contact from "~/Contact";
import { SECTION_IDS } from "#/lib";
import { scrollToSection } from "$/utils/scrollToSection";
// import SkillShowcase from "~/SkillShowcase";
// import Testimonials from "~/Testimonials";
import { ResponsiveBackground } from "#/Components/ScrollingSections";
// import LazySection from "~/LazySection";
import profileSrc from "#/public/Watercolor_Profile_Picture.png";

export default function HomePage() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // const t = useTranslations("about");
  const router = useRouter();

  // State for skill showcase modal
  // const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  // const [showSkillModal, setShowSkillModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [locale]);

  if (!mounted) {
    return null;
  }

  // Navigation helpers
  const navigateToPage = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  // Skill showcase handlers
  // const handleSkillClick = (skillKey: string) => {
  //   setSelectedSkill(skillKey);
  //   setShowSkillModal(true);
  // };

  // const handleCloseSkillModal = () => {
  //   setShowSkillModal(false);
  //   setSelectedSkill(null);
  // };

  // // Get skill details for the selected skill
  // const getSkillDetail = () => {
  //   if (!selectedSkill) return null;
  //   try {
  //     return t.raw(`skillDetails.${selectedSkill}`);
  //   } catch {
  //     return null;
  //   }
  // };

  // const skillDetail = getSkillDetail();

  // Event handlers for components
  const handleExploreClick = () => scrollToSection(SECTION_IDS.PROJECTS);
  const handleResumeClick = () => navigateToPage("/resume");
  const handleCareerClick = () => scrollToSection(SECTION_IDS.CAREER);

  // const handleServiceClick = (serviceIndex: number) => {
  //   if (serviceIndex === 0) {
  //     scrollToSection(SECTION_IDS.PROJECTS);
  //   } else if (serviceIndex === 1) {
  //     navigateToPage("/resume");
  //   } else {
  //     scrollToSection(SECTION_IDS.CONTACT);
  //   }
  // };
  const handleContactClick = () => {
    scrollToSection(SECTION_IDS.CONTACT);
  };

  return (
    <ResponsiveBackground>
      <Box
        id="main-content"
        sx={{
          width: "100%",
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Hero
          onExploreClick={handleExploreClick}
          onAboutClick={handleResumeClick}
          onCareerClick={handleCareerClick}
          onContactClick={handleContactClick}
          profileSrc={profileSrc}
        />
      </Box>
    </ResponsiveBackground>
  );
}
