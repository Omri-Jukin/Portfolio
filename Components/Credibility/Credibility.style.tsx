import { styled } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";
import { HOME_SECTION_WIDTH } from "$/constants";

export const CredibilityContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: HOME_SECTION_WIDTH,
  margin: "0 auto",
  padding: theme.spacing(2, 2, 6),
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3, 3, 7),
  },
}));

export const CredibilityHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: "center",
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
  },
}));

export const CredibilityTitle = styled(Typography)(({ theme }) => ({
  fontSize: "clamp(1.5rem, 3vw, 2rem)",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.75),
})).withComponent("h2");

export const CredibilitySubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  maxWidth: "42rem",
  lineHeight: 1.6,
  marginInline: "auto",
  [theme.breakpoints.up("md")]: {
    marginInline: 0,
  },
}));

export const CredibilityGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(1.5),
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
}));

export const CredibilityCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
  height: "100%",
}));

export const CredibilityLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.75),
}));

export const CredibilityValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.92rem",
  lineHeight: 1.6,
  color: theme.palette.text.primary,
}));

export const SignalsList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
}));

export const SignalItem = styled(Typography)(({ theme }) => ({
  fontSize: "0.92rem",
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(2),
  position: "relative",
  "&::before": {
    content: '"—"',
    position: "absolute",
    left: 0,
    color: theme.palette.primary.main,
  },
}));
