"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import type { GlobeBackgroundProps, DeviceType } from "./GlobeBackground.type";
import { StyledGlobeContainer, StyledCanvas } from "./GlobeBackground.style";
import { BREAKPOINTS, calculateGlobePosition } from "./GlobeBackground.const";

const GlobeBackground: React.FC<GlobeBackgroundProps> = ({
  markers = [],
  className,
  rotationSpeed = 0.005,
  opacity = 0.3,
  children,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<{ destroy: () => void } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  const [globePosition, setGlobePosition] = useState(
    calculateGlobePosition(1920, 1080)
  );
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getDeviceType = (width: number): DeviceType => {
    if (width < BREAKPOINTS.mobile) return "mobile" as const;
    if (width < BREAKPOINTS.tablet) return "tablet" as const;
    return "desktop" as const;
  };

  const updateGlobePosition = useCallback((width: number, height: number) => {
    const position = calculateGlobePosition(width, height);
    setGlobePosition(position);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;
      setWindowSize({ width: innerWidth, height: innerHeight });
      updateGlobePosition(innerWidth, innerHeight);
    }
  }, [updateGlobePosition]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      setWindowSize({ width: innerWidth, height: innerHeight });
      updateGlobePosition(innerWidth, innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateGlobePosition]);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    let phi = 0;

    if (globeRef.current) {
      globeRef.current.destroy();
    }

    const { width: viewportWidth, height: viewportHeight } = windowSize;
    const safeWidth = viewportWidth > 0 ? viewportWidth : window.innerWidth;
    const safeHeight = viewportHeight > 0 ? viewportHeight : window.innerHeight;
    const deviceType = getDeviceType(safeWidth);
    const vmin = Math.min(safeWidth, safeHeight);
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      deviceType === "mobile" ? 1.5 : 2
    );

    try {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: dpr,
        width: vmin * dpr,
        height: vmin * dpr,
        phi: 0,
        theta: 0.3,
        dark: isDark ? 1 : 0,
        diffuse: isDark ? 1.5 : 1.2,
        mapSamples:
          deviceType === "mobile"
            ? 10000
            : deviceType === "tablet"
            ? 14000
            : 18000,
        mapBrightness: isDark ? 8 : 5,
        baseColor: isDark ? [0.15, 0.15, 0.2] : [0.7, 0.75, 0.8],
        markerColor: isDark ? [0.2, 0.9, 1] : [0.1, 0.4, 0.9],
        glowColor: isDark ? [0.8, 0.9, 1] : [0.3, 0.4, 0.6],
        markers,
        onRender: (state) => {
          state.phi = phi;
          phi += rotationSpeed;
        },
      });
    } catch (error) {
      console.error("Failed to create globe:", error);
    }

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [mounted, markers, rotationSpeed, isDark, windowSize]);

  if (!mounted) return null;

  return (
    <StyledGlobeContainer
      className={className}
      opacity={opacity}
      scrollProgress={0}
      {...props}
    >
      <Box
        className="globe-canvas-container"
        sx={{
          position: "fixed",
          left: globePosition.left,
          top: globePosition.top,
          transform: globePosition.transform,
          width: "100vmin",
          height: "100vmin",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: -1,
          pointerEvents: "none",
          overflow: "visible",
          opacity: opacity,
          transition: "none",
          willChange: "auto",
        }}
      >
        <StyledCanvas ref={canvasRef} isDark={isDark} />
      </Box>

      {children && <Box className="content-container">{children}</Box>}
    </StyledGlobeContainer>
  );
};

export default GlobeBackground;
