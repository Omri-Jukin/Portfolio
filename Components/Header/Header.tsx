"use client";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import DarkModeToggle from "~/DarkModeToggle/DarkModeToggle";
import LanguageSwitcher from "~/LanguageSwitcher/LanguageSwitcher";
import { Typography } from "~/Typography";
import { usePathname } from "next/navigation";
import { HeaderProps } from "./Header.type";
import AnimationSwitcher from "~/AnimationSwitcher";
import { AppBar, Toolbar } from "./Header.style";
import Image from "next/image";

export default function Header({
  animationType,
  onAnimationTypeChange,
  isDarkMode = false,
  onThemeToggle,
}: HeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Always call hooks at the top level
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  // Theme is now provided by ThemeProvider in ClientLayout

  // Split and filter path segments
  const pathSegments = pathname.split("/").filter(Boolean);
  // Remove the locale segment if present
  const segmentsWithoutLocale = pathSegments.slice(1);
  // Build breadcrumbs, always prefixing with locale if RTL
  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...segmentsWithoutLocale.map((segment, idx) => {
      const href = "/" + [...segmentsWithoutLocale.slice(0, idx + 1)].join("/");
      // Optionally, prettify the label
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, href };
    }),
  ];

  if (!mounted) return null;

  if (!isClient) {
    return null;
  }

  return (
    <AppBar position="fixed" color="transparent" elevation={0} dir="ltr">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
          <Typography variant="h6">Omri's Dev Portfolio and Blog</Typography>
        </Box>
        {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Breadcrumbs>
            {breadcrumbs.map((crumb, idx) =>
              idx < breadcrumbs.length - 1 ? (
                <Link
                  key={crumb.href}
                  href={crumb.href}
                  aria-label={`Go to ${crumb.label}`}
                  sx={{
                    color: "text.primary",
                    textDecoration: "none",
                  }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span key={crumb.href} style={{ color: "inherit" }}>
                  {crumb.label}
                </span>
              )
            )}
          </Breadcrumbs>
        </Box> */}
        {/* Toggles: DarkMode + AnimationSwitcher + Language */}
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
