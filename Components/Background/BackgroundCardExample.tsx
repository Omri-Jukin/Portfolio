"use client";

import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import BackgroundCard from "./BackgroundCard";
import type { CardProps } from "../Card/Card.type";
import Background from "./Background";

const BackgroundCardExample: React.FC = () => {
  const sampleCardProps: CardProps = {
    title: "Sample Card with Background",
    description:
      "This card has an animated background that shows through the transparent card surface.",
    href: "#",
    buttonText: "Learn More",
  };

  const variants = [
    { variant: "floating" as const, title: "Floating Elements" },
    { variant: "particles" as const, title: "Particle System" },
    { variant: "waves" as const, title: "Wave Animation" },
    { variant: "geometric" as const, title: "Geometric Shapes" },
    { variant: "cosmic" as const, title: "Cosmic Background" },
    { variant: "gradient-orbs" as const, title: "Spinning Galaxy" },
    { variant: "three-galaxy" as const, title: "Three.js Galaxy" },
  ];

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
        Background Card Examples
      </Typography>

      <Grid container spacing={3}>
        {variants.map(({ variant, title }) => (
          <Grid key={variant}>
            <BackgroundCard
              variant={variant}
              intensity="medium"
              speed="normal"
              color="primary"
              cardProps={{
                ...sampleCardProps,
                title: `${title} Card`,
                description: `This card demonstrates the ${variant} background variant with animated elements.`,
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Manual Usage Example
        </Typography>
        <Typography variant="body1" paragraph>
          You can also use the Background and Card components separately:
        </Typography>

        <Box sx={{ maxWidth: 400, mx: "auto" }}>
          <Background variant="cosmic" intensity="high" speed="fast">
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  background: "transparent",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 2,
                  p: 3,
                  color: "white",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Manual Background + Card
                </Typography>
                <Typography variant="body2">
                  This card is manually wrapped with a Background component and
                  has a transparent background.
                </Typography>
              </Box>
            </Box>
          </Background>
        </Box>
      </Box>
    </Box>
  );
};

export default BackgroundCardExample;
