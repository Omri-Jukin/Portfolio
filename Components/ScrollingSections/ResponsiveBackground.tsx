import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollPosition } from "../../lib/hooks/useScrollPosition";

interface ResponsiveBackgroundProps {
  children: React.ReactNode;
}

const BackgroundContainer = styled(Box, {
  shouldForwardProp: (prop) => !["scrollProgress"].includes(prop as string),
})<{
  scrollProgress: number;
}>(({ theme }) => ({
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  boxSizing: "border-box",

  // Transparent background to let globe show through
  background: "transparent",

  // Responsive design
  [theme.breakpoints.down("md")]: {
    minHeight: "auto",
    padding: theme.spacing(4, 0),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 0),

    // Mobile-specific Swiper constraints (consolidated here)
    "& .swiper": {
      width: "100% !important",
      maxWidth: "100vw !important",
      overflow: "hidden !important",
    },
    "& .swiper-slide": {
      width: "100% !important",
      maxWidth: "100vw !important",
    },
    "& .swiper-button-next, & .swiper-button-prev": {
      display: "none !important",
    },
  },

  // Ensure content flows naturally above background effects
  "& > *": {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "100vw",
    boxSizing: "border-box",
  },
}));

const ResponsiveBackground: React.FC<ResponsiveBackgroundProps> = React.memo(
  ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const { scrollProgress } = useScrollPosition();

    useEffect(() => {
      // Only set mounted to true when window is defined
      if (typeof window !== "undefined") {
        setMounted(true);
      }
    }, []);

    // Don't render anything until window is defined
    if (typeof window === "undefined" || !mounted) {
      return (
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
            maxWidth: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxSizing: "border-box",
            background: "transparent",
          }}
        >
          {children}
        </Box>
      );
    }

    return (
      <BackgroundContainer scrollProgress={scrollProgress}>
        {children}
      </BackgroundContainer>
    );
  }
);

ResponsiveBackground.displayName = "ResponsiveBackground";

export default ResponsiveBackground;
