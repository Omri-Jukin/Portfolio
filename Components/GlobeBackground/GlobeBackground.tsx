import React, { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { GlobeBackgroundProps } from "./GlobeBackground.type";
import { StyledGlobeContainer, StyledCanvas } from "./GlobeBackground.style";
import GridDebug from "./GridDebug";
import { BREAKPOINTS, calculateGlobePosition } from "./GlobeBackground.const";
import { DeviceType } from "./GlobeBackground.type";

const GlobeBackground: React.FC<GlobeBackgroundProps> = ({
  markers = [],
  className,
  rotationSpeed = 0.005,
  size = 1920,
  opacity = 0.3,
  children,
  showGrid = false,
  enableGridPositioning = true,
  customGridConfig,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<{ destroy: () => void } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 }); // Default to desktop size

  // Calculate initial globe position to prevent hydration mismatch
  const getInitialGlobePosition = () => {
    return calculateGlobePosition(1920, 1080);
  };

  const [globePosition, setGlobePosition] = useState(getInitialGlobePosition());
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Determine device type based on viewport width
  const getDeviceType = (width: number): DeviceType => {
    if (width < BREAKPOINTS.mobile) return "mobile";
    if (width < BREAKPOINTS.tablet) return "tablet";
    return "desktop";
  };

  // Calculate globe position using grid system
  const updateGlobePosition = useCallback(
    (width: number, height: number) => {
      if (!enableGridPositioning) return;

      const position = calculateGlobePosition(width, height);
      setGlobePosition(position);
    },
    [enableGridPositioning]
  );

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;
      setWindowSize({ width: innerWidth, height: innerHeight });
      updateGlobePosition(innerWidth, innerHeight);
    }
  }, [enableGridPositioning, updateGlobePosition]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      setWindowSize({ width: innerWidth, height: innerHeight });
      updateGlobePosition(innerWidth, innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [enableGridPositioning, updateGlobePosition]);

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

    // Calculate massive globe size - span full width and extend beyond viewport

    // Make globe massive - create horizon effect by making it larger than viewport
    // But not so large that only a tiny portion is visible
    let globeSize = Math.max(safeWidth, safeHeight) * 1.8; // 180% of larger viewport dimension

    // Ensure minimum size but keep it reasonable for horizon effect
    globeSize = Math.max(globeSize, 1200);
    globeSize = Math.min(globeSize, 3000); // Cap at reasonable size

    try {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: Math.min(
          window.devicePixelRatio || 1,
          deviceType === "mobile" ? 1.5 : 2
        ),
        width: globeSize,
        height: globeSize,
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
  }, [
    mounted,
    markers,
    rotationSpeed,
    size,
    isDark,
    windowSize,
    customGridConfig,
    enableGridPositioning,
  ]);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  return (
    <StyledGlobeContainer
      className={className}
      opacity={opacity}
      scrollProgress={0}
      {...props}
    >
      {/* Grid Debug Overlay - Only render on client to prevent hydration issues */}
      {mounted && (
        <GridDebug
          showGrid={showGrid}
          viewportWidth={windowSize.width}
          viewportHeight={windowSize.height}
        />
      )}

      {/* Globe Canvas Background */}
      <Box
        className="globe-canvas-container"
        sx={{
          position: "fixed",
          left: globePosition.left,
          top: globePosition.top,
          transform: globePosition.transform,
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          zIndex: -1,
          pointerEvents: "none",
          overflow: "visible",
          opacity: opacity,
          transition: "none",
          willChange: "auto",
        }}
      >
        <StyledCanvas ref={canvasRef} size={size} isDark={isDark} />
      </Box>

      {/* Content Overlay */}
      {children && <Box className="content-container">{children}</Box>}
    </StyledGlobeContainer>
  );
};

export default GlobeBackground;
