import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TorusKnot, Sphere, Stars } from "@react-three/drei";
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
  useFrame(() => {
    if (meshRef.current) {
      // Animate rotation based on mouse position and click
      meshRef.current.rotation.x += 0.01 + mouse.y * 0.05;
      meshRef.current.rotation.y += 0.01 + mouse.x * 0.05;
      if (clicked) {
        meshRef.current.scale.set(1.2, 1.2, 1.2);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });
  switch (type) {
    case "torusKnot":
      return (
        <TorusKnot ref={meshRef} args={[2, 0.7, 100, 16]}>
          <meshStandardMaterial color="#00bcd4" transparent opacity={0.25} />
        </TorusKnot>
      );
    case "sphere":
      return (
        <Sphere ref={meshRef} args={[2, 64, 64]}>
          <meshStandardMaterial color="#ff9800" transparent opacity={0.25} />
        </Sphere>
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Normalize mouse position to [-1, 1]
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMouse({ x, y });
  };

  const handlePointerDown = () => setClicked(true);
  const handlePointerUp = () => setClicked(false);

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
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1} />
        <directionalLight
          position={[2, 2, 2]}
          intensity={1}
          color={animationType === "torusKnot" ? "#00bcd4" : "#ff9800"}
        />
        <AnimatedObject type={animationType} mouse={mouse} clicked={clicked} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
