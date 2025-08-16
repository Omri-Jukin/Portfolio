import { styled } from "@mui/material/styles";
import { Box, Button, Card, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

export const ProjectsContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 2.5, 2, 2.5),
  width: "100%",
  maxWidth: "1200px",
  overflow: "visible",
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2.5, 5, 2.5, 5),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1, 2, 1),
    width: "100%",
    maxWidth: "100%",
    overflow: "visible",
  },
}));

export const ProjectsSwiperContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  maxWidth: "1000px",
  width: "100%",
  margin: "0 auto",
  position: "relative",
  overflowY: "visible",
  overflowX: "visible",
  boxSizing: "border-box",
  padding: theme.spacing(0, 1),

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

  // Fade effect for slides based on distance from center
  "& .swiper-slide": {
    transition: "all 0.6s ease-in-out",
    opacity: 0.01,
    transform: "scale(0.85)",
    filter: "blur(1px)",
  },

  "& .swiper-slide-active": {
    opacity: 1,
    transform: "scale(1)",
    filter: "blur(0px)",
    zIndex: 2,
  },

  "& .swiper-slide-prev": {
    opacity: 0.15,
    transform: "scale(0.9)",
    filter: "blur(0.5px)",
    zIndex: 1,
  },

  "& .swiper-slide-next": {
    opacity: 0.2,
    transform: "scale(0.9)",
    filter: "blur(0.5px)",
    zIndex: 1,
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
    maxWidth: "100%",
    overflow: "visible",

    // Mobile fade effect
    "& .swiper-slide": {
      opacity: 0.4,
      transform: "scale(0.8)",
      filter: "blur(1.5px)",
    },

    "& .swiper-slide-active": {
      opacity: 1,
      transform: "scale(1)",
      filter: "blur(0px)",
    },

    "& .swiper-slide-prev, & .swiper-slide-next": {
      opacity: 0.5,
      transform: "scale(0.85)",
      filter: "blur(1px)",
    },
  },

  // Ensure Swiper container is properly sized
  "& .swiper": {
    width: "100%",
    maxWidth: "100%",
    overflow: "visible",
  },

  // Mobile-specific Swiper constraints
  [theme.breakpoints.down("sm")]: {
    "& .swiper": {
      width: "100% !important",
      maxWidth: "100% !important",
      overflow: "visible !important",
    },
  },
}));

export const ProjectCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "100%",
  minHeight: "200px",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "350px",
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
    minHeight: "180px",
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
  wordWrap: "break-word",
  overflowWrap: "break-word",
  hyphens: "auto",

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

export const SwiperContainer = styled(Swiper)({
  width: "100%",
  maxWidth: "100%",
  overflow: "visible",
  overflowY: "visible",
  overflowX: "visible",

  // Ensure proper slide sizing and fade effect
  "& .swiper-wrapper": {
    display: "flex",
    alignItems: "stretch",
  },

  "& .swiper-slide": {
    height: "auto",
    display: "flex",
    width: "100%",
    maxWidth: "100%",
    opacity: 0.01,
    transform: "scale(0.85)",
    filter: "blur(1px)",
    transition: "all 0.6s ease-in-out",
  },

  // Active slide styling
  "& .swiper-slide-active": {
    opacity: 1,
    transform: "scale(1)",
    filter: "blur(0px)",
    zIndex: 2,
  },

  // Adjacent slides styling
  "& .swiper-slide-prev, & .swiper-slide-next": {
    opacity: 0.2,
    transform: "scale(0.9)",
    filter: "blur(0.5px)",
    zIndex: 1,
  },

  // Mobile responsive styles
  "@media (max-width: 600px)": {
    "& .swiper-slide": {
      opacity: 0.4,
      transform: "scale(0.8)",
      filter: "blur(1.5px)",
    },

    "& .swiper-slide-active": {
      opacity: 1,
      transform: "scale(1)",
      filter: "blur(0px)",
    },

    "& .swiper-slide-prev, & .swiper-slide-next": {
      opacity: 0.5,
      transform: "scale(0.85)",
      filter: "blur(1px)",
    },
  },
});

export const SwiperSlideContainer = styled(SwiperSlide)({
  width: "100%",
  maxWidth: "100%",
  height: "auto",
  display: "flex",
});
