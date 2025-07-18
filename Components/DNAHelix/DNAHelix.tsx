import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "@mui/material/styles";
import * as THREE from "three";

const DNAHelix: React.FC<{ spinning: boolean }> = ({ spinning }) => {
  const positionGroupRef = useRef<THREE.Group>(null); // For positioning and orientation
  const rotationGroupRef = useRef<THREE.Group>(null); // For tube rolling around DNA's natural axis
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Impressive DNA colors using your color palette
  const isDark = theme.palette.mode === "dark";

  // DNA backbone colors - striking but professional
  const strand1Color = isDark ? "#64B5F6" : "#42A5F5"; // Cool blue from theme
  const strand2Color = isDark ? "#81C784" : "#4CAF50"; // Complementary green

  // Generate nucleotide colors from your palette for visual appeal
  const vibrantColors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Purple
    "#FF8A65", // Orange
    "#81C784", // Light Green
    "#64B5F6", // Light Blue
    "#FFB74D", // Amber
    "#F06292", // Pink
    "#9575CD", // Deep Purple
  ];

  // Assign specific colors for scientific accuracy but with your vibrant palette
  const adenineColor = "#FF6B6B"; // Red - Adenine (A)
  const thymineColor = "#64B5F6"; // Light Blue - Thymine (T)
  const guanineColor = "#96CEB4"; // Green - Guanine (G)
  const cytosineColor = "#DDA0DD"; // Purple - Cytosine (C)

  // Connection colors for impressive visuals
  const hydrogenBondColor = isDark ? "#FFEAA7" : "#FFB74D"; // Bright yellow/amber
  const sugarPhosphateBondColor = isDark ? "#F06292" : "#E91E63"; // Pink connections

  // Background bond color - warmer tone
  const backgroundBondColor = isDark ? theme.palette.dark.primary : "#F8F6F0"; // Dark blue or warm off-white

  // Animation - revolve around the DNA's natural helix axis (Y-axis)
  useFrame(() => {
    if (spinning && mounted && rotationGroupRef.current) {
      // Rotate around the DNA's natural central axis (Y-axis is the helix length)
      // This makes it revolve like a tube rolling around its own centerline
      rotationGroupRef.current.rotation.y += 0.01; // Rolling around its natural length axis
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

    // Create detailed texture-like materials with bump mapping simulation
    const strand1Material = new THREE.MeshStandardMaterial({
      color: strand1Color,
      transparent: false,
      metalness: 0.3,
      roughness: 0.4, // More realistic surface roughness
      emissive: new THREE.Color(strand1Color).multiplyScalar(0.1),
      emissiveIntensity: 0.8,
    });
    const strand2Material = new THREE.MeshStandardMaterial({
      color: strand2Color,
      transparent: false,
      metalness: 0.3,
      roughness: 0.4,
      emissive: new THREE.Color(strand2Color).multiplyScalar(0.1),
      emissiveIntensity: 0.8,
    });

    // Enhanced nucleotide materials with more realistic properties
    const adenineMaterial = new THREE.MeshStandardMaterial({
      color: adenineColor,
      transparent: false,
      metalness: 0.2,
      roughness: 0.6, // More matte, organic appearance
      emissive: new THREE.Color(adenineColor).multiplyScalar(0.15),
      emissiveIntensity: 0.6,
    });
    const thymineMaterial = new THREE.MeshStandardMaterial({
      color: thymineColor,
      transparent: false,
      metalness: 0.2,
      roughness: 0.6,
      emissive: new THREE.Color(thymineColor).multiplyScalar(0.15),
      emissiveIntensity: 0.6,
    });
    const guanineMaterial = new THREE.MeshStandardMaterial({
      color: guanineColor,
      transparent: false,
      metalness: 0.2,
      roughness: 0.6,
      emissive: new THREE.Color(guanineColor).multiplyScalar(0.15),
      emissiveIntensity: 0.6,
    });
    const cytosineMaterial = new THREE.MeshStandardMaterial({
      color: cytosineColor,
      transparent: false,
      metalness: 0.2,
      roughness: 0.6,
      emissive: new THREE.Color(cytosineColor).multiplyScalar(0.15),
      emissiveIntensity: 0.6,
    });

    // Enhanced bond materials with realistic properties
    const basePairBondMaterial = new THREE.MeshStandardMaterial({
      color: backgroundBondColor,
      transparent: false,
      metalness: 0.1,
      roughness: 0.8, // Very matte for organic bonds
      emissive: new THREE.Color(backgroundBondColor).multiplyScalar(0.05),
    });

    const backboneConnectionMaterial = new THREE.MeshStandardMaterial({
      color: sugarPhosphateBondColor,
      transparent: false,
      metalness: 0.4,
      roughness: 0.3, // Slightly more reflective for phosphate groups
      emissive: new THREE.Color(sugarPhosphateBondColor).multiplyScalar(0.2),
      emissiveIntensity: 0.7,
    });

    // Create DNA double helix with enhanced detail for textured appearance
    const segments = 150; // More segments for ultra-smooth, detailed helix
    const helixRadius = 1.1; // Slightly tighter for more detail
    const segmentHeight = 0.25; // Closer segments for smoother surface
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
    hydrogenBondColor,
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
      // Position on the right side of screen, responsive for mobile/PC
      position={[4, 2, -4]} // Moved to positive X (right side), closer Z for visibility
      rotation={[0, Math.PI / 6, 0]} // Slightly angled toward center for better view
      scale={[0.8, 1.2, 0.8]} // Slightly smaller for better mobile compatibility
    >
      {/* Inner group that rotates around DNA's natural Y-axis (helix length) */}
      <group ref={rotationGroupRef}>
        <primitive object={dnaStructure} />
      </group>
    </group>
  );
};

export default DNAHelix;
