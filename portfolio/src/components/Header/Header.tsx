"use client";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { HeaderProps } from "./Header.type";
import { AppBar, Toolbar } from "./Header.style";
import Image from "next/image";
import { PopupButton } from "react-calendly";
import { useTheme } from "@mui/material/styles";
import { baseTheme } from "@/theme";

export default function Header({
  isDarkMode = false,
  onThemeToggle,
  isMobile,
}: HeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const gradientStyles = {
    background: baseTheme.conicGradients.galaxy,
  };

  if (!mounted || !isClient) return null;

  return (
    <AppBar position="fixed" color="transparent" elevation={0} dir="ltr">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            onClick={handleLogoClick}
          />
          <Typography variant="h6">
            {isMobile ? "Omri Jukin" : "Omri Jukin — Full Stack Developer"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isClient && !isMobile && (
            <PopupButton
              url="https://calendly.com/omrijukin/30min"
              pageSettings={{
                backgroundColor: theme.palette.calendly.background,
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: theme.palette.calendly.primary.replace("#", ""),
                textColor: theme.palette.text.primary.replace("#", ""),
                hideGdprBanner: true,
              }}
              rootElement={document.getElementById("root") || document.body}
              text="Let's Talk!"
              styles={{
                background: gradientStyles.background,
                color: theme.palette.calendly.contrastText,
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
                transform: "translateY(0)",
                textTransform: "none",
              }}
              prefill={{
                name: "",
                email: "",
                firstName: "",
                lastName: "",
              }}
            />
          )}
          <DarkModeToggle onToggle={onThemeToggle} isDark={isDarkMode} />
          {/* <AnimationSwitcher
            animationType={animationType!}
            onChange={onAnimationTypeChange!}
          /> */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
