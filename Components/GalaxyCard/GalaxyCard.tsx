import React from "react";
import { Card, CardProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import Galaxy from "./Galaxy";
import { GalaxyProps } from "./Galaxy.type";

interface GalaxyCardProps extends GalaxyProps {
  cardProps?: CardProps;
  children?: React.ReactNode;
}

const TransparentCard = styled(Card)({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  color: "white",
  "& .MuiCardContent-root": {
    color: "white",
  },
  "& .MuiTypography-root": {
    color: "white",
  },
});

const GalaxyCard: React.FC<GalaxyCardProps> = ({
  cardProps,
  children,
  ...galaxyProps
}) => {
  return (
    <Galaxy {...galaxyProps}>
      <TransparentCard {...cardProps}>{children}</TransparentCard>
    </Galaxy>
  );
};

export default GalaxyCard;
