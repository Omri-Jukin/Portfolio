import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const HeroBackgroundImage = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "10%",
  right: "5%",
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
  opacity: 0.4,
  zIndex: 0,
  filter: "blur(2px)",
  [theme.breakpoints.down("md")]: {
    width: "80px",
    height: "80px",
    top: "5%",
    right: "10%",
  },
}));

const HeroBackgroundImage2 = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "15%",
  left: "8%",
  width: "100px",
  height: "100px",
  borderRadius: "16px",
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}12, ${theme.palette.primary.main}12)`,
  opacity: 0.3,
  zIndex: 0,
  filter: "blur(2px)",
  [theme.breakpoints.down("md")]: {
    width: "60px",
    height: "60px",
    bottom: "10%",
    left: "5%",
  },
}));

const HeroBackgroundImage3 = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "60%",
  right: "15%",
  width: "80px",
  height: "80px",
  borderRadius: "8px",
  background: `linear-gradient(225deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
  opacity: 0.2,
  zIndex: 0,
  filter: "blur(2px)",
  [theme.breakpoints.down("md")]: {
    width: "50px",
    height: "50px",
    top: "70%",
    right: "8%",
  },
}));

const HeroBackgroundElements: React.FC = () => {
  return (
    <Box>
      <HeroBackgroundImage />
      <HeroBackgroundImage2 />
      <HeroBackgroundImage3 />
    </Box>
  );
};

export default HeroBackgroundElements;
