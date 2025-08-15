import { styled } from "@mui/material/styles";
import { Box, Button, Card, Typography } from "@mui/material";

export const ProjectsContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 2.5, 2, 2.5),
  width: "100%",
  maxWidth: "100vw",
  overflow: "hidden",
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2.5, 5, 2.5, 5),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1, 2, 1),
    width: "100%",
    maxWidth: "100vw",
    overflow: "hidden",
  },
}));

export const ProjectsSwiperContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  maxWidth: "1400px",
  width: "100%",
  margin: "0 auto",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",

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
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 1),
    width: "100%",
    maxWidth: "100vw",
    overflow: "hidden",
  },

  // Ensure Swiper container is properly sized
  "& .swiper": {
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },

  "& .swiper-slide": {
    width: "100%",
    maxWidth: "100%",
  },

  // Mobile-specific Swiper constraints
  [theme.breakpoints.down("sm")]: {
    "& .swiper": {
      width: "100% !important",
      maxWidth: "100vw !important",
      overflow: "hidden !important",
    },
    "& .swiper-slide": {
      width: "100% !important",
      maxWidth: "100vw !important",
    },
  },
}));

export const ProjectCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 36px rgba(150, 206, 180, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4), 3px 3px 12px rgba(0, 0, 0, 0.25)"
        : "0 12px 36px rgba(78, 205, 196, 0.3), 0 6px 18px rgba(0, 0, 0, 0.15), 3px 3px 12px rgba(0, 0, 0, 0.1)",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    margin: theme.spacing(0, 0.5),
    width: "100%",
    maxWidth: "100%",
  },
}));

export const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
  },
}));

export const ProjectDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  lineHeight: 1.6,
  flex: 1, // Push button to bottom

  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
    lineHeight: 1.5,
  },
}));

export const ProjectButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: 500,
  marginTop: "auto", // Push to bottom of card

  [theme.breakpoints.down("sm")]: {
    fontSize: "0.875rem",
    padding: theme.spacing(0.75, 2),
  },

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
