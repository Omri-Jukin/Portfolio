import { Typography } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import { TypographyProps } from "./Typography.type";
import { Box } from "@mui/material";

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

export const GooeyText = styled(Typography)(() => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "inherit",
  textAlign: "center",
}));

export const MarqueeText = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  height: "2em",
  fontSize: "5em",
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
}));

export const MarqueeTextContent = styled(Typography)({
  position: "absolute",
  minWidth: "100%",
  whiteSpace: "nowrap",
  animation: "marquee 16s infinite linear",
  "@keyframes marquee": {
    "0%": { transform: "translateX(100vw)" },
    "100%": { transform: "translateX(-100%)" },
  },
});

export const MarqueeBlur = styled(Box)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  backgroundColor: theme.palette.background.default,
  backgroundImage: `
    linear-gradient(to right, ${theme.palette.background.default}, 1rem, transparent 50%),
    linear-gradient(to left, ${theme.palette.background.default}, 1rem, transparent 50%)
  `,
  filter: "contrast(15)",
  "& p": {
    filter: "blur(0.07em)",
  },
}));

export const MarqueeClear = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
});
