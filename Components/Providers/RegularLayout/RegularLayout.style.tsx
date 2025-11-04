import { Box, styled } from "@mui/material";

export const RegularLayoutContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  backgroundColor: "transparent",
  width: "100%",
  maxWidth: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  alignItems: "center",
}));
