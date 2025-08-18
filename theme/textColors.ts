import { Theme } from "@mui/material/styles";

/**
 * Centralized text color system with theme mode support
 * This ensures consistent text colors across the entire website
 */
export interface TextColorOptions {
  /** Primary text color - for headings and important content */
  primary: string;
  /** Secondary text color - for supporting content */
  secondary: string;
  /** Tertiary text color - for subtle text and metadata */
  tertiary: string;
  /** Muted text color - for disabled or low-priority content */
  muted: string;
  /** Inverse text color - for text on dark backgrounds */
  inverse: string;
  /** Accent text color - for highlights and call-to-action text */
  accent: string;
  /** Error text color - for error messages */
  error: string;
  /** Success text color - for success messages */
  success: string;
  /** Warning text color - for warning messages */
  warning: string;
  /** Info text color - for informational messages */
  info: string;
}

/**
 * Gets text colors based on theme mode
 * @param theme - MUI theme object
 * @returns TextColorOptions object with all text colors
 */
export const getTextColors = (theme: Theme): TextColorOptions => {
  const isDark = theme.palette.mode === "dark";

  return {
    // Primary text - high contrast, readable
    primary: isDark ? "#FFFFFF" : "#1A1A1A",

    // Secondary text - medium contrast
    secondary: isDark ? "#E0E0E0" : "#424242",

    // Tertiary text - lower contrast
    tertiary: isDark ? "#B0B0B0" : "#757575",

    // Muted text - subtle
    muted: isDark ? "#888888" : "#9E9E9E",

    // Inverse text - for use on opposite backgrounds
    inverse: isDark ? "#1A1A1A" : "#FFFFFF",

    // Accent text - brand colors
    accent: theme.palette.primary.main,

    // Semantic colors
    error: theme.palette.error.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };
};

/**
 * Hook-style function to get text colors (can be used in styled components)
 * @param theme - MUI theme object
 * @param variant - text color variant
 * @returns color string
 */
export const getTextColor = (
  theme: Theme,
  variant: keyof TextColorOptions = "primary"
): string => {
  const colors = getTextColors(theme);
  return colors[variant];
};

/**
 * CSS custom properties for text colors
 * This creates CSS variables that can be used throughout the application
 */
export const createTextColorVariables = (
  theme: Theme
): Record<string, string> => {
  const colors = getTextColors(theme);

  return {
    "--text-primary": colors.primary,
    "--text-secondary": colors.secondary,
    "--text-tertiary": colors.tertiary,
    "--text-muted": colors.muted,
    "--text-inverse": colors.inverse,
    "--text-accent": colors.accent,
    "--text-error": colors.error,
    "--text-success": colors.success,
    "--text-warning": colors.warning,
    "--text-info": colors.info,
  };
};

/**
 * Utility function to apply text color CSS variables to the document root
 * Call this when the theme changes to update CSS variables
 */
export const applyTextColorVariables = (theme: Theme): void => {
  if (typeof document === "undefined") return;

  const variables = createTextColorVariables(theme);
  const root = document.documentElement;

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

/**
 * Legacy compatibility - maps MUI text palette to our centralized system
 * @param theme - MUI theme object
 * @returns object that matches MUI's text palette structure
 */
export const getMUICompatibleTextColors = (theme: Theme) => {
  const colors = getTextColors(theme);

  return {
    primary: colors.primary,
    secondary: colors.secondary,
    disabled: colors.muted,
  };
};

/**
 * Semantic text color variants for common use cases
 */
export const TextColorVariants = {
  // Content hierarchy
  HEADING: "primary" as const,
  BODY: "secondary" as const,
  CAPTION: "tertiary" as const,
  LABEL: "secondary" as const,

  // Interactive elements
  LINK: "accent" as const,
  BUTTON_PRIMARY: "inverse" as const,
  BUTTON_SECONDARY: "primary" as const,

  // Status indicators
  ERROR: "error" as const,
  SUCCESS: "success" as const,
  WARNING: "warning" as const,
  INFO: "info" as const,

  // Special cases
  PLACEHOLDER: "muted" as const,
  DISABLED: "muted" as const,
  OVERLAY: "inverse" as const,
} as const;

export type TextColorVariant = keyof typeof TextColorVariants;
