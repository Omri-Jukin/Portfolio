import {
  THEME_MODES as CENTRALIZED_THEME_MODES,
  ANIMATION_DURATIONS,
  ANIMATION_EASING,
  ACCESSIBILITY_LABELS,
} from "#/lib";

// Re-export centralized theme modes
export const THEME_MODES = CENTRALIZED_THEME_MODES;

// Animation configuration using centralized values
export const TOGGLE_ANIMATION = {
  DURATION: ANIMATION_DURATIONS.FAST,
  EASING: ANIMATION_EASING.EASE_IN_OUT,
  ROTATION: 180,
} as const;

// Icon configuration with accessibility labels
export const ICON_CONFIG = {
  LIGHT: {
    icon: "LightMode",
    tooltip: ACCESSIBILITY_LABELS.TOGGLE_DARK_MODE,
  },
  DARK: {
    icon: "DarkMode",
    tooltip: ACCESSIBILITY_LABELS.TOGGLE_LIGHT_MODE,
  },
} as const;
