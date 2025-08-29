import { Chip, ChipProps } from "@mui/material";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantMap: Record<string, ChipProps['color']> = {
    default: "default",
    primary: "primary",
    secondary: "secondary",
    success: "success",
    warning: "warning",
    danger: "error",
  };

  const sizeMap = {
    sm: "small",
    md: "medium",
    lg: "large",
  };

  return (
    <Chip
      label={children}
      color={variantMap[variant]}
      size={sizeMap[size] as "small" | "medium" | "large"}
      className={className}
      sx={{
        borderRadius: "16px",
        fontWeight: 500,
      }}
    />
  );
}
