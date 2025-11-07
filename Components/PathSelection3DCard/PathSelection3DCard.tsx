"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { PathSelection3DCardProps } from "./PathSelection3DCard.type";
import {
  MODEL_URLS,
  MODEL_COLORS,
  DEFAULT_ANIMATION,
  DEFAULT_HOVER_EFFECT,
} from "./PathSelection3DCard.const";
import { StyledCardContainer } from "./PathSelection3DCard.style";

// Error boundary for model loading
class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("Model failed to load:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Particle Burst Effect Component
const ParticleBurst: React.FC<{
  active: boolean;
  intensity: number;
  color: string;
  count?: number;
}> = ({ active, intensity, color, count = 50 }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (active) {
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);

      // Initialize particles at center
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;

        // Random velocity direction
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.5 + 0.5) * intensity;
        velocities[i3] = Math.cos(angle) * speed;
        velocities[i3 + 1] = Math.sin(angle) * speed;
        velocities[i3 + 2] = (Math.random() - 0.5) * speed * 0.5;
      }

      setParticles(positions);
      velocitiesRef.current = velocities;
    } else {
      setParticles(null);
    }
  }, [active, intensity, count]);

  useFrame((state, delta) => {
    if (particlesRef.current && particles && velocitiesRef.current && active) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] += velocitiesRef.current[i3] * delta;
        positions[i3 + 1] += velocitiesRef.current[i3 + 1] * delta;
        positions[i3 + 2] += velocitiesRef.current[i3 + 2] * delta;

        // Fade out
        velocitiesRef.current[i3] *= 0.95;
        velocitiesRef.current[i3 + 1] *= 0.95;
        velocitiesRef.current[i3 + 2] *= 0.95;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active || !particles) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.1 * intensity}
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Neon Glow Effect Component
const NeonGlow: React.FC<{
  active: boolean;
  intensity: number;
  color: string;
}> = ({ active, intensity, color }) => {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (glowRef.current && active) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = intensity * 0.5;
      material.emissive = new THREE.Color(color);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={glowRef} position={[0, 0, -0.5]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity * 0.5}
        transparent
        opacity={0.3 * intensity}
      />
    </mesh>
  );
};

// 3D Model Component
const Model3D: React.FC<{
  url: string;
  scale?: [number, number, number] | number;
  position?: [number, number, number];
  rotationSpeed?: number;
  rotationAxis?: "x" | "y" | "z" | "all";
  hoverRotationSpeed?: number;
  hovered?: boolean;
}> = ({
  url,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotationSpeed = 0.5,
  rotationAxis = "y",
  hoverRotationSpeed = 0,
  hovered = false,
}) => {
  const modelRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(url);
  // FIXED MODEL SCALE - Calculate once, never change
  const fixedModelScale = useRef<[number, number, number]>(
    Array.isArray(scale) ? scale : [scale, scale, scale]
  );
  const modelScaleInitialized = useRef(false);

  // Initialize model scale in useEffect - only once
  useEffect(() => {
    if (modelRef.current && !modelScaleInitialized.current) {
      const scaleValue = fixedModelScale.current;
      modelRef.current.scale.set(scaleValue[0], scaleValue[1], scaleValue[2]);
      modelScaleInitialized.current = true;
    }
  }, []); // Empty deps - only run once

  useFrame((state, delta) => {
    if (modelRef.current && gltf?.scene) {
      // DO NOT modify scale here - it's set once in useEffect

      // Only handle rotation - no scale changes
      const currentSpeed =
        hovered && hoverRotationSpeed > 0
          ? rotationSpeed + hoverRotationSpeed
          : rotationSpeed;

      if (currentSpeed > 0) {
        if (rotationAxis === "y" || rotationAxis === "all") {
          modelRef.current.rotation.y += delta * currentSpeed;
        }
        if (rotationAxis === "x" || rotationAxis === "all") {
          modelRef.current.rotation.x += delta * currentSpeed * 0.5;
        }
        if (rotationAxis === "z" || rotationAxis === "all") {
          modelRef.current.rotation.z += delta * currentSpeed * 0.3;
        }
      }
    }
  });

  if (!gltf || !gltf.scene) return null;

  return (
    <group
      ref={modelRef}
      position={position}
      scale={fixedModelScale.current} // Fixed scale in JSX - never changes
    >
      <primitive object={gltf.scene.clone()} />
    </group>
  );
};

