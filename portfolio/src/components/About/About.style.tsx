import { styled } from "@mui/material/styles";
import { Box, Typography, Chip } from "@mui/material";

export const AboutContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4, 2.5, 4, 2.5),
  width: "100%",
  maxWidth: "100vw",
  boxSizing: "border-box",

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6, 5, 6, 5),
  },

  [theme.breakpoints.down("md")]: {
    minHeight: "auto",
    padding: theme.spacing(4, 2, 4, 2),
    justifyContent: "flex-start",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 1.5, 3, 1.5),
  },
}));

export const AboutTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 600,
  textAlign: "center",
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

export const AboutSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  textAlign: "center",
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "1px",
}));

export const AboutDescription = styled(Typography)(({ theme }) => ({
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: 1.8,
  textAlign: "center",
  fontSize: "1.1rem",
  color: theme.palette.text.secondary,
}));

export const SkillsContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

export const SkillsSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: theme.palette.text.secondary,
}));

export const SkillsSwiperContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  minHeight: "fit-content",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  position: "relative",

  // Custom Swiper navigation styling
  [`& .swiper-button-next,
    & .swiper-button-prev`]: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "50%",
    width: "44px",
    height: "44px",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0, 0, 0, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    "&::after": {
      fontSize: "18px",
      fontWeight: "bold",
    },
  },

  "& .swiper-button-next": {
    right: "10px",
  },

  "& .swiper-button-prev": {
    left: "10px",
  },

  // Custom pagination styling
  "& .swiper-pagination": {
    bottom: "0",
  },

  "& .swiper-pagination-bullet": {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.3,
    "&.swiper-pagination-bullet-active": {
      opacity: 1,
    },
  },

  // Responsive adjustments
  [theme.breakpoints.down("sm")]: {
    [`& .swiper-button-next,
      & .swiper-button-prev`]: {
      display: "none",
    },
  },
}));

export const SkillsTagsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

export const SkillTag = styled(Chip)(({ theme }) => ({
  cursor: "pointer",
  opacity: 0.75,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
        : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  },
}));
