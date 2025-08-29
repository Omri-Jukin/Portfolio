// Animation variants
export const ANIMATION_VARIANTS = {
  FADE_IN: "fadeIn",
  FADE_IN_UP: "fadeInUp",
  FADE_IN_DOWN: "fadeInDown",
  FADE_IN_LEFT: "fadeInLeft",
  FADE_IN_RIGHT: "fadeInRight",
  SLIDE_UP: "slideUp",
  SLIDE_DOWN: "slideDown",
  SLIDE_LEFT: "slideLeft",
  SLIDE_RIGHT: "slideRight",
  SCALE: "scale",
  ROTATE: "rotate",
  BOUNCE: "bounce",
  STAGGER: "stagger",
} as const;

// Default animation configuration
export const ANIMATION_DEFAULTS = {
  DURATION: 0.6,
  DELAY: 0,
  ONCE: true,
} as const;

// Animation easing functions
export const EASING_FUNCTIONS = {
  EASE_IN: "ease-in",
  EASE_OUT: "ease-out",
  EASE_IN_OUT: "ease-in-out",
  CUBIC_BEZIER: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const;

// Stagger animation configuration
export const STAGGER_CONFIG = {
  DELAY_CHILDREN: 0.1,
  STAGGER_CHILDREN: 0.1,
} as const;
