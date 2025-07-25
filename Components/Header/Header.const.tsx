// Layout types
export const LAYOUT_TYPES = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
  AUTO: "auto",
} as const;

// Navigation items
export const NAVIGATION_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;

// Header configuration
export const HEADER_CONFIG = {
  HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DURATION: 0.3,
} as const;

// Logo configuration
export const LOGO_CONFIG = {
  ALT_TEXT: "Portfolio Logo",
  DEFAULT_SIZE: 40,
  MOBILE_SIZE: 32,
} as const;

// Theme configuration
export const THEME_CONFIG = {
  STORAGE_KEY: "theme-mode",
  DEFAULT_MODE: "light",
} as const;
