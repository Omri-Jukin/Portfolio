import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Chip,
} from "@mui/material";

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(3),
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)"
        : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.95) 100%)",
    backdropFilter: "blur(20px)",
    border: `2px solid ${theme.palette.primary.main}20`,
    boxShadow: `0 20px 60px ${theme.palette.primary.main}15, 0 10px 30px rgba(0, 0, 0, 0.3)`,
    maxWidth: "600px",
    width: "90vw",
    transform: "scale(0.3)",
    opacity: 0,
    transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",

    "&.MuiDialog-paperOpen": {
      transform: "scale(1)",
      opacity: 1,
    },
  },

  // Backdrop animation
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0)",
    transition: "background-color 0.4s ease",
  },

  "&.MuiDialog-open .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(4, 4, 3, 4),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  textAlign: "center",
  "& .MuiTypography-root": {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: theme.palette.text.primary,
    flex: 1,
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  "& .MuiTypography-root": {
    color: theme.palette.text.secondary,
    lineHeight: 1.8,
    fontSize: "1.1rem",
  },
}));

export const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: "rotate(90deg) scale(1.1)",
  },
}));

export const ExperienceChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  fontSize: "0.9rem",
  padding: theme.spacing(1, 2),
  "& .MuiChip-icon": {
    color: theme.palette.warning.main,
  },
}));

export const TechnologyChip = styled(Chip)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.primary.main}30`,
  fontWeight: 500,
  fontSize: "0.9rem",
  padding: theme.spacing(0.75, 1.5),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
  },
}));

export const ExampleChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontWeight: 500,
  fontSize: "0.9rem",
  padding: theme.spacing(0.75, 1.5),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: `0 4px 12px ${theme.palette.secondary.main}30`,
  },
}));

export const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
  "&:last-child": {
    marginBottom: 0,
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

export const ChipContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  justifyContent: "center",
  marginTop: theme.spacing(2),
}));

export const ExperienceContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  flexWrap: "wrap",
}));

export const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  textAlign: "center",
  maxWidth: "500px",
  margin: "0 auto",
}));
