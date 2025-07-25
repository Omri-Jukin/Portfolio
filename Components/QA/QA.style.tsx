import { styled } from "@mui/material/styles";
import { Box, Typography, Card } from "@mui/material";

export const QAContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 2.5, 2, 2.5),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2.5, 5, 2.5, 5),
  },
}));

export const QATitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 600,
  textAlign: "center",
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

export const QASubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  textAlign: "center",
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "1px",
}));

export const QAGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(3),
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

export const QACard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 36px rgba(150, 206, 180, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4), 3px 3px 12px rgba(0, 0, 0, 0.25)"
        : "0 12px 36px rgba(78, 205, 196, 0.3), 0 6px 18px rgba(0, 0, 0, 0.15), 3px 3px 12px rgba(0, 0, 0, 0.1)",
  },
}));

export const QAQuestion = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const QAAnswer = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));
