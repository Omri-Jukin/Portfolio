import { styled } from "@mui/material/styles";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";

export const SectionContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  minWidth: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  width: "100vw",
  marginLeft: "calc(-50vw + 50%)",
  [theme.breakpoints.down("md")]: {
    minHeight: "auto",
    alignItems: "flex-start",
  },
}));

export const SectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(6, 0),
  },
}));

export const HeroSection = styled(SectionContainer)(({ theme }) => ({
  textAlign: "center",
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.primary.main}05 50%, 
    ${theme.palette.background.default} 100%)`,
  position: "relative",
  overflow: "hidden",
  marginTop: 0,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}08 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
    animation: "heroPulse 6s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  "@keyframes heroPulse": {
    "0%, 100%": {
      opacity: 0.3,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.6,
      transform: "scale(1.05)",
    },
  },
}));

export const HeroBackgroundImage = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "10%",
  right: "5%",
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
  opacity: 0.4,
  zIndex: 0,
  filter: "blur(2px)",
  [theme.breakpoints.down("md")]: {
    width: "80px",
    height: "80px",
    top: "5%",
    right: "10%",
  },
}));

export const HeroBackgroundImage2 = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "15%",
  left: "8%",
  width: "100px",
  height: "100px",
  borderRadius: "16px",
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}12, ${theme.palette.primary.main}12)`,
  opacity: 0.3,
  zIndex: 0,
  filter: "blur(2px)",
  [theme.breakpoints.down("md")]: {
    width: "60px",
    height: "60px",
    bottom: "10%",
    left: "5%",
  },
}));

export const HeroBackgroundImage3 = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "60%",
  right: "15%",
  width: "80px",
  height: "80px",
  borderRadius: "8px",
  background: `linear-gradient(225deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
  opacity: 0.2,
  zIndex: 0,
  filter: "blur(2px)",
  [theme.breakpoints.down("md")]: {
    width: "50px",
    height: "50px",
    top: "70%",
    right: "8%",
  },
}));

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

export const AboutSection = styled(SectionContainer)(({ theme }) => ({
  background: `linear-gradient(45deg, 
    ${theme.palette.background.paper} 0%, 
    ${theme.palette.secondary.main}06 25%, 
    ${theme.palette.background.paper} 50%, 
    ${theme.palette.primary.main}06 75%, 
    ${theme.palette.background.paper} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `conic-gradient(from 0deg at 50% 50%, 
      ${theme.palette.primary.main}05 0deg, 
      transparent 60deg, 
      ${theme.palette.secondary.main}05 120deg, 
      transparent 180deg, 
      ${theme.palette.primary.main}05 240deg, 
      transparent 300deg, 
      ${theme.palette.secondary.main}05 360deg)`,
    animation: "aboutRotate 12s linear infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  "@keyframes aboutRotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const ScrollingSectionTitle = styled(Box)(({ theme }) => ({
  fontSize: "clamp(2rem, 6vw, 3rem)",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  textAlign: "center",
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
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
}));

export const QASection = styled(SectionContainer)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.primary.main}08 25%, 
    ${theme.palette.secondary.main}08 50%, 
    ${theme.palette.background.default} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `radial-gradient(circle at 30% 70%, ${theme.palette.primary.main}15 0%, transparent 40%),
                radial-gradient(circle at 70% 30%, ${theme.palette.secondary.main}15 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}08 0%, transparent 60%)`,
    animation: "floatingOrbs 20s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, 
      transparent 0%, 
      ${theme.palette.primary.main}03 25%, 
      transparent 50%, 
      ${theme.palette.secondary.main}03 75%, 
      transparent 100%)`,
    animation: "shimmer 8s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  "@keyframes floatingOrbs": {
    "0%, 100%": {
      transform: "translate(0, 0) rotate(0deg)",
    },
    "25%": {
      transform: "translate(-20px, -30px) rotate(90deg)",
    },
    "50%": {
      transform: "translate(20px, -20px) rotate(180deg)",
    },
    "75%": {
      transform: "translate(-10px, 20px) rotate(270deg)",
    },
  },
  "@keyframes shimmer": {
    "0%, 100%": {
      opacity: 0.3,
      transform: "translateX(-100%)",
    },
    "50%": {
      opacity: 0.6,
      transform: "translateX(100%)",
    },
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

export const ServicesSection = styled(SectionContainer)(({ theme }) => ({
  background: `linear-gradient(225deg, 
    ${theme.palette.background.paper} 0%, 
    ${theme.palette.primary.main}08 33%, 
    ${theme.palette.background.paper} 66%, 
    ${theme.palette.secondary.main}08 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-100%",
    left: "-100%",
    width: "300%",
    height: "300%",
    background: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.main}12 0%, transparent 30%),
                radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main}12 0%, transparent 30%),
                radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}06 0%, transparent 50%)`,
    animation: "servicesFloat 15s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, 
      transparent 0%, 
      ${theme.palette.primary.main}04 25%, 
      transparent 50%, 
      ${theme.palette.secondary.main}04 75%, 
      transparent 100%)`,
    animation: "servicesWave 10s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  "@keyframes servicesFloat": {
    "0%, 100%": {
      transform: "translate(0, 0) scale(1)",
    },
    "33%": {
      transform: "translate(-30px, -40px) scale(1.1)",
    },
    "66%": {
      transform: "translate(20px, -30px) scale(0.9)",
    },
  },
  "@keyframes servicesWave": {
    "0%, 100%": {
      opacity: 0.2,
      transform: "translateX(-100%) skewX(-15deg)",
    },
    "50%": {
      opacity: 0.4,
      transform: "translateX(100%) skewX(-15deg)",
    },
  },
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

