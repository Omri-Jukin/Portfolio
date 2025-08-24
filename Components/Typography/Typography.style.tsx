import { Typography } from "@mui/material";
import { createTheme, styled, keyframes } from "@mui/material/styles";
import { TypographyProps } from "./Typography.type";
import { Box } from "@mui/material";
import { mixins } from "#/lib/styles";

// Keyframe for marquee animation using centralized approach
const marqueeAnimation = keyframes`
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
`;

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
  ...mixins.flexCenter,
  overflow: "hidden",
}));

export const MarqueeTextContent = styled(Typography)({
  position: "absolute",
  minWidth: "100%",
  ...mixins.textEllipsis,
  whiteSpace: "nowrap",
  animation: `${marqueeAnimation} 16s infinite linear`,
});

export const MarqueeBlur = styled(Box)(({ theme }) => ({
  ...mixins.absoluteCenter,
  ...mixins.fullSize,
  ...mixins.flexCenter,
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

export const MarqueeClear = styled(Box)(() => ({
  ...mixins.absoluteCenter,
  ...mixins.fullSize,
  ...mixins.flexCenter,
}));
