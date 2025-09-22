import { Theme, ThemeOptions, createTheme } from "@mui/material/styles";
import { applyTextColorVariables, getTextColors } from "./textColors";

const SPACING_UNIT = 4;

const BREAKPOINT_VALUES = {
  xs: 0,
  sm: 600,
  md: 900,
  ml: 1100,
  lg: 1280,
  xl: 1600,
  xxl: 1920,
  xxxl: 2560,
  xxxxl: 3840,
};

const ACCENT_CYAN = "#22D3EE";
const ACCENT_CYAN_STRONG = "#06B6D4";
const VIOLET = "#7C3AED";
const BG_DARK = "#0B0F14";
const SURFACE_DARK = "#111722";
const TEXT_PRIMARY_DARK = "#E6EDF3";
const TEXT_SECONDARY_DARK = "#A8B2C1";
const DIVIDER_DARK = "#223041";

const BG_LIGHT = "#F5F7FA";
const SURFACE_LIGHT = "#FFFFFF";
const TEXT_PRIMARY_LIGHT = "#0B0F14";
const TEXT_SECONDARY_LIGHT = "#3B4A5B";
const DIVIDER_LIGHT = "#CBD5E1";

const darkPalette = {
  background: {
    default: BG_DARK,
    paper: SURFACE_DARK,
  },
  primary: {
    main: ACCENT_CYAN,
    light: "#38E8FF",
    dark: ACCENT_CYAN_STRONG,
    contrastText: "#061015",
  },
  secondary: {
    main: VIOLET,
    light: "#A855F7",
    dark: "#5B21B6",
    contrastText: "#F3F4FF",
  },
  success: {
    main: "#22C55E",
    light: "#34D399",
    dark: "#15803D",
  },
  warning: {
    main: "#F59E0B",
    light: "#FBBF24",
    dark: "#B45309",
  },
  error: {
    main: "#EF4444",
    light: "#F87171",
    dark: "#B91C1C",
  },
  info: {
    main: "#60A5FA",
    light: "#93C5FD",
    dark: "#2563EB",
  },
  text: {
    primary: TEXT_PRIMARY_DARK,
    secondary: TEXT_SECONDARY_DARK,
    disabled: "#556072",
  },
  divider: DIVIDER_DARK,
  calendly: {
    primary: ACCENT_CYAN,
    secondary: ACCENT_CYAN_STRONG,
    accent: VIOLET,
    contrastText: "#061015",
    background: BG_DARK,
  },
  warm: {
    primary: "#F97316",
    secondary: "#F59E0B",
    accent: "#EF4444",
    contrastText: "#0B0F14",
  },
  cool: {
    primary: "#0EA5C4",
    secondary: ACCENT_CYAN,
    accent: "#38E8FF",
    contrastText: "#061015",
  },
  neutral: {
    primary: "#1F2933",
    secondary: "#304154",
    accent: "#3E4C61",
    contrastText: TEXT_PRIMARY_DARK,
  },
  dark: {
    primary: "#05080D",
    secondary: BG_DARK,
    accent: SURFACE_DARK,
    contrastText: TEXT_PRIMARY_DARK,
  },
  whatsapp: {
    primary: "#22C55E",
    secondary: "#16A34A",
    accent: "#15803D",
    contrastText: TEXT_PRIMARY_DARK,
  },
  telegram: {
    primary: "#60A5FA",
    secondary: "#38BDF8",
    accent: "#0EA5E9",
    contrastText: TEXT_PRIMARY_DARK,
  },
  linkedin: {
    primary: "#0A66C2",
    secondary: "#1473D1",
    accent: "#1E86E5",
    contrastText: "#F8FAFC",
  },
  github: {
    primary: "#0D1117",
    secondary: "#161B22",
    accent: "#30363D",
    contrastText: "#F8FAFC",
  },
  email: {
    primary: "#2563EB",
    secondary: "#1D4ED8",
    accent: "#1E40AF",
    contrastText: "#F8FAFC",
  },
  phone: {
    primary: ACCENT_CYAN,
    secondary: ACCENT_CYAN_STRONG,
    accent: "#0891B2",
    contrastText: "#061015",
  },
};

