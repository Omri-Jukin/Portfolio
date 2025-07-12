import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

export const StyledDarkModeToggle = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  top: 16,
  right: 16,
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));
