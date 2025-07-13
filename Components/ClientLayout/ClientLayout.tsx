"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ThemeProvider from "#/Components/ThemeProvider";
import DarkModeToggle from "#/Components/DarkModeToggle";
import { ClientLayoutProps } from "./ClientLayout.types";
import { StyledControlsContainer } from "./ClientLayout.styled";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    // Reset and refresh AOS when theme changes
    setTimeout(() => {
      // Remove all AOS classes to reset animation states
      document.querySelectorAll("[data-aos]").forEach((el) => {
        el.classList.remove("aos-init", "aos-animate");
      });

      // Reinitialize AOS to detect elements again
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });

      // Refresh AOS to trigger animations
      AOS.refresh();
    }, 100);
  };

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <StyledControlsContainer>
        <DarkModeToggle onToggle={handleThemeToggle} />
        <LanguageSwitcher />
      </StyledControlsContainer>
      {children}
    </ThemeProvider>
  );
}