const lightPalette = {
  background: {
    default: BG_LIGHT,
    paper: SURFACE_LIGHT,
  },
  primary: {
    main: "#0EA5E9",
    light: "#38BDF8",
    dark: "#0284C7",
    contrastText: "#F8FAFC",
  },
  secondary: {
    main: VIOLET,
    light: "#A855F7",
    dark: "#5B21B6",
    contrastText: "#F8FAFC",
  },
  success: {
    main: "#16A34A",
    light: "#22C55E",
    dark: "#15803D",
  },
  warning: {
    main: "#F97316",
    light: "#FB923C",
    dark: "#C2410C",
  },
  error: {
    main: "#DC2626",
    light: "#F87171",
    dark: "#991B1B",
  },
  info: {
    main: "#0EA5E9",
    light: "#38BDF8",
    dark: "#0369A1",
  },
  text: {
    primary: TEXT_PRIMARY_LIGHT,
    secondary: TEXT_SECONDARY_LIGHT,
    disabled: "#94A3B8",
  },
  divider: DIVIDER_LIGHT,
  calendly: {
    primary: "#0EA5E9",
    secondary: "#38BDF8",
    accent: VIOLET,
    contrastText: "#F8FAFC",
    background: SURFACE_LIGHT,
  },
  warm: {
    primary: "#F97316",
    secondary: "#F59E0B",
    accent: "#EF4444",
    contrastText: "#0B0F14",
  },
  cool: {
    primary: "#0EA5E9",
    secondary: ACCENT_CYAN,
    accent: "#38BDF8",
    contrastText: "#0B0F14",
  },
  neutral: {
    primary: "#E2E8F0",
    secondary: "#CBD5E1",
    accent: "#94A3B8",
    contrastText: "#0B0F14",
  },
  dark: {
    primary: "#0F172A",
    secondary: "#1E293B",
    accent: "#334155",
    contrastText: "#F8FAFC",
  },
  whatsapp: {
    primary: "#16A34A",
    secondary: "#15803D",
    accent: "#22C55E",
    contrastText: "#F8FAFC",
  },
  telegram: {
    primary: "#0284C7",
    secondary: "#0369A1",
    accent: "#0EA5E9",
    contrastText: "#F8FAFC",
  },
  linkedin: {
    primary: "#0A66C2",
    secondary: "#1473D1",
    accent: "#1E86E5",
    contrastText: "#F8FAFC",
  },
  github: {
    primary: "#0F172A",
    secondary: "#1E293B",
    accent: "#334155",
    contrastText: "#F8FAFC",
  },
  email: {
    primary: "#1D4ED8",
    secondary: "#1E40AF",
    accent: "#312E81",
    contrastText: "#F8FAFC",
  },
  phone: {
    primary: "#0EA5E9",
    secondary: ACCENT_CYAN,
    accent: "#38BDF8",
    contrastText: "#0B0F14",
  },
};

const TYPOGRAPHY: ThemeOptions["typography"] = {
  fontFamily:
    'var(--font-inter), "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont',
  h1: {
    fontFamily:
      "var(--font-anton), var(--font-inter), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    fontSize: "clamp(2.75rem, 6vw, 3.5rem)",
    lineHeight: 1.1,
  },
  h2: {
    fontFamily:
      "var(--font-anton), var(--font-inter), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    fontSize: "clamp(2rem, 4vw, 2.5rem)",
    lineHeight: 1.15,
  },
  h3: {
    fontFamily:
      "var(--font-anton), var(--font-inter), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    lineHeight: 1.2,
  },
  button: {
    textTransform: "none",
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.6,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.4,
  },
};

const animations = {
  bobbing: "0.75s ease-in-out infinite alternate",
  rotating: "20s linear infinite",
  hover: "0.2s ease-in-out",
  shadow: "0.3s ease-in-out",
};

const gradients = {
  phone: "linear-gradient(135deg, #22D3EE 0%, #7C3AED 100%)",
  email: "linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)",
  github: "linear-gradient(135deg, #0D1117 0%, #30363D 100%)",
  linkedin: "linear-gradient(135deg, #0A66C2 0%, #60A5FA 100%)",
  whatsapp: "linear-gradient(135deg, #22C55E 0%, #15803D 100%)",
  telegram: "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)",
  warm: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  coolWarm: "linear-gradient(135deg, #22D3EE 0%, #7C3AED 50%, #EF4444 100%)",
  cool: "linear-gradient(135deg, #0EA5C4 0%, #22D3EE 100%)",
  neutral: "linear-gradient(135deg, #1F2933 0%, #304154 100%)",
  dark: "linear-gradient(135deg, #05080D 0%, #111722 100%)",
  sunset: "linear-gradient(135deg, #F97316 0%, #7C3AED 100%)",
  ocean: "linear-gradient(135deg, #0EA5C4 0%, #60A5FA 100%)",
  forest: "linear-gradient(135deg, #0E9F6E 0%, #22C55E 100%)",
  galaxy: "linear-gradient(135deg, #0B0F14 0%, #7C3AED 50%, #22D3EE 100%)",
  aurora: "linear-gradient(135deg, #22D3EE 0%, #0EA5C4 50%, #7C3AED 100%)",
  fire: "linear-gradient(135deg, #EF4444 0%, #F97316 50%, #F59E0B 100%)",
  spring: "linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)",
} as const;

