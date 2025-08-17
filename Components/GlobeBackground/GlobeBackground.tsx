import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { GlobeBackgroundProps } from "./GlobeBackground.type";
import { StyledGlobeContainer, StyledCanvas } from "./GlobeBackground.style";

const GlobeBackground: React.FC<GlobeBackgroundProps> = ({
  markers = [],
  className,
  rotationSpeed = 0.005,
  size = 1920,
  opacity = 0.3,
  children,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<{ destroy: () => void } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    let phi = 0;

    if (globeRef.current) {
      globeRef.current.destroy();
    }

    const { width: viewportWidth, height: viewportHeight } = windowSize;

    const safeWidth = viewportWidth > 0 ? viewportWidth : window.innerWidth;
    const safeHeight = viewportHeight > 0 ? viewportHeight : window.innerHeight;

    const isMobile = safeWidth < 768;
    const isTablet = safeWidth < 1024;

    // Use the size prop as the base, then scale it based on viewport and device type
    const minViewportDimension = Math.min(safeWidth, safeHeight);
    let globeSize = size;

    if (isMobile) {
      const maxMobileSize = safeWidth;
      globeSize = Math.min(size, maxMobileSize);
    } else if (isTablet) {
      // Tablet: make it more like mobile - use full width like mobile
      const maxTabletSize = safeWidth * 0.95;
      globeSize = Math.min(size, maxTabletSize);
    } else {
      const maxDesktopSize = minViewportDimension * 0.8;
      globeSize = Math.min(size, maxDesktopSize);
    }

    globeSize = Math.max(globeSize, 200);

    try {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: Math.min(
          window.devicePixelRatio || 1,
          isMobile ? 1.5 : 2
        ),
        width: globeSize,
        height: globeSize,
        phi: 0,
        theta: 0.3,
        dark: isDark ? 1 : 0,
        diffuse: isDark ? 1.5 : 1.2,
        mapSamples: isMobile ? 10000 : isTablet ? 14000 : 18000,
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
  }, [mounted, markers, rotationSpeed, size, isDark, windowSize]);

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
      {/* Globe Canvas Background */}
      <Box className="globe-canvas-container">
        <StyledCanvas ref={canvasRef} size={size} isDark={isDark} />
      </Box>

      {/* Content Overlay */}
      {children && <Box className="content-container">{children}</Box>}
    </StyledGlobeContainer>
  );
};

export default GlobeBackground;
