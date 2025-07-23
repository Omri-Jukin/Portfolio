import { styled } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";

export const StyledQACard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  background: theme.palette.background.paper,
  border: "none",
  boxShadow: theme.shadows[2],
  borderLeft: `3px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, 
      ${theme.palette.primary.main}08 0%, 
      transparent 50%, 
      ${theme.palette.secondary.main}08 100%)`,
    opacity: 0,
    transition: "opacity 0.4s ease",
    zIndex: 0,
  },
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: `0 20px 40px ${theme.palette.primary.main}20, 0 10px 20px rgba(0,0,0,0.1)`,
    borderLeft: `3px solid ${theme.palette.primary.dark}`,
    "&::before": {
      opacity: 1,
    },
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
}));

export const QAQuestion = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

export const QAAnswer = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));
