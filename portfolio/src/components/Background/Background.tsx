"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import * as Styled from "./Background.style";
import type {
  BackgroundProps,
  FloatingElement,
  Particle,
  Wave,
  GradientOrb,
} from "./Background.type";
import Galaxy from "../GalaxyCard/Galaxy";

const Background: React.FC<BackgroundProps> = ({
  variant = "floating",
  intensity = "medium",
  speed = "normal",
  color = "primary",
  customColor,
  children,
  className,
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>(
    []
  );
  const [particles, setParticles] = useState<Particle[]>([]);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [gradientOrbs, setGradientOrbs] = useState<GradientOrb[]>([]);

  // Get color based on theme
  const getColor = useCallback(() => {
    if (customColor) return customColor;
    switch (color) {
      case "primary":
        return theme.palette.primary.main;
      case "secondary":
        return theme.palette.secondary.main;
      case "accent":
        return theme.palette.mode === "dark" ? "#4ECDC4" : "#FF6B6B";
      default:
        return theme.palette.primary.main;
    }
  }, [color, customColor, theme.palette]);

  // Get intensity multiplier
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

  // Get speed multiplier
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

  // Generate floating elements
  const generateFloatingElements = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const elementCount = Math.floor(10 * getIntensityMultiplier());
    const elements: FloatingElement[] = [];

    for (let i = 0; i < elementCount; i++) {
      elements.push({
        id: `floating-${i}`,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * 360,
        animationDelay: Math.random() * 2,
        animationDuration: (Math.random() * 3 + 2) / getSpeedMultiplier(),
      });
    }

    setFloatingElements(elements);
  }, [getIntensityMultiplier, getSpeedMultiplier]);

  // Generate particles
  const generateParticles = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const particleCount = Math.floor(50 * getIntensityMultiplier());
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: `particle-${i}`,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2 * getSpeedMultiplier(),
        vy: (Math.random() - 0.5) * 2 * getSpeedMultiplier(),
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: getColor(),
      });
    }

    setParticles(particles);
  }, [getIntensityMultiplier, getSpeedMultiplier, getColor]);

  // Generate waves
  const generateWaves = useCallback(() => {
    const waveCount = Math.floor(3 * getIntensityMultiplier());
    const waves: Wave[] = [];

    for (let i = 0; i < waveCount; i++) {
      waves.push({
        id: `wave-${i}`,
        amplitude: Math.random() * 50 + 20,
        frequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        color: getColor(),
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    setWaves(waves);
  }, [getIntensityMultiplier, getColor]);

  // Generate gradient orbs
  const generateGradientOrbs = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    const orbCount = Math.floor(15 * getIntensityMultiplier());
    const orbs: GradientOrb[] = [];

    // Galaxy color palette - bright core to outer edges
    const coreColors = [
      ["#FFD700", "#FFA500"], // Bright yellow to orange (core)
      ["#FFA500", "#FF6347"], // Orange to red-orange
      ["#FF6347", "#FF4500"], // Red-orange to red
    ];

    const armColors = [
      ["#87CEEB", "#4682B4"], // Sky blue to steel blue
      ["#9370DB", "#8A2BE2"], // Medium purple to blue violet
      ["#20B2AA", "#008B8B"], // Light sea green to dark cyan
    ];

    // Create dense core
    const coreCount = Math.floor(orbCount * 0.4);
    for (let i = 0; i < coreCount; i++) {
      const distance = Math.random() * 100; // Dense core
      const angle = Math.random() * Math.PI * 2;
      const colorPair = coreColors[i % coreColors.length];

      orbs.push({
        id: `core-${i}`,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 150 + 80, // Larger orbs in core
        color1: colorPair[0],
        color2: colorPair[1],
        animationDelay: Math.random() * 2,
        animationDuration: (Math.random() * 3 + 2) / getSpeedMultiplier(),
        blur: Math.random() * 30 + 15,
      });
    }

    // Create spiral arms
    const armCount = orbCount - coreCount;
    for (let i = 0; i < armCount; i++) {
      const distance = Math.random() * 300 + 100; // Spread out
      const angle = Math.random() * Math.PI * 2;
      const spiralOffset = Math.sin(distance * 0.01) * 50; // Spiral effect
      const colorPair = armColors[i % armColors.length];

      orbs.push({
        id: `arm-${i}`,
        x: centerX + Math.cos(angle) * distance + spiralOffset,
        y: centerY + Math.sin(angle) * distance + spiralOffset,
        size: Math.random() * 100 + 40, // Smaller orbs in arms
        color1: colorPair[0],
        color2: colorPair[1],
        animationDelay: Math.random() * 2,
        animationDuration: (Math.random() * 4 + 3) / getSpeedMultiplier(),
        blur: Math.random() * 50 + 25,
      });
    }

    setGradientOrbs(orbs);
  }, [getIntensityMultiplier, getSpeedMultiplier]);

  // Animate particles
  const animateParticles = useCallback(() => {
    setParticles((prevParticles) =>
      prevParticles.map((particle) => {
        const newX = particle.x + particle.vx;
        const newY = particle.y + particle.vy;

        // Bounce off edges
        let newVx = particle.vx;
        let newVy = particle.vy;

        if (containerRef.current) {
          const { width, height } =
            containerRef.current.getBoundingClientRect();
          if (newX <= 0 || newX >= width) newVx = -particle.vx;
          if (newY <= 0 || newY >= height) newVy = -particle.vy;
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      })
    );
  }, []);

  // Animate waves
  const animateWaves = useCallback(() => {
    setWaves((prevWaves) =>
      prevWaves.map((wave) => ({
        ...wave,
        phase: wave.phase + 0.02 * getSpeedMultiplier(),
      }))
    );
  }, [getSpeedMultiplier]);

  // Initialize elements based on variant
  useEffect(() => {
    switch (variant) {
      case "floating":
        generateFloatingElements();
        break;
      case "particles":
        generateParticles();
        break;
      case "waves":
        generateWaves();
        break;
      case "geometric":
        generateFloatingElements();
        break;
      case "cosmic":
        generateParticles();
        generateWaves();
        break;
      case "gradient-orbs":
        generateGradientOrbs();
        break;
    }
  }, [
    variant,
    generateFloatingElements,
    generateParticles,
    generateWaves,
    generateGradientOrbs,
  ]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (variant === "particles" || variant === "cosmic") {
        animateParticles();
      }
      if (variant === "waves" || variant === "cosmic") {
        animateWaves();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    if (
      variant === "particles" ||
      variant === "waves" ||
      variant === "cosmic"
    ) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant, animateParticles, animateWaves]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (variant === "floating" || variant === "geometric") {
        generateFloatingElements();
      }
      if (variant === "particles" || variant === "cosmic") {
        generateParticles();
      }
      if (variant === "gradient-orbs") {
        generateGradientOrbs();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    variant,
    generateFloatingElements,
    generateParticles,
    generateGradientOrbs,
  ]);

  const renderFloatingElements = () => (
    <AnimatePresence>
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: element.opacity,
            scale: 1,
            x: [element.x, element.x + 50, element.x],
            y: [element.y, element.y + 50, element.y],
            rotate: [element.rotation, element.rotation + 360],
          }}
          transition={{
            duration: element.animationDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.animationDelay,
          }}
          style={{
            position: "absolute",
            left: element.x,
            top: element.y,
            width: element.size,
            height: element.size,
            background: getColor(),
            borderRadius: variant === "geometric" ? "0%" : "50%",
            transform: `rotate(${element.rotation}deg)`,
          }}
        />
      ))}
    </AnimatePresence>
  );

  const renderParticles = () => (
    <>
      {particles.map((particle) => (
        <Styled.Particle
          key={particle.id}
          size={particle.size}
          opacity={particle.opacity}
          color={particle.color}
          style={{
            left: particle.x,
            top: particle.y,
          }}
        />
      ))}
    </>
  );

  const renderWaves = () => (
    <Styled.WaveContainer>
      {waves.map((wave) => (
        <Styled.Wave
          key={wave.id}
          amplitude={wave.amplitude}
          frequency={wave.frequency}
          phase={Math.sin(wave.phase) * wave.amplitude}
          color={wave.color}
          opacity={wave.opacity}
        />
      ))}
    </Styled.WaveContainer>
  );

  const renderGradientOrbs = () => (
    <AnimatePresence>
      {gradientOrbs.map((orb) => {
        const isCore = orb.id.startsWith("core");
        const baseRotationSpeed = isCore ? 0.5 : 0.3; // Core spins faster

        return (
          <motion.div
            key={orb.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isCore ? 0.9 : 0.7,
              scale: [1, 1.1, 1],
              rotate: [0, 360],
              x: [orb.x, orb.x + Math.cos(Date.now() * 0.001) * 20, orb.x],
              y: [orb.y, orb.y + Math.sin(Date.now() * 0.001) * 20, orb.y],
            }}
            transition={{
              duration: orb.animationDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.animationDelay,
              rotate: {
                duration: 10 / baseRotationSpeed, // Faster rotation for core orbs
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{
              position: "absolute",
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color1} 0%, ${orb.color2} 50%, transparent 100%)`,
              borderRadius: "50%",
              filter: `blur(${orb.blur}px)`,
              transform: `translate(-50%, -50%)`,
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </AnimatePresence>
  );

  const renderBackground = () => {
    switch (variant) {
      case "floating":
      case "geometric":
        return renderFloatingElements();
      case "particles":
        return renderParticles();
      case "waves":
        return renderWaves();
      case "cosmic":
        return (
          <>
            {renderParticles()}
            {renderWaves()}
          </>
        );
      case "gradient-orbs":
        return renderGradientOrbs();
      case "three-galaxy":
        return (
          <Galaxy
            count={50000}
            branches={6}
            spin={1}
            insideColor="#ffff00"
            outsideColor="#0000ff"
            rotationSpeed={0.1}
            intensity={intensity}
            speed={speed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Styled.BackgroundContainer ref={containerRef} className={className}>
      <Styled.BackgroundCanvas>{renderBackground()}</Styled.BackgroundCanvas>
      <Styled.ContentContainer>{children}</Styled.ContentContainer>
    </Styled.BackgroundContainer>
  );
};

export default Background;
