import React from "react";
import { Card, CardProps, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import Galaxy from "./Galaxy";
import { GalaxyProps } from "./Galaxy.type";

interface GalaxyCardProps extends GalaxyProps {
  cardProps?: CardProps;
  children?: React.ReactNode;
  sx?: SxProps;
}

const TransparentCard = styled(Card)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  color: theme.palette.mode === "dark" ? "white" : "black",
  "& .MuiCardContent-root": {
    color: theme.palette.mode === "dark" ? "white" : "black",
  },
  "& .MuiTypography-root": {
    color: theme.palette.mode === "dark" ? "white" : "black",
  },
}));

const GalaxyCard: React.FC<GalaxyCardProps> = ({
  cardProps,
  children,
  sx,
  ...galaxyProps
}) => {
  return (
    <Galaxy {...galaxyProps}>
      <TransparentCard {...cardProps} sx={sx}>
        {children}
      </TransparentCard>
    </Galaxy>
  );
};

export default GalaxyCard;
