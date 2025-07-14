import { styled } from "@mui/material/styles";
import { Card as MuiCard, Box, Typography } from "@mui/material";

export const StyledCardContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  background:
    theme.palette.mode === "dark"
      ? "rgba(26, 26, 26, 0.8)"
      : "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
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
