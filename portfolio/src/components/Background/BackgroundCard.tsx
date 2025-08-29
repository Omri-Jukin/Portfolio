"use client";

import React from "react";
import { Box } from "@mui/material";
import Background from "./Background";
import Card from "../Card";
import type { BackgroundProps } from "./Background.type";
import type { CardProps } from "../Card/Card.type";

export interface BackgroundCardProps extends BackgroundProps {
  cardProps: CardProps;
}

const BackgroundCard: React.FC<BackgroundCardProps> = ({
  cardProps,
  variant = "floating",
  intensity = "medium",
  speed = "normal",
  color = "primary",
  customColor,
  className,
}) => {
  return (
    <Background
      variant={variant}
      intensity={intensity}
      speed={speed}
      color={color}
      customColor={customColor}
      className={className}
    >
      <Box sx={{ p: 2 }}>
        <Card
          {...cardProps}
          // Make the card transparent so the background shows through
          style={{
            ...cardProps.style,
            background: "transparent",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        />
      </Box>
    </Background>
  );
};

export default BackgroundCard;
