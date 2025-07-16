import React, { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  TorusKnot,
  Text,
  Stars,
  Image,
} from "@react-three/drei";
import * as THREE from "three";
import {
  AnimationType,
  AnimatedBackgroundProps,
} from "./AnimatedBackground.type";

const AnimatedObject: React.FC<{
  type: AnimationType;
  mouse: { x: number; y: number };
  clicked: boolean;
}> = ({ type, mouse, clicked }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetScale = useRef(1);

  useFrame((state) => {
    const currentRef = type === "sphere" ? groupRef.current : meshRef.current;

    if (currentRef) {
      // Smooth rotation following mouse with lerp
      targetRotation.current.x += mouse.y * 0.02;
      targetRotation.current.y += mouse.x * 0.02;

      // Apply smooth interpolation
      currentRef.rotation.x +=
        (targetRotation.current.x - currentRef.rotation.x) * 0.05;
      currentRef.rotation.y +=
        (targetRotation.current.y - currentRef.rotation.y) * 0.05;

      // Add subtle continuous rotation
      currentRef.rotation.x += 0.005;
      currentRef.rotation.y += 0.005;

      // Smooth scale animation on click
      targetScale.current = clicked ? 1.3 : 1;
      const scaleDiff = targetScale.current - currentRef.scale.x;
      currentRef.scale.x += scaleDiff * 0.1;
      currentRef.scale.y += scaleDiff * 0.1;
      currentRef.scale.z += scaleDiff * 0.1;

      // Add subtle floating animation
      currentRef.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  switch (type) {
    case "torusKnot":
      return (
        <TorusKnot ref={meshRef} args={[2, 0.7, 100, 16]}>
          <meshStandardMaterial
            color="#00bcd4"
            transparent
            opacity={0.25}
            metalness={0.5}
            roughness={0.2}
          />
        </TorusKnot>
      );
    case "sphere":
      return (
        <Image
          url="/logo.png"
          position={[0, 0, 0]}
          scale={[1, 1]}
          rotation={[0, 0, 0]}
        />
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
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // Throttled mouse move handler for better performance
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        // Normalize mouse position to [-1, 1]
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;

        // Smooth mouse tracking
        mouseRef.current.x += (x - mouseRef.current.x) * 0.1;
        mouseRef.current.y += (y - mouseRef.current.y) * 0.1;

        setMouse({ x: mouseRef.current.x, y: mouseRef.current.y });
      });
    },
    []
  );

  const handlePointerEnter = () => setIsHovering(true);
  const handlePointerLeave = () => setIsHovering(false);
  const handlePointerDown = () => setClicked(true);
  const handlePointerUp = () => setClicked(false);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        cursor: isHovering ? "pointer" : "default",
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[2, 2, 2]}
          intensity={1.2}
          color={animationType === "torusKnot" ? "#00bcd4" : "#ff9800"}
        />
        <pointLight
          position={[-2, -2, -2]}
          intensity={0.5}
          color={animationType === "torusKnot" ? "#00bcd4" : "#ff9800"}
        />
        <AnimatedObject type={animationType} mouse={mouse} clicked={clicked} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!isHovering}
          autoRotateSpeed={animationType === "sphere" ? 5 : 1}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
