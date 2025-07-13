import { styled } from "@mui/material/styles";
import { Box, Typography, Button, Card, buttonClasses } from "@mui/material";

export const StyledPageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #1a1a1a 0%,#787878 100%)"
      : "linear-gradient(135deg, #f8fafc 0%,#d1d1d1 100%)",
}));

export const StyledHeroContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(8),
}));

export const StyledHeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(3),
}));

export const StyledHeroDescription = styled(Typography)(({ theme }) => ({
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: 1.6,
  marginBottom: theme.spacing(4),
}));

export const StyledButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "center",
  flexWrap: "wrap",
}));

export const StyledHeroButton = styled(Button)(({ theme }) => ({
  paddingInline: theme.spacing(4),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  [buttonClasses.endIcon]: {
    ...(theme.direction === "rtl" ? { display: "block" } : { display: "none" }),
  },
  [buttonClasses.startIcon]: {
    ...(theme.direction === "rtl" ? { display: "none" } : { display: "block" }),
  },
}));

export const StyledSectionCard = styled(Card)(({ theme }) => ({
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  background:
    theme.palette.mode === "dark"
      ? "rgba(26, 26, 26, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
}));

export const StyledGridContainer = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2rem",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "1fr",
  },
}));

export const StyledIconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const StyledSectionIcon = styled(Box)(({ theme }) => ({
  fontSize: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > svg": {
    fontSize: "inherit",
    width: "1em",
    height: "1em",
  },
  ...(theme.direction === "rtl"
    ? { marginLeft: theme.spacing(1.5) }
    : { marginRight: theme.spacing(1.5) }),
}));

export const StyledSectionTitle = styled(Typography)({
  fontWeight: 600,
});

export const StyledSectionDescription = styled(Typography)({
  lineHeight: 1.6,
});

export const StyledSectionButton = styled(Button)({
  textTransform: "none",
  fontWeight: 500,
});
