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
  maxWidth: "500px", // Optimized width for cube effect
  width: "100%",
  margin: "0 auto",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(0, 4),
  height: "450px", // Optimized height for cube effect

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
    height: "100% !important",
    display: "flex !important",
    justifyContent: "center",
    alignItems: "center",
    // For cube effect - ensure proper 3D rendering
    transformOrigin: "center center",
    background: "transparent !important",
    // Ensure consistent positioning for cube faces
    position: "relative",
    // Enable 3D transforms for cube effect
    backfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
    // Ensure consistent sizing
    flexShrink: 0,
    boxSizing: "border-box",
  },

  // Cube effect specific styling
  "& .swiper-cube-shadow": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(0, 0, 0, 0.6)"
        : "rgba(0, 0, 0, 0.3)",
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
  height: "350px", // Optimized height for cube effect
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "420px", // Optimized for cube effect
  margin: "0 auto",
  background: `${theme.palette.background.paper} !important`, // Ensure solid background
  // Enhanced box shadow for cube effect
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 10px 30px rgba(150, 206, 180, 0.3), 0 6px 20px rgba(0, 0, 0, 0.4) !important"
      : "0 10px 30px rgba(78, 205, 196, 0.25), 0 6px 20px rgba(0, 0, 0, 0.15) !important",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  zIndex: 1,
  overflow: "hidden", // Prevent content overflow
  // Ensure proper 3D rendering for cube effect
  backfaceVisibility: "hidden",
  transform: "translateZ(0)", // Force hardware acceleration
  transformStyle: "preserve-3d",

  "&:hover": {
    transform: "translateY(-4px) translateZ(0)", // Enhanced hover effect for cube
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 15px 40px rgba(150, 206, 180, 0.4), 0 8px 25px rgba(0, 0, 0, 0.5) !important"
        : "0 15px 40px rgba(78, 205, 196, 0.35), 0 8px 25px rgba(0, 0, 0, 0.2) !important",
    zIndex: 2,
  },

  [theme.breakpoints.down("md")]: {
    maxWidth: "380px",
    height: "330px",
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    margin: "0 auto",
    width: "calc(100% - 32px)",
    maxWidth: "300px",
    height: "300px",
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
