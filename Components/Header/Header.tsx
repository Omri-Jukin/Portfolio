"use client";
import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DarkModeToggle from "~/DarkModeToggle/DarkModeToggle";
import LanguageSwitcher from "~/LanguageSwitcher/LanguageSwitcher";
import { HeaderProps } from "./Header.type";
import { AppBar, Toolbar } from "./Header.style";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { HOMEPAGE_NAV_ITEMS, PROFILE_LINKS } from "$/constants";

export default function Header({
  isDarkMode = false,
  onThemeToggle,
  isMobile,
}: HeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("common");

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    window.location.href = `/${locale}`;
  };

  const handleResumeClick = () => {
    router.push(`/${locale}/resume`);
  };

  const handleSectionClick = (sectionId: string) => {
    const isHome = window.location.pathname === `/${locale}` || window.location.pathname === `/${locale}/`;
    if (isHome) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(`/${locale}/#${sectionId}`);
  };

  if (!mounted || !isClient) return null;

  return (
    <AppBar position="fixed" color="transparent" elevation={0} dir="ltr">
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
          <Typography variant="h6" sx={{ fontSize: { xs: "0.95rem", md: "1rem" }, fontWeight: 700 }}>
            {isMobile ? "Omri Jukin" : "Omri Jukin — Fullstack Engineer"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
          {!isMobile &&
            HOMEPAGE_NAV_ITEMS.map((item) => (
              <Link
                key={item.sectionId}
                component="button"
                underline="hover"
                color="text.secondary"
                onClick={() => handleSectionClick(item.sectionId)}
                sx={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  font: "inherit",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {t(item.labelKey)}
              </Link>
            ))}

          <Button
            variant="contained"
            size="small"
            onClick={handleResumeClick}
            sx={{ textTransform: "none", fontWeight: 600, display: { xs: "none", sm: "inline-flex" } }}
          >
            {t("resume")}
          </Button>

          {!isMobile && (
            <>
              <IconButton
                component="a"
                href={PROFILE_LINKS.GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                size="small"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href={PROFILE_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                size="small"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </>
          )}

          <DarkModeToggle onToggle={onThemeToggle} isDark={isDarkMode} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
