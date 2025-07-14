import { Typography } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import { TypographyProps } from "./Typography.type";

export const StyledTypography = styled(Typography)<TypographyProps>(
  ({ theme, variant, weight, color, align, margin }) => {
    const currentTheme = theme || createTheme();
    return {
      fontSize: currentTheme.typography[variant || "body1"]?.fontSize,
      fontWeight: weight === "light" ? 300 : weight === "normal" ? 400 : 700,
      color:
        color === "primary"
          ? theme.palette.primary.main
          : color === "secondary"
          ? theme.palette.secondary.main
          : color === "textPrimary"
          ? theme.palette.text.primary
          : theme.palette.text.secondary,
      textAlign: align,
      marginBottom: margin?.bottom,
      marginTop: margin?.top,
      marginLeft: margin?.left,
      marginRight: margin?.right,
    };
  }
);
