"use client";

import { useState } from "react";
import ThemeProvider from "~/ThemeProvider";
import DarkModeToggle from "~/DarkModeToggle";
import { SimpleClientLayoutProps } from "./SimpleClientLayout.types";
import { StyledControlsContainer } from "./SimpleClientLayout.styles";

export default function SimpleClientLayout({
  children,
}: SimpleClientLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <StyledControlsContainer>
        <DarkModeToggle onToggle={handleThemeToggle} />
      </StyledControlsContainer>
      {children}
    </ThemeProvider>
  );
}
