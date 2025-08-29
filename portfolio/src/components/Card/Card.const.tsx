// Card animation variants
export const CARD_ANIMATIONS = {
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

// Default card configuration
export const CARD_DEFAULTS = {
  PHOTO_SIZE: "medium",
  PHOTO_POSITION: "left",
  ANIMATION: "fade",
  GRADIENT: false,
  GLOW: false,
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  FADE: 0.3,
  SLIDE: 0.4,
  SCALE: 0.3,
  BOUNCE: 0.6,
} as const;
