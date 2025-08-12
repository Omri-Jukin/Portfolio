import { ContactCardType } from "@/app/[locale]/contact/page.type";
import { Theme, createTheme } from "@mui/material/styles";

// Utility function to extract colors from conic gradients
const extractColorsFromGradient = (gradient: string): string[] => {
  // Extract hex colors from the gradient string
  const colorRegex = /#[0-9A-Fa-f]{6}/g;
  const colors = gradient.match(colorRegex) || [];
  return colors;
};

// Function to create colored box shadows based on gradient colors
const createColoredBoxShadows = (conicGradients: Record<string, string>) => {
  const gradientTypes = Object.keys(conicGradients);

  return gradientTypes.map((gradientType) => {
    const gradient = conicGradients[gradientType];
    const colors = extractColorsFromGradient(gradient);

    // Use the first few colors from the gradient for shadows
    const primaryColor = colors[0] || "#000000";
    const secondaryColor = colors[1] || primaryColor;
    const accentColor = colors[2] || secondaryColor;

    return {
      none: "none",
      light: `0 1px 2px ${primaryColor}20, 0 1px 1px ${secondaryColor}15`,
      medium: `0 2px 4px ${primaryColor}30, 1px 1px 2px ${secondaryColor}25`,
      heavy: `0 3px 6px ${primaryColor}40, 1px 1px 3px ${accentColor}35`,
    };
  });
};

