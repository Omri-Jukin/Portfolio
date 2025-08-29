// Layout types
export const LAYOUT_TYPES = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
  AUTO: "auto",
} as const;

// Responsive breakpoints
export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

// Theme configuration
export const THEME_CONFIG = {
  STORAGE_KEY: "theme-mode",
  DEFAULT_MODE: "light",
  ANIMATION_DURATION: 0.3,
} as const;

// Layout configuration
export const LAYOUT_CONFIG = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 240,
  MOBILE_SIDEBAR_WIDTH: 280,
} as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: 0.3,
  EASING: "ease-in-out",
} as const;
