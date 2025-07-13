"use client";

import { useState, ReactNode } from "react";
import { Box } from "@mui/material";
import ThemeProvider from "~/ThemeProvider";
import DarkModeToggle from "~/DarkModeToggle";
import LanguageSwitcher from "~/LanguageSwitcher";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 1000,
        }}
      >
        <LanguageSwitcher />
        <DarkModeToggle onToggle={handleThemeToggle} />
      </Box>
      {children}
    </ThemeProvider>
  );
}
