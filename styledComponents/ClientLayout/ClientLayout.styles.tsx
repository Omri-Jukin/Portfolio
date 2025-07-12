import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledControlsContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  zIndex: 1000,
}));
