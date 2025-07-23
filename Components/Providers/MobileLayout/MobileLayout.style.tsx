import { Box, styled } from "@mui/material";

export const MobileLayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  backgroundColor: theme.palette.background.paper,
  WebkitOverflowScrolling: "touch",

  // Mobile-specific optimizations
  "& *": {
    WebkitTapHighlightColor: "transparent",
  },

  // Ensure proper touch targets
  "& button, & a": {
    minHeight: "3.5rem",
    minWidth: "3.5rem",
  },

  // Mobile-friendly spacing
  "& .MuiContainer-root": {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },

  // Mobile typography adjustments
  "& .MuiTypography-h1": {
    fontSize: "2rem",
    lineHeight: 1.3,
  },
  "& .MuiTypography-h2": {
    fontSize: "1.75rem",
    lineHeight: 1.4,
  },
  "& .MuiTypography-h3": {
    fontSize: "1.5rem",
    lineHeight: 1.4,
  },
  "& .MuiTypography-h4": {
    fontSize: "1.25rem",
    lineHeight: 1.5,
  },
  "& .MuiTypography-h5": {
    fontSize: "1.125rem",
    lineHeight: 1.5,
  },
  "& .MuiTypography-h6": {
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  "& .MuiTypography-body1": {
    fontSize: "0.875rem",
    lineHeight: 1.6,
  },
  "& .MuiTypography-body2": {
    fontSize: "0.8125rem",
    lineHeight: 1.6,
  },
}));
