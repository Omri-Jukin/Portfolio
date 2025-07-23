// Theme modes
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

// Animation configuration
export const TOGGLE_ANIMATION = {
  DURATION: 0.3,
  EASING: "ease-in-out",
  ROTATION: 180,
} as const;

// Icon configuration
export const ICON_CONFIG = {
  LIGHT: {
    icon: "LightMode",
    tooltip: "Switch to dark mode",
  },
  DARK: {
    icon: "DarkMode",
    tooltip: "Switch to light mode",
  },
} as const;
