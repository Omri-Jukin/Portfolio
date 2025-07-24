import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const ScrollingSectionTitle = styled(Box)(({ theme }) => ({
  fontSize: "clamp(2rem, 6vw, 3rem)",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(5),
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
  paddingBottom: theme.spacing(5),
  paddingTop: theme.spacing(5),
  textAlign: "center",
  maxWidth: "600px",
  margin: "0 auto",
  width: "100%",
}));
