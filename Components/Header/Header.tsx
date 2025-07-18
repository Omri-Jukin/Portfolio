"use client";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import DarkModeToggle from "~/DarkModeToggle/DarkModeToggle";
import LanguageSwitcher from "~/LanguageSwitcher/LanguageSwitcher";
import { Typography } from "~/Typography";
import { HeaderProps } from "./Header.type";
import AnimationSwitcher from "~/AnimationSwitcher";
import { AppBar, Toolbar } from "./Header.style";
import Image from "next/image";

export default function Header({
  animationType,
  onAnimationTypeChange,
  isDarkMode = false,
  onThemeToggle,
  isMobile,
  forceLayout,
  onLayoutChange,
}: HeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  // Theme is now provided by ThemeProvider in ClientLayout

  if (!mounted) return null;

  if (!isClient) {
    return null;
  }

  return (
    <AppBar position="fixed" color="transparent" elevation={0} dir="ltr">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
          <Typography variant="h6">
            {/* {isMobile ? "Omri Jukin" : "Omri Jukin<FullStack & Rationalist>"} */}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DarkModeToggle onToggle={onThemeToggle} isDark={isDarkMode} />
          <AnimationSwitcher
            animationType={animationType!}
            onChange={onAnimationTypeChange!}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
