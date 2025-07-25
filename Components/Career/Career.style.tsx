import { styled } from "@mui/material/styles";
import { Box, Typography, Card, Button } from "@mui/material";

export const CareerContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  maxWidth: "1200px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

export const CareerTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h1.fontSize,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

export const CareerSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  fontWeight: "normal",
}));

export const CareerDescription = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(6),
  fontSize: "1.1rem",
  lineHeight: 1.6,
  maxWidth: "800px",
  margin: "0 auto 3rem auto",
}));

export const ExperienceCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "translateY(-4px)",
  },
}));

export const ExperienceHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const ExperienceTime = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

export const ExperienceDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const CallToActionBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}));

export const CallToActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: "bold",
}));
