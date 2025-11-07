"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ModelLoaderProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  autoRotate?: boolean;
}

export const ModelLoader: React.FC<ModelLoaderProps> = ({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate = true,
}) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Clone the scene to avoid conflicts
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (modelRef.current && autoRotate) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={modelRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload function to be called in the main component
export const preloadModels = () => {
  if (typeof window !== "undefined") {
    import("@react-three/drei").then(({ useGLTF }) => {
      useGLTF.preload("/models/bull_head_1k.gltf/bull_head_1k.gltf");
      useGLTF.preload("/models/lion_head_1k.gltf/lion_head_1k.gltf");
      useGLTF.preload("/models/horse_head_1k.gltf/horse_head_1k.gltf");
    });
  }
};
