// Portfolio section types
export const SECTION_TYPES = {
  ABOUT: "about",
  PROJECTS: "projects",
  SERVICES: "services",
  CONTACT: "contact",
  BLOG: "blog",
} as const;

// Animation variants
export const ANIMATION_VARIANTS = {
  FADE: "fade",
  SLIDE: "slide",
  SCALE: "scale",
  BOUNCE: "bounce",
} as const;

// Photo size options
export const PHOTO_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

// Photo position options
export const PHOTO_POSITIONS = {
  LEFT: "left",
  RIGHT: "right",
} as const;

// Default section configuration
export const SECTION_DEFAULTS = {
  PHOTO_SIZE: "medium",
  PHOTO_POSITION: "left",
  ANIMATION: "fade",
  TRANSPARENT: false,
  GRADIENT: false,
  GLOW: false,
} as const;
