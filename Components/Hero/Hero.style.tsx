import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";

export const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 2.5, 2, 2.5),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2.5, 5, 2.5, 5),
  },
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: "3rem",
  fontWeight: 700,
  textAlign: "center",
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
})).withComponent("h1");

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  textAlign: "center",
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  maxWidth: "800px",
  lineHeight: 1.6,
  [theme.breakpoints.down("md")]: {
    fontSize: "1.1rem",
  },
}));

export const HeroButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

export const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 500,
  padding: theme.spacing(1.5, 3),
  fontSize: "1rem",
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
