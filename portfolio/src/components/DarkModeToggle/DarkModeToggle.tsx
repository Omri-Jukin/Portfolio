"use client";

import Tooltip from "@mui/material/Tooltip";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { DarkModeToggleProps } from "./DarkModeToggle.type";
import { StyledDarkModeToggle } from "./DarkModeToggle.style";

export default function DarkModeToggle({
  onToggle,
  isDark = false,
}: DarkModeToggleProps) {
  const toggleTheme = () => {
    const newIsDark = !isDark;
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    onToggle?.(newIsDark);
  };

  return (
    <Tooltip
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      id="dark-mode-toggle-tooltip"
    >
      <StyledDarkModeToggle
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        color="inherit"
        onClick={toggleTheme}
        size="small"
        id="dark-mode-toggle-button"
      >
        {isDark ? (
          <Brightness7Icon id="dark-mode-toggle-icon" fontSize="small" />
        ) : (
          <Brightness4Icon id="dark-mode-toggle-icon" fontSize="small" />
        )}
      </StyledDarkModeToggle>
    </Tooltip>
  );
}
