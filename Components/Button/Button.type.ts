import { ButtonProps as MuiButtonProps } from "@mui/material";

export type ButtonProps = Omit<MuiButtonProps, "variant"> & {
  children?: React.ReactNode;
  variant?:
    | "contained"
    | "outlined"
    | "text"
    | "ghost"
    | "gradient"
    | "neon"
    | "glass";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  size?: "small" | "medium" | "large";
  center?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode | string;
  endIcon?: React.ReactNode | string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  title?: string;
};
