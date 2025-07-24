import { styled } from "@mui/material/styles";
import { Box, Typography, Card, Button } from "@mui/material";

export const ServicesContainer = styled(Box)(({ theme }) => ({
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

export const ServicesSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  textAlign: "center",
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "1px",
}));

export const ServicesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(4),
  marginTop: theme.spacing(6),
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

export const ServiceCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: "all 0.3s ease-in-out",
  textAlign: "center",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

export const ServiceIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    fontSize: "3rem",
    color: theme.palette.primary.main,
  },
}));

export const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const ServiceDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  lineHeight: 1.6,
}));

export const ServiceButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 500,
  "&.primary": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  "&.secondary": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));
