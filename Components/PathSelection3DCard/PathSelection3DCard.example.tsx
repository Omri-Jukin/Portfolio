/**
 * Usage Examples for PathSelection3DCard Component
 */

import { Box } from "@mui/material";
import { PathSelection3DCard } from "./PathSelection3DCard";

// Example 1: Basic glassmorphism card with horse
export const BasicExample = () => {
  return (
    <PathSelection3DCard
      type="horse"
      rotation={0}
      rotationSpeed={0}
      backgroundVariant="glassmorphism"
      backgroundColor="#10B981"
      animationDirection={0}
    />
  );
};

// Example 2: Rotating lion card with gradient background
export const RotatingLionExample = () => {
  return (
    <PathSelection3DCard
      type="lion"
      rotation={45}
      rotationSpeed={0.5}
      autoRotate={true}
      rotationAxis="y"
      backgroundVariant="gradient"
      backgroundColor="#9333EA"
      animationDirection={90}
      floating={true}
      floatSpeed={1}
      floatAmplitude={0.5}
    />
  );
};

// Example 3: Bull card with neon hover effect
export const NeonBullExample = () => {
  return (
    <PathSelection3DCard
      type="bull"
      rotation={0}
      rotationSpeed={1}
      autoRotate={true}
      rotationAxis="all"
      backgroundVariant="neon"
      backgroundColor="#2563EB"
      animationDirection={180}
      floating={true}
      floatSpeed={1.5}
      floatAmplitude={0.8}
      hoverScale={true}
      hoverScaleAmount={1.2}
      hoverGlow={true}
      glowIntensity={1}
      hoverEffect="neon"
      hoverEffectIntensity={1.5}
      modelScale={[4, 4, 4]}
      modelRotationSpeed={1}
      onClick={() => console.log("Bull clicked!")}
    />
  );
};

// Example 7: Horse with particle burst on hover
export const ParticleHorseExample = () => {
  return (
    <PathSelection3DCard
      type="horse"
      backgroundVariant="glassmorphism"
      backgroundColor="#10B981"
      hoverEffect="particles"
      hoverEffectIntensity={1.2}
      onClick={() => console.log("Horse clicked!")}
    />
  );
};

// Example 8: Lion with explode effect on hover
export const ExplodeLionExample = () => {
  return (
    <PathSelection3DCard
      type="lion"
      backgroundVariant="holographic"
      backgroundColor="#9333EA"
      hoverEffect="explode"
      hoverEffectIntensity={1.5}
      onClick={() => console.log("Lion clicked!")}
    />
  );
};

// Example 9: Bull with shake effect
export const ShakeBullExample = () => {
  return (
    <PathSelection3DCard
      type="bull"
      backgroundVariant="solid"
      backgroundColor="#2563EB"
      hoverEffect="shake"
      hoverEffectIntensity={1}
      onClick={() => console.log("Shaking bull!")}
    />
  );
};

// Example 10: Horse with pulse effect
export const PulseHorseExample = () => {
  return (
    <PathSelection3DCard
      type="horse"
      backgroundVariant="gradient"
      backgroundColor="#10B981"
      hoverEffect="pulse"
      hoverEffectIntensity={0.8}
      onClick={() => console.log("Pulsing horse!")}
    />
  );
};

// Example 11: Lion with rotate effect (spins faster on hover)
export const RotateLionExample = () => {
  return (
    <PathSelection3DCard
      type="lion"
      backgroundVariant="glow"
      backgroundColor="#9333EA"
      hoverEffect="rotate"
      hoverEffectIntensity={2}
      modelRotationSpeed={0.5}
      onClick={() => console.log("Rotating lion!")}
    />
  );
};

// Example 12: Bull with magnetic effect
export const MagneticBullExample = () => {
  return (
    <PathSelection3DCard
      type="bull"
      backgroundVariant="metal"
      backgroundColor="#2563EB"
      hoverEffect="magnetic"
      hoverEffectIntensity={1}
      onClick={() => console.log("Magnetic bull!")}
    />
  );
};

// Example 4: Holographic horse card with custom settings
export const HolographicHorseExample = () => {
  return (
    <PathSelection3DCard
      type="horse"
      rotation={90}
      rotationSpeed={0.3}
      autoRotate={false}
      backgroundVariant="holographic"
      animationDirection={270}
      position={[0, 0, 0]}
      scale={[1.2, 1.2, 1.2]}
      floating={true}
      floatSpeed={0.8}
      floatAmplitude={0.3}
      modelScale={[5, 5, 5]}
      modelRotationSpeed={0.8}
      modelRotationAxis="y"
      animationDelay={0.5}
    />
  );
};

// Example 5: Metal effect with custom model URL
export const CustomModelExample = () => {
  return (
    <PathSelection3DCard
      type="lion"
      modelUrl="/models/custom_model.glb"
      backgroundVariant="metal"
      backgroundColor="#666666"
      rotation={0}
      rotationSpeed={0}
      animationDirection={0}
      modelScale={[3, 3, 3]}
    />
  );
};

// Example 6: All three cards in a grid
export const ThreeCardsExample = () => {
  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2rem",
      }}
    >
      <PathSelection3DCard
        type="bull"
        backgroundVariant="glassmorphism"
        backgroundColor="#2563EB"
        rotation={0}
        animationDirection={0}
        onClick={() => console.log("Employers")}
      />
      <PathSelection3DCard
        type="lion"
        backgroundVariant="gradient"
        backgroundColor="#9333EA"
        rotation={0}
        animationDirection={0}
        onClick={() => console.log("Clients")}
      />
      <PathSelection3DCard
        type="horse"
        backgroundVariant="neon"
        backgroundColor="#10B981"
        rotation={0}
        animationDirection={0}
        onClick={() => console.log("Browse")}
      />
    </Box>
  );
};
