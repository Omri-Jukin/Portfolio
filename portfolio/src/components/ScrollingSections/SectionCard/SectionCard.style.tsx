import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const SectionContainer = styled(Box)(({ theme }) => ({
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

export const SectionTitle = styled(Box)(({ theme }) => ({
  fontSize: "clamp(2rem, 6vw, 3rem)",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  textAlign: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
    marginBottom: theme.spacing(1.5),
  },
}));

export const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(6),
  textAlign: "center",
  maxWidth: "600px",
  margin: "0 auto",
  width: "100%",
}));

export const SectionContent = styled(Box)(() => ({
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
}));
