import { Theme } from "@mui/material/styles";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2";

export type TypographyWeight = "light" | "normal" | "bold";

export type TypographyColor =
  | "primary"
  | "secondary"
  | "textPrimary"
  | "textSecondary";

export type TypographyAlign = "left" | "center" | "right";

export type TypographyProps = {
  children: React.ReactNode;
  theme?: Theme;
  variant?: TypographyVariant;
  component?: React.ElementType;
  gutterBottom?: boolean;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TypographyAlign;
  margin?: {
    bottom?: string;
    top?: string;
    left?: string;
    right?: string;
  };
};
