"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales, defaultLocale } from "#/i18n";
import { Menu } from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";
import {
  StyledLanguageBox,
  StyledLanguageButton,
  StyledLanguageMenuItem,
} from "./LanguageSwitcher.styles";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("language");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitch = (targetLocale: string) => {
    if (targetLocale !== locale) {
      // Store locale preference in cookie
      Cookies.set("locale", targetLocale, { expires: 365 });

      const segments = pathname.split("/");
      let newPath;

      // Check if current path has a locale segment
      const hasLocaleInPath = locales.includes(
        segments[1] as (typeof locales)[number]
      );

      if (hasLocaleInPath) {
        // Replace with new locale (always keep locale in URL)
        segments[1] = targetLocale;
      } else {
        // Add locale segment (always show locale in URL)
        segments.splice(1, 0, targetLocale);
      }

      newPath = segments.join("/");
      if (!newPath.startsWith("/")) newPath = "/" + newPath;
      newPath = newPath.replace(/\/+/g, "/");

      // Use window.location for immediate navigation
      window.location.href = newPath;
    }
    handleClose();
  };

  return (
    <StyledLanguageBox>
      <StyledLanguageButton
        onClick={handleClick}
        variant="outlined"
        size="small"
      >
        {locale}
      </StyledLanguageButton>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {locales.map((loc: string) => (
          <StyledLanguageMenuItem
            key={loc}
            onClick={() => handleSwitch(loc)}
            selected={loc === locale}
          >
            {t(loc)} ({loc.toUpperCase()})
          </StyledLanguageMenuItem>
        ))}
      </Menu>
    </StyledLanguageBox>
  );
}
