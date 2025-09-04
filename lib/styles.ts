/**
 * Centralized styles for the entire Portfolio application
 * Single source of truth for all shared styling constants, mixins, and CSS-in-JS objects
 */

import { css, keyframes } from "@emotion/react";
import { Theme } from "@mui/material/styles";
import { RESPONSIVE_BREAKPOINTS, PDF_THEMES } from "./constants";

// ========================
// BREAKPOINT UTILITIES
// ========================

export const breakpoints = {
  up: (breakpoint: keyof typeof RESPONSIVE_BREAKPOINTS) =>
    `@media (min-width: ${RESPONSIVE_BREAKPOINTS[breakpoint]}px)`,
  down: (breakpoint: keyof typeof RESPONSIVE_BREAKPOINTS) =>
    `@media (max-width: ${RESPONSIVE_BREAKPOINTS[breakpoint] - 1}px)`,
  between: (
    min: keyof typeof RESPONSIVE_BREAKPOINTS,
    max: keyof typeof RESPONSIVE_BREAKPOINTS
  ) =>
    `@media (min-width: ${RESPONSIVE_BREAKPOINTS[min]}px) and (max-width: ${
      RESPONSIVE_BREAKPOINTS[max] - 1
    }px)`,
  only: (breakpoint: keyof typeof RESPONSIVE_BREAKPOINTS) => {
    const breakpointKeys = Object.keys(RESPONSIVE_BREAKPOINTS) as Array<
      keyof typeof RESPONSIVE_BREAKPOINTS
    >;
    const currentIndex = breakpointKeys.indexOf(breakpoint);
    const nextBreakpoint = breakpointKeys[currentIndex + 1];

    if (!nextBreakpoint) {
      return `@media (min-width: ${RESPONSIVE_BREAKPOINTS[breakpoint]}px)`;
    }

    return `@media (min-width: ${
      RESPONSIVE_BREAKPOINTS[breakpoint]
    }px) and (max-width: ${RESPONSIVE_BREAKPOINTS[nextBreakpoint] - 1}px)`;
  },
};

// ========================
// ANIMATION KEYFRAMES
// ========================

export const animations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,

  fadeOut: keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
  `,

  slideInUp: keyframes`
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,

  slideInDown: keyframes`
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,

  slideInLeft: keyframes`
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,

  slideInRight: keyframes`
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,

  scaleIn: keyframes`
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  `,

  bounce: keyframes`
    0%, 20%, 53%, 80%, 100% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      transform: translate3d(0, -30px, 0) scaleY(1.1);
    }
    70% {
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      transform: translate3d(0, -15px, 0) scaleY(1.05);
    }
    90% {
      transform: translate3d(0, -4px, 0) scaleY(1.02);
    }
  `,

  pulse: keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `,

  rotate: keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `,

  spin: keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `,

  float: keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  `,

  wobble: keyframes`
    0%, 100% { transform: translateX(0%); }
    15% { transform: translateX(-25px) rotate(-5deg); }
    30% { transform: translateX(20px) rotate(3deg); }
    45% { transform: translateX(-15px) rotate(-3deg); }
    60% { transform: translateX(10px) rotate(2deg); }
    75% { transform: translateX(-5px) rotate(-1deg); }
  `,

  glow: keyframes`
    0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
    50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4); }
  `,

  shimmer: keyframes`
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  `,

  typewriter: keyframes`
    from { width: 0; }
    to { width: 100%; }
  `,

  blink: keyframes`
    0%, 50% { border-color: transparent; }
    51%, 100% { border-color: currentColor; }
  `,
};

// ========================
// COMMON MIXINS
// ========================

export const mixins = {
  // Flexbox utilities
  flexCenter: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  flexBetween: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  flexColumn: css`
    display: flex;
    flex-direction: column;
  `,

  flexColumnCenter: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,

  // Text utilities
  textEllipsis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  textClamp: (lines: number) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,

  // Visual effects
  glassmorphism: (opacity = 0.1, blur = 10) => css`
    background: rgba(255, 255, 255, ${opacity});
    backdrop-filter: blur(${blur}px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `,

  neumorphism: (theme: Theme) => css`
    background: ${theme.palette.background.paper};
    box-shadow: 20px 20px 60px
        ${theme.palette.mode === "dark" ? "#1a1a1a" : "#bebebe"},
      -20px -20px 60px ${theme.palette.mode === "dark" ? "#2a2a2a" : "#ffffff"};
  `,

  gradient: (direction: string, colors: string[]) => css`
    background: linear-gradient(${direction}, ${colors.join(", ")});
  `,

  // Layout utilities
  absoluteCenter: css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,

  fullSize: css`
    width: 100%;
    height: 100%;
  `,

  srOnly: css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `,

  // Interactive states
  hoverLift: css`
    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: translateY(-2px);
    }
  `,

  hoverScale: (scale = 1.05) => css`
    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: scale(${scale});
    }
  `,

  hoverGlow: (color = "rgba(255, 255, 255, 0.3)") => css`
    transition: box-shadow 0.2s ease-in-out;
    &:hover {
      box-shadow: 0 0 20px ${color};
    }
  `,

  // Focus styles
  focusRing: (color = "#0066CC") => css`
    &:focus {
      outline: 2px solid ${color};
      outline-offset: 2px;
    }
  `,

  // Transitions
  smoothTransition: (
    properties = "all",
    duration = "0.2s",
    easing = "ease-in-out"
  ) => css`
    transition: ${properties} ${duration} ${easing};
  `,

  // Responsive typography
  responsiveText: (mobileSize: string, desktopSize: string) => css`
    font-size: ${mobileSize};

    ${breakpoints.up("TABLET")} {
      font-size: ${desktopSize};
    }
  `,

  // Custom scrollbar
  customScrollbar: (theme: Theme) => css`
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: ${theme.palette.background.default};
    }

    &::-webkit-scrollbar-thumb {
      background: ${theme.palette.primary.main};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${theme.palette.primary.dark};
    }
  `,
};

