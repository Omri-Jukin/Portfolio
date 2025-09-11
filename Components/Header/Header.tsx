"use client";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import DarkModeToggle from "~/DarkModeToggle/DarkModeToggle";
import LanguageSwitcher from "~/LanguageSwitcher/LanguageSwitcher";
import { HeaderProps } from "./Header.type";
import { AppBar, Toolbar } from "./Header.style";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { baseTheme } from "!/theme";
import { useRouter } from "next/navigation";

export default function Header({
  isDarkMode = false,
  onThemeToggle,
  isMobile,
}: HeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleCalendlyClick = () => {
    router.push("/calendly");
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
            <button
              onClick={handleCalendlyClick}
              style={{
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(255, 107, 107, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(255, 107, 107, 0.3)";
              }}
            >
              Let&apos;s Talk!
            </button>
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
