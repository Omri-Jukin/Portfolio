import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const SectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(6, 0),
  },
}));
