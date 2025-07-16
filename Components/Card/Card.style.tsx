import { styled } from "@mui/material/styles";
import {
  Card as MuiCard,
  Box,
  Typography,
  IconButton as MuiIconButton,
} from "@mui/material";

export const StyledCardContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  background: "transparent",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[200]
  }`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.4)"
        : "0 8px 32px rgba(0, 0, 0, 0.15)",
  },
  "&:focus-within": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const StyledCardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

export const StyledCardDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  lineHeight: 1.6,
}));

export const StyledCardDate = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.8,
});

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
  width: "fit-content",
  height: "fit-content",
  maxWidth: "2rem",
  maxHeight: "2rem",
  padding: 0,
  margin: 0,
  borderRadius: "50%",
  backgroundColor: "transparent",
  border: "none",
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg) scale(1)",
    },
    "100%": {
      transform: "rotate(360deg) scale(1.2)",
    },
  },
  "&:hover": {
    transform: "rotate(360deg)",
    transition: "transform 1s linear",
    animation: "spin 1s linear infinite",
    animationDirection: "alternate",
  },
}));
