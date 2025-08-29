// Animation types for switching
export const ANIMATION_TYPES = {
  TORUS_KNOT: "torusKnot",
  DNA: "dna",
  STARS: "stars",
  POLYHEDRON: "polyhedron",
} as const;

// Animation switching order
export const ANIMATION_ORDER = [
  ANIMATION_TYPES.TORUS_KNOT,
  ANIMATION_TYPES.DNA,
  ANIMATION_TYPES.STARS,
  ANIMATION_TYPES.POLYHEDRON,
] as const;

// Tooltip messages for each animation
export const ANIMATION_TOOLTIPS = {
  [ANIMATION_TYPES.TORUS_KNOT]: "Switch to DNA helix",
  [ANIMATION_TYPES.DNA]: "Switch to stars",
  [ANIMATION_TYPES.STARS]: "Switch to polyhedron",
  [ANIMATION_TYPES.POLYHEDRON]: "Switch to torus knot",
} as const;

// Button configuration
export const BUTTON_CONFIG = {
  SIZE: "small",
  ARIA_LABEL: "Switch animation background",
  ICON_SIZE: "small",
} as const;
