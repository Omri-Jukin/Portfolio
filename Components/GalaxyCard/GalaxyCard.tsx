import React from "react";
import { Card, CardProps, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import Galaxy from "./Galaxy";
import type { GalaxyProps } from "./Galaxy.type";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";

export interface GalaxyCardProps extends GalaxyProps {
  cardProps?: CardProps;
  galaxyProps?: GalaxyProps;
  children?: React.ReactNode;
  sx?: SxProps;
  id?: string;
}

export const GalaxyCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "black" : "white",
  width: "100%",
}));

export const TransparentCard = styled(Card)(({ theme }) => ({
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

export const GalaxyCard: React.FC<GalaxyCardProps> = ({
  cardProps,
  children,
  sx,
  id,
  galaxyProps: galaxyPropsFromProps,
}) => {
  const theme = useTheme();

  const insideColor =
    galaxyPropsFromProps?.insideColor ||
    (theme.palette.mode === "dark" ? "#fff" : "#000");
  const outsideColor =
    galaxyPropsFromProps?.outsideColor ||
    (theme.palette.mode === "dark" ? "#ffff00" : "#ff0000");

  const galaxyProps: GalaxyProps = {
    ...galaxyPropsFromProps,
    insideColor,
    outsideColor,
    count: 50000,
    branches: 6,
    offset: { z: 1.5, x: 5, y: 0.5 },
  };

  return (
    <GalaxyCardContainer id={id}>
      <Galaxy {...galaxyProps}>
        <TransparentCard {...cardProps} sx={sx}>
          {children}
        </TransparentCard>
      </Galaxy>
    </GalaxyCardContainer>
  );
};

export default GalaxyCard;