// ========================
// COMMON COMPONENT STYLES
// ========================

export const componentStyles = {
  // Form styles
  formField: (theme: Theme) => css`
    margin-bottom: ${theme.spacing(3)};

    & .MuiOutlinedInput-root {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background-color: ${theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(255, 255, 255, 0.8)"};

      &:hover {
        background-color: ${theme.palette.mode === "dark"
          ? "rgba(100, 181, 246, 0.15)"
          : "rgba(78, 205, 196, 0.12)"};
        transform: translateY(-2px);
      }

      &.Mui-focused {
        background-color: ${theme.palette.mode === "dark"
          ? "rgba(100, 181, 246, 0.15)"
          : "rgba(78, 205, 196, 0.12)"};
        transform: translateY(-2px);
        box-shadow: ${theme.palette.mode === "dark"
          ? "0 6px 16px rgba(100, 181, 246, 0.3)"
          : "0 6px 16px rgba(78, 205, 196, 0.25)"};

        & .MuiOutlinedInput-notchedOutline {
          border-color: ${theme.palette.mode === "dark"
            ? "#64B5F6"
            : "#4ECDC4"};
          border-width: 3px;
        }
      }
    }

    & .MuiInputLabel-root {
      color: ${theme.palette.mode === "dark" ? "#FFEAA7" : "#2C3E50"};
      font-weight: 600;

      &.Mui-focused {
        color: ${theme.palette.mode === "dark" ? "#64B5F6" : "#4ECDC4"};
        font-weight: 700;
      }
    }

    & .MuiInputBase-input {
      color: ${theme.palette.mode === "dark" ? "#FFFFFF" : "#34495E"};
      font-weight: 500;
      font-size: 1rem;
    }

    & .MuiFormHelperText-root {
      color: ${theme.palette.mode === "dark" ? "#FF8A65" : "#E74C3C"};
      font-weight: 500;
    }
  `,

  // Button styles
  gradientButton: (gradient: string) => css`
    background: ${gradient};
    border: 0;
    border-radius: 25px;
    color: white;
    padding: 10px 30px;
    box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: ${gradient};
      transform: translateY(-2px);
      box-shadow: 0 5px 15px 2px rgba(255, 105, 135, 0.4);
    }
  `,

  neonButton: (color: string, opacity = 1) => css`
    background: transparent;
    border: 2px solid rgba(${color}, ${opacity});
    border-radius: 25px;
    color: rgba(${color}, ${opacity});
    padding: 10px 30px;
    text-shadow: 0 0 10px rgba(${color}, ${opacity});
    box-shadow: 0 0 20px rgba(${color}, ${opacity});
    transition: all 0.3s ease;

    &:hover {
      background: rgba(${color}, ${opacity * 0.1});
      box-shadow: 0 0 30px rgba(${color}, ${opacity});
      transform: scale(1.05);
    }
  `,

  glassButton: css`
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    color: white;
    padding: 10px 30px;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s;
    }

    &:hover::before {
      left: 100%;
    }
  `,

  // Card styles
  cardBase: (theme: Theme) => css`
    background: ${theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.8)"};
    backdrop-filter: blur(10px);
    border: 1px solid
      ${theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"};
    border-radius: ${theme.shape.borderRadius}px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.3)"
        : "0 8px 32px rgba(0, 0, 0, 0.1)"};
    }
  `,

  galaxyCard: (theme: Theme) => css`
    position: relative;
    background: linear-gradient(
      135deg,
      ${theme.palette.mode === "dark"
        ? "rgba(16, 16, 32, 0.9)"
        : "rgba(240, 240, 255, 0.9)"},
      ${theme.palette.mode === "dark"
        ? "rgba(32, 16, 64, 0.9)"
        : "rgba(220, 220, 255, 0.9)"}
    );
    border: 1px solid
      ${theme.palette.mode === "dark"
        ? "rgba(100, 50, 200, 0.3)"
        : "rgba(100, 50, 200, 0.2)"};

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
          circle at 20% 50%,
          ${theme.palette.mode === "dark"
              ? "rgba(120, 60, 240, 0.1)"
              : "rgba(120, 60, 240, 0.05)"}
            0%,
          transparent 50%
        ),
        radial-gradient(
          circle at 80% 20%,
          ${theme.palette.mode === "dark"
              ? "rgba(240, 60, 120, 0.1)"
              : "rgba(240, 60, 120, 0.05)"}
            0%,
          transparent 50%
        ),
        radial-gradient(
          circle at 40% 80%,
          ${theme.palette.mode === "dark"
              ? "rgba(60, 180, 240, 0.1)"
              : "rgba(60, 180, 240, 0.05)"}
            0%,
          transparent 50%
        );
      pointer-events: none;
    }
  `,

  // Typography styles
  gradientText: (gradient: string) => css`
    background: ${gradient};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,

  glowText: (color: string) => css`
    text-shadow: 0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color};
  `,

  // Layout styles
  containerBase: (theme: Theme) => css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing(2)};

    ${breakpoints.up("TABLET")} {
      padding: 0 ${theme.spacing(3)};
    }

    ${breakpoints.up("DESKTOP")} {
      padding: 0 ${theme.spacing(4)};
    }
  `,

  sectionBase: (theme: Theme) => css`
    padding: ${theme.spacing(8)} 0;

    ${breakpoints.up("TABLET")} {
      padding: ${theme.spacing(12)} 0;
    }

    ${breakpoints.up("DESKTOP")} {
      padding: ${theme.spacing(16)} 0;
    }
  `,

  gridContainer: (
    theme: Theme,
    columns: { mobile: number; tablet: number; desktop: number }
  ) => css`
    display: grid;
    gap: ${theme.spacing(3)};
    grid-template-columns: repeat(${columns.mobile}, 1fr);

    ${breakpoints.up("TABLET")} {
      grid-template-columns: repeat(${columns.tablet}, 1fr);
      gap: ${theme.spacing(4)};
    }

    ${breakpoints.up("DESKTOP")} {
      grid-template-columns: repeat(${columns.desktop}, 1fr);
      gap: ${theme.spacing(6)};
    }
  `,
};

