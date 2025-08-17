import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useScrollPosition } from "../../lib/hooks/useScrollPosition";
import { GlobeBackgroundProps } from "./GlobeBackground.type";
import { StyledGlobeContainer, StyledCanvas } from "./GlobeBackground.style";

const GlobeBackground: React.FC<GlobeBackgroundProps> = ({
  markers = [],
  className,
  rotationSpeed = 0.005,
  size = 800,
  opacity = 0.3,
  children,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<{ destroy: () => void } | null>(null);
  const [mounted, setMounted] = useState(false);
  const { scrollProgress } = useScrollPosition();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    let phi = 0;

    // Clean up previous globe instance
    if (globeRef.current) {
      globeRef.current.destroy();
    }

    // Optimize settings for performance
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(
        window.devicePixelRatio || 1,
        isMobile ? 1.5 : 2
      ),
      width: size * (isMobile ? 1.8 : 2.2),
      height: size * (isMobile ? 1.8 : 2.2),
      phi: 0,
      theta: 0.3, // Better initial angle
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 1.5 : 1.2, // Increased diffuse for better visibility
      mapSamples: isMobile ? 10000 : isTablet ? 14000 : 18000, // Higher quality
      mapBrightness: isDark ? 8 : 5, // Brighter for better visibility
      baseColor: isDark ? [0.15, 0.15, 0.2] : [0.7, 0.75, 0.8], // Better contrast
      markerColor: isDark ? [0.2, 0.9, 1] : [0.1, 0.4, 0.9], // More vibrant markers
      glowColor: isDark ? [0.8, 0.9, 1] : [0.3, 0.4, 0.6], // Subtle glow
      markers,
      onRender: (state) => {
        // Slower, more stable rotation
        const speedMultiplier = Math.max(0.3, 1 - scrollProgress * 0.5);
        state.phi = phi;
        phi += rotationSpeed * speedMultiplier;
      },
    });

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [mounted, markers, rotationSpeed, size, isDark, scrollProgress]);

  // Don't render anything until mounted (prevents SSR issues)
  if (!mounted) {
    return null;
  }

  return (
    <StyledGlobeContainer
      className={className}
      opacity={opacity}
      scrollProgress={scrollProgress}
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