export const ProjectsSection = styled(SectionContainer)(({ theme }) => ({
  background: `linear-gradient(315deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.secondary.main}06 25%, 
    ${theme.palette.background.default} 50%, 
    ${theme.palette.primary.main}06 75%, 
    ${theme.palette.background.default} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `repeating-linear-gradient(45deg, 
      transparent, 
      transparent 20px, 
      ${theme.palette.primary.main}02 20px, 
      ${theme.palette.primary.main}02 40px)`,
    animation: "projectsStripe 8s linear infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `radial-gradient(circle at 40% 60%, ${theme.palette.secondary.main}10 0%, transparent 40%),
                radial-gradient(circle at 60% 40%, ${theme.palette.primary.main}10 0%, transparent 40%)`,
    animation: "projectsGlow 12s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  "@keyframes projectsStripe": {
    "0%": {
      transform: "translateX(-100%)",
    },
    "100%": {
      transform: "translateX(100%)",
    },
  },
  "@keyframes projectsGlow": {
    "0%, 100%": {
      opacity: 0.3,
      transform: "scale(1) rotate(0deg)",
    },
    "50%": {
      opacity: 0.6,
      transform: "scale(1.2) rotate(180deg)",
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

export const ContactSection = styled(SectionContainer)(({ theme }) => ({
  background: `linear-gradient(180deg, 
    ${theme.palette.background.paper} 0%, 
    ${theme.palette.primary.main}04 25%, 
    ${theme.palette.background.paper} 50%, 
    ${theme.palette.secondary.main}04 75%, 
    ${theme.palette.background.paper} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(ellipse at center, 
      ${theme.palette.primary.main}08 0%, 
      transparent 70%)`,
    animation: "contactPulse 4s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-100%",
    left: "-100%",
    width: "300%",
    height: "300%",
    background: `conic-gradient(from 0deg at 50% 50%, 
      transparent 0deg, 
      ${theme.palette.secondary.main}06 90deg, 
      transparent 180deg, 
      ${theme.palette.primary.main}06 270deg, 
      transparent 360deg)`,
    animation: "contactSpin 20s linear infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  "@keyframes contactPulse": {
    "0%, 100%": {
      opacity: 0.3,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.6,
      transform: "scale(1.1)",
    },
  },
  "@keyframes contactSpin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const ContactForm = styled(Box)(({ theme }) => ({
  maxWidth: "600px",
  margin: "0 auto",
  padding: theme.spacing(4),
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
