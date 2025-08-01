import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import ThreeGalaxy from "./ThreeGalaxy";
import ThreeGalaxyCard from "./ThreeGalaxyCard";

const ThreeGalaxyExample: React.FC = () => {
  const galaxyConfigs = [
    {
      title: "Classic Galaxy",
      props: {
        count: 50000,
        branches: 6,
        spin: 1,
        insideColor: "#ffff00",
        outsideColor: "#0000ff",
        rotationSpeed: 0.1,
      },
    },
    {
      title: "Spiral Galaxy",
      props: {
        count: 80000,
        branches: 4,
        spin: 2,
        insideColor: "#ff6b6b",
        outsideColor: "#4ecdc4",
        rotationSpeed: 0.15,
        animateColors: true,
      },
    },
    {
      title: "Cosmic Nebula",
      props: {
        count: 100000,
        branches: 8,
        spin: 0.5,
        insideColor: "#ffd700",
        outsideColor: "#8a2be2",
        rotationSpeed: 0.08,
        pulseIntensity: 0.3,
        animateSpin: true,
      },
    },
  ];

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Typography variant="h3" gutterBottom sx={{ color: "white", mb: 4 }}>
        Three.js Galaxy Background Examples
      </Typography>

      <Grid container spacing={4}>
        {/* Direct Galaxy Usage */}
        <Grid component="div">
          <Typography variant="h5" gutterBottom sx={{ color: "white", mb: 2 }}>
            Direct Galaxy Background
          </Typography>
          <Box sx={{ height: 400, position: "relative" }}>
            <ThreeGalaxy
              count={60000}
              branches={5}
              spin={1.5}
              insideColor="#ff6b6b"
              outsideColor="#4ecdc4"
              rotationSpeed={0.12}
              animateColors={true}
              intensity="high"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  zIndex: 1,
                }}
              >
                <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
                  Interactive Galaxy
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Real-time 3D galaxy with thousands of particles
                </Typography>
              </Box>
            </ThreeGalaxy>
          </Box>
        </Grid>

        {/* Galaxy Card Examples */}
        <Grid component="div">
          <Typography variant="h5" gutterBottom sx={{ color: "white", mb: 2 }}>
            Galaxy Card Wrappers
          </Typography>
          <Grid container spacing={3}>
            {galaxyConfigs.map((config, index) => (
              <Grid component="div" key={index}>
                <ThreeGalaxyCard
                  {...config.props}
                  intensity="medium"
                  cardProps={{ style: { height: 300 } }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {config.title}
                    </Typography>
                    <Typography variant="body2">
                      This card has a beautiful 3D galaxy background with{" "}
                      {config.props.count?.toLocaleString()} particles.
                    </Typography>
                  </CardContent>
                </ThreeGalaxyCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Performance Comparison */}
        <Grid component="div">
          <Typography variant="h5" gutterBottom sx={{ color: "white", mb: 2 }}>
            Performance Comparison
          </Typography>
          <Grid container spacing={3}>
            <Grid component="div">
              <ThreeGalaxyCard
                count={20000}
                intensity="low"
                speed="slow"
                cardProps={{ style: { height: 250 } }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Low Performance
                  </Typography>
                  <Typography variant="body2">
                    20,000 particles, slow rotation, optimized for older
                    devices.
                  </Typography>
                </CardContent>
              </ThreeGalaxyCard>
            </Grid>
            <Grid component="div">
              <ThreeGalaxyCard
                count={120000}
                intensity="high"
                speed="fast"
                animateColors={true}
                animateSpin={true}
                cardProps={{ style: { height: 250 } }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    High Performance
                  </Typography>
                  <Typography variant="body2">
                    120,000 particles, fast animations, full effects enabled.
                  </Typography>
                </CardContent>
              </ThreeGalaxyCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Manual Usage Example */}
        <Grid component="div">
          <Typography variant="h5" gutterBottom sx={{ color: "white", mb: 2 }}>
            Manual Implementation
          </Typography>
          <Box sx={{ height: 300, position: "relative" }}>
            <ThreeGalaxy
              count={40000}
              branches={7}
              spin={0.8}
              insideColor="#ffd700"
              outsideColor="#ff6347"
              rotationSpeed={0.1}
              pulseIntensity={0.25}
            >
              <Box sx={{ p: 3 }}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Manual Card Styling
                    </Typography>
                    <Typography variant="body2">
                      This card uses manual styling with backdrop blur and
                      transparency.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </ThreeGalaxy>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThreeGalaxyExample;
