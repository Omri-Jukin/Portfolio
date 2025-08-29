import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Create styled components for each gradient type
const ShadowBox = styled(Box)<{
  gradienttype: string;
  shadowintensity: "light" | "medium" | "heavy";
}>(({ theme, gradienttype, shadowintensity }) => ({
  width: 200,
  height: 100,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: theme.spacing(2),
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  background:
    theme.conicGradients[gradienttype as keyof typeof theme.conicGradients] ||
    theme.conicGradients.warm,
  color: "white",
  fontWeight: "bold",
  textShadow: "0 1px 2px rgba(0,0,0,0.5)",

  // Use the colored box shadows based on gradient type
  boxShadow: theme.boxShadows[0]?.[shadowintensity] || "none",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.boxShadows[1]?.[shadowintensity] || "none",
  },
}));

const BoxShadowDemo: React.FC = () => {
  const gradientTypes = [
    "warm",
    "cool",
    "neutral",
    "dark",
    "sunset",
    "ocean",
    "forest",
    "galaxy",
    "aurora",
    "fire",
    "spring",
  ];
  const shadowIntensities: ("light" | "medium" | "heavy")[] = [
    "light",
    "medium",
    "heavy",
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Colored Box Shadows Demo
      </Typography>
      <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
        Box shadows now dynamically use colors from conic gradients
      </Typography>

      {shadowIntensities.map((intensity) => (
        <Box key={intensity} sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ textTransform: "capitalize" }}
          >
            {intensity} Shadows
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {gradientTypes.map((gradientType) => (
              <ShadowBox
                key={gradientType}
                gradienttype={gradientType}
                shadowintensity={intensity}
              >
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {gradientType}
                </Typography>
              </ShadowBox>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default BoxShadowDemo;
