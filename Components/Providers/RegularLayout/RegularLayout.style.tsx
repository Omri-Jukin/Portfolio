import { Box, styled } from "@mui/material";

export const RegularLayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  padding: "20px 40px",
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));
