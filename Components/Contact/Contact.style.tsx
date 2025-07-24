import { styled } from "@mui/material/styles";
import { Box, Typography, Card, Button } from "@mui/material";

export const ContactContainer = styled(Box)(({ theme }) => ({
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

export const ContactTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 600,
  textAlign: "center",
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

export const ContactSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  textAlign: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

export const ContactForm = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  maxWidth: "600px",
  width: "100%",
  textAlign: "center",
}));

export const ContactDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

export const ContactButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 500,
  padding: theme.spacing(1.5, 3),
  fontSize: "1rem",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));
