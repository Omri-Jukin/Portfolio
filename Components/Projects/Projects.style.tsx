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
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  maxWidth: "800px",
  width: "100%",
  margin: "0 auto",
  position: "relative",
  overflow: "visible",
  boxSizing: "border-box",
  padding: theme.spacing(0, 2),

  // Cube effect specific styling - ensure clean transitions
  "& .swiper": {
    perspective: "1200px", // Enhanced 3D perspective
  },

  "& .swiper-wrapper": {
    transformStyle: "preserve-3d",
  },

  "& .swiper-slide": {
    backfaceVisibility: "hidden",
    outline: "none", // Remove any outline that might cause gaps
    border: "none", // Remove any border that might cause gaps
  },

  "& .swiper-cube-shadow": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(0, 0, 0, 0.15)",
    borderRadius: "8px", // Slightly rounded shadow for softer appearance
  },

  // Remove any slide shadows that might interfere
  "& .swiper-slide-shadow-left, & .swiper-slide-shadow-right, & .swiper-slide-shadow-top, & .swiper-slide-shadow-bottom": {
    display: "none !important",
  },

  // Custom Swiper navigation styling
  [`& .swiper-button-next,
    & .swiper-button-prev`]: {
    opacity: 1,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "50%",
    width: "44px",
    height: "44px",
    zIndex: 10,
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
    bottom: "10px",
    position: "relative",
    zIndex: 10,
  },

  "& .swiper-pagination-bullet": {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.3,
    margin: "0 6px",
    "&.swiper-pagination-bullet-active": {
      opacity: 1,
      transform: "scale(1.2)",
    },
  },

  // Responsive adjustments
  [theme.breakpoints.down("md")]: {
    maxWidth: "450px",
    height: "380px",
  },

  [theme.breakpoints.down("sm")]: {
    [`& .swiper-button-next,
      & .swiper-button-prev`]: {
      display: "none",
    },
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 1),
    width: "100%",
    maxWidth: "100%",
    height: "350px",
  },
}));

export const ProjectCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "400px",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  background: theme.palette.background.paper,
  // Minimal shadow that won't interfere with cube effect
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 4px 12px rgba(0, 0, 0, 0.2)"
      : "0 4px 12px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "hidden",
  border: "none", // Ensure no border that might cause gaps
  outline: "none", // Ensure no outline that might cause gaps
  
  "&:hover": {
    transform: "translateY(-2px)", // Reduced to not interfere with cube
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 6px 16px rgba(0, 0, 0, 0.25)"
        : "0 6px 16px rgba(0, 0, 0, 0.12)",
  },

  [theme.breakpoints.down("md")]: {
    maxWidth: "500px",
    height: "380px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    margin: "0 auto",
    width: "calc(100% - 32px)",
    maxWidth: "350px",
    height: "350px",
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
