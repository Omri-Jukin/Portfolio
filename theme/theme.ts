import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    gradients: {
      warm: string;
      cool: string;
      neutral: string;
      dark: string;
    };
    animations: {
      bobbing: string;
      rotating: string;
      hover: string;
      shadow: string;
    };
    paperLight: string;
    paperDark: string;
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    gradients?: {
      warm?: string;
      cool?: string;
      neutral?: string;
      dark?: string;
    };
    animations?: {
      bobbing?: string;
      rotating?: string;
      hover?: string;
      shadow?: string;
    };
    paperLight?: string;
    paperDark?: string;
  }
  // Palette and PaletteOptions augmentation as you already have
  interface Palette {
    warm: { primary: string; secondary: string; accent: string };
    cool: { primary: string; secondary: string; accent: string };
    neutral: { primary: string; secondary: string; accent: string };
    dark: { primary: string; secondary: string; accent: string };
    whatsapp: { primary: string; secondary: string; accent: string };
    telegram: { primary: string; secondary: string; accent: string };
    linkedin: { primary: string; secondary: string; accent: string };
    github: { primary: string; secondary: string; accent: string };
    email: { primary: string; secondary: string; accent: string };
    phone: { primary: string; secondary: string; accent: string };
  }
  interface PaletteOptions {
    warm?: { primary?: string; secondary?: string; accent?: string };
    cool?: { primary?: string; secondary?: string; accent?: string };
    neutral?: { primary?: string; secondary?: string; accent?: string };
    dark?: { primary?: string; secondary?: string; accent?: string };
    whatsapp?: { primary?: string; secondary?: string; accent?: string };
    telegram?: { primary?: string; secondary?: string; accent?: string };
    linkedin?: { primary?: string; secondary?: string; accent?: string };
    github?: { primary?: string; secondary?: string; accent?: string };
    email?: { primary?: string; secondary?: string; accent?: string };
    phone?: { primary?: string; secondary?: string; accent?: string };
  }
  interface Breakpoints {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    ml: true;
    xxl: true;
    xxxl: true;
    xxxxl: true;
  }
  interface BreakpointsOptions {
    values: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      ml: number;
      xxl: number;
      xxxl: number;
      xxxxl: number;
    };
  }
}

