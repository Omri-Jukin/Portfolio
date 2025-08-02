"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Container,
  Paper,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import {
  AnimatedBackground,
  DNAHelixWrapper,
  AnimatedText,
  Background,
  BackgroundCard,
  WaveText,
  TagChip,
  Galaxy,
  GalaxyCard,
  MotionWrapper,
  Typography as CustomTypography,
  Card as CustomCard,
  Button as CustomButton,
  BrokenGlass,
  AnimationType,
  BackgroundVariant,
} from "#/Components";
import { ColorWorm } from "#/Components/ColorWorm/ColorWorm";
import { FloatingEmojis } from "#/Components/FloatingEmojis";
import { InnovationFlow } from "#/Components/InnovationFlow";
import { ParticleBridge } from "#/Components/ParticleBridge";
import { VisionRealityBridge } from "#/Components/VisionRealityBridge";

// Styled components for the examples page
const ExamplesContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)"
      : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #a8edea 100%)",
  padding: theme.spacing(4),
}));

const SectionCard = styled(Card)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  marginBottom: theme.spacing(3),
}));

const DemoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: 400,
  width: "100%",
  height: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ExamplesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [animationType, setAnimationType] =
    useState<AnimationType>("torusKnot");
  const [backgroundVariant, setBackgroundVariant] =
    useState<BackgroundVariant>("floating");
  const [galaxyConfig, setGalaxyConfig] = useState({
    count: 30000,
    branches: 4,
    spin: 1.5,
    insideColor: "#ff6b6b",
    outsideColor: "#4ecdc4",
    rotationSpeed: 0.3,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const animationTypes = ["torusKnot", "stars", "polyhedron", "dna"];

  const backgroundVariants = [
    "floating",
    "particles",
    "waves",
    "geometric",
    "cosmic",
    "gradient-orbs",
    "three-galaxy",
  ];

  return (
    <ExamplesContainer>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Portfolio Showcase & Examples
        </Typography>

        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 6,
            color: "text.secondary",
            maxWidth: 800,
            mx: "auto",
          }}
        >
          Explore my full-stack development capabilities through interactive
          examples, showcasing React, TypeScript, Three.js, animations, and
          modern web technologies using components I have built.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                },
              },
            }}
          >
            <Tab label="3D Animations" />
            <Tab label="Background Effects" />
            <Tab label="Interactive Components" />
            <Tab label="UI/UX Elements" />
            <Tab label="Three.js Galaxy" />
            <Tab label="Motion & Effects" />
          </Tabs>
        </Box>

        {/* 3D Animations Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
            }}
          >
            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Animated Background Objects
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Interactive 3D objects using React Three Fiber and Drei
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Animation Type</InputLabel>
                  <Select
                    value={animationType}
                    label="Animation Type"
                    onChange={(e) => setAnimationType(e.target.value)}
                  >
                    {animationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <DemoContainer>
                  <AnimatedBackground
                    animationType={animationType}
                    manualOverride={true}
                  />
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  DNA Helix Animation
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Complex molecular structure with realistic physics
                </Typography>

                <DemoContainer>
                  <DNAHelixWrapper spinning={true} position={[0, -25, 0]} />
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Animated Text Effects
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Various text animation techniques and effects
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 2,
                    minHeight: 200,
                  }}
                >
                  <AnimatedText type="fadeIn" delay={0} fontSize={32}>
                    Fade In Effect
                  </AnimatedText>
                  <AnimatedText type="slideUp" delay={0.2} fontSize={32}>
                    Slide Up Effect
                  </AnimatedText>
                  <AnimatedText
                    type="scaleUp"
                    delay={0.4}
                    fontSize={32}
                    scale={1.5}
                  >
                    Scale Up Effect
                  </AnimatedText>
                </Box>
              </CardContent>
            </SectionCard>
          </Box>
        </TabPanel>

        {/* Background Effects Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
            }}
          >
            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  CSS Background Variants
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Various animated background effects using CSS and Framer
                  Motion
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Background Variant</InputLabel>
                  <Select
                    value={backgroundVariant}
                    label="Background Variant"
                    onChange={(e) => setBackgroundVariant(e.target.value)}
                  >
                    {backgroundVariants.map((variant) => (
                      <MenuItem key={variant} value={variant}>
                        {variant
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <DemoContainer>
                  <Background
                    variant={backgroundVariant}
                    intensity="high"
                    speed="normal"
                  >
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="h6" sx={{ color: "white" }}>
                        {backgroundVariant
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}{" "}
                        Background
                      </Typography>
                    </Box>
                  </Background>
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Background Card Wrapper
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Cards with animated backgrounds and glassmorphism effects
                </Typography>

                <DemoContainer>
                  <BackgroundCard
                    variant="cosmic"
                    intensity="medium"
                    cardProps={{
                      title: "Cosmic Background Card",
                      href: "/",
                      style: { height: "100%", background: "transparent" },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "white" }}>
                        Cosmic Background Card
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        This card has a beautiful animated background with
                        glassmorphism effects.
                      </Typography>
                    </CardContent>
                  </BackgroundCard>
                </DemoContainer>
              </CardContent>
            </SectionCard>
          </Box>
        </TabPanel>

        {/* Interactive Components Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 4,
            }}
          >
            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Particle Bridge
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Interactive particle system connecting elements
                </Typography>

                <DemoContainer>
                  <ParticleBridge />
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Innovation Flow
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Dynamic flow visualization with interactive elements
                </Typography>

                <DemoContainer>
                  <InnovationFlow />
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vision Reality Bridge
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Conceptual bridge between vision and reality
                </Typography>

                <DemoContainer>
                  <VisionRealityBridge />
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Color Worm
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Animated color worm with smooth transitions
                </Typography>

                <DemoContainer>
                  <ColorWorm />
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Floating Emojis
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Playful floating emoji animations
                </Typography>

                <DemoContainer>
                  <FloatingEmojis />
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Wave Text
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Text with wave animation effects
                </Typography>

                <DemoContainer>
                  <WaveText text="Wave Animation" />
                </DemoContainer>
              </CardContent>
            </SectionCard>
          </Box>
        </TabPanel>

        {/* UI/UX Elements Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 4,
            }}
          >
            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Custom Typography
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Enhanced typography components with animations
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <CustomTypography variant="h4">
                    Animated Heading
                  </CustomTypography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <CustomTypography variant="body1">
                    Gradient Text Effect
                  </CustomTypography>
                </Box>

                <Box>
                  <CustomTypography variant="h6">Glowing Text</CustomTypography>
                </Box>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Custom Buttons
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Interactive buttons with various effects
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <CustomButton variant="gradient">
                    Gradient Button
                  </CustomButton>
                  <CustomButton variant="neon">Neon Button</CustomButton>
                  <CustomButton variant="glass">Glass Button</CustomButton>
                </Box>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tag Chips
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Interactive tag components with animations
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TagChip tag="React" />
                  <TagChip tag="TypeScript" />
                  <TagChip tag="Three.js" />
                  <TagChip tag="Framer Motion" />
                  <TagChip tag="Material-UI" />
                </Box>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Custom Cards
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Enhanced card components with effects
                </Typography>

                <CustomCard
                  title="Glass Card Effect"
                  href="/"
                  style={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                />
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Broken Glass Effect
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Animated broken glass texture with realistic cracks and
                  reflections
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 2,
                  }}
                >
                  <BrokenGlass
                    intensity="low"
                    animation={true}
                    style={{ height: 120 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Low Intensity
                    </Typography>
                  </BrokenGlass>

                  <BrokenGlass
                    intensity="medium"
                    animation={true}
                    style={{ height: 120 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      Medium Intensity
                    </Typography>
                  </BrokenGlass>

                  <BrokenGlass
                    intensity="high"
                    animation={true}
                    style={{ height: 120 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "white", textAlign: "center" }}
                    >
                      High Intensity
                    </Typography>
                  </BrokenGlass>
                </Box>
              </CardContent>
            </SectionCard>
          </Box>
        </TabPanel>

        {/* Three.js Galaxy Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 4,
            }}
          >
            <SectionCard sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Three.js Galaxy Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Interactive controls for the 3D galaxy system
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 3,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Particle Count: {galaxyConfig.count.toLocaleString()}
                    </Typography>
                    <Slider
                      value={galaxyConfig.count}
                      onChange={(_, value) =>
                        setGalaxyConfig((prev) => ({
                          ...prev,
                          count: value as number,
                        }))
                      }
                      min={10000}
                      max={150000}
                      step={1000}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Branches: {galaxyConfig.branches}
                    </Typography>
                    <Slider
                      value={galaxyConfig.branches}
                      onChange={(_, value) =>
                        setGalaxyConfig((prev) => ({
                          ...prev,
                          branches: value as number,
                        }))
                      }
                      min={2}
                      max={12}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Spin: {galaxyConfig.spin}
                    </Typography>
                    <Slider
                      value={galaxyConfig.spin}
                      onChange={(_, value) =>
                        setGalaxyConfig((prev) => ({
                          ...prev,
                          spin: value as number,
                        }))
                      }
                      min={0}
                      max={3}
                      step={0.1}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Rotation Speed: {galaxyConfig.rotationSpeed}
                    </Typography>
                    <Slider
                      value={galaxyConfig.rotationSpeed}
                      onChange={(_, value) =>
                        setGalaxyConfig((prev) => ({
                          ...prev,
                          rotationSpeed: value as number,
                        }))
                      }
                      min={0}
                      max={0.5}
                      step={0.01}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Box>

                <DemoContainer sx={{ height: 400 }}>
                  <Galaxy
                    {...galaxyConfig}
                    intensity="high"
                    speed="normal"
                    // animateColors={true}
                    animateSpin={true}
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
                        {galaxyConfig.count.toLocaleString()} particles,{" "}
                        {galaxyConfig.branches} branches
                      </Typography>
                    </Box>
                  </Galaxy>
                </DemoContainer>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Galaxy Card Examples
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Cards with Three.js galaxy backgrounds
                </Typography>

                <GalaxyCard
                  count={30000}
                  branches={4}
                  spin={1.5}
                  insideColor="#ff6b6b"
                  outsideColor="#4ecdc4"
                  cardProps={{ sx: { height: 200 } }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "white" }}>
                      Spiral Galaxy Card
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Beautiful 3D galaxy background with 30,000 particles.
                    </Typography>
                  </CardContent>
                </GalaxyCard>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Comparison
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Different performance levels for various devices
                </Typography>

                <GalaxyCard
                  count={80000}
                  branches={8}
                  spin={0.8}
                  insideColor="#ffd700"
                  outsideColor="#8a2be2"
                  intensity="high"
                  speed="fast"
                  // animateColors={true}
                  animateSpin={true}
                  cardProps={{ sx: { height: 200 } }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "white" }}>
                      High Performance Galaxy
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      80,000 particles with full animation effects.
                    </Typography>
                  </CardContent>
                </GalaxyCard>
              </CardContent>
            </SectionCard>
          </Box>
        </TabPanel>

        {/* Motion & Effects Tab */}
        <TabPanel value={tabValue} index={5}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 4,
            }}
          >
            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Motion Wrapper
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Framer Motion wrapper for smooth animations
                </Typography>

                <MotionWrapper variant="fadeInUp" delay={0.2} duration={0.6}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6">Fade In Up Animation</Typography>
                    <Typography variant="body2">
                      This element animates in with a fade and slide effect.
                    </Typography>
                  </Box>
                </MotionWrapper>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scroll Animations
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Elements that animate based on scroll position
                </Typography>

                <Box sx={{ height: 400, overflow: "auto" }}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <MotionWrapper
                      key={item}
                      variant="slideLeft"
                      delay={item * 0.1}
                      duration={0.5}
                      style={{ marginBottom: 16 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: `primary.${
                            item % 2 === 0 ? "light" : "main"
                          }`,
                          color: "white",
                        }}
                      >
                        <Typography variant="h6">Scroll Item {item}</Typography>
                        <Typography variant="body2">
                          This item animates when scrolled into view.
                        </Typography>
                      </Paper>
                    </MotionWrapper>
                  ))}
                </Box>
              </CardContent>
            </SectionCard>
          </Box>
        </TabPanel>
      </Container>
    </ExamplesContainer>
  );
};

export default ExamplesPage;