const conicGradients = {
  phone:
    "conic-gradient(from 140deg at 50% 50%, #22D3EE 0%, #7C3AED 50%, #22D3EE 100%)",
  email:
    "conic-gradient(from 140deg at 50% 50%, #7C3AED 0%, #22D3EE 60%, #7C3AED 100%)",
  github:
    "conic-gradient(from 140deg at 50% 50%, #0D1117 0%, #30363D 60%, #0D1117 100%)",
  linkedin:
    "conic-gradient(from 140deg at 50% 50%, #0A66C2 0%, #60A5FA 65%, #0A66C2 100%)",
  whatsapp:
    "conic-gradient(from 140deg at 50% 50%, #22C55E 0%, #15803D 65%, #22C55E 100%)",
  telegram:
    "conic-gradient(from 140deg at 50% 50%, #38BDF8 0%, #0EA5E9 65%, #38BDF8 100%)",
  warm: "conic-gradient(from 140deg at 50% 50%, #F97316 0%, #F59E0B 50%, #EF4444 100%)",
  coolWarm:
    "conic-gradient(from 140deg at 50% 50%, #22D3EE 0%, #7C3AED 40%, #EF4444 100%)",
  cool: "conic-gradient(from 140deg at 50% 50%, #0EA5C4 0%, #22D3EE 60%, #0EA5C4 100%)",
  neutral:
    "conic-gradient(from 140deg at 50% 50%, #1F2933 0%, #304154 65%, #1F2933 100%)",
  dark: "conic-gradient(from 140deg at 50% 50%, #05080D 0%, #111722 65%, #05080D 100%)",
  sunset:
    "conic-gradient(from 140deg at 50% 50%, #F97316 0%, #7C3AED 60%, #F97316 100%)",
  ocean:
    "conic-gradient(from 140deg at 50% 50%, #0EA5C4 0%, #60A5FA 65%, #0EA5C4 100%)",
  forest:
    "conic-gradient(from 140deg at 50% 50%, #0E9F6E 0%, #22C55E 65%, #0E9F6E 100%)",
  galaxy:
    "conic-gradient(from 140deg at 50% 50%, #0B0F14 0%, #7C3AED 60%, #22D3EE 100%)",
  aurora:
    "conic-gradient(from 140deg at 50% 50%, #22D3EE 0%, #0EA5C4 55%, #7C3AED 100%)",
  fire: "conic-gradient(from 140deg at 50% 50%, #EF4444 0%, #F97316 60%, #F59E0B 100%)",
  spring:
    "conic-gradient(from 140deg at 50% 50%, #7C3AED 0%, #22D3EE 65%, #7C3AED 100%)",
} as const;

const extractColorsFromGradient = (gradient: string): string[] => {
  const colorRegex = /#[0-9A-Fa-f]{3,8}/g;
  return gradient.match(colorRegex) ?? [];
};

const createColoredBoxShadows = (gradientsMap: Record<string, string>) => {
  return Object.values(gradientsMap).map((gradient) => {
    const colors = extractColorsFromGradient(gradient);
    const primary = colors[0] ?? "#000000";
    const secondary = colors[1] ?? primary;
    const accent = colors[2] ?? secondary;

    return {
      none: "none",
      light: `0 1px 2px ${primary}33, 0 1px 1px ${secondary}22`,
      medium: `0 2px 5px ${primary}40, 0 1px 3px ${secondary}33`,
      heavy: `0 4px 12px ${primary}55, 0 2px 6px ${accent}44`,
    };
  });
};

const createComponentOverrides = (
  palette: typeof darkPalette
): ThemeOptions["components"] => {
  const accent = palette.primary?.main ?? ACCENT_CYAN;
  const divider = palette.divider ?? DIVIDER_DARK;
  const focusOutline = `${accent}40`;

  return {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.2s ease-in-out",
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            backgroundColor: ACCENT_CYAN_STRONG,
            boxShadow: `0 0 0 3px ${focusOutline}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${divider}`,
          backgroundColor: palette.background?.paper ?? SURFACE_DARK,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: accent,
          textUnderlineOffset: "3px",
          transition: "color 0.2s ease, text-shadow 0.2s ease",
          "&:hover": {
            textDecoration: "underline",
            textShadow: `0 0 8px ${focusOutline}`,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: divider,
        },
        root: {
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: accent,
            boxShadow: `0 0 0 3px ${focusOutline}`,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background?.default ?? BG_DARK,
          color: palette.text?.primary ?? TEXT_PRIMARY_DARK,
        },
      },
    },
  };
};

const createPalette = (mode: "light" | "dark") =>
  mode === "dark" ? darkPalette : lightPalette;

export const createPortfolioTheme = (
  mode: "light" | "dark" = "dark",
  direction: "ltr" | "rtl" = "ltr"
): Theme => {
  const palette = createPalette(mode);
  const theme = createTheme({
    direction,
    spacing: (factor: number) => factor * SPACING_UNIT,
    breakpoints: {
      values: BREAKPOINT_VALUES,
    },
    palette: {
      mode,
      ...palette,
    },
    shape: {
      borderRadius: 14,
    },
    typography: TYPOGRAPHY,
    components: createComponentOverrides(palette),
    gradients,
    conicGradients,
    animations,
    boxShadows: createColoredBoxShadows(conicGradients),
    paperLight: lightPalette.background.paper,
    paperDark: darkPalette.background.paper,
  });

  const textColors = getTextColors(theme);

  theme.palette.text.primary = textColors.primary;
  theme.palette.text.secondary = textColors.secondary;
  theme.palette.text.disabled = textColors.muted;

  if (typeof window !== "undefined") {
    applyTextColorVariables(theme);
  }

  return theme;
};

export const portfolioTheme = createPortfolioTheme("dark", "ltr");
