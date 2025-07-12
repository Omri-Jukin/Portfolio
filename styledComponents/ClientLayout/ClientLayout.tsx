"use client";

import { useState } from "react";
import ThemeProvider from "~/ThemeProvider";
import DarkModeToggle from "~/DarkModeToggle";
import { ClientLayoutProps } from "./ClientLayout.types";
import { StyledControlsContainer } from "./ClientLayout.styles";

export default function ClientLayout({ children }: ClientLayoutProps) {
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
