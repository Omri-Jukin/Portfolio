import { styled } from "@mui/material/styles";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
} from "@mui/material";

export const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: "600px",
  margin: "0 auto",
  background: theme.palette.background.paper,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[4],
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[8],
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
  fontWeight: 600,
  background: `radial-gradient(circle at 50% 50%, ${theme.palette.warm.primary} 0%, ${theme.palette.cool.primary} 40%, ${theme.palette.neutral.primary} 80%, ${theme.palette.warm.secondary} 100%)`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

export const FormDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

export const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
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
  borderRadius: (theme.shape.borderRadius as number) * 2,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
  },
  "&:disabled": {
    transform: "none",
    boxShadow: "none",
  },
}));

export const SuccessMessage = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  "& .MuiAlert-icon": {
    fontSize: "1.5rem",
  },
}));

export const ErrorMessage = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
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
  background: theme.palette.background.default,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.05)"
  }`,
}));

export const ContactInfoTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const ContactInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  "&:last-child": {
    marginBottom: 0,
  },
}));