// ========================
// THEME-AWARE UTILITIES
// ========================

export const themeUtils = {
  getContrastText: (background: string): string => {
    // Simple contrast calculation
    const hex = background.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  },

  hexToRgba: (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  darken: (color: string, amount: number): string => {
    const hex = color.replace("#", "");
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  },

  lighten: (color: string, amount: number): string => {
    const hex = color.replace("#", "");
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  },
};

// ========================
// GRADIENT PRESETS
// ========================

export const gradients = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  warning: "linear-gradient(135deg, #ffcc70 0%, #ff6b6b 100%)",
  error: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
  info: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",

  // Themed gradients
  ocean: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  sunset: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
  forest: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  galaxy: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  aurora: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  fire: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
  spring: "linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)",

  // Social media gradients
  github: "linear-gradient(135deg, #333 0%, #000 100%)",
  linkedin: "linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)",
  whatsapp: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
  telegram: "linear-gradient(135deg, #0088cc 0%, #0066aa 100%)",
  email: "linear-gradient(135deg, #ea4335 0%, #c23321 100%)",
  phone: "linear-gradient(135deg, #34a853 0%, #137333 100%)",
};

// ========================
// SHADOW PRESETS
// ========================

export const shadows = {
  none: "none",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

  // Colored shadows
  colored: (
    color: string,
    intensity: "light" | "medium" | "heavy" = "medium"
  ) => {
    const opacities = {
      light: 0.2,
      medium: 0.3,
      heavy: 0.4,
    };
    return `0 4px 20px ${themeUtils.hexToRgba(color, opacities[intensity])}`;
  },

  glow: (color: string) => `0 0 20px ${color}, 0 0 40px ${color}`,
  neon: (color: string) =>
    `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`,
};

