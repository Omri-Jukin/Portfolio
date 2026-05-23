import { styled } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";

export const StrengthsContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto",
  padding: theme.spacing(6, 2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(8, 4),
  },
}));

export const StrengthsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

export const StrengthCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  height: "100%",
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
}));

export const StrengthTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 700,
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.primary,
}));

export const StrengthItem = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  lineHeight: 1.55,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.75),
}));
