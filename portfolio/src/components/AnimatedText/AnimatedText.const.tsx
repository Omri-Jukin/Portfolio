// Color palette for animated text
export const COLOR_PALETTE = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Purple
  "#FF8A65", // Orange
  "#81C784", // Light Green
  "#64B5F6", // Light Blue
  "#FFB74D", // Amber
  "#F06292", // Pink
  "#9575CD", // Deep Purple
] as const;

// Font size options
export const FONT_SIZES = [
  "1rem",
  "2rem",
  "3rem",
  "4rem",
  "5rem",
  "6rem",
  "7rem",
  "8rem",
  "9rem",
  "10rem",
] as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: 0.3,
  TRANSITION_EASING: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  LETTER_SPACING_RATIO: 0.05, // 5% of font size
  RESPONSIVE_BREAKPOINTS: {
    LARGE: 1200,
    MEDIUM: 768,
    SMALL: 480,
  },
  RESPONSIVE_SCALES: {
    LARGE: 0.8,
    MEDIUM: 0.6,
    SMALL: 0.45,
  },
} as const;