// ========================
// PDF TEMPLATE STYLES
// ========================

/**
 * Styles for resume template previews that match PDF output
 */
export const pdfTemplateStyles = {
  // Template card base styles
  templateCard: (themeName: keyof typeof PDF_THEMES, isSelected = false) => {
    const theme = PDF_THEMES[themeName];
    return css`
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: ${isSelected
        ? `0 8px 32px ${theme.cssAccent}40, 0 0 0 3px ${theme.cssAccent}`
        : "0 4px 20px rgba(0, 0, 0, 0.1)"};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }
    `;
  },

  // Header section that matches PDF header
  templateHeader: (themeName: keyof typeof PDF_THEMES) => {
    const theme = PDF_THEMES[themeName];
    return css`
      background: ${theme.cssHeaderBg};
      ${theme.cssHeaderAccent
        ? `
        background: linear-gradient(180deg, ${theme.cssHeaderBg} 0%, ${theme.cssHeaderBg} 85%, ${theme.cssHeaderAccent} 85%, ${theme.cssHeaderAccent} 100%);
      `
        : ""}
      padding: 16px 20px;
      color: white;
      position: relative;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `;
  },

  // Name styling
  templateName: css`
    font-size: 20px;
    font-weight: bold;
    margin: 0 0 4px 0;
    line-height: 1.2;
  `,

  // Title styling
  templateTitle: css`
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    opacity: 0.95;
    line-height: 1.2;
  `,

  // Contact info styling
  templateContacts: css`
    font-size: 8px;
    margin-top: 8px;
    opacity: 0.9;
    line-height: 1.3;
  `,

  // Body section styling
  templateBody: css`
    padding: 16px 20px;
    background: white;
    color: #000;
  `,

  // Section headers that match PDF
  templateSectionHeader: (themeName: keyof typeof PDF_THEMES) => {
    const theme = PDF_THEMES[themeName];
    return css`
      font-size: 10px;
      font-weight: bold;
      color: ${theme.cssAccent};
      margin: 12px 0 4px 0;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 1px;
        background: ${theme.cssAccent};
      }
    `;
  },

  // Content sections
  templateContent: css`
    font-size: 8px;
    line-height: 1.4;
    color: #333;
    margin: 4px 0;
  `,

  // Skills section
  templateSkills: css`
    font-size: 7px;
    line-height: 1.3;
    color: #444;
    margin: 2px 0;
  `,

  // Experience section
  templateExperience: css`
    margin: 6px 0;
  `,

  templateRole: css`
    font-size: 8px;
    font-weight: bold;
    color: #000;
    margin: 0 0 2px 0;
  `,

  templatePeriod: css`
    font-size: 7px;
    color: #666;
    margin: 0 0 3px 0;
  `,

  templateBullets: css`
    font-size: 6px;
    line-height: 1.3;
    color: #555;
    margin-left: 8px;

    &::before {
      content: "•";
      margin-right: 4px;
    }
  `,

  // Template preview container
  templatePreview: css`
    width: 100%;
    aspect-ratio: 210 / 297; /* A4 ratio */
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,

  // Template list container
  templateGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;

    ${breakpoints.up("TABLET")} {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 32px;
    }
  `,
};

/**
 * PDF theme-based color utilities
 */