// Main Card Component (3D)
const FloatingCard3D: React.FC<
  PathSelection3DCardProps & {
    canvasContainer: HTMLDivElement | null;
  }
> = ({
  type,
  rotation = DEFAULT_ANIMATION.rotation,
  rotationSpeed = DEFAULT_ANIMATION.rotationSpeed,
  backgroundColor,
  animationDirection = 0,
  position = [0, 0, 0],
  floating = true,
  floatSpeed = DEFAULT_ANIMATION.floatSpeed,
  floatAmplitude = DEFAULT_ANIMATION.floatAmplitude,
  autoRotate = false,
  rotationAxis = "y",
  hoverEffect = DEFAULT_HOVER_EFFECT,
  hoverEffectIntensity = DEFAULT_ANIMATION.hoverEffectIntensity,
  onClick,
  modelUrl,
  modelScale = [3, 3, 3],
  modelPosition = [0, 0, 0],
  modelRotationSpeed = DEFAULT_ANIMATION.modelRotationSpeed,
  modelRotationAxis = "y",
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const shakeRef = useRef({ x: 0, y: 0, z: 0 });
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [particleBurstActive, setParticleBurstActive] = useState(false);
  const timeRef = useRef(0);
  const initialPosition = useRef<[number, number, number]>(position);
  const initialRotation = useRef({
    y: (rotation * Math.PI) / 180,
    x: 0,
    z: 0,
  });

  // Scale is fixed at 1 in JSX - no initialization needed

  // Trigger particle burst on hover - only depend on hovered state
  useEffect(() => {
    if (hovered && (hoverEffect === "particles" || hoverEffect === "explode")) {
      setParticleBurstActive(true);
      const timer = setTimeout(() => setParticleBurstActive(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setParticleBurstActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]); // Only depend on hovered, not hoverEffect to prevent re-renders

  // Convert animation direction (0-360 degrees) to rotation
  const directionRad = (animationDirection * Math.PI) / 180;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scale is set in JSX as fixed prop - no need for useEffect

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // DO NOT modify scale here - it's set once in useEffect

    timeRef.current += delta;

    // Floating animation - only affects Y position
    if (floating) {
      const floatOffset =
        Math.sin(timeRef.current * floatSpeed) * floatAmplitude;
      meshRef.current.position.y = initialPosition.current[1] + floatOffset;
    } else {
      // Reset Y position when not floating
      meshRef.current.position.y = initialPosition.current[1];
    }

    // Auto rotation - only when not hovered
    if (autoRotate && !hovered) {
      if (rotationAxis === "y" || rotationAxis === "all") {
        initialRotation.current.y += delta * rotationSpeed;
      }
      if (rotationAxis === "x" || rotationAxis === "all") {
        initialRotation.current.x += delta * rotationSpeed * 0.5;
      }
      if (rotationAxis === "z" || rotationAxis === "all") {
        initialRotation.current.z += delta * rotationSpeed * 0.3;
      }
    }

    // Apply rotation with animation direction
    meshRef.current.rotation.y = initialRotation.current.y + directionRad;
    meshRef.current.rotation.x = initialRotation.current.x;
    meshRef.current.rotation.z = initialRotation.current.z;

    // SCALE IS FIXED - Do not modify scale after initialization

    // Apply hover effects (position/visual effects only, no scaling)
    if (hovered && hoverEffect !== "none") {
      switch (hoverEffect) {
        case "shake":
          // Shake effect - random position offset
          const shakeAmount = hoverEffectIntensity * 0.1;
          shakeRef.current.x = (Math.random() - 0.5) * shakeAmount;
          shakeRef.current.y = (Math.random() - 0.5) * shakeAmount;
          shakeRef.current.z = (Math.random() - 0.5) * shakeAmount;
          meshRef.current.position.x =
            initialPosition.current[0] + shakeRef.current.x;
          meshRef.current.position.z =
            initialPosition.current[2] + shakeRef.current.z;
          break;

        case "magnetic":
          // Magnetic effect - pull towards cursor with bounds
          const magneticPull = hoverEffectIntensity * 0.05;
          const maxOffset = 2;
          const currentX = meshRef.current.position.x;
          const currentZ = meshRef.current.position.z;
          const newX = Math.max(
            initialPosition.current[0] - maxOffset,
            Math.min(
              initialPosition.current[0] + maxOffset,
              currentX + magneticPull * delta
            )
          );
          const newZ = Math.max(
            initialPosition.current[2] - maxOffset,
            Math.min(
              initialPosition.current[2] + maxOffset,
              currentZ + magneticPull * delta
            )
          );
          meshRef.current.position.x = newX;
          meshRef.current.position.z = newZ;
          break;

        case "rotate":
        case "neon":
        case "particles":
        case "explode":
        case "glow":
        case "scale":
        case "pulse":
        default:
          // These effects are handled by other components (NeonGlow, ParticleBurst, Model3D rotation)
          // No position changes needed here
          break;
      }
    } else {
      // Not hovered - reset position to initial
      meshRef.current.position.x = initialPosition.current[0];
      meshRef.current.position.z = initialPosition.current[2];
    }
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const modelUrlToUse = modelUrl || MODEL_URLS[type];
  const bgColor = backgroundColor || MODEL_COLORS[type];

  return (
    <group
      ref={meshRef}
      position={position}
      scale={[1, 1, 1]} // FIXED SCALE - Never changes
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* 3D Model */}
      {mounted && (
        <ModelErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Model3D
              url={modelUrlToUse}
              scale={modelScale}
              position={modelPosition}
              rotationSpeed={modelRotationSpeed}
              rotationAxis={modelRotationAxis}
              hoverRotationSpeed={
                hoverEffect === "rotate" ? hoverEffectIntensity * 2 : 0
              }
              hovered={hovered}
            />
          </Suspense>
        </ModelErrorBoundary>
      )}

      {/* Hover Effects */}
      {hoverEffect === "neon" && (
        <NeonGlow
          active={hovered}
          intensity={hoverEffectIntensity}
          color={bgColor}
        />
      )}

      {(hoverEffect === "particles" || hoverEffect === "explode") && (
        <ParticleBurst
          active={particleBurstActive}
          intensity={hoverEffectIntensity}
          color={bgColor}
          count={hoverEffect === "explode" ? 100 : 50}
        />
      )}
    </group>
  );
};

// Main Component
export const PathSelection3DCard: React.FC<PathSelection3DCardProps> = (
  props
) => {
  const {
    type,
    backgroundVariant = "glassmorphism",
    backgroundColor,
    glowIntensity = DEFAULT_ANIMATION.glowIntensity,
    animationDelay = DEFAULT_ANIMATION.animationDelay,
    className,
  } = props;

  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = backgroundColor || MODEL_COLORS[type];

  if (!mounted) {
    return (
      <StyledCardContainer
        backgroundVariant={backgroundVariant}
        backgroundColor={bgColor}
        glowIntensity={glowIntensity}
        className={className}
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading 3D card...</div>
      </StyledCardContainer>
    );
  }

  return (
    <StyledCardContainer
      ref={canvasRef}
      backgroundVariant={backgroundVariant}
      backgroundColor={bgColor}
      glowIntensity={glowIntensity}
      className={className}
      style={{
        minHeight: "400px",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: props.onClick ? "pointer" : "default",
        animationDelay: `${animationDelay}s`,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <FloatingCard3D {...props} canvasContainer={canvasRef.current} />
      </Canvas>
    </StyledCardContainer>
  );
};

export default PathSelection3DCard;
