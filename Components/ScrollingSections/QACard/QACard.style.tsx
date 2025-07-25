import { styled } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";

export const StyledQACard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  background: theme.palette.background.paper,
  border: "none",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
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
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 20px 40px rgba(150, 206, 180, 0.35), 0 10px 20px rgba(0,0,0,0.3)"
        : "0 20px 40px rgba(78, 205, 196, 0.3), 0 10px 20px rgba(0,0,0,0.15)",
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
