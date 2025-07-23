import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const DNAHelixContainer = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  height: "100%",
}));

export const DNAStrand = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "2px",
  height: "100%",
  background: `linear-gradient(to bottom, 
    ${theme.palette.primary.main}40 0%, 
    ${theme.palette.secondary.main}40 50%, 
    ${theme.palette.primary.main}40 100%)`,
  borderRadius: "1px",
}));
