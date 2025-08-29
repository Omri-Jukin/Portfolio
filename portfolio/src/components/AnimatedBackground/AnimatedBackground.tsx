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
import { usePathname } from "next/navigation";
import {
  AnimationType,
  AnimatedBackgroundProps,
} from "./AnimatedBackground.type";
import DNAHelix from "../DNAHelix/DNAHelix";

// Path-based animation mapping
export const getAnimationForPath = (path: string): AnimationType => {
  // Only remove locale if it's a valid locale code
  const validLocales = ["en", "es", "fr", "he"];
  const localeMatch = path.match(/^\/([a-z]{2})\/?/);
  const cleanPath =
    localeMatch && validLocales.includes(localeMatch[1])
      ? path.replace(/^\/[a-z]{2}\/?/, "").replace(/^\//, "")
      : path.replace(/^\//, "");

  switch (cleanPath) {
    case "":
    case "home":
      return "torusKnot"; // Home page gets torus knot
    case "about":
      return "dna"; // About page gets the impressive DNA animation
    case "contact":
      return "stars"; // Contact page gets stars
    case "blog":
      return "polyhedron"; // Blog page gets polyhedron
    case "career":
      return "dna"; // Career page gets DNA (professional/scientific)
    case "resume":
      return "torusKnot"; // Resume page gets torus knot
    case "admin":
      return "stars"; // Admin pages get stars
    default:
      // For any other paths, check if they contain certain keywords
      if (cleanPath.includes("blog")) return "polyhedron";
      if (cleanPath.includes("admin")) return "stars";
      if (cleanPath.includes("dna")) return "dna";
      return "dna"; // Default fallback
  }
};

export const AnimatedObject: React.FC<{
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
      return <DNAHelix spinning={spinning} position={[0, 0, 0]} />;
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
        <group scale={0.6} position={[0, 0, 0]}>
          <Polyhedron
            ref={meshRef}
            position={[0, 0, 0]}
            args={[
              // vertices array - octahedron
              [
                1,
                0,
                0, // 0
                -1,
                0,
                0, // 1
                0,
                1,
                0, // 2
                0,
                -1,
                0, // 3
                0,
                0,
                1, // 4
                0,
                0,
                -1, // 5
              ],
              // indices array - octahedron faces
              [
                0,
                2,
                4, // front face
                0,
                4,
                3, // bottom face
                0,
                3,
                5, // back face
                0,
                5,
                2, // top face
                1,
                2,
                5, // left face
                1,
                5,
                3, // bottom face
                1,
                3,
                4, // right face
                1,
                4,
                2, // top face
              ],
            ]}
          >
            <meshStandardMaterial
              color={themeMode === "dark" ? darkColor : lightColor}
              emissive={themeMode === "dark" ? darkColor : lightColor}
              emissiveIntensity={1.5}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={1}
            />
          </Polyhedron>
        </group>
      );
    case "stars":
      return <Stars />;
    default:
      return null;
  }
};

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  animationType,
  path,
  manualOverride = false,
}) => {
  // Track whether the user is interacting (grabbing)
  const [spinning, setSpinning] = useState(true);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const currentPath = usePathname();

  // Determine which animation to use based on path or fallback to provided animationType
  // If user manually overrode, use their choice; otherwise use path-based animation
  const effectiveAnimationType = manualOverride
    ? animationType
    : path
    ? getAnimationForPath(path)
    : currentPath
    ? getAnimationForPath(currentPath)
    : animationType;

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
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping, // Better tone mapping for glow
          toneMappingExposure: isDark ? 1.5 : 0.8, // Higher exposure for dark mode glow
        }}
      >
        {effectiveAnimationType === "dna" ? (
          // For DNA/helix, ultra-enhanced lighting for maximum glow
          <>
            <ambientLight
              intensity={isDark ? 0.2 : 0.4}
              color={isDark ? "#001122" : "#112244"}
            />
            <directionalLight
              position={[20, 8, 10]} // Moved further right to follow DNA
              intensity={isDark ? 2.0 : 1.0}
              color={isDark ? "#00BFFF" : "#0066CC"}
            />
            <pointLight
              position={[15, 5, 5]} // Main DNA area light - moved right
              intensity={isDark ? 2.5 : 1.2}
              color={isDark ? "#FF1493" : "#CC0066"}
              distance={25}
              decay={2}
            />
            <pointLight
              position={[12, -3, 8]} // Secondary glow light - moved right
              intensity={isDark ? 1.8 : 0.9}
              color={isDark ? "#00FFFF" : "#008B8B"}
              distance={20}
              decay={2}
            />
            <pointLight
              position={[8, 8, -5]} // Fill light - moved right
              intensity={isDark ? 1.5 : 0.7}
              color={isDark ? "#9370DB" : "#663399"}
              distance={30}
              decay={2}
            />
            <pointLight
              position={[10, -8, 0]} // Bottom accent light - moved right
              intensity={isDark ? 1.0 : 0.5}
              color={isDark ? "#FF4500" : "#CC3300"}
              distance={35}
              decay={2}
            />
            <AnimatedObject type={effectiveAnimationType} spinning={spinning} />
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
              <AnimatedObject
                type={effectiveAnimationType}
                spinning={spinning}
              />
            </group>
          </PresentationControls>
        )}
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
