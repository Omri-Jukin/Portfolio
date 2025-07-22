import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

export const StyledLanguageBox = styled(Box)(({ theme }) => ({
  display: "inline-block",
  ...(theme.direction === "rtl" ? { marginRight: 8 } : { marginLeft: 8 }),
  verticalAlign: "top",
}));

export const LanguageSwitcherButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
});

// If you have a styled icon, ensure logical margin:
export const LanguageSwitcherIcon = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginInlineEnd: "0.5em",
});

export const StyledLanguageButton = styled(Button)(({ theme }) => ({
  position: "relative",
  backgroundColor: "rgba(255, 255, 255, 0.1) !important",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)", // Safari support
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  borderRadius: theme.spacing(1),
  color: theme.palette.mode === "dark" ? "#ffffff" : theme.palette.text.primary,
  textTransform: "uppercase",
  fontWeight: 600,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 1px 1px 2px rgba(0, 0, 0, 0.08)",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2) !important",
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15), 2px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  "&:focus": {
    backgroundColor: "rgba(255, 255, 255, 0.15) !important",
  },
}));

export const StyledLanguageMenuItem = styled(MenuItem)(({ theme }) => ({
  minWidth: 120,
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));
