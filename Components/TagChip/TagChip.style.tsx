import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledTagChip = styled(Box)(({ theme }) => ({
  display: "inline-block",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  fontSize: "0.875rem",
  fontWeight: 500,
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  transition: "all 0.2s ease-in-out",
  cursor: "default",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[2],
  },
}));
