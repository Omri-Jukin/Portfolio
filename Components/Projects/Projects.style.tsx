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
  marginTop: theme.spacing(6),
  maxWidth: "600px", // Reduced width for cards effect
  width: "100%",
  margin: "0 auto",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(0, 4),
  height: "500px", // Fixed height for cards effect

  // Swiper container specific styles
  "& .swiper": {
    width: "100%",
    height: "100%",
    paddingBottom: "60px", // Space for pagination
    overflow: "visible", // Allow cards to extend beyond container
  },

  // Ensure proper slide sizing for cards effect
  "& .swiper-wrapper": {
    alignItems: "center",
    justifyContent: "center",
  },

  "& .swiper-slide": {
    width: "100% !important",
    height: "auto !important",
    display: "flex !important",
    justifyContent: "center",
    alignItems: "center",
    // For cards effect - ensure slides are properly stacked
    transformOrigin: "center center",
    background: "transparent !important", // Remove any background that might cause dark patches
    boxShadow: "none !important", // Remove any default shadows
    // Ensure consistent positioning for all cards
    position: "relative",
    // Prevent any transform interference
    backfaceVisibility: "hidden",
    // Ensure consistent sizing
    flexShrink: 0,
    minHeight: "auto",
  },

  // Remove any default slide shadows from cards effect
  "& .swiper-slide-shadow": {
    display: "none !important",
  },

  "& .swiper-slide-shadow-left": {
    display: "none !important",
  },

  "& .swiper-slide-shadow-right": {
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
    maxWidth: "500px",
    height: "450px",
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
    height: "400px",
  },
}));

export const ProjectCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: "380px", // Fixed height for consistency
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "400px", // Optimized for cards effect
  margin: "0 auto",
  background: `${theme.palette.background.paper} !important`, // Ensure solid background
  // Use custom box shadow that won't conflict with Swiper's cards effect
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3) !important"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1) !important",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  zIndex: 1,
  overflow: "hidden", // Prevent content overflow
  // Ensure consistent rendering
  backfaceVisibility: "hidden",
  transform: "translateZ(0)", // Force hardware acceleration for consistent rendering
  
  "&:hover": {
    transform: "translateY(-2px) translateZ(0)", // Reduced movement with hardware acceleration
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 36px rgba(150, 206, 180, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4) !important"
        : "0 12px 36px rgba(78, 205, 196, 0.3), 0 6px 18px rgba(0, 0, 0, 0.15) !important",
    zIndex: 2,
  },

  [theme.breakpoints.down("md")]: {
    maxWidth: "350px",
    height: "360px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    margin: "0 auto",
    width: "calc(100% - 32px)",
    maxWidth: "320px",
    height: "320px",
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
