"use client";

import { Box, Button, Typography } from "@mui/material";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import DarkModeToggle from "~/DarkModeToggle/DarkModeToggle";
import LanguageSwitcher from "~/LanguageSwitcher/LanguageSwitcher";
import { HeaderProps } from "./Header.type";
import { AppBar, Toolbar } from "./Header.style";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { NAVIGATION_ITEMS } from "./Header.const";
import { SECTION_IDS } from "#/lib";

export default function Header({
  isDarkMode = false,
  onThemeToggle,
  isMobile,
  activeSection,
  onNavigateToSection,
}: HeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  const basePath = useMemo(() => `/${locale}`, [locale]);
  const isHomePath = pathname === basePath || pathname === `${basePath}/`;

  const handleLogoClick = () => {
    router.push(basePath);
  };

  const handleCalendlyClick = () => {
    router.push("/calendly");
  };

  const handleNavigation = (
    event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();

    if (href.startsWith("#")) {
      const sectionId = href.slice(1);
      if (isHomePath) {
        onNavigateToSection?.(sectionId);
      } else {
        router.push(`${basePath}${href}`);
      }
      return;
    }

    if (href === "/") {
      router.push(basePath);
      return;
    }

    if (href.startsWith("/")) {
      router.push(`${basePath}${href}`);
      return;
    }

    router.push(href);
  };

  const isNavItemActive = (href: string) => {
    if (href.startsWith("#")) {
      const sectionId = href.slice(1);
      return activeSection === sectionId;
    }

    if (href === "/") {
      return (
        isHomePath && (activeSection === SECTION_IDS.HERO || !activeSection)
      );
    }

    if (href.startsWith("/")) {
      return pathname === `${basePath}${href}`;
    }

    return pathname === href;
  };

  const gradientStyles = {
    background:
      theme.conicGradients?.galaxy ??
      "linear-gradient(135deg, #0B0F14 0%, #7C3AED 50%, #22D3EE 100%)",
  };

  if (!mounted || !isClient) return null;

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      dir="ltr"
      id="navigation"
    >
      <Toolbar>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
          <Typography variant="h6">
            {isMobile ? "Omri Jukin" : "Omri Jukin — Full Stack Developer"}
          </Typography>
        </Box>

        {!isMobile && (
          <Box
            component="nav"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flex: 1,
              mx: 4,
            }}
          >
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = isNavItemActive(item.href);
              const targetHref = item.href.startsWith("#")
                ? item.href
                : item.href === "/"
                ? basePath
                : item.href.startsWith("/")
                ? `${basePath}${item.href}`
                : item.href;

              return (
                <Button
                  key={item.label}
                  component="a"
                  href={targetHref}
                  onClick={(event) => handleNavigation(event, item.href)}
                  aria-current={isActive ? "page" : undefined}
                  sx={{
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    fontWeight: isActive ? 600 : 500,
                    textTransform: "none",
                    position: "relative",
                    transition: "color 0.2s ease",
                    paddingX: 1,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: -6,
                      width: "100%",
                      height: 2,
                      borderRadius: 9999,
                      backgroundColor: theme.palette.primary.main,
                      opacity: isActive ? 1 : 0,
                      transform: `scaleX(${isActive ? 1 : 0.4})`,
                      transition: "opacity 0.2s ease, transform 0.2s ease",
                    },
                    "&:hover": {
                      color: theme.palette.primary.main,
                      "&::after": {
                        opacity: 0.6,
                        transform: "scaleX(1)",
                      },
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        )}

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}
        >
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
                fontWeight: 600,
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
