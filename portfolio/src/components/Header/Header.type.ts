export type TLayout = "mobile" | "desktop" | "auto";

export interface HeaderProps {
  isDarkMode?: boolean;
  onThemeToggle?: (isDark: boolean) => void;
  isMobile?: boolean | undefined;
  forceLayout?: TLayout;
  onLayoutChange?: (layout: TLayout) => void;
}

// Module augmentation to add custom variants
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    rounded: true;
    pill: true;
    square: true;
  }
  interface ButtonPropsSizeOverrides {
    xs: true;
    xl: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    elevated: true;
    flat: true;
    soft: true;
    rounded: true;
    pill: true;
    square: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    rounded: true;
    square: true;
    pill: true;
  }
  interface ChipPropsSizeOverrides {
    xs: true;
    xl: true;
  }
}
