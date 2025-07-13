import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: theme.direction === "rtl" ? "flex-start" : "flex-end",
  position: "fixed",
  top: theme.spacing(2),
  ...(theme.direction === "rtl"
    ? { left: theme.spacing(2) }
    : { right: theme.spacing(2) }),
  gap: theme.spacing(2.5),
  zIndex: 1000,
  minWidth: "auto",
  flexWrap: "nowrap",
}));
