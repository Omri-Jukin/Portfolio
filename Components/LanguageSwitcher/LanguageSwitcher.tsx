"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { locales } from "#/i18n";
import { Menu } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  StyledLanguageBox,
  StyledLanguageButton,
  StyledLanguageMenuItem,
} from "./LanguageSwitcher.styled";
import { getLanguageName, getTargetPath } from "./LanguageSwitcher.consts";
import { Locale } from "./LanguageSwitcher.types";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isClient, setIsClient] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Prevent hydration mismatch by only running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      handleClose();
      return;
    }

    const targetPath = getTargetPath(newLocale, pathname);
    router.push(targetPath);
    handleClose();
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <StyledLanguageBox>
        <StyledLanguageButton
          size="small"
          startIcon={<LanguageIcon />}
          disabled
        >
          {/* Show a placeholder while loading */}
          ...
        </StyledLanguageButton>
      </StyledLanguageBox>
    );
  }

  return (
    <StyledLanguageBox>
      <StyledLanguageButton
        onClick={handleClick}
        size="small"
        startIcon={<LanguageIcon />}
      >
        {locale}
      </StyledLanguageButton>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {locales.map((loc: Locale) => (
          <StyledLanguageMenuItem
            key={loc}
            selected={loc === locale}
            onClick={() => handleLanguageChange(loc)}
          >
            {getLanguageName(loc)} ({loc.toUpperCase()})
          </StyledLanguageMenuItem>
        ))}
      </Menu>
    </StyledLanguageBox>
  );
}