declare module "@mui/material/styles" {
  interface Theme {
    gradients: {
      phone: string;
      email: string;
      github: string;
      linkedin: string;
      whatsapp: string;
      telegram: string;
      warm?: string;
      coolWarm?: string;
      cool?: string;
      neutral?: string;
      dark?: string;
      sunset?: string;
      ocean?: string;
      forest?: string;
      galaxy?: string;
      aurora?: string;
      fire?: string;
      spring?: string;
    };
    conicGradients: {
      phone?: string;
      email?: string;
      github?: string;
      linkedin?: string;
      whatsapp?: string;
      telegram?: string;
      warm?: string;
      coolWarm?: string;
      cool?: string;
      neutral?: string;
      dark?: string;
      sunset?: string;
      ocean?: string;
      forest?: string;
      galaxy?: string;
      aurora?: string;
      fire?: string;
      spring?: string;
    };
    animations: {
      bobbing: string;
      rotating: string;
      hover: string;
      shadow: string;
    };
    boxShadows: {
      none: string;
      light: string;
      medium: string;
      heavy: string;
    }[];
    paperLight: string;
    paperDark: string;
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    gradients?: {
      phone?: string;
      email?: string;
      github?: string;
      linkedin?: string;
      whatsapp?: string;
      telegram?: string;
      warm?: string;
      coolWarm?: string;
      cool?: string;
      neutral?: string;
      dark?: string;
      sunset?: string;
      ocean?: string;
      forest?: string;
      galaxy?: string;
      aurora?: string;
      fire?: string;
      spring?: string;
    };
    conicGradients?: {
      phone?: string;
      email?: string;
      github?: string;
      linkedin?: string;
      whatsapp?: string;
      telegram?: string;
      warm?: string;
      coolWarm?: string;
      cool?: string;
      neutral?: string;
      dark?: string;
      sunset?: string;
      ocean?: string;
      forest?: string;
      galaxy?: string;
      aurora?: string;
      fire?: string;
      spring?: string;
    };
    animations?: {
      bobbing?: string;
      rotating?: string;
      hover?: string;
      shadow?: string;
    };
    boxShadows?: {
      none?: string;
      light?: string;
      medium?: string;
      heavy?: string;
    }[];
    paperLight?: string;
    paperDark?: string;
  }
  // Palette and PaletteOptions augmentation as you already have
  interface Palette {
    calendly: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
      background: string;
    };
    warm: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    cool: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    neutral: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    dark: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    whatsapp: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    telegram: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    linkedin: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    github: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    email: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
    phone: {
      primary: string;
      secondary: string;
      accent: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    calendly?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
      background?: string;
    };
    warm?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    cool?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    neutral?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    dark?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    whatsapp?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    telegram?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    linkedin?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    github?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    email?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
    phone?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      contrastText?: string;
    };
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
      contrastText: "#000000",
    },
    secondary: {
      main: "#FF6B6B", // Red from vibrant palette
      light: "#F06292", // Pink from vibrant palette
      dark: "#9575CD", // Deep purple from vibrant palette
      contrastText: "#000000",
    },
    success: {
      main: "#96CEB4", // Light green from vibrant palette
      light: "#81C784", // Light green from vibrant palette
      dark: "#4ECDC4", // Teal from vibrant palette
      contrastText: "#000000",
    },
    warning: {
      main: "#FFB74D", // Amber from vibrant palette
      light: "#FFEAA7", // Yellow from vibrant palette
      dark: "#FF8A65", // Orange from vibrant palette
      contrastText: "#000000",
    },
    info: {
      main: "#64B5F6", // Light blue from vibrant palette
      light: "#45B7D1", // Blue from vibrant palette
      dark: "#4ECDC4", // Teal from vibrant palette
      contrastText: "#000000",
    },
    error: {
      main: "#FF6B6B", // Red from vibrant palette
      light: "#F06292", // Pink from vibrant palette
      dark: "#E74C3C", // Red from vibrant palette
      contrastText: "#000000",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2C3E50", // Dark blue-gray for better contrast
      secondary: "#34495E", // Dark gray for better contrast
    },
    calendly: {
      primary: "#4ECDC4", // Teal - matches your cool palette and info colors
      secondary: "#64B5F6", // Light blue - complements the primary
      accent: "#FF6B6B", // Red accent - adds warmth and matches warm palette
      contrastText: "#ffffff", // White text for good contrast
      background: "#f8f9fa", // Light background that works with both light/dark themes
    },
    warm: {
      primary: "#FF6B6B", // Red from vibrant palette
      secondary: "#FF8A65", // Orange from vibrant palette
      accent: "#FFEAA7", // Yellow from vibrant palette
      contrastText: "#000000",
    },
    cool: {
      primary: "#4ECDC4", // Teal from vibrant palette
      secondary: "#64B5F6", // Light blue from vibrant palette
      accent: "#45B7D1", // Blue from vibrant palette
      contrastText: "#000000",
    },
    neutral: {
      primary: "#96CEB4", // Light green from vibrant palette
      secondary: "#81C784", // Light green from vibrant palette
      accent: "#DDA0DD", // Purple from vibrant palette
      contrastText: "#000000",
    },
    dark: {
      primary: "#2C3E50", // Dark blue-gray
      secondary: "#34495E", // Dark gray
      accent: "#4ECDC4", // Teal accent
      contrastText: "#000000",
    },
    whatsapp: {
      primary: "#25D366", // WhatsApp green
      secondary: "#25D366", // WhatsApp green
      accent: "#25D366", // WhatsApp green
      contrastText: "#000000",
    },
    telegram: {
      primary: "#0088CC", // Telegram blue
      secondary: "#0088CC", // Telegram blue
      accent: "#0088CC", // Telegram blue
      contrastText: "#000000",
    },
    linkedin: {
      primary: "#0077B5", // LinkedIn blue
      secondary: "#0077B5", // LinkedIn blue
      accent: "#0077B5", // LinkedIn blue
      contrastText: "#ffffff",
    },
    github: {
      primary: "#181717", // GitHub black
      secondary: "#181717", // GitHub black
      accent: "#181717", // GitHub black
      contrastText: "#ffffff",
    },
    email: {
      primary: "#000000", // Email black
      secondary: "#000000", // Email black
      accent: "#000000", // Email black
      contrastText: "#ffffff",
    },
    phone: {
      primary: "#000000", // Phone black
      secondary: "#000000", // Phone black
      accent: "#000000", // Phone black
      contrastText: "#ffffff",
    },
  },
  gradients: {
    phone: "linear-gradient(to right, #FF6B6B, #FF8A65, #FFEAA7)",
    email:
      "linear-gradient(to right, #FF6B6B, #FF8A65, #4ECDC4, #64B5F6, #45B7D1)",
    github: "linear-gradient(to right, #4ECDC4, #64B5F6, #45B7D1)",
    linkedin: "linear-gradient(to right, #96CEB4, #81C784, #DDA0DD)",
    whatsapp: "linear-gradient(to right, #2C3E50, #34495E, #4ECDC4)",
    telegram:
      "linear-gradient(to right, #FF6B6B, #FF8A65, #FFB347, #FFD700, #FF69B4)",
    warm: "linear-gradient(to right, #FF6B6B, #FF8A65, #FFEAA7)",
    coolWarm:
      "linear-gradient(to right, #FF6B6B, #FF8A65, #4ECDC4, #64B5F6, #45B7D1)",
    cool: "linear-gradient(to right, #4ECDC4, #64B5F6, #45B7D1)",
    neutral: "linear-gradient(to right, #96CEB4, #81C784, #DDA0DD)",
    dark: "linear-gradient(to right, #2C3E50, #34495E, #4ECDC4)",
    sunset: "linear-gradient(to right, #FF6B6B, #FF8A65, #FFEAA7)",
    ocean:
      "linear-gradient(to right, #006994, #4ECDC4, #64B5F6, #45B7D1, #1E3A8A)",
    forest:
      "linear-gradient(to right, #228B22, #32CD32, #90EE90, #98FB98, #00CED1)",
    galaxy:
      "linear-gradient(to right, #2C3E50, #8E44AD, #9B59B6, #E74C3C, #F39C12)",
    aurora:
      "linear-gradient(to right, #00CED1, #20B2AA, #48D1CC, #40E0D0, #7FFFD4)",
    fire: "linear-gradient(to right, #FF4500, #FF6347, #FF7F50, #FF8C00, #FFA500)",
    spring:
      "linear-gradient(to right, #FF69B4, #FFB6C1, #FFC0CB, #DDA0DD, #E6E6FA)",
  },
  conicGradients: {
    phone:
      "repeating-linear-gradient(315deg, #FF6B6B2E 92%, #FF450000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF8A6512 30%, #FFB34714 39%),radial-gradient(99% 99% at 109% 2%, #FFD700FF 0%, #FF450000 100%),radial-gradient(99% 99% at 21% 78%, #FF6B6BFF 0%, #FF450000 100%),radial-gradient(160% 154% at 711px -303px, #FF6B6BFF 0%, #FFD700FF 100%)",
    email:
      "repeating-linear-gradient(315deg, #FF6B6B2E 92%, #4ECDC400 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF8A6512 30%, #4ECDC414 39%),radial-gradient(99% 99% at 109% 2%, #64B5F6FF 0%, #4ECDC400 100%),radial-gradient(99% 99% at 21% 78%, #FF6B6BFF 0%, #4ECDC400 100%),radial-gradient(160% 154% at 711px -303px, #FF6B6BFF 0%, #64B5F6FF 100%)",
    github:
      "repeating-linear-gradient(315deg, #4ECDC42E 92%, #2C3E5000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #64B5F612 30%, #45B7D114 39%),radial-gradient(99% 99% at 109% 2%, #34495EFF 0%, #2C3E5000 100%),radial-gradient(99% 99% at 21% 78%, #4ECDC4FF 0%, #2C3E5000 100%),radial-gradient(160% 154% at 711px -303px, #4ECDC4FF 0%, #34495EFF 100%)",
    linkedin:
      "repeating-linear-gradient(315deg, #96CEB42E 92%, #4CAF5000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #81C78412 30%, #8BC34A14 39%),radial-gradient(99% 99% at 109% 2%, #DDA0DDFF 0%, #4CAF5000 100%),radial-gradient(99% 99% at 21% 78%, #96CEB4FF 0%, #4CAF5000 100%),radial-gradient(160% 154% at 711px -303px, #96CEB4FF 0%, #DDA0DDFF 100%)",
    whatsapp:
      "repeating-linear-gradient(315deg, #00FFFF2E 92%, #073AFF00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #00FFFF12 30%, #073AFF14 39%),radial-gradient(99% 99% at 109% 2%, #00C9FFFF 0%, #073AFF00 100%),radial-gradient(99% 99% at 21% 78%, #7B00FFFF 0%, #073AFF00 100%),radial-gradient(160% 154% at 711px -303px, #FF0000FF 0%, #FFF107FF 100%)",
    telegram:
      "repeating-linear-gradient(315deg, #FF6B6B2E 92%, #FF69B400 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF8A6512 30%, #FFB34714 39%),radial-gradient(99% 99% at 109% 2%, #FFD700FF 0%, #FF69B400 100%),radial-gradient(99% 99% at 21% 78%, #FF6B6BFF 0%, #FF69B400 100%),radial-gradient(160% 154% at 711px -303px, #FF6B6BFF 0%, #FF69B4FF 100%)",
    warm: "conic-gradient(from 180deg, #FF6B6B, #FF8A65, #FFB347, #FFD700, #FFEAA7)",
    coolWarm:
      "conic-gradient(from 180deg, #FF6B6B, #FF8A65, #4ECDC4, #64B5F6, #45B7D1)",
    cool: "conic-gradient(from 180deg, #4ECDC4, #64B5F6, #45B7D1, #2C3E50, #34495E)",
    neutral:
      "conic-gradient(from 180deg, #96CEB4, #81C784, #4CAF50, #8BC34A, #DDA0DD)",
    dark: "conic-gradient(from 180deg, #2C3E50, #34495E, #4ECDC4, #64B5F6, #45B7D1)",
    sunset:
      "conic-gradient(from 180deg, #FF6B6B, #FF8A65, #FFB347, #FFD700, #FFEAA7)",
    ocean:
      "repeating-linear-gradient(315deg, #0069942E 92%, #1E3A8A00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #4ECDC412 30%, #64B5F614 39%),radial-gradient(99% 99% at 109% 2%, #64B5F6FF 0%, #1E3A8A00 100%),radial-gradient(99% 99% at 21% 78%, #006994FF 0%, #1E3A8A00 100%),radial-gradient(160% 154% at 711px -303px, #006994FF 0%, #1E3A8AFF 100%)",
    forest:
      "repeating-linear-gradient(315deg, #228B222E 92%, #00CED100 100%),repeating-radial-gradient(75% 75% at 238% 218%, #32CD3212 30%, #90EE9014 39%),radial-gradient(99% 99% at 109% 2%, #90EE90FF 0%, #00CED100 100%),radial-gradient(99% 99% at 21% 78%, #228B22FF 0%, #00CED100 100%),radial-gradient(160% 154% at 711px -303px, #228B22FF 0%, #00CED1FF 100%)",
    galaxy:
      "repeating-linear-gradient(315deg, #2C3E502E 92%, #F39C1200 100%),repeating-radial-gradient(75% 75% at 238% 218%, #8E44AD12 30%, #9B59B614 39%),radial-gradient(99% 99% at 109% 2%, #9B59B6FF 0%, #F39C1200 100%),radial-gradient(99% 99% at 21% 78%, #2C3E50FF 0%, #F39C1200 100%),radial-gradient(160% 154% at 711px -303px, #2C3E50FF 0%, #F39C12FF 100%)",
    aurora:
      "repeating-linear-gradient(315deg, #00CED12E 92%, #7FFFD400 100%),repeating-radial-gradient(75% 75% at 238% 218%, #20B2AA12 30%, #48D1CC14 39%),radial-gradient(99% 99% at 109% 2%, #48D1CCFF 0%, #7FFFD400 100%),radial-gradient(99% 99% at 21% 78%, #00CED1FF 0%, #7FFFD400 100%),radial-gradient(160% 154% at 711px -303px, #00CED1FF 0%, #7FFFD4FF 100%)",
    fire: "repeating-linear-gradient(315deg, #FF45002E 92%, #FFA50000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF634712 30%, #FF7F5014 39%),radial-gradient(99% 99% at 109% 2%, #FF7F50FF 0%, #FFA50000 100%),radial-gradient(99% 99% at 21% 78%, #FF4500FF 0%, #FFA50000 100%),radial-gradient(160% 154% at 711px -303px, #FF4500FF 0%, #FFA500FF 100%)",
    spring:
      "repeating-linear-gradient(315deg, #FF69B42E 92%, #E6E6FA00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FFB6C112 30%, #FFC0CB14 39%),radial-gradient(99% 99% at 109% 2%, #FFC0CBFF 0%, #E6E6FA00 100%),radial-gradient(99% 99% at 21% 78%, #FF69B4FF 0%, #E6E6FA00 100%),radial-gradient(160% 154% at 711px -303px, #FF69B4FF 0%, #E6E6FAFF 100%)",
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
  boxShadows: createColoredBoxShadows({
    phone:
      "repeating-linear-gradient(315deg, #FF6B6B2E 92%, #FF450000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF8A6512 30%, #FFB34714 39%),radial-gradient(99% 99% at 109% 2%, #FFD700FF 0%, #FF450000 100%),radial-gradient(99% 99% at 21% 78%, #FF6B6BFF 0%, #FF450000 100%),radial-gradient(160% 154% at 711px -303px, #FF6B6BFF 0%, #FFD700FF 100%)",
    email:
      "repeating-linear-gradient(315deg, #FF6B6B2E 92%, #4ECDC400 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF8A6512 30%, #4ECDC414 39%),radial-gradient(99% 99% at 109% 2%, #64B5F6FF 0%, #4ECDC400 100%),radial-gradient(99% 99% at 21% 78%, #FF6B6BFF 0%, #4ECDC400 100%),radial-gradient(160% 154% at 711px -303px, #FF6B6BFF 0%, #64B5F6FF 100%)",
    github:
      "repeating-linear-gradient(315deg, #4ECDC42E 92%, #2C3E5000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #64B5F612 30%, #45B7D114 39%),radial-gradient(99% 99% at 109% 2%, #34495EFF 0%, #2C3E5000 100%),radial-gradient(99% 99% at 21% 78%, #4ECDC4FF 0%, #2C3E5000 100%),radial-gradient(160% 154% at 711px -303px, #4ECDC4FF 0%, #34495EFF 100%)",
    linkedin:
      "repeating-linear-gradient(315deg, #96CEB42E 92%, #4CAF5000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #81C78412 30%, #8BC34A14 39%),radial-gradient(99% 99% at 109% 2%, #DDA0DDFF 0%, #4CAF5000 100%),radial-gradient(99% 99% at 21% 78%, #96CEB4FF 0%, #4CAF5000 100%),radial-gradient(160% 154% at 711px -303px, #96CEB4FF 0%, #DDA0DDFF 100%)",
    whatsapp:
      "repeating-linear-gradient(315deg, #00FFFF2E 92%, #073AFF00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #00FFFF12 30%, #073AFF14 39%),radial-gradient(99% 99% at 109% 2%, #00C9FFFF 0%, #073AFF00 100%),radial-gradient(99% 99% at 21% 78%, #7B00FFFF 0%, #073AFF00 100%),radial-gradient(160% 154% at 711px -303px, #FF0000FF 0%, #FFF107FF 100%)",
    telegram:
      "repeating-linear-gradient(315deg, #FF6B6B2E 92%, #FF69B400 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF8A6512 30%, #FFB34714 39%),radial-gradient(99% 99% at 109% 2%, #FFD700FF 0%, #FF69B400 100%),radial-gradient(99% 99% at 21% 78%, #FF6B6BFF 0%, #FF69B400 100%),radial-gradient(160% 154% at 711px -303px, #FF6B6BFF 0%, #FF69B4FF 100%)",
    warm: "conic-gradient(from 180deg, #FF6B6B, #FF8A65, #FFB347, #FFD700, #FFEAA7)",
    coolWarm:
      "conic-gradient(from 180deg, #FF6B6B, #FF8A65, #4ECDC4, #64B5F6, #45B7D1)",
    cool: "conic-gradient(from 180deg, #4ECDC4, #64B5F6, #45B7D1, #2C3E50, #34495E)",
    neutral:
      "conic-gradient(from 180deg, #96CEB4, #81C784, #4CAF50, #8BC34A, #DDA0DD)",
    dark: "conic-gradient(from 180deg, #2C3E50, #34495E, #4ECDC4, #64B5F6, #45B7D1)",
    sunset:
      "conic-gradient(from 180deg, #FF6B6B, #FF8A65, #FFB347, #FFD700, #FFEAA7)",
    ocean:
      "repeating-linear-gradient(315deg, #0069942E 92%, #1E3A8A00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #4ECDC412 30%, #64B5F614 39%),radial-gradient(99% 99% at 109% 2%, #64B5F6FF 0%, #1E3A8A00 100%),radial-gradient(99% 99% at 21% 78%, #006994FF 0%, #1E3A8A00 100%),radial-gradient(160% 154% at 711px -303px, #006994FF 0%, #1E3A8AFF 100%)",
    forest:
      "repeating-linear-gradient(315deg, #228B222E 92%, #00CED100 100%),repeating-radial-gradient(75% 75% at 238% 218%, #32CD3212 30%, #90EE9014 39%),radial-gradient(99% 99% at 109% 2%, #90EE90FF 0%, #00CED100 100%),radial-gradient(99% 99% at 21% 78%, #228B22FF 0%, #00CED100 100%),radial-gradient(160% 154% at 711px -303px, #228B22FF 0%, #00CED1FF 100%)",
    galaxy:
      "repeating-linear-gradient(315deg, #2C3E502E 92%, #F39C1200 100%),repeating-radial-gradient(75% 75% at 238% 218%, #8E44AD12 30%, #9B59B614 39%),radial-gradient(99% 99% at 109% 2%, #9B59B6FF 0%, #F39C1200 100%),radial-gradient(99% 99% at 21% 78%, #2C3E50FF 0%, #F39C1200 100%),radial-gradient(160% 154% at 711px -303px, #2C3E50FF 0%, #F39C12FF 100%)",
    aurora:
      "repeating-linear-gradient(315deg, #00CED12E 92%, #7FFFD400 100%),repeating-radial-gradient(75% 75% at 238% 218%, #20B2AA12 30%, #48D1CC14 39%),radial-gradient(99% 99% at 109% 2%, #48D1CCFF 0%, #7FFFD400 100%),radial-gradient(99% 99% at 21% 78%, #00CED1FF 0%, #7FFFD400 100%),radial-gradient(160% 154% at 711px -303px, #00CED1FF 0%, #7FFFD4FF 100%)",
    fire: "repeating-linear-gradient(315deg, #FF45002E 92%, #FFA50000 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FF634712 30%, #FF7F5014 39%),radial-gradient(99% 99% at 109% 2%, #FF7F50FF 0%, #FFA50000 100%),radial-gradient(99% 99% at 21% 78%, #FF4500FF 0%, #FFA50000 100%),radial-gradient(160% 154% at 711px -303px, #FF4500FF 0%, #FFA500FF 100%)",
    spring:
      "repeating-linear-gradient(315deg, #FF69B42E 92%, #E6E6FA00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #FFB6C112 30%, #FFC0CB14 39%),radial-gradient(99% 99% at 109% 2%, #FFC0CBFF 0%, #E6E6FA00 100%),radial-gradient(99% 99% at 21% 78%, #FF69B4FF 0%, #E6E6FA00 100%),radial-gradient(160% 154% at 711px -303px, #FF69B4FF 0%, #E6E6FAFF 100%)",
  }),
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

// Gradient utility function with switch case
export const getGradient = (gradientType: ContactCardType, theme: Theme) => {
  switch (gradientType) {
    case "email":
      return theme.gradients.email;
    case "phone":
      return theme.gradients.phone;
    case "github":
      return theme.gradients.github;
    case "linkedin":
      return theme.gradients.linkedin;
    case "whatsapp":
      return theme.gradients.whatsapp;
    case "telegram":
      return theme.gradients.telegram;
  }
};

// Alternative: Direct gradient access without switch case
export const gradients = {
  phone: "linear-gradient(to right, #FF6B6B, #FF8A65, #FFEAA7)",
  email:
    "linear-gradient(to right, #FF6B6B, #FF8A65, #4ECDC4, #64B5F6, #45B7D1)",
  github: "linear-gradient(to right, #4ECDC4, #64B5F6, #45B7D1)",
  linkedin: "linear-gradient(to right, #96CEB4, #81C784, #DDA0DD)",
  whatsapp: "linear-gradient(to right, #2C3E50, #34495E, #4ECDC4)",
  telegram:
    "linear-gradient(to right, #FF6B6B, #FF8A65, #FFB347, #FFD700, #FF69B4)",
};
