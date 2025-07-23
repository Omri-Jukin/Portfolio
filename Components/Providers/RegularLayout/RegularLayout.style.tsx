import { Box, styled } from "@mui/material";

export const RegularLayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  backgroundColor: theme.palette.background.paper,
}));
