import React from "react";
import Image from "next/image";
import { Box, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StaticImageData } from "next/image";

// Keyframe animations for floating and bobbing effect
const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-5px) rotate(-1deg);
  }
  75% {
    transform: translateY(-15px) rotate(0.5deg);
  }
`;

const gentleBob = keyframes`
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.02);
  }
`;

const StyledFloatingProfile = styled(Box)(({ theme }) => ({
  position: "fixed",
  left: "2rem",
  top: "2rem",
  transform: "none",
  zIndex: 1000,
  width: "auto",
  height: "auto",
  animation: `${float} 6s ease-in-out infinite, ${gentleBob} 4s ease-in-out infinite`,

  // Responsive design
  [theme.breakpoints.down("md")]: {
    left: "1rem",
    top: "1rem",
    width: "auto",
    height: "auto",
  },

  [theme.breakpoints.down("sm")]: {
    position: "relative",
    left: "auto",
    top: "auto",
    transform: "none",
    margin: "2rem auto",
    width: "auto",
    height: "auto",
  },

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "transform 0.3s ease",
  },

  "&:hover img": {
    transform: "scale(1.05)",
  },
}));

interface FloatingProfileProps {
  imageUrl: StaticImageData;
  altText?: string;
}

export const FloatingProfile: React.FC<FloatingProfileProps> = ({
  imageUrl,
  altText = "Profile Picture",
}) => {
  return (
    <StyledFloatingProfile>
      <Image width={360} height={360} src={imageUrl} alt={altText} />
    </StyledFloatingProfile>
  );
};

export default FloatingProfile;
