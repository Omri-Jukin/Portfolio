import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { useTheme } from "@mui/material/styles";
import * as THREE from "three";

const DNAHelix: React.FC<{
  spinning: boolean;
  position?: [number, number, number];
}> = ({ spinning, position }) => {
  const positionGroupRef = useRef<THREE.Group>(null); // For positioning and orientation
  const rotationGroupRef = useRef<THREE.Group>(null); // For tube rolling around DNA's natural axis
  const rotationState = useRef({ y: 0 }); // Persistent rotation state
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Electric glowing DNA colors with theme-responsive darkness for light mode
  const isDark = theme.palette.mode === "dark";

  // Electric backbone colors - darker for light mode, bright for dark mode
  const strand1Color = isDark ? "#00BFFF" : "#0066CC"; // Electric blue - darker in light mode
  const strand2Color = isDark ? "#FF1493" : "#CC0066"; // Deep pink/magenta - darker in light mode

  // Nucleotide colors - darker for light mode visibility
  const adenineColor = isDark ? "#00FFFF" : "#008B8B"; // Cyan - darker teal in light mode
  const thymineColor = isDark ? "#FF69B4" : "#C71585"; // Hot pink - darker in light mode
  const guanineColor = isDark ? "#9370DB" : "#663399"; // Purple - darker in light mode
  const cytosineColor = isDark ? "#FF4500" : "#CC3300"; // Orange red - darker in light mode

  // Connection colors - darker for light mode
  const sugarPhosphateBondColor = isDark ? "#00FF00" : "#006600"; // Bright green to dark green

  // Background bond color - theme responsive
  const backgroundBondColor = isDark ? "#87CEEB" : "#4682B4"; // Sky blue to steel blue

  // Animation - revolve around the DNA's natural helix axis (Y-axis) with persistence
  useFrame(() => {
    if (spinning && mounted && rotationGroupRef.current) {
      // Update persistent rotation state
      rotationState.current.y += 0.01;
      // Apply to the actual rotation
      rotationGroupRef.current.rotation.y = rotationState.current.y;
    }
  });

  // Create DNA structure
  const dnaStructure = useMemo(() => {
    if (!mounted) return new THREE.Group();

    const group = new THREE.Group();

    // Geometries for highly detailed, textured DNA
    const backboneSegmentGeometry = new THREE.CylinderGeometry(
      0.1,
      0.08,
      0.35,
      16,
      4
    ); // More segments, tapered for organic look
    const nucleotideGeometry = new THREE.SphereGeometry(0.15, 20, 20); // Higher resolution spheres
    const basePairBondGeometry = new THREE.CylinderGeometry(
      0.03,
      0.05,
      1,
      12,
      2
    ); // Tapered bonds
    const backboneConnectionGeometry = new THREE.CylinderGeometry(
      0.08,
      0.06,
      1,
      12,
      3
    ); // Organic connections

    // Create ULTRA glowing materials with maximum glow effects
    const strand1Material = new THREE.MeshStandardMaterial({
      color: strand1Color,
      transparent: false,
      metalness: 0.0,
      roughness: 0.1,
      emissive: new THREE.Color(strand1Color),
      emissiveIntensity: isDark ? 4.0 : 2.0, // Ultra bright in dark, moderate in light
    });
    const strand2Material = new THREE.MeshStandardMaterial({
      color: strand2Color,
      transparent: false,
      metalness: 0.0,
      roughness: 0.1,
      emissive: new THREE.Color(strand2Color),
      emissiveIntensity: isDark ? 4.0 : 2.0, // Ultra bright in dark, moderate in light
    });

    // MAXIMUM glow nucleotide materials
    const adenineMaterial = new THREE.MeshStandardMaterial({
      color: adenineColor,
      transparent: false,
      metalness: 0.0,
      roughness: 0.05,
      emissive: new THREE.Color(adenineColor),
      emissiveIntensity: isDark ? 5.0 : 2.5, // Maximum possible glow
    });
    const thymineMaterial = new THREE.MeshStandardMaterial({
      color: thymineColor,
      transparent: false,
      metalness: 0.0,
      roughness: 0.05,
      emissive: new THREE.Color(thymineColor),
      emissiveIntensity: isDark ? 5.0 : 2.5,
    });
    const guanineMaterial = new THREE.MeshStandardMaterial({
      color: guanineColor,
      transparent: false,
      metalness: 0.0,
      roughness: 0.05,
      emissive: new THREE.Color(guanineColor),
      emissiveIntensity: isDark ? 5.0 : 2.5,
    });
    const cytosineMaterial = new THREE.MeshStandardMaterial({
      color: cytosineColor,
      transparent: false,
      metalness: 0.0,
      roughness: 0.05,
      emissive: new THREE.Color(cytosineColor),
      emissiveIntensity: isDark ? 5.0 : 2.5,
    });

    // Ultra bright glowing bond materials
    const basePairBondMaterial = new THREE.MeshStandardMaterial({
      color: backgroundBondColor,
      transparent: false,
      metalness: 0.1,
      roughness: 0.05,
      emissive: new THREE.Color(backgroundBondColor),
      emissiveIntensity: isDark ? 3.5 : 1.8, // Intense glow
    });

    const backboneConnectionMaterial = new THREE.MeshStandardMaterial({
      color: sugarPhosphateBondColor,
      transparent: false,
      metalness: 0.0,
      roughness: 0.05,
      emissive: new THREE.Color(sugarPhosphateBondColor),
      emissiveIntensity: isDark ? 4.5 : 2.2, // Ultra bright green glow
    });

    // Create DNA double helix with enhanced detail for textured appearance
    const segments = 200; // More segments for longer, more detailed helix
    const helixRadius = 1.1; // Slightly tighter for more detail
    const segmentHeight = 0.3; // Slightly larger segments for better visibility
    const basePairSpacing = 3; // More frequent base pairs for richer detail

    // Store positions for backbone connections
    const strand1Positions = [];
    const strand2Positions = [];

    for (let i = 0; i < segments; i++) {
      const angle = (i * 24 * Math.PI) / 180; // 24 degrees per segment (15 segments per full turn)
      const y = (i - segments / 2) * segmentHeight;

      // Add slight random variation for organic texture
      const radiusVariation = 1 + Math.sin(i * 0.3) * 0.1; // Subtle radius variation
      const heightVariation = Math.sin(i * 0.7) * 0.05; // Subtle height variation

      // Strand positions with organic variation
      const x1 = Math.cos(angle) * (helixRadius * radiusVariation);
      const z1 = Math.sin(angle) * (helixRadius * radiusVariation);
      const x2 = Math.cos(angle + Math.PI) * (helixRadius * radiusVariation);
      const z2 = Math.sin(angle + Math.PI) * (helixRadius * radiusVariation);

      const pos1 = new THREE.Vector3(x1, y + heightVariation, z1);
      const pos2 = new THREE.Vector3(x2, y + heightVariation, z2);
      strand1Positions.push(pos1);
      strand2Positions.push(pos2);

      // Create detailed backbone segments with organic orientation
      const backboneSegment1 = new THREE.Mesh(
        backboneSegmentGeometry,
        strand1Material
      );
      backboneSegment1.position.copy(pos1);

      // Add slight random rotation for organic texture
      const randomRotation = (Math.random() - 0.5) * 0.2;
      backboneSegment1.rotation.set(randomRotation, 0, randomRotation);

      // Orient toward next segment for flow
      if (i < segments - 1) {
        const nextAngle = ((i + 1) * 24 * Math.PI) / 180;
        const nextVariation = 1 + Math.sin((i + 1) * 0.3) * 0.1;
        const nextPos1 = new THREE.Vector3(
          Math.cos(nextAngle) * (helixRadius * nextVariation),
          (i + 1 - segments / 2) * segmentHeight +
            Math.sin((i + 1) * 0.7) * 0.05,
          Math.sin(nextAngle) * (helixRadius * nextVariation)
        );
        const direction1 = nextPos1.clone().sub(pos1);
        backboneSegment1.lookAt(pos1.clone().add(direction1));
        backboneSegment1.rotateX(Math.PI / 2);
      }
      group.add(backboneSegment1);

      // Same for second strand
      const backboneSegment2 = new THREE.Mesh(
        backboneSegmentGeometry,
        strand2Material
      );
      backboneSegment2.position.copy(pos2);
      backboneSegment2.rotation.set(randomRotation, 0, randomRotation);

      if (i < segments - 1) {
        const nextAngle = ((i + 1) * 24 * Math.PI) / 180;
        const nextVariation = 1 + Math.sin((i + 1) * 0.3) * 0.1;
        const nextPos2 = new THREE.Vector3(
          Math.cos(nextAngle + Math.PI) * (helixRadius * nextVariation),
          (i + 1 - segments / 2) * segmentHeight +
            Math.sin((i + 1) * 0.7) * 0.05,
          Math.sin(nextAngle + Math.PI) * (helixRadius * nextVariation)
        );
        const direction2 = nextPos2.clone().sub(pos2);
        backboneSegment2.lookAt(pos2.clone().add(direction2));
        backboneSegment2.rotateX(Math.PI / 2);
      }
      group.add(backboneSegment2);

      // Add detailed base pairs with enhanced structure
      if (i % basePairSpacing === 0) {
        // Determine base pair type
        const isAT = (i / basePairSpacing) % 2 === 0;

        // Create nucleotides with slight size variation for organic look
        const sizeVariation = 0.9 + Math.random() * 0.2; // 0.9x to 1.1x size
        const nucleotideOffset = 0.25;
        const nx1 = x1 + (x2 - x1) * nucleotideOffset;
        const nz1 = z1 + (z2 - z1) * nucleotideOffset;
        const nx2 = x2 + (x1 - x2) * nucleotideOffset;
        const nz2 = z2 + (z1 - z2) * nucleotideOffset;

        // Base pair materials
        let nucleotide1Material, nucleotide2Material;
        if (isAT) {
          nucleotide1Material = adenineMaterial; // Adenine
          nucleotide2Material = thymineMaterial; // Thymine
        } else {
          nucleotide1Material = guanineMaterial; // Guanine
          nucleotide2Material = cytosineMaterial; // Cytosine
        }

        const nucleotide1 = new THREE.Mesh(
          nucleotideGeometry,
          nucleotide1Material
        );
        nucleotide1.position.set(nx1, y + heightVariation, nz1);
        nucleotide1.scale.setScalar(sizeVariation);
        group.add(nucleotide1);

        const nucleotide2 = new THREE.Mesh(
          nucleotideGeometry,
          nucleotide2Material
        );
        nucleotide2.position.set(nx2, y + heightVariation, nz2);
        nucleotide2.scale.setScalar(sizeVariation);
        group.add(nucleotide2);

        // Enhanced base pair bonds with organic shape
        const basePairBond = new THREE.Mesh(
          basePairBondGeometry,
          basePairBondMaterial
        );
        basePairBond.position.set(
          (nx1 + nx2) / 2,
          y + heightVariation,
          (nz1 + nz2) / 2
        );

        // Orient and scale the bond
        const bondDirection = new THREE.Vector3(nx2 - nx1, 0, nz2 - nz1);
        basePairBond.lookAt(basePairBond.position.clone().add(bondDirection));
        basePairBond.rotateX(Math.PI / 2);
        basePairBond.scale.y = bondDirection.length() * 0.6;

        group.add(basePairBond);

        // Enhanced connections with organic curvature
        const connection1 = new THREE.Mesh(
          backboneConnectionGeometry,
          backboneConnectionMaterial
        );
        const midPoint1 = pos1
          .clone()
          .lerp(new THREE.Vector3(nx1, y + heightVariation, nz1), 0.5);
        connection1.position.copy(midPoint1);
        const connDir1 = new THREE.Vector3(nx1 - x1, 0, nz1 - z1);
        connection1.lookAt(midPoint1.clone().add(connDir1));
        connection1.rotateX(Math.PI / 2);
        connection1.scale.y = connDir1.length() * 0.8;
        group.add(connection1);

        const connection2 = new THREE.Mesh(
          backboneConnectionGeometry,
          backboneConnectionMaterial
        );
        const midPoint2 = pos2
          .clone()
          .lerp(new THREE.Vector3(nx2, y + heightVariation, nz2), 0.5);
        connection2.position.copy(midPoint2);
        const connDir2 = new THREE.Vector3(nx2 - x2, 0, nz2 - z2);
        connection2.lookAt(midPoint2.clone().add(connDir2));
        connection2.rotateX(Math.PI / 2);
        connection2.scale.y = connDir2.length() * 0.8;
        group.add(connection2);
      }
    }

    return group;
  }, [
    strand1Color,
    strand2Color,
    adenineColor,
    thymineColor,
    guanineColor,
    cytosineColor,
    sugarPhosphateBondColor,
    backgroundBondColor,
    isDark,
    mounted,
  ]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    // Outer group for positioning and diagonal orientation
    <group
      ref={positionGroupRef}
      // Position to start from very bottom of card
      position={position || [0, -25, 0]} // Moved much lower to start from bottom edge
      rotation={[0, Math.PI / 6, 0]} // Slightly angled toward center for better view
      scale={[5, 5, 5]} // Much larger scale to fill the card
    >
      {/* Inner group that rotates around DNA's natural Y-axis (helix length) */}
      <group ref={rotationGroupRef}>
        <primitive object={dnaStructure} />
      </group>
    </group>
  );
};

// Wrapper component that provides Canvas context
const DNAHelixWrapper: React.FC<{
  spinning: boolean;
  position?: [number, number, number];
}> = ({ spinning, position }) => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 15], // Moved camera further back to accommodate larger helix
          fov: 60, // Reduced field of view for better framing
        }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
      >
        <ambientLight intensity={0.2} color="#001122" />
        <directionalLight
          position={[20, 8, 10]}
          intensity={2.0}
          color="#00BFFF"
        />
        <pointLight
          position={[15, 5, 5]}
          intensity={2.5}
          color="#FF1493"
          distance={25}
          decay={2}
        />
        <pointLight
          position={[12, -3, 8]}
          intensity={1.8}
          color="#00FFFF"
          distance={20}
          decay={2}
        />
        <pointLight
          position={[8, 8, -5]}
          intensity={1.5}
          color="#9370DB"
          distance={30}
          decay={2}
        />
        <pointLight
          position={[10, -8, 0]}
          intensity={1.0}
          color="#FF4500"
          distance={35}
          decay={2}
        />
        <DNAHelix spinning={spinning} position={position || [0, 0, 5]} />
      </Canvas>
    </div>
  );
};

export default DNAHelix;
export { DNAHelixWrapper };
