import { Box, AppBar as MuiAppBar, Toolbar as MuiToolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledThemeProvider = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: "4rem",
  zIndex: 1100,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  backdropFilter: "blur(8px)", // <-- this line
}));

export const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: 64,
  px: 2,

  // Mobile responsive styles for Calendly button
  [theme.breakpoints.down("md")]: {
    "& [data-calendly-popup-button]": {
      fontSize: "0.75rem !important",
      padding: "0.5rem 1rem !important",
    },
  },
}));
