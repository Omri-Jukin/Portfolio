import { styled } from "@mui/material/styles";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
} from "@mui/material";

export const FormContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "transparent",
})<{ transparent?: boolean }>(({ theme, transparent }) => ({
  padding: theme.spacing(4),
  maxWidth: "600px",
  margin: "0 auto",
  background: transparent
    ? "transparent"
    : theme.palette.mode === "dark"
    ? "rgba(150, 206, 180, 0.08)" // Light green tint using vibrant palette
    : "rgba(255, 255, 255, 0.98)",
  border: `2px solid ${
    theme.palette.mode === "dark"
      ? "#96CEB4" // Light green border using vibrant palette
      : "#4ECDC4" // Teal border using vibrant palette
  }`,
  borderRadius: theme.spacing(2),
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 36px rgba(150, 206, 180, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4), 3px 3px 12px rgba(0, 0, 0, 0.25)"
        : "0 12px 36px rgba(78, 205, 196, 0.3), 0 6px 18px rgba(0, 0, 0, 0.15), 3px 3px 12px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-2px)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: "center",
  fontWeight: 700,
  color: theme.palette.mode === "dark" ? "#FF6B6B" : "#4ECDC4", // Red in dark, Teal in light
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, #FF6B6B 0%, #F06292 50%, #9575CD 100%)` // Red to Pink to Purple
      : `linear-gradient(135deg, #4ECDC4 0%, #45B7D1 50%, #64B5F6 100%)`, // Teal to Blue to Light Blue
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow:
    theme.palette.mode === "dark"
      ? "0 2px 4px rgba(0, 0, 0, 0.8)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

export const FormDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
  color:
    theme.palette.mode === "dark"
      ? "#FFEAA7" // Yellow for better contrast in dark mode
      : "#2C3E50", // Dark blue-gray for better contrast in light mode
  lineHeight: 1.6,
  fontWeight: 500,
}));

export const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    transition: "all 0.3s ease-in-out",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(100, 181, 246, 0.08)" // Light blue background
        : "rgba(78, 205, 196, 0.05)", // Teal background
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(100, 181, 246, 0.3)" // Light blue border
        : "rgba(78, 205, 196, 0.3)" // Teal border
    }`,
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(100, 181, 246, 0.12)" // Light blue hover
          : "rgba(78, 205, 196, 0.08)", // Teal hover
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.mode === "dark" ? "#64B5F6" : "#4ECDC4",
        borderWidth: 2,
      },
    },
    "&.Mui-focused": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(100, 181, 246, 0.15)" // Light blue focus
          : "rgba(78, 205, 196, 0.12)", // Teal focus
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.mode === "dark" ? "#64B5F6" : "#4ECDC4",
        borderWidth: 3,
      },
    },
  },
  "& .MuiInputLabel-root": {
    color:
      theme.palette.mode === "dark"
        ? "#FFEAA7" // Yellow labels in dark mode
        : "#2C3E50", // Dark blue-gray labels in light mode
    fontWeight: 500,
    "&.Mui-focused": {
      color: theme.palette.mode === "dark" ? "#64B5F6" : "#4ECDC4",
      fontWeight: 600,
    },
  },
  "& .MuiInputBase-input": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#34495E", // White in dark, Dark gray in light
    fontWeight: 500,
  },
  "& .MuiFormHelperText-root": {
    color:
      theme.palette.mode === "dark"
        ? "#FF8A65" // Orange helper text in dark mode
        : "#E74C3C", // Red helper text in light mode
  },
}));

export const MessageField = styled(FormField)(() => ({
  "& .MuiInputBase-root": {
    minHeight: "120px",
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: theme.spacing(2),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #FF6B6B 0%, #F06292 100%)" // Red to Pink gradient
      : "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)", // Teal to Blue gradient
  color: "#FFFFFF",
  border: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 6px 18px rgba(255, 107, 107, 0.4), 0 3px 9px rgba(0, 0, 0, 0.3), 2px 2px 6px rgba(0, 0, 0, 0.2)" // Red shadow with directional shadows
        : "0 6px 18px rgba(78, 205, 196, 0.4), 0 3px 9px rgba(0, 0, 0, 0.15), 2px 2px 6px rgba(0, 0, 0, 0.1)", // Teal shadow with directional shadows
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #F06292 0%, #9575CD 100%)" // Pink to Purple gradient
        : "linear-gradient(135deg, #45B7D1 0%, #64B5F6 100%)", // Blue to Light Blue gradient
  },
  "&:disabled": {
    transform: "none",
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 107, 107, 0.3)" // Dimmed red
        : "rgba(78, 205, 196, 0.3)", // Dimmed teal
  },
}));

export const SuccessMessage = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  "& .MuiAlert-icon": {
    fontSize: "1.5rem",
  },
}));

export const ErrorMessage = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  "& .MuiAlert-icon": {
    fontSize: "1.5rem",
  },
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

export const ContactInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  background:
    theme.palette.mode === "dark"
      ? "rgba(100, 181, 246, 0.12)" // Light blue background using vibrant palette
      : "rgba(255, 255, 255, 0.95)",
  borderRadius: (theme.shape.borderRadius as number) * 2,
  border: `2px solid ${
    theme.palette.mode === "dark"
      ? "#64B5F6" // Light blue border using vibrant palette
      : "#4ECDC4" // Teal border using vibrant palette
  }`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 6px 18px rgba(100, 181, 246, 0.2), 0 3px 9px rgba(0, 0, 0, 0.25), 1px 1px 6px rgba(0, 0, 0, 0.15)"
      : "0 6px 18px rgba(78, 205, 196, 0.15), 0 3px 9px rgba(0, 0, 0, 0.08), 1px 1px 6px rgba(0, 0, 0, 0.05)",
}));

export const ContactInfoTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  color: theme.palette.mode === "dark" ? "#FF6B6B" : "#4ECDC4", // Red in dark, Teal in light
  fontSize: "1.125rem",
  textShadow:
    theme.palette.mode === "dark"
      ? "0 1px 2px rgba(0, 0, 0, 0.8)"
      : "0 1px 2px rgba(0, 0, 0, 0.1)",
}));

export const ContactInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.mode === "dark" ? "#FFEAA7" : "#2C3E50", // Yellow in dark, Dark blue-gray in light
  fontWeight: 500,
  "&:last-child": {
    marginBottom: 0,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "dark" ? "#45B7D1" : "#FF8A65", // Blue in dark, Orange in light
    fontSize: "1.2rem",
  },
  "& span": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#34495E", // White in dark, Dark gray in light
    fontWeight: 400,
  },
}));
