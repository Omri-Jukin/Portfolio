import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";

import { HOME_SECTION_WIDTH } from "$/constants";

export { HOME_SECTION_WIDTH };

export const HeroContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: HOME_SECTION_WIDTH,
  marginInline: "auto",
  padding: theme.spacing(3, 2, 4),
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4, 3, 5),
  },
}));

export const HeroGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(3),
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "240px minmax(0, 1fr)",
    gap: theme.spacing(4),
    alignItems: "start",
  },
}));

export const HeroProfileColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.up("md")]: {
    justifyContent: "flex-start",
    paddingTop: theme.spacing(0.5),
  },
}));

export const HeroProfileFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 12px 40px rgba(0, 0, 0, 0.35)"
      : "0 12px 32px rgba(0, 0, 0, 0.08)",
  [theme.breakpoints.up("md")]: {
    width: "240px",
    height: "240px",
  },
}));

export const HeroContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  minWidth: 0,
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    textAlign: "left",
  },
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
  fontWeight: 700,
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.primary,
  letterSpacing: "-0.02em",
  lineHeight: 1.15,
})).withComponent("h1");

export const HeroRoleLine = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  letterSpacing: "0.01em",
}));

export const HeroHeadline = styled(Typography)(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1.25),
  color: theme.palette.text.primary,
  lineHeight: 1.55,
  maxWidth: "42rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "1rem",
  },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  maxWidth: "42rem",
  lineHeight: 1.65,
}));

export const HeroStackStrip = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(0.75),
  marginBottom: theme.spacing(2.5),
  maxWidth: "42rem",
  justifyContent: "center",
  [theme.breakpoints.up("md")]: {
    justifyContent: "flex-start",
  },
}));

export const HeroButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  justifyContent: "center",
  [theme.breakpoints.up("md")]: {
    justifyContent: "flex-start",
  },
  "& a": {
    display: "inline-flex",
  },
}));

export const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1, 2.25),
  fontSize: "0.9rem",
  minHeight: "40px",
  "&.primary": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: "none",
    },
  },
  "&.secondary": {
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
    },
  },
}));
