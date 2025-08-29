// Typography variants
export const TYPOGRAPHY_VARIANTS = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  BODY1: "body1",
  BODY2: "body2",
} as const;

// Typography weights
export const TYPOGRAPHY_WEIGHTS = {
  LIGHT: "light",
  NORMAL: "normal",
  BOLD: "bold",
} as const;

// Typography colors
export const TYPOGRAPHY_COLORS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TEXT_PRIMARY: "textPrimary",
  TEXT_SECONDARY: "textSecondary",
} as const;

// Typography alignments
export const TYPOGRAPHY_ALIGNS = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

// Default typography configuration
export const TYPOGRAPHY_DEFAULTS = {
  VARIANT: "body1",
  WEIGHT: "normal",
  COLOR: "textPrimary",
  ALIGN: "left",
  GUTTER_BOTTOM: false,
} as const;
