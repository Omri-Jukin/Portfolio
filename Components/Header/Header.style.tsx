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
  color: "inherit",
}));

export const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: "4rem",
  zIndex: 1100,
  backgroundColor: theme.palette.background.paper,
  backdropFilter: "blur(8px)", // <-- this line
}));

export const Toolbar = styled(MuiToolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: 64,
  px: 2,
});
