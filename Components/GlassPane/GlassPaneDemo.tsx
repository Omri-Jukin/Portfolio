import React from "react";
import { Box, Typography } from "@mui/material";
import { GlassPane } from "./GlassPane";

const GlassPaneDemo: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "white", mb: 3 }}>
        GlassPane Component Examples
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Basic GlassPane */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Basic GlassPane
          </Typography>
          <GlassPane
            width="150px"
            height="100px"
            background="rgba(255, 0, 0, 0.3)"
            border="1px solid rgba(255, 0, 0, 0.5)"
          >
            <Typography sx={{ color: "white", fontSize: "12px" }}>
              Basic
            </Typography>
          </GlassPane>
        </Box>

        {/* Rotated GlassPane */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Rotated (15deg)
          </Typography>
          <GlassPane
            width="150px"
            height="100px"
            rotate="15deg"
            background="rgba(0, 255, 0, 0.3)"
            border="1px solid rgba(0, 255, 0, 0.5)"
          >
            <Typography sx={{ color: "white", fontSize: "12px" }}>
              Rotated
            </Typography>
          </GlassPane>
        </Box>

        {/* Different Border Radius */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Rounded (50%)
          </Typography>
          <GlassPane
            width="100px"
            height="100px"
            borderRadius="50%"
            background="rgba(0, 0, 255, 0.3)"
            border="1px solid rgba(0, 0, 255, 0.5)"
          >
            <Typography sx={{ color: "white", fontSize: "10px" }}>
              Circle
            </Typography>
          </GlassPane>
        </Box>

        {/* Different Blur */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Heavy Blur
          </Typography>
          <GlassPane
            width="150px"
            height="100px"
            backdropFilter="blur(20px)"
            WebkitBackdropFilter="blur(20px)"
            background="rgba(255, 255, 0, 0.3)"
            border="1px solid rgba(255, 255, 0, 0.5)"
          >
            <Typography sx={{ color: "white", fontSize: "12px" }}>
              Heavy Blur
            </Typography>
          </GlassPane>
        </Box>

        {/* Different Shadow */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Custom Shadow
          </Typography>
          <GlassPane
            width="150px"
            height="100px"
            boxShadow="0 8px 32px rgba(255, 0, 255, 0.3)"
            background="rgba(255, 0, 255, 0.3)"
            border="1px solid rgba(255, 0, 255, 0.5)"
          >
            <Typography sx={{ color: "white", fontSize: "12px" }}>
              Custom Shadow
            </Typography>
          </GlassPane>
        </Box>

        {/* Different Opacity */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Low Opacity
          </Typography>
          <GlassPane
            width="150px"
            height="100px"
            opacity={0.5}
            background="rgba(255, 165, 0, 0.3)"
            border="1px solid rgba(255, 165, 0, 0.5)"
          >
            <Typography sx={{ color: "white", fontSize: "12px" }}>
              Low Opacity
            </Typography>
          </GlassPane>
        </Box>
      </Box>

      {/* Interactive Examples */}
      <Typography variant="h6" gutterBottom sx={{ color: "white", mb: 3 }}>
        Interactive Examples
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {/* Hover Effect */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Hover Effect
          </Typography>
          <GlassPane
            rotate="25deg"
            width="200px"
            height="120px"
            background="rgba(138, 43, 226, 0.3)"
            border="1px solid rgba(138, 43, 226, 0.5)"
            transition="all 0.3s ease-in-out"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(0deg)";
              e.currentTarget.style.background = "rgba(138, 43, 226, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(25deg)";
              e.currentTarget.style.background = "rgba(138, 43, 226, 0.3)";
            }}
          >
            <Typography sx={{ color: "white", fontSize: "14px" }}>
              Hover me!
            </Typography>
          </GlassPane>
        </Box>

        {/* Click Effect */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
            Click Effect
          </Typography>
          <GlassPane
            width="200px"
            height="120px"
            background="rgba(255, 20, 147, 0.3)"
            border="1px solid rgba(255, 20, 147, 0.5)"
            transition="all 0.2s ease-in-out"
            onClick={(e) => {
              const target = e.currentTarget;
              if (target) {
                target.style.transform = "scale(2)";
                setTimeout(() => {
                  if (target) {
                    target.style.transform = "scale(1)";
                  }
                }, 200);
              }
            }}
          >
            <Typography sx={{ color: "white", fontSize: "14px" }}>
              Click me!
            </Typography>
          </GlassPane>
        </Box>
      </Box>
    </Box>
  );
};

export default GlassPaneDemo;
