"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";

// Local constants - completely isolated from main GlobeBackground
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

const GRID_CONFIG = {
  mobile: {
    columns: 4,
    rows: 6,
    globe: {
      startColumn: 1,
      endColumn: 4,
      startRow: 2,
      endRow: 5,
    },
  },
  tablet: {
    columns: 8,
    rows: 8,
    globe: {
      startColumn: 2,
      endColumn: 7,
      startRow: 2,
      endRow: 7,
    },
  },
  desktop: {
    columns: 12,
    rows: 10,
    globe: {
      startColumn: 3,
      endColumn: 10,
      startRow: 2,
      endRow: 9,
    },
  },
};

const GlobeGridDemo: React.FC = () => {
  const [showGrid, setShowGrid] = useState(true);
  const [enableGridPositioning, setEnableGridPositioning] = useState(true);
  const [currentViewport, setCurrentViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setCurrentViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDeviceType = () => {
    if (currentViewport.width < BREAKPOINTS.mobile) return "mobile";
    if (currentViewport.width < BREAKPOINTS.tablet) return "tablet";
    return "desktop";
  };

  const deviceType = getDeviceType();
  const config = GRID_CONFIG[deviceType];

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Content overlay - no redundant GlobeBackground */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          padding: 4,
          textAlign: "center",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Globe Grid Demo
        </Typography>
        <Typography variant="h5" gutterBottom>
          Testing Grid-Based Positioning
        </Typography>
      </Box>

      {/* Control Panel */}
      <Paper
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          padding: 3,
          color: "#F0F",
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          maxWidth: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Grid Controls
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
          }
          label="Show Grid Overlay"
        />

        <FormControlLabel
          control={
            <Switch
              checked={enableGridPositioning}
              onChange={(e) => setEnableGridPositioning(e.target.checked)}
            />
          }
          label="Enable Grid Positioning"
        />

        <Box sx={{ mt: 2, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Current Device:</strong> {deviceType}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Viewport:</strong> {currentViewport.width} ×{" "}
            {currentViewport.height}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Grid:</strong> {config.columns} × {config.rows}
          </Typography>
          <Typography variant="body2">
            <strong>Globe Cells:</strong> {config.globe.startColumn}-
            {config.globe.endColumn}, {config.globe.startRow}-
            {config.globe.endRow}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Resize your browser window to see the grid adapt to different screen
            sizes.
          </Typography>
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: 2,
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          maxWidth: 300,
        }}
      >
        <Typography variant="body2" gutterBottom>
          <strong>How to Test:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          • Toggle grid overlay on/off
        </Typography>
        <Typography variant="body2" component="div">
          • Enable/disable grid positioning
        </Typography>
        <Typography variant="body2" component="div">
          • Resize browser window
        </Typography>
        <Typography variant="body2" component="div">
          • Check mobile/tablet dev tools
        </Typography>
      </Paper>
    </Box>
  );
};

export default GlobeGridDemo;
