import Box from "@mui/material/Box";
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
