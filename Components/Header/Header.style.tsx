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
  backgroundColor: "transparent",
  color: "inherit",
  zIndex: 1000,
}));

export const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: 64,
  px: 2,
}));
