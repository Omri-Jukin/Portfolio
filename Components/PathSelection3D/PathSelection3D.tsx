"use client";

import React, { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Box } from "@mui/material";
import { Typography } from "..";
import { preloadModels } from "./ModelLoader";

interface FloatingCardProps {
  position: [number, number, number];
  color1: string;
  color2: string;
  text: string;
  icon: string;
  type: "employer" | "client" | "browse";
  modelUrl?: string;
  onSelect?: (type: "employer" | "client" | "browse") => void;
}

interface TextPlaneProps {
  icon: string;
  text: string;
  color1: string;
  color2: string;
}

const TextPlane: React.FC<TextPlaneProps> = ({
  icon,
  text,
  color1,
  color2,
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 768);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 768);

    // Text
    ctx.fillStyle = "white";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(icon, 256, 150);
    ctx.font = "bold 36px Arial";
    ctx.fillText(text, 256, 250);
    ctx.font = "24px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Click to select", 256, 300);

    return new THREE.CanvasTexture(canvas);
  }, [icon, text, color1, color2]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, 0.11]}>
      <planeGeometry args={[4, 6]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  );
};

// Error boundary component for model loading
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
    // Silently handle missing model files
    console.warn("Model failed to load:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Separate component for model loading to avoid hydration issues
// This component must always call hooks unconditionally
const Model3D: React.FC<{ url: string }> = ({ url }) => {
  const modelRef = useRef<THREE.Group>(null);

  // Always call hook unconditionally - drei's useGLTF will handle errors
  // We wrap this in an error boundary to catch 404s gracefully
  const gltf = useGLTF(url);

  // Return null if model didn't load
  if (!gltf || !gltf.scene) return null;

  return (
    <group
      ref={modelRef}
      position={[0, 5, 0]}
      scale={[10, 10, 10]}
      rotation={[0, 0, 0]}
    >
      <primitive object={gltf.scene.clone()} />
    </group>
  );
};

const FloatingCard: React.FC<FloatingCardProps> = ({
  position,
  color1,
  color2,
  text,
  icon,
  type,
  modelUrl,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeRef = useRef(0);
  const initialPosition = useRef<[number, number, number]>(position);
  const initialRotation = useRef({ y: 0, x: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    timeRef.current += delta;

    // Float animation
    const floatOffset = Math.sin(timeRef.current) * 0.5;
    meshRef.current.position.y = initialPosition.current[1] + floatOffset;

    // Slow rotation
    if (!hovered) {
      // initialRotation.current.y += delta * 1;
      // initialRotation.current.x = Math.cos(timeRef.current * 0.3) * 0.05;
      meshRef.current.rotation.y = initialRotation.current.y;
      meshRef.current.rotation.x = initialRotation.current.x;
    }

    // Hover scale for the entire card group (including model)
    if (meshRef.current) {
      const targetScale = hovered ? 1.1 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const handleClick = () => {
    if (onSelect) {
      onSelect(type);
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* 3D Model - only render after mount, wrapped in error boundary and Suspense */}
      {mounted && modelUrl && (
        <ModelErrorBoundary
          fallback={
            <TextPlane
              icon={icon}
              text={text}
              color1={color1}
              color2={color2}
            />
          }
        >
          <Suspense fallback={null}>
            <Model3D url={modelUrl} />
          </Suspense>
        </ModelErrorBoundary>
      )}

      {/* Text plane on front (fallback if model not loaded or not mounted) */}
      {(!mounted || !modelUrl) && (
        <TextPlane icon={icon} text={text} color1={color1} color2={color2} />
      )}
    </group>
  );
};

const ParticleSystem: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
    }
  });

  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={0x888888} size={0.1} transparent opacity={0.6} />
    </points>
  );
};

interface PathSelection3DProps {
  onSelect?: (type: "employer" | "client" | "browse") => void;
  height?: string | number;
}

const PathSelection3D: React.FC<PathSelection3DProps> = ({
  onSelect,
  height = "100%",
}) => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
    preloadModels();
  }, []);

  if (!mounted) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Loading 3D scene...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height, position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={25}
          enablePan={false}
        />

        {/* Background particles */}
        <ParticleSystem />

        {/* Cards */}
        <FloatingCard
          position={[-6, 0, 0]}
          color1="#2563EB"
          color2="#06B6D4"
          text="For Employers"
          icon="💼"
          type="employer"
          modelUrl="/models/bull_head_1k.gltf/bull_head_1k.gltf"
          onSelect={onSelect}
        />

        <FloatingCard
          position={[0, 0, 0]}
          color1="#9333EA"
          color2="#EC4899"
          text="For Clients"
          icon="🚀"
          type="client"
          modelUrl="/models/lion_head_1k.gltf/lion_head_1k.gltf"
          onSelect={onSelect}
        />

        <FloatingCard
          position={[6, 0, 0]}
          color1="#10B981"
          color2="#34D399"
          text="Browse Portfolio"
          icon="🌐"
          type="browse"
          modelUrl="/models/horse_head_1k.gltf/horse_head_1k.gltf"
          onSelect={onSelect}
        />
      </Canvas>

      {/* UI Overlay */}
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
          color: "#0F172A",
        }}
      >
        <Typography variant="h3" color="textPrimary" gutterBottom>
          Choose Your Path
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Click a card to continue:
          <br />
          • Bull = Employers
          <br />
          • Lion = Clients
          <br />• Horse = Browse
        </Typography>
      </Box>

      {/* Instructions */}
      <Box
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          textAlign: "center",
          color: "#64748B",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          padding: "1rem 2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          pointerEvents: "none",
        }}
      >
        <Typography variant="body2" color="textSecondary" gutterBottom>
          3D Interaction:
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          • Move mouse to orbit around the 3D cards
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          • Scroll to zoom in/out
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          • Click a card to select and navigate
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          • Cards float and rotate in 3D space
        </Typography>
      </Box>
    </Box>
  );
};

export default PathSelection3D;
