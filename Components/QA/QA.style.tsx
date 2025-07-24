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
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
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
