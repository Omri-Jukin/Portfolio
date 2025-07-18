import { Box, styled } from "@mui/material";

export const RegularLayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  alignItems: "flex-start",
  justifyContent: "flex-start",
  padding: "20px 40px",
  backgroundColor: "transparent",
  overflow: "hidden",
}));
