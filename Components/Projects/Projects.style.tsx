import { styled } from "@mui/material/styles";
import { Box, Button, Card, Typography } from "@mui/material";

export const ProjectsContainer = styled(Box)(({ theme }) => ({
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

export const ProjectsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(4),
  marginTop: theme.spacing(6),
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
}));

export const ProjectCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

export const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const ProjectDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  lineHeight: 1.6,
}));

export const ProjectButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 500,
  "&.outlined": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  "&.contained": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));
