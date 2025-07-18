import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PresentationControls,
  TorusKnot,
  Stars,
  Polyhedron,
} from "@react-three/drei";
import * as THREE from "three";
import {
  AnimationType,
  AnimatedBackgroundProps,
} from "./AnimatedBackground.type";
import DNAHelix from "../DNAHelix/DNAHelix";

const AnimatedObject: React.FC<{
  type: AnimationType;
  spinning: boolean;
}> = ({ type, spinning }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const themeMode = useTheme().palette.mode;
  const darkColor = "#325663";
  const lightColor = "#632024";
  // Only animate if spinning is true
  useFrame(() => {
    const currentRef = meshRef.current;
    if (currentRef && spinning) {
      currentRef.rotation.x += 0.005;
      currentRef.rotation.y += 0.005;
    }
  });

  switch (type) {
    case "dna":
      return <DNAHelix spinning={spinning} />;
    case "torusKnot":
      return (
        <TorusKnot ref={meshRef} args={[5.5, 0.2, 200, 100]}>
          <meshStandardMaterial
            color={themeMode === "dark" ? darkColor : lightColor}
            emissive={themeMode === "dark" ? darkColor : lightColor}
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0.2}
            transparent
            opacity={1}
          />
        </TorusKnot>
      );
    case "polyhedron":
      return (
        <Polyhedron
          ref={meshRef}
          args={[
            // vertices array
            [
              -1, 0, 1, 0, -1, -1, 0, 1, -1, 0, 0, -1, 0, 1, 1, 0, -1, -1, 0, 1,
              -1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1,
            ],
            // indices array
            [
              0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11,
              4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6,
              8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
            ],
          ]}
        >
          <meshStandardMaterial
            color={themeMode === "dark" ? darkColor : lightColor}
            emissive={themeMode === "dark" ? darkColor : lightColor}
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={1}
          />
        </Polyhedron>
      );
    case "stars":
      return <Stars />;
    default:
      return null;
  }
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  animationType,
}) => {
  // Track whether the user is interacting (grabbing)
  const [spinning, setSpinning] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return nothing during SSR
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
        }}
        style={{ background: "transparent" }}
      >
        {animationType === "dna" ? (
          // For DNA/helix, optimized lighting for right-side positioning
          <>
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[15, 8, 10]} // Positioned to light the right side
              intensity={0.8}
              color={"#ffffff"}
            />
            <pointLight
              position={[10, 5, 5]} // Additional light for the DNA area
              intensity={0.4}
              color={"#E3F2FD"}
            />
            <pointLight
              position={[-5, -5, -5]} // Subtle fill light from left
              intensity={0.2}
              color={"#FFEAA7"}
            />
            <AnimatedObject type={animationType} spinning={spinning} />
          </>
        ) : (
          <PresentationControls
            global
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
            enabled
            cursor
            snap
            rotation={[0, 0, 0]}
          >
            <ambientLight intensity={0.8} />
            <directionalLight
              position={[2, 2, 2]}
              intensity={1.2}
              color={"#00bcd4"}
            />
            <pointLight
              position={[-2, -2, -2]}
              intensity={0.5}
              color={"#00bcd4"}
            />
            <group
              onPointerDown={() => setSpinning(false)}
              onPointerUp={() => setSpinning(true)}
            >
              <AnimatedObject type={animationType} spinning={spinning} />
            </group>
          </PresentationControls>
        )}
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
