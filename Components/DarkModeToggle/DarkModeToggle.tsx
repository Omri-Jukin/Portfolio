"use client";

import Tooltip from "@mui/material/Tooltip";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { DarkModeToggleProps } from "./DarkModeToggle.types";
import { StyledDarkModeToggle } from "./DarkModeToggle.styled";

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
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <StyledDarkModeToggle
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        color="inherit"
        onClick={toggleTheme}
        size="small"
      >
        {isDark ? (
          <Brightness7Icon fontSize="small" />
        ) : (
          <Brightness4Icon fontSize="small" />
        )}
      </StyledDarkModeToggle>
    </Tooltip>
  );
}
