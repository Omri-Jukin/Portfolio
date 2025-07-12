"use client";

import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { DarkModeToggleProps } from "./DarkModeToggle.types";
import { StyledDarkModeToggle } from "./DarkModeToggle.styles";

export default function DarkModeToggle({ onToggle }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
    onToggle?.(shouldBeDark);
  }, [onToggle]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    onToggle?.(newIsDark);
  };

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <StyledDarkModeToggle
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
        color="inherit"
      >
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </StyledDarkModeToggle>
    </Tooltip>
  );
}
