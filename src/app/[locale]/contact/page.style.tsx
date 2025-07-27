import { styled } from "@mui/material/styles";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";

export const FormContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "transparent",
})<{ transparent?: boolean }>(({ theme, transparent }) => ({
  padding: theme.spacing(4),
  maxWidth: "700px",
  margin: "0 auto",
  marginTop: theme.spacing(8),
  background: transparent
    ? "transparent"
    : theme.palette.mode === "dark"
    ? "rgba(150, 206, 180, 0.08)"
    : "rgba(255, 255, 255, 0.98)",
  border: `2px solid ${theme.palette.mode === "dark" ? "#96CEB4" : "#4ECDC4"}`,
  borderRadius: theme.spacing(3),
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, rgba(150, 206, 180, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)"
        : "linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%)",
    zIndex: -1,
  },
  "&:hover": {
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 36px rgba(150, 206, 180, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4), 3px 3px 12px rgba(0, 0, 0, 0.25)"
        : "0 12px 36px rgba(78, 205, 196, 0.3), 0 6px 18px rgba(0, 0, 0, 0.15), 3px 3px 12px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-4px)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: "center",
  fontWeight: 800,
  fontSize: "2.5rem",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #FF6B6B 0%, #F06292 50%, #9575CD 100%)"
      : "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 50%, #64B5F6 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow:
    theme.palette.mode === "dark"
      ? "0 2px 4px rgba(0, 0, 0, 0.8)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px",
    height: "3px",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(90deg, #FF6B6B, #F06292)"
        : "linear-gradient(90deg, #4ECDC4, #45B7D1)",
    borderRadius: "2px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

export const FormDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.mode === "dark" ? "#FFEAA7" : "#2C3E50",
  lineHeight: 1.8,
  fontWeight: 500,
  fontSize: "1.1rem",
  maxWidth: "500px",
  margin: "0 auto 2rem auto",
}));

export const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(100, 181, 246, 0.08)"
        : "rgba(78, 205, 196, 0.05)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(100, 181, 246, 0.3)"
        : "rgba(78, 205, 196, 0.3)"
    }`,
    borderRadius: theme.spacing(2),
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(100, 181, 246, 0.12)"
          : "rgba(78, 205, 196, 0.08)",
      transform: "translateY(-1px)",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 4px 12px rgba(100, 181, 246, 0.2)"
          : "0 4px 12px rgba(78, 205, 196, 0.15)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.mode === "dark" ? "#64B5F6" : "#4ECDC4",
        borderWidth: 2,
      },
    },
    "&.Mui-focused": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(100, 181, 246, 0.15)"
          : "rgba(78, 205, 196, 0.12)",
      transform: "translateY(-2px)",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 6px 16px rgba(100, 181, 246, 0.3)"
          : "0 6px 16px rgba(78, 205, 196, 0.25)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.mode === "dark" ? "#64B5F6" : "#4ECDC4",
        borderWidth: 3,
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.mode === "dark" ? "#FFEAA7" : "#2C3E50",
    fontWeight: 600,
    "&.Mui-focused": {
      color: theme.palette.mode === "dark" ? "#64B5F6" : "#4ECDC4",
      fontWeight: 700,
    },
  },
  "& .MuiInputBase-input": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#34495E",
    fontWeight: 500,
    fontSize: "1rem",
  },
  "& .MuiFormHelperText-root": {
    color: theme.palette.mode === "dark" ? "#FF8A65" : "#E74C3C",
    fontWeight: 500,
  },
}));

export const MessageField = styled(FormField)(() => ({
  "& .MuiInputBase-root": {
    minHeight: "140px",
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  fontSize: "1.2rem",
  fontWeight: 700,
  textTransform: "none",
  borderRadius: theme.spacing(3),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #FF6B6B 0%, #F06292 100%)"
      : "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)",
  color: "#FFFFFF",
  border: "none",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 24px rgba(255, 107, 107, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)"
        : "0 8px 24px rgba(78, 205, 196, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #F06292 0%, #9575CD 100%)"
        : "linear-gradient(135deg, #45B7D1 0%, #64B5F6 100%)",
    "&::before": {
      left: "100%",
    },
  },
  "&:active": {
    transform: "translateY(-1px)",
  },
  "&:disabled": {
    transform: "none",
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 107, 107, 0.3)"
        : "rgba(78, 205, 196, 0.3)",
    "&::before": {
      display: "none",
    },
  },
}));

export const SuccessMessage = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `2px solid ${theme.palette.success.main}`,
  background:
    theme.palette.mode === "dark"
      ? "rgba(76, 175, 80, 0.1)"
      : "rgba(76, 175, 80, 0.05)",
  "& .MuiAlert-icon": {
    fontSize: "1.5rem",
  },
  "& .MuiAlert-message": {
    fontWeight: 600,
  },
}));

export const ErrorMessage = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `2px solid ${theme.palette.error.main}`,
  background:
    theme.palette.mode === "dark"
      ? "rgba(244, 67, 54, 0.1)"
      : "rgba(244, 67, 54, 0.05)",
  "& .MuiAlert-icon": {
    fontSize: "1.5rem",
  },
  "& .MuiAlert-message": {
    fontWeight: 600,
  },
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

// Enhanced social media cards styling
export const ContactSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

export const ContactSectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1.5rem",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #FFEAA7 0%, #FDCB6E 100%)"
      : "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

export const ContactCardsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

export const ContactCard = styled(Box, {
  shouldForwardProp: (prop) =>
    !["variant", "clickable"].includes(prop as string),
})<{ variant?: "info" | "social" | "additional"; clickable?: boolean }>(
  ({ theme, variant = "info", clickable = false }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(255, 255, 255, 0.8)",
    border: `2px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(78, 205, 196, 0.2)"
    }`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),
    cursor: clickable ? "pointer" : "default",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(135deg, rgba(150, 206, 180, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%)",
      zIndex: -1,
    },
    "&:hover": clickable
      ? {
          transform: "translateY(-6px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 32px rgba(150, 206, 180, 0.3), 0 6px 16px rgba(0, 0, 0, 0.3)"
              : "0 12px 32px rgba(78, 205, 196, 0.25), 0 6px 16px rgba(0, 0, 0, 0.1)",
          borderColor: theme.palette.primary.main,
        }
      : {},
  })
);

export const ContactCardIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme, color }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: color || theme.palette.primary.main,
  "& .MuiSvgIcon-root": {
    fontSize: "2rem",
    color: "#FFFFFF",
  },
}));

export const ContactCardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: "center",
  fontSize: "1.1rem",
}));

export const ContactCardSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: "center",
  fontSize: "0.9rem",
}));

export const ContactCardButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "brandColor",
})<{ brandColor?: string }>(({ theme, brandColor }) => ({
  marginTop: theme.spacing(1),
  borderColor: brandColor || theme.palette.primary.main,
  color: brandColor || theme.palette.primary.main,
  fontWeight: 600,
  borderRadius: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    borderColor: brandColor || theme.palette.primary.main,
    backgroundColor: brandColor
      ? `${brandColor}15`
      : theme.palette.primary.main,
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${brandColor || theme.palette.primary.main}40`,
  },
}));

export const AdditionalInfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.8)",
  border: `2px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(78, 205, 196, 0.2)"
  }`,
  marginTop: theme.spacing(4),
}));

export const AdditionalInfoTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.error.main,
  fontWeight: 700,
  fontSize: "1.2rem",
}));

export const AdditionalInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(78, 205, 196, 0.05)",
  },
  "&:last-child": {
    marginBottom: 0,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.action.active,
    fontSize: "1.5rem",
  },
}));
