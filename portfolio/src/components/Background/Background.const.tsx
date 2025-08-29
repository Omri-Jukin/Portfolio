export const BACKGROUND_VARIANTS = {
  FLOATING: "floating",
  PARTICLES: "particles",
  WAVES: "waves",
  GEOMETRIC: "geometric",
  COSMIC: "cosmic",
} as const;

export const INTENSITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const SPEED_LEVELS = {
  SLOW: "slow",
  NORMAL: "normal",
  FAST: "fast",
} as const;

export const COLOR_THEMES = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  ACCENT: "accent",
  CUSTOM: "custom",
} as const;

export const FLOATING_SHAPES = [
  "circle",
  "square",
  "triangle",
  "diamond",
  "star",
  "hexagon",
] as const;

export const GEOMETRIC_PATTERNS = [
  "grid",
  "dots",
  "lines",
  "circles",
  "triangles",
  "hexagons",
] as const;

export const WAVE_PATTERNS = [
  "sine",
  "cosine",
  "triangle",
  "square",
  "sawtooth",
] as const;
