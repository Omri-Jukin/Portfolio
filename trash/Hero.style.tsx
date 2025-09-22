import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";

export const HeroContainer = styled("section")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 4rem)",
  paddingTop: theme.spacing(16),
  paddingBottom: theme.spacing(12),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  isolation: "isolate",
  [theme.breakpoints.down("md")]: {
    paddingTop: theme.spacing(14),
    paddingBottom: theme.spacing(10),
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(12),
  },
}));

export const HeroInner = styled(Box)(({ theme }) => ({
  display: "grid",
  width: "100%",
  maxWidth: 1200,
  gap: theme.spacing(8),
  alignItems: "center",
  gridTemplateColumns: "minmax(0, 1fr)",
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
    gap: theme.spacing(10),
  },
}));

export const HeroBadge = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.75),
  borderRadius: 9999,
  background:
    theme.palette.mode === "dark"
      ? "rgba(34, 211, 238, 0.12)"
      : "rgba(124, 58, 237, 0.1)",
  color: theme.palette.primary.main,
  fontSize: theme.typography.pxToRem(12),
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontWeight: 600,
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  fontFamily: "var(--font-anton), var(--font-inter), system-ui",
  backgroundImage:
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, #7c3aed 0%,#2989d8 100%)`
      : `linear-gradient(135deg, #0ea5e9 0%,#7c3aed 100%)`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.04em",
  fontWeight: 800,
  fontSize: theme.typography.pxToRem(64),
  lineHeight: 1.05,
  [theme.breakpoints.down("lg")]: {
    fontSize: theme.typography.pxToRem(54),
  },
  [theme.breakpoints.down("md")]: {
    fontSize: theme.typography.pxToRem(44),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: theme.typography.pxToRem(36),
  },
})).withComponent("h1");

export const HeroTitleHighlight = styled("span")(({ theme }) => ({
  display: "block",
  marginTop: theme.spacing(1),
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(90deg, #22D3EE 0%, #7C3AED 60%, #22D3EE 100%)"
      : "linear-gradient(90deg, #0EA5E9 0%, #7C3AED 60%, #0EA5E9 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  maxWidth: 640,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.pxToRem(18),
  lineHeight: 1.7,
  [theme.breakpoints.down("sm")]: {
    fontSize: theme.typography.pxToRem(16),
  },
})).withComponent("p");

export const HeroActions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

export const HeroPrimaryButton = styled(Button)(({ theme }) => ({
  minWidth: 180,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1.5),
  fontWeight: 700,
  fontSize: theme.typography.pxToRem(16),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[8],
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[10],
  },
}));

export const HeroSecondaryButton = styled(Button)(({ theme }) => ({
  minWidth: 180,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1.5),
  fontWeight: 600,
  fontSize: theme.typography.pxToRem(16),
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(34, 211, 238, 0.08)"
      : "rgba(14, 165, 233, 0.08)",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(34, 211, 238, 0.16)"
        : "rgba(14, 165, 233, 0.16)",
  },
}));

export const HeroAvailability = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.pxToRem(15),
  [theme.breakpoints.down("sm")]: {
    fontSize: theme.typography.pxToRem(14),
  },
})).withComponent("p");

export const HeroMetricsGrid = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  display: "grid",
  gap: theme.spacing(2),
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
}));

export const HeroMetricCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(17, 23, 34, 0.85)"
      : "rgba(255, 255, 255, 0.8)",
  boxShadow: theme.shadows[6],
  backdropFilter: "blur(12px)",
}));

export const HeroMetricValue = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(32),
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
})).withComponent("span");

export const HeroMetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(14),
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
})).withComponent("span");

export const HeroVisual = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: theme.spacing(48),
}));

export const HeroVisualFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(3),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(124, 58, 237, 0.2))"
      : "linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(124, 58, 237, 0.18))",
  boxShadow: "0 25px 70px rgba(15, 23, 42, 0.35)",
  overflow: "hidden",
  minWidth: theme.spacing(38),
  minHeight: theme.spacing(38),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    minWidth: theme.spacing(34),
    minHeight: theme.spacing(34),
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: theme.spacing(28),
    minHeight: theme.spacing(28),
  },
}));

export const HeroVisualAccent = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: "10%",
  borderRadius: "32px",
  background:
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.35), transparent 55%)"
      : "radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.35), transparent 55%)",
  filter: "blur(45px)",
  opacity: 0.7,
  pointerEvents: "none",
  zIndex: -1,
}));
