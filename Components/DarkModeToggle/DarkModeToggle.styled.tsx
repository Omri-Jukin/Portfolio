import { styled } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

export const StyledDarkModeToggle = styled(IconButton)(({ theme }) => ({
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
  color:
    theme.palette.mode === "dark"
      ? theme.palette.warning.light
      : theme.palette.info.main,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2) !important",
    transform: "scale(1.05)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  },
  "&:focus": {
    backgroundColor: "rgba(255, 255, 255, 0.15) !important",
  },
  [`& .${buttonClasses.startIcon}`]: {
    marginRight: theme.direction === "rtl" ? 0 : theme.spacing(1.5),
    marginLeft: theme.direction === "rtl" ? theme.spacing(1.5) : 0,
  },
}));
