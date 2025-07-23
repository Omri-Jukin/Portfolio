import { styled } from "@mui/material/styles";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";

export const ScrollingHeroTitle = styled(Box)(({ theme }) => ({
  fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  lineHeight: 1.1,
  textShadow:
    theme.palette.mode === "dark"
      ? "0 3px 12px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.7)"
      : "0 3px 12px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1)",
  position: "relative",
  zIndex: 2,
  [theme.breakpoints.down("sm")]: {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    marginBottom: theme.spacing(2),
  },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: 1.6,
  textShadow:
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.6)"
      : "0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1)",
  position: "relative",
  zIndex: 2,
}));

export const CTAButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  fontSize: "1.1rem",
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  textTransform: "none",
  margin: theme.spacing(1),
  minHeight: "48px", // Accessibility: minimum touch target size
  "&.primary": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&:focus-visible": {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },
  },
  "&.secondary": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    border: `2px solid ${theme.palette.text.primary}`,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:focus-visible": {
      outline: `3px solid ${theme.palette.text.primary}`,
      outlineOffset: "2px",
    },
  },
}));

export const ScrollingSectionTitle = styled(Box)(({ theme }) => ({
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

export const SkillTag = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[100]
      : theme.palette.grey[800],
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  margin: theme.spacing(0.5),
  textTransform: "uppercase",
  fontWeight: 700,
  fontSize: "0.9rem",
  letterSpacing: "0.5px",
  minHeight: "32px", // Accessibility: minimum touch target size
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  position: "relative",
  overflow: "hidden",

  // Hover effects
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: "translateY(-3px) scale(1.05)",
    boxShadow: `0 8px 25px ${theme.palette.primary.main}40, 0 4px 10px rgba(0,0,0,0.2)`,
    borderColor: theme.palette.primary.dark,
  },

  // Active/Click effects
  "&:active": {
    transform: "translateY(-1px) scale(1.02)",
    transition: "all 0.1s ease",
  },

  // Focus for accessibility
  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
    transform: "translateY(-2px)",
  },

  // Glow effect on hover
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at center, ${theme.palette.primary.main}20 0%, transparent 70%)`,
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
  },

  "&:hover::before": {
    opacity: 1,
  },

  // Ripple effect
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0",
    height: "0",
    borderRadius: "50%",
    background: `${theme.palette.primary.main}30`,
    transform: "translate(-50%, -50%)",
    transition: "width 0.6s, height 0.6s",
    pointerEvents: "none",
  },

  "&:active::after": {
    width: "300px",
    height: "300px",
    transition: "width 0.3s, height 0.3s",
  },
}));

export const QAGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(6),
}));

export const QACard = styled(Paper)(({ theme }) => ({
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

export const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  background: theme.palette.background.default,
  border: "none",
  borderRadius: theme.spacing(2),
  textAlign: "center",
  transition: "all 0.3s ease",
  boxShadow: theme.shadows[2],
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: theme.shadows[12],
    background:
      theme.palette.mode === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
  },
}));

export const ServiceIcon = styled(Box)(({ theme }) => ({
  fontSize: "3rem",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

export const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

export const ServiceDescription = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
}));

export const ServiceButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  "&.primary": {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    },
  },
  "&.secondary": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    border: `2px solid ${theme.palette.text.primary}`,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export const ProjectCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  background: theme.palette.background.paper,
  border: "none",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease",
  boxShadow: theme.shadows[2],
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: theme.shadows[12],
    background:
      theme.palette.mode === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
  },
}));

export const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

export const ProjectDescription = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
}));

export const ProjectButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  marginRight: theme.spacing(1),
  "&.outlined": {
    border: `2px solid ${theme.palette.text.primary}`,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
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

export const ContactForm = styled(Box)(({ theme }) => ({
  maxWidth: "600px",
  margin: "0 auto",
  padding: theme.spacing(4),
  color: theme.palette.text.primary,
  background: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
}));

export const ContactInput = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2, 3),
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  textTransform: "none",
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));
