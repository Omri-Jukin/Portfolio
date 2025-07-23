// Tag chip variants
export const TAG_VARIANTS = {
  DEFAULT: "default",
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

// Tag chip sizes
export const TAG_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

// Default tag configuration
export const TAG_DEFAULTS = {
  VARIANT: "default",
  SIZE: "medium",
  CLICKABLE: false,
} as const;

// Animation configuration
export const TAG_ANIMATION = {
  HOVER_DURATION: 0.2,
  TRANSITION_EASING: "ease-in-out",
  SCALE_FACTOR: 1.05,
} as const;
