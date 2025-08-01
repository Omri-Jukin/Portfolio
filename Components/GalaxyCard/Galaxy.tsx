import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { GalaxyProps } from "./Galaxy.type";
import { GalaxyContainer, Canvas, ContentContainer } from "./Galaxy.style";

const Galaxy: React.FC<GalaxyProps> = ({
  count = 30000,
  size = 0.01,
  radius = 5,
  branches = 4,
  spin = 1.5,
  randomness = 0.2,
  randomnessPower = 2.2,
  insideColor = "#ffff00",
  outsideColor = "#0000ff",
  rotationSpeed = 0.3,
  pulseSpeed = 0.5,
  pulseIntensity = 0.1,
  animateColors = false,
  animateSpin = true,
  intensity = "medium",
  speed = "normal",
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const galaxyGroupRef = useRef<THREE.Group | null>(null);
  const galaxyPointsRef = useRef<THREE.Points | null>(null);
  const galaxyGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const galaxyMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const ambientStarsRef = useRef<THREE.Points | null>(null);
  const shootingStarsRef = useRef<THREE.Group[]>([]);
  const centerGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const clockRef = useRef(new THREE.Clock());

  // Adjust parameters based on intensity and speed
  const getIntensityMultiplier = useCallback(() => {
    switch (intensity) {
      case "low":
        return 0.5;
      case "high":
        return 2;
      default:
        return 1;
    }
  }, [intensity]);

  const getSpeedMultiplier = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.5;
      case "fast":
        return 2;
      default:
        return 1;
    }
  }, [speed]);

  const adjustedCount = Math.floor(count * getIntensityMultiplier());
  const adjustedRotationSpeed = rotationSpeed * getSpeedMultiplier();
  const adjustedPulseSpeed = pulseSpeed * getSpeedMultiplier();

  const generateCenter = useCallback(() => {
    if (!sceneRef.current || !centerGroupRef.current) return;

    // Create a bright center point
    const centerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.9,
    });
    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMesh.position.set(0, 0, 0);
    centerGroupRef.current.add(centerMesh);

    // Add a glow effect around the center
    const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#ffff00",
      transparent: true,
      opacity: 0.3,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    centerGroupRef.current.add(glowMesh);
  }, [sceneRef, centerGroupRef]);

  const generateAmbientStars = useCallback(() => {
    if (!sceneRef.current || !galaxyGroupRef.current) return;

    const count = 2000;
    const radius = 50;

    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random position on a sphere, adjusted to match galaxy position
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius;

      starsPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      starsPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 4; // Offset to match galaxy Y position
      starsPositions[i3 + 2] = r * Math.cos(phi);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starsPositions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
    });

    ambientStarsRef.current = new THREE.Points(starsGeometry, starsMaterial);
    // Add stars directly to scene so they remain stationary (not affected by galaxy rotation)
    sceneRef.current.add(ambientStarsRef.current);
  }, [sceneRef, galaxyGroupRef]);

  const generateGalaxy = useCallback(() => {
    if (!sceneRef.current || !galaxyGroupRef.current) return;

    // Dispose old galaxy
    if (galaxyPointsRef.current !== null) {
      galaxyGeometryRef.current?.dispose();
      galaxyMaterialRef.current?.dispose();
      galaxyGroupRef.current.remove(galaxyPointsRef.current);
    }

    // Geometry
    galaxyGeometryRef.current = new THREE.BufferGeometry();
    const positions = new Float32Array(adjustedCount * 3);
    const colors = new Float32Array(adjustedCount * 3);

    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3;

      // Position
      const radius_i = Math.random() * radius;
      const spinAngle = radius_i * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius_i;
      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius_i;
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius_i;

      // For clockwise rotation, arms should trail behind the rotation direction
      positions[i3] = Math.cos(branchAngle - spinAngle) * radius_i + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] =
        Math.sin(branchAngle - spinAngle) * radius_i + randomZ;

      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius_i / radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    galaxyGeometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    galaxyGeometryRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    // Material
    galaxyMaterialRef.current = new THREE.PointsMaterial({
      size: size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    // Points
    galaxyPointsRef.current = new THREE.Points(
      galaxyGeometryRef.current,
      galaxyMaterialRef.current
    );
    galaxyGroupRef.current.add(galaxyPointsRef.current);

    // Generate ambient stars if they don't exist
    if (!ambientStarsRef.current) {
      generateAmbientStars();
    }
  }, [
    adjustedCount,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
    size,
    generateAmbientStars,
  ]);

  const createShootingStar = useCallback(() => {
    if (!sceneRef.current) return;

    // Random position on the edge of the scene
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 20;

    const position = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    // Direction toward center with some randomness
    const direction = new THREE.Vector3(
      -position.x + (Math.random() - 0.5) * 10,
      -position.y + (Math.random() - 0.5) * 10,
      -position.z + (Math.random() - 0.5) * 10
    ).normalize();

    // Create star head
    const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.position.copy(position);

    // Create trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(20 * 3);

    for (let i = 0; i < 20; i++) {
      const i3 = i * 3;
      trailPositions[i3] = position.x - i * 0.1 * direction.x;
      trailPositions[i3 + 1] = position.y - i * 0.1 * direction.y;
      trailPositions[i3 + 2] = position.z - i * 0.1 * direction.z;
    }

    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3)
    );

    const trailMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      color: "#ffffff",
      transparent: true,
      opacity: 0.6,
    });

    const trail = new THREE.Points(trailGeometry, trailMaterial);

    // Group for the shooting star
    const shootingStar = new THREE.Group();
    shootingStar.add(starMesh);
    shootingStar.add(trail);
    shootingStar.userData.direction = direction;
    shootingStar.userData.active = true;

    sceneRef.current.add(shootingStar);
    shootingStarsRef.current.push(shootingStar);

    return shootingStar;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Scene
    sceneRef.current = new THREE.Scene();

    // Center group (for rotating center)
    centerGroupRef.current = new THREE.Group();
    sceneRef.current.add(centerGroupRef.current);

    // Galaxy group
    galaxyGroupRef.current = new THREE.Group();
    // Move galaxy higher in the container to show the center
    galaxyGroupRef.current.position.y = 4;
    sceneRef.current.add(galaxyGroupRef.current);

    // Camera
    const sizes = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    // Adjust camera position to better frame the higher galaxy
    cameraRef.current.position.set(3, 5, 3);
    sceneRef.current.add(cameraRef.current);

    // Renderer
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(sizes.width, sizes.height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current.setClearColor("#000000", 0);

    // Generate center and initial galaxy
    generateCenter();
    generateGalaxy();

    // Generate ambient stars
    generateAmbientStars();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const newSizes = {
        width: container.clientWidth,
        height: container.clientHeight,
      };

      cameraRef.current.aspect = newSizes.width / newSizes.height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(newSizes.width, newSizes.height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Shooting stars interval
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        createShootingStar();
      }

      // Clean up old shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        if (!star.userData.active) {
          sceneRef.current?.remove(star);
          return false;
        }
        return true;
      });
    }, 2000);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const delta = clockRef.current.getDelta();
      timeRef.current += delta;

      // Rotate the center (counter-clockwise)
      if (centerGroupRef.current) {
        centerGroupRef.current.rotation.y -=
          delta * adjustedRotationSpeed * 0.5; // Counter-clockwise rotation for center
        centerGroupRef.current.rotation.z -=
          delta * adjustedRotationSpeed * 0.3; // Counter-clockwise Z rotation
      }

      // Rotate the galaxy (counter-clockwise)
      if (galaxyGroupRef.current) {
        galaxyGroupRef.current.rotation.y -= delta * adjustedRotationSpeed; // Counter-clockwise rotation

        // Pulse effect
        const pulse =
          Math.sin(timeRef.current * adjustedPulseSpeed) * pulseIntensity;
        galaxyGroupRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      }

      // Animate colors
      if (
        animateColors &&
        galaxyPointsRef.current &&
        galaxyGeometryRef.current
      ) {
        const hue = (timeRef.current * 0.1) % 1;
        const insideColorHSL = { h: 0, s: 0, l: 0 };
        const outsideColorHSL = { h: 0, s: 0, l: 0 };

        new THREE.Color(insideColor).getHSL(insideColorHSL);
        new THREE.Color(outsideColor).getHSL(outsideColorHSL);

        const newInsideColor = new THREE.Color().setHSL(
          (insideColorHSL.h + hue) % 1,
          insideColorHSL.s,
          insideColorHSL.l
        );
        const newOutsideColor = new THREE.Color().setHSL(
          (outsideColorHSL.h + hue + 0.5) % 1,
          outsideColorHSL.s,
          outsideColorHSL.l
        );

        const positions =
          galaxyPointsRef.current.geometry.attributes.position.array;
        const colors = galaxyPointsRef.current.geometry.attributes.color.array;

        for (let i = 0; i < adjustedCount; i++) {
          const i3 = i * 3;
          const radius_i =
            Math.sqrt(
              Math.pow(positions[i3], 2) +
                Math.pow(positions[i3 + 1], 2) +
                Math.pow(positions[i3 + 2], 2)
            ) / radius;

          const mixedColor = newInsideColor.clone();
          mixedColor.lerp(newOutsideColor, radius_i);

          colors[i3] = mixedColor.r;
          colors[i3 + 1] = mixedColor.g;
          colors[i3 + 2] = mixedColor.b;
        }

        galaxyPointsRef.current.geometry.attributes.color.needsUpdate = true;
      }

      // Animate spin - subtle internal motion to maintain arm structure
      if (animateSpin && galaxyPointsRef.current && galaxyGeometryRef.current) {
        // Use a much smaller spin rate to prevent arm distortion
        const spinRate = -0.05; // Negative for counter-clockwise internal motion
        const positions =
          galaxyPointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < adjustedCount; i++) {
          const i3 = i * 3;

          const x = positions[i3];
          const z = positions[i3 + 2];

          const distance = Math.sqrt(x * x + z * z);
          // Use distance-based rotation that's more uniform
          const angle = spinRate * Math.pow(distance / radius, 0.5) * delta; // Square root for more uniform rotation
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          positions[i3] = x * cos - z * sin;
          positions[i3 + 2] = x * sin + z * cos;
        }

        galaxyPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Update shooting stars
      for (const star of shootingStarsRef.current) {
        if (star.userData.active) {
          star.position.x += star.userData.direction.x * delta * 30;
          star.position.y += star.userData.direction.y * delta * 30;
          star.position.z += star.userData.direction.z * delta * 30;

          const distanceFromCenter = star.position.length();

          if (distanceFromCenter < 1) {
            star.userData.active = false;
            sceneRef.current.remove(star);
          }
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(shootingStarInterval);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (galaxyGeometryRef.current) {
        galaxyGeometryRef.current.dispose();
      }
      if (galaxyMaterialRef.current) {
        galaxyMaterialRef.current.dispose();
      }
    };
  }, [
    generateGalaxy,
    generateAmbientStars,
    generateCenter,
    createShootingStar,
    adjustedRotationSpeed,
    adjustedPulseSpeed,
    pulseIntensity,
    animateColors,
    animateSpin,
    adjustedCount,
    radius,
    insideColor,
    outsideColor,
  ]);

  return (
    <GalaxyContainer ref={containerRef} className={className}>
      <Canvas ref={canvasRef} className="webgl" />
      <ContentContainer>{children}</ContentContainer>
    </GalaxyContainer>
  );
};

export default Galaxy;
