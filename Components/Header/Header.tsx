"use client";
import { Box, Breadcrumbs, Link } from "@mui/material";
import { useState, useEffect } from "react";
import DarkModeToggle from "#/Components/DarkModeToggle/DarkModeToggle";
import LanguageSwitcher from "#/Components/LanguageSwitcher/LanguageSwitcher";
import { usePathname } from "next/navigation";
import { HeaderProps } from "./Header.type";
import AnimationSwitcher from "#/Components/AnimationSwitcher";
import { AppBar, Toolbar } from "./Header.style";

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
    <AppBar position="static" color="transparent" elevation={0} dir="ltr">
      <Toolbar>
        {/* Navigation: Back + Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        </Box>
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