export const pdfThemeColors = {
  getThemeColors: (themeName: keyof typeof PDF_THEMES) => {
    const theme = PDF_THEMES[themeName];
    return {
      headerBg: theme.cssHeaderBg,
      headerAccent: theme.cssHeaderAccent,
      accent: theme.cssAccent,
      // RGB values for calculations
      headerBgRgb: theme.headerBg,
      accentRgb: theme.accent,
    };
  },

  // Get contrasting text color for theme
  getContrastColor: (themeName: keyof typeof PDF_THEMES): string => {
    const theme = PDF_THEMES[themeName];
    const [r, g, b] = theme.headerBg;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  },

  // Get theme-based hover color
  getHoverColor: (themeName: keyof typeof PDF_THEMES): string => {
    const theme = PDF_THEMES[themeName];
    const [r, g, b] = theme.accent;
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  },

  // Get theme-based border color
  getBorderColor: (themeName: keyof typeof PDF_THEMES): string => {
    const theme = PDF_THEMES[themeName];
    const [r, g, b] = theme.accent;
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  },

  // Get theme-based gradient
  getGradient: (themeName: keyof typeof PDF_THEMES): string => {
    const theme = PDF_THEMES[themeName];
    if (theme.cssHeaderAccent) {
      return `linear-gradient(135deg, ${theme.cssHeaderBg} 0%, ${theme.cssHeaderAccent} 100%)`;
    }
    return theme.cssHeaderBg;
  },

  // Get theme-based shadow
  getShadow: (themeName: keyof typeof PDF_THEMES): string => {
    const theme = PDF_THEMES[themeName];
    const [r, g, b] = theme.accent;
    return `0 4px 20px rgba(${r}, ${g}, ${b}, 0.2)`;
  },
};

/**
 * Enhanced PDF template styles with new visual features
 */
export const enhancedPdfTemplateStyles = {
  // Visual element indicators
  visualElementIndicator: css`
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 10px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  // Layout variant indicators
  layoutVariantIndicator: css`
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 10px;
    color: #666;
  `,

  // Typography variant indicators
  typographyIndicator: css`
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 10px;
    color: #666;
  `,

  // Enhanced template card with visual features
  enhancedTemplateCard: (
    themeName: keyof typeof PDF_THEMES,
    isSelected = false
  ) => {
    const theme = PDF_THEMES[themeName];
    return css`
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: ${isSelected
        ? `0 8px 32px ${theme.cssAccent}40, 0 0 0 3px ${theme.cssAccent}`
        : "0 4px 20px rgba(0, 0, 0, 0.1)"};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        border-color: ${theme.cssAccent}40;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: ${theme.cssHeaderAccent
          ? `linear-gradient(90deg, ${theme.cssHeaderBg} 0%, ${theme.cssHeaderAccent} 100%)`
          : theme.cssHeaderBg};
        z-index: 1;
      }
    `;
  },

  // Enhanced header with gradient and visual effects
  enhancedTemplateHeader: (themeName: keyof typeof PDF_THEMES) => {
    const theme = PDF_THEMES[themeName];
    return css`
      background: ${theme.cssHeaderAccent
        ? `linear-gradient(135deg, ${theme.cssHeaderBg} 0%, ${theme.cssHeaderAccent} 100%)`
        : theme.cssHeaderBg};
      padding: 16px 20px;
      color: white;
      position: relative;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 60px;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.1) 100%
        );
        pointer-events: none;
      }
    `;
  },

  // Enhanced section headers with visual elements
  enhancedSectionHeader: (themeName: keyof typeof PDF_THEMES) => {
    const theme = PDF_THEMES[themeName];
    return css`
      font-size: 10px;
      font-weight: bold;
      color: ${theme.cssAccent};
      margin: 12px 0 4px 0;
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: "▶";
        font-size: 8px;
        color: ${theme.cssAccent};
      }

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 16px;
        right: 0;
        height: 1px;
        background: ${theme.cssAccent};
      }
    `;
  },

  // Visual element badges
  visualElementBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 9px;
    color: #666;
    margin: 2px;
  `,

  // Theme category styles
  themeCategory: css`
    margin-bottom: 24px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #f0f0f0;
    }
  `,

  // Enhanced template grid with categories
  enhancedTemplateGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;

    ${breakpoints.up("TABLET")} {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 32px;
    }
  `,
};

// ========================
// Z-INDEX SCALE
// ========================

export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ========================
// EXPORTS
// ========================

const styles = {
  breakpoints,
  animations,
  mixins,
  componentStyles,
  themeUtils,
  gradients,
  shadows,
  zIndex,
  pdfTemplateStyles,
  pdfThemeColors,
  enhancedPdfTemplateStyles,
};

export default styles;
