import { styled } from "@mui/material/styles";
import { Box, Typography, Card, Button } from "@mui/material";

export const CareerContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
  overflow: "visible", // Changed from hidden to visible to allow hover transforms
  boxSizing: "border-box",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1),
    width: "100%",
    maxWidth: "100vw",
    overflow: "visible", // Changed from hidden to visible for mobile hover effects
  },
}));

export const CareerTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h1.fontSize,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.75rem",
  },
}));

export const CareerSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  fontWeight: "normal",

  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

export const CareerDescription = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontSize: "1.1rem",
  lineHeight: 1.6,
  maxWidth: "800px",
  margin: "0 auto 3rem auto",

  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
    marginBottom: theme.spacing(4),
  },
}));

export const CareerSwiperContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  maxWidth: "1400px",
  width: "100%",
  margin: "0 auto",
  position: "relative",
  overflow: "visible", // Changed from hidden to visible to allow hover transforms
  boxSizing: "border-box",
  padding: theme.spacing(0, 2), // Added padding to accommodate hover transforms

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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 1),
    width: "100%",
    maxWidth: "100vw",
    overflow: "hidden",
  },

  // Ensure Swiper container is properly sized
  "& .swiper": {
    width: "100%",
    maxWidth: "100%",
    overflow: "visible", // Changed from hidden to visible
  },

  "& .swiper-slide": {
    width: "100%",
    maxWidth: "100%",
    overflow: "visible", // Added to ensure slide content is visible
  },

  // Mobile-specific Swiper constraints
  [theme.breakpoints.down("sm")]: {
    "& .swiper": {
      width: "100% !important",
      maxWidth: "100vw !important",
      overflow: "visible !important", // Changed to visible for mobile hover effects
    },
    "& .swiper-slide": {
      width: "100% !important",
      maxWidth: "100vw !important",
      overflow: "visible !important", // Changed to visible for mobile hover effects
    },
  },
}));

export const ExperienceCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  height: "100%",
  minHeight: "400px", // Ensure consistent card height
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  boxSizing: "border-box",
  margin: theme.spacing(1, 0), // Added margin to accommodate hover transform
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "translateY(-4px)",
    zIndex: 1, // Ensure hovered card appears above others
  },

  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1, 0.5), // Updated margin to accommodate hover transform
    width: "100%",
    maxWidth: "100%",
    minHeight: "350px", // Slightly smaller height on mobile
  },
}));

export const ExperienceHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const ExperienceTime = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

export const ExperienceDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  flex: 1, // Push content to fill card height

  // Text truncation and line breaks for long content
  "& .detail-text": {
    wordBreak: "break-word",
    overflowWrap: "break-word",
    lineHeight: 1.6,
    maxHeight: "4.8em", // Limit to 3 lines (1.6 * 3)
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
  },
}));

export const CallToActionBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
}));

export const CallToActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(2),
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: "bold",

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1, 3),
    fontSize: "1rem",
  },
}));
