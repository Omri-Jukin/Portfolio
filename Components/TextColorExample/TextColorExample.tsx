import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { getTextColors } from "#/theme/textColors";

/**
 * Example component demonstrating the centralized text color system
 * This shows how to use the new text color utilities consistently across the app
 */
const TextColorExample: React.FC = () => {
  const theme = useTheme();
  const textColors = getTextColors(theme);

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography
        variant="h4"
        sx={{
          color: textColors.primary,
          mb: 3,
          fontWeight: "bold",
        }}
      >
        Centralized Text Color System Demo
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: textColors.secondary,
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        This demonstrates the new centralized text color system that provides
        consistent, theme-aware colors across the entire website. The colors
        automatically adapt to light/dark mode for optimal readability.
      </Typography>

      {/* Color Examples */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.primary,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.primary, fontWeight: "bold" }}>
            Primary Text - {textColors.primary}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.secondary,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.secondary }}>
            Secondary Text - {textColors.secondary}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.tertiary,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.tertiary }}>
            Tertiary Text - {textColors.tertiary}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.muted,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.muted }}>
            Muted Text - {textColors.muted}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.accent,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.accent, fontWeight: "bold" }}>
            Accent Text - {textColors.accent}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.success,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.success }}>
            Success Text - {textColors.success}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.error,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.error }}>
            Error Text - {textColors.error}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.warning,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.warning }}>
            Warning Text - {textColors.warning}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              backgroundColor: textColors.info,
              borderRadius: 1,
            }}
          />
          <Typography sx={{ color: textColors.info }}>
            Info Text - {textColors.info}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: textColors.primary,
            mb: 2,
            fontWeight: "bold",
          }}
        >
          Usage Examples
        </Typography>

        <Box
          component="pre"
          sx={{
            color: textColors.secondary,
            fontSize: "0.875rem",
            fontFamily: "monospace",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            p: 2,
            borderRadius: 1,
            overflow: "auto",
          }}
        >
          {`// Import the text color utilities
import { getTextColors } from "#/theme/textColors";

// In your component
const theme = useTheme();
const textColors = getTextColors(theme);

// Use in sx prop
<Typography sx={{ color: textColors.primary }}>
  Primary text with centralized colors
</Typography>

// Or use CSS variables (applied automatically)
<Typography sx={{ color: "var(--text-primary)" }}>
  Using CSS variables
</Typography>`}
        </Box>
      </Box>
    </Box>
  );
};

export default TextColorExample;