// Export a static base theme (light mode, LTR, default palette)
export const baseTheme = createTheme({
  direction: "ltr",
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      ml: 1024,
      lg: 1280,
      xl: 1440,
      xxl: 1920,
      xxxl: 2560,
      xxxxl: 3840,
    },
  },

  palette: {
    mode: "light",
    primary: {
      main: "#4ECDC4", // Teal from vibrant palette
      light: "#64B5F6", // Light blue from vibrant palette
      dark: "#45B7D1", // Blue from vibrant palette
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF6B6B", // Red from vibrant palette
      light: "#F06292", // Pink from vibrant palette
      dark: "#9575CD", // Deep purple from vibrant palette
      contrastText: "#ffffff",
    },
    success: {
      main: "#96CEB4", // Light green from vibrant palette
      light: "#81C784", // Light green from vibrant palette
      dark: "#4ECDC4", // Teal from vibrant palette
    },
    warning: {
      main: "#FFB74D", // Amber from vibrant palette
      light: "#FFEAA7", // Yellow from vibrant palette
      dark: "#FF8A65", // Orange from vibrant palette
    },
    info: {
      main: "#64B5F6", // Light blue from vibrant palette
      light: "#45B7D1", // Blue from vibrant palette
      dark: "#4ECDC4", // Teal from vibrant palette
    },
    error: {
      main: "#FF6B6B", // Red from vibrant palette
      light: "#F06292", // Pink from vibrant palette
      dark: "#E74C3C", // Red from vibrant palette
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2C3E50", // Dark blue-gray for better contrast
      secondary: "#34495E", // Dark gray for better contrast
    },
    warm: {
      primary: "#FF6B6B", // Red from vibrant palette
      secondary: "#FF8A65", // Orange from vibrant palette
      accent: "#FFEAA7", // Yellow from vibrant palette
    },
    cool: {
      primary: "#4ECDC4", // Teal from vibrant palette
      secondary: "#64B5F6", // Light blue from vibrant palette
      accent: "#45B7D1", // Blue from vibrant palette
    },
    neutral: {
      primary: "#96CEB4", // Light green from vibrant palette
      secondary: "#81C784", // Light green from vibrant palette
      accent: "#DDA0DD", // Purple from vibrant palette
    },
    dark: {
      primary: "#2C3E50", // Dark blue-gray
      secondary: "#34495E", // Dark gray
      accent: "#4ECDC4", // Teal accent
    },
    whatsapp: {
      primary: "#25D366", // WhatsApp green
      secondary: "#25D366", // WhatsApp green
      accent: "#25D366", // WhatsApp green
    },
    telegram: {
      primary: "#0088CC", // Telegram blue
      secondary: "#0088CC", // Telegram blue
      accent: "#0088CC", // Telegram blue
    },
    linkedin: {
      primary: "#0077B5", // LinkedIn blue
      secondary: "#0077B5", // LinkedIn blue
      accent: "#0077B5", // LinkedIn blue
    },
    github: {
      primary: "#181717", // GitHub black
      secondary: "#181717", // GitHub black
      accent: "#181717", // GitHub black
    },
    email: {
      primary: "#000000", // Email black
      secondary: "#000000", // Email black
      accent: "#000000", // Email black
    },
    phone: {
      primary: "#000000", // Phone black
      secondary: "#000000", // Phone black
      accent: "#000000", // Phone black
    },
  },
  gradients: {
    warm: "linear-gradient(to right, #FF6B6B, #FF8A65, #FFEAA7)", // Red to Orange to Yellow
    cool: "linear-gradient(to right, #4ECDC4, #64B5F6, #45B7D1)", // Teal to Light Blue to Blue
    neutral: "linear-gradient(to right, #96CEB4, #81C784, #DDA0DD)", // Light Green to Green to Purple
    dark: "linear-gradient(to right, #2C3E50, #34495E, #4ECDC4)", // Dark Blue-gray to Gray to Teal
  },
  animations: {
    bobbing: "0.5s ease-in-out infinite normal",
    rotating: "0.5s linear infinite normal",
    hover: "0.2s ease-in-out normal",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.15) inset normal",
  },
  paperLight: "#fafafa",
  paperDark: "#2C3E50",
  typography: {
    fontFamily: 'var(--font-bona-nova-sc), "Bona Nova SC", serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      "@media (max-width:900px)": {
        fontSize: "2rem",
        lineHeight: 1.3,
      },
      "@media (max-width:600px)": {
        fontSize: "1.75rem",
        lineHeight: 1.4,
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
      "@media (max-width:900px)": {
        fontSize: "1.75rem",
        lineHeight: 1.4,
      },
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
      "@media (max-width:900px)": {
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
        lineHeight: 1.5,
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      "@media (max-width:900px)": {
        fontSize: "1.25rem",
        lineHeight: 1.5,
      },
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
        lineHeight: 1.5,
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.5,
      "@media (max-width:900px)": {
        fontSize: "1.125rem",
        lineHeight: 1.5,
      },
      "@media (max-width:600px)": {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.125rem",
      lineHeight: 1.5,
      "@media (max-width:900px)": {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      "@media (max-width:600px)": {
        fontSize: "0.875rem",
        lineHeight: 1.6,
      },
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      "@media (max-width:900px)": {
        fontSize: "0.875rem",
        lineHeight: 1.6,
      },
      "@media (max-width:600px)": {
        fontSize: "0.8125rem",
        lineHeight: 1.6,
      },
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      "@media (max-width:900px)": {
        fontSize: "0.8125rem",
        lineHeight: 1.6,
      },
      "@media (max-width:600px)": {
        fontSize: "0.75rem",
        lineHeight: 1.6,
      },
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  shadows: [
    "none",
    "0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.08)",
    "0 2px 4px rgba(0, 0, 0, 0.1), 1px 1px 2px rgba(0, 0, 0, 0.08)",
    "0 3px 6px rgba(0, 0, 0, 0.15), 1px 1px 3px rgba(0, 0, 0, 0.1)",
    "0 4px 8px rgba(0, 0, 0, 0.2), 2px 2px 4px rgba(0, 0, 0, 0.15)",
    "0 6px 12px rgba(0, 0, 0, 0.25), 3px 3px 6px rgba(0, 0, 0, 0.2)",
    "0 8px 16px rgba(0, 0, 0, 0.3), 4px 4px 8px rgba(0, 0, 0, 0.25)",
    "0 10px 20px rgba(0, 0, 0, 0.35), 5px 5px 10px rgba(0, 0, 0, 0.3)",
    "0 12px 24px rgba(0, 0, 0, 0.4), 6px 6px 12px rgba(0, 0, 0, 0.35)",
    "0 14px 28px rgba(0, 0, 0, 0.45), 7px 7px 14px rgba(0, 0, 0, 0.4)",
    "0 16px 32px rgba(0, 0, 0, 0.5), 8px 8px 16px rgba(0, 0, 0, 0.45)",
    "0 18px 36px rgba(0, 0, 0, 0.55), 9px 9px 18px rgba(0, 0, 0, 0.5)",
    "0 20px 40px rgba(0, 0, 0, 0.6), 10px 10px 20px rgba(0, 0, 0, 0.55)",
    "0 22px 44px rgba(0, 0, 0, 0.65), 11px 11px 22px rgba(0, 0, 0, 0.6)",
    "0 24px 48px rgba(0, 0, 0, 0.7), 12px 12px 24px rgba(0, 0, 0, 0.65)",
    "0 26px 52px rgba(0, 0, 0, 0.75), 13px 13px 26px rgba(0, 0, 0, 0.7)",
    "0 28px 56px rgba(0, 0, 0, 0.8), 14px 14px 28px rgba(0, 0, 0, 0.75)",
    "0 30px 60px rgba(0, 0, 0, 0.85), 15px 15px 30px rgba(0, 0, 0, 0.8)",
    "0 32px 64px rgba(0, 0, 0, 0.9), 16px 16px 32px rgba(0, 0, 0, 0.85)",
    "0 34px 68px rgba(0, 0, 0, 0.95), 17px 17px 34px rgba(0, 0, 0, 0.9)",
    "0 36px 72px rgba(0, 0, 0, 1), 18px 18px 36px rgba(0, 0, 0, 0.95)",
    "0 38px 76px rgba(0, 0, 0, 1), 19px 19px 38px rgba(0, 0, 0, 1)",
    "0 40px 80px rgba(0, 0, 0, 1), 20px 20px 40px rgba(0, 0, 0, 1)",
    "0 42px 84px rgba(0, 0, 0, 1), 21px 21px 42px rgba(0, 0, 0, 1)",
    "0 44px 88px rgba(0, 0, 0, 1), 22px 22px 44px rgba(0, 0, 0, 1)",
  ],
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "rounded" },
          style: {
            borderRadius: 8,
            padding: "8px 24px",
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: "44px",
            minWidth: "44px",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            "@media (max-width:600px)": {
              padding: "10px 16px",
              fontSize: "0.8125rem",
            },
          },
        },
        {
          props: { variant: "pill" },
          style: {
            borderRadius: 50,
            padding: "10px 32px",
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { variant: "square" },
          style: {
            borderRadius: 4,
            padding: "8px 24px",
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { size: "xs" },
          style: {
            padding: "4px 12px",
            fontSize: "0.75rem",
            minHeight: 28,
          },
        },
        {
          props: { size: "xl" },
          style: {
            padding: "12px 36px",
            fontSize: "1rem",
            minHeight: 48,
          },
        },
      ],
    },
    MuiCard: {
      variants: [
        {
          props: { variant: "elevated" },
          style: {
            borderRadius: 16,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            },
          },
        },
        {
          props: { variant: "flat" },
          style: {
            borderRadius: 12,
            boxShadow: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `1px solid #e0e0e0`,
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            borderRadius: 8,
            boxShadow: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            border: `2px solid #ddd`,
          },
        },
        {
          props: { variant: "soft" },
          style: {
            borderRadius: 20,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          },
        },
      ],
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "rounded" },
          style: {
            borderRadius: 12,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { variant: "soft" },
          style: {
            borderRadius: 20,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { variant: "square" },
          style: {
            borderRadius: 4,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { variant: "pill" },
          style: {
            borderRadius: 50,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
      ],
    },
    MuiChip: {
      variants: [
        {
          props: { variant: "rounded" },
          style: {
            borderRadius: 8,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { variant: "square" },
          style: {
            borderRadius: 4,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { variant: "pill" },
          style: {
            borderRadius: 50,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        {
          props: { size: "xs" },
          style: {
            height: 20,
            fontSize: "0.625rem",
            "& .MuiChip-label": {
              padding: "0 6px",
            },
          },
        },
        {
          props: { size: "xl" },
          style: {
            height: 40,
            fontSize: "0.875rem",
            "& .MuiChip-label": {
              padding: "0 16px",
            },
          },
        },
      ],
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "h1" },
          style: {
            fontSize: "2.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
          },
        },
        {
          props: { variant: "h2" },
          style: {
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.3,
          },
        },
        {
          props: { variant: "h3" },
          style: {
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.4,
          },
        },
        {
          props: { variant: "h4" },
          style: {
            fontSize: "1.5rem",
            fontWeight: 600,
            lineHeight: 1.4,
          },
        },
        {
          props: { variant: "h5" },
          style: {
            fontSize: "1.25rem",
            fontWeight: 500,
            lineHeight: 1.5,
          },
        },
        {
          props: { variant: "h6" },
          style: {
            fontSize: "1.125rem",
            fontWeight: 500,
            lineHeight: 1.5,
          },
        },
        {
          props: { variant: "body1" },
          style: {
            fontSize: "1rem",
            lineHeight: 1.6,
          },
        },
        {
          props: { variant: "body2" },
          style: {
            fontSize: "0.875rem",
            lineHeight: 1.6,
          },
        },
      ],
    },
  },
});
