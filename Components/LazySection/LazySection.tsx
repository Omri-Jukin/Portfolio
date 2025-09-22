"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  minHeight?: string | number;
  name?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
    >
      <CircularProgress />
    </Box>
  ),
  threshold = 0.1,
  rootMargin = "50px",
  minHeight = "200px",
  name = "LazySection",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Disconnect observer after first load
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <Box
      ref={ref}
      minHeight={minHeight}
      sx={{
        position: "relative",
        width: "100%",
      }}
      data-lazy-section={name}
    >
      {isVisible ? children : fallback}
    </Box>
  );
};

export default LazySection;
