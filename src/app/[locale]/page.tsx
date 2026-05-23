"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import Hero from "~/Hero";
import Credibility from "~/Credibility";
import Projects from "~/Projects";
import Career from "~/Career";
import EngineeringStrengths from "~/EngineeringStrengths";
import About from "~/About";
import Contact from "~/Contact";
import { ResponsiveBackground } from "#/Components/ScrollingSections";
import profileSrc from "^/Watercolor_Profile_Picture.png";

export default function HomePage() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, [locale]);

  if (!mounted) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    window.location.hash = sectionId;

    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return true;
      }
      return false;
    };

    if (!scrollToElement()) {
      setTimeout(scrollToElement, 100);
    }
  };

  const navigateToPage = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  const handleProjectsClick = () => scrollToSection("projects-section");
  const handleResumeClick = () => navigateToPage("/resume");
  const handleContactClick = () => navigateToPage("/contact");

  return (
    <ResponsiveBackground>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Hero
          onProjectsClick={handleProjectsClick}
          onResumeClick={handleResumeClick}
          onContactClick={handleContactClick}
          profileSrc={profileSrc}
        />

        <Credibility />

        <Projects />

        <Career />

        <EngineeringStrengths />

        <About />

        <Contact locale={locale} onContactClick={handleContactClick} />
      </Box>
    </ResponsiveBackground>
  );
}
