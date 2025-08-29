"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import {
  Palette as PaletteIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

interface ThemeCustomizerProps {
  onThemeChange?: (theme: ThemeCustomizerProps) => void;
}

const colorPresets = [
  { name: "Blue", primary: "#1976d2", secondary: "#dc004e" },
  { name: "Green", primary: "#2e7d32", secondary: "#ed6c02" },
  { name: "Purple", primary: "#7b1fa2", secondary: "#f57c00" },
  { name: "Teal", primary: "#00796b", secondary: "#ff6f00" },
  { name: "Orange", primary: "#d84315", secondary: "#1976d2" },
];

export default function ThemeCustomizer({
  onThemeChange,
}: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [borderRadius, setBorderRadius] = useState(8);
  const [spacing, setSpacing] = useState(8);

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index);
    if (onThemeChange) {
      onThemeChange({
        ...colorPresets[index],
        borderRadius,
        spacing,
        darkMode,
      } as ThemeCustomizerProps);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    if (onThemeChange) {
      onThemeChange({
        ...colorPresets[selectedPreset],
        borderRadius,
        spacing,
        darkMode: !darkMode,
      } as ThemeCustomizerProps);
    }
  };

  const handleBorderRadiusChange = (value: number) => {
    setBorderRadius(value);
    if (onThemeChange) {
      onThemeChange({
        ...colorPresets[selectedPreset],
        borderRadius: value,
        spacing,
        darkMode,
      } as ThemeCustomizerProps);
    }
  };

  const handleSpacingChange = (value: number) => {
    setSpacing(value);
    if (onThemeChange) {
      onThemeChange({
        ...colorPresets[selectedPreset],
        borderRadius,
        spacing: value,
        darkMode,
      } as ThemeCustomizerProps);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {/* Toggle Button */}
      <Button
        variant="contained"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          minWidth: "auto",
          width: 56,
          height: 56,
          borderRadius: "50%",
          boxShadow: 3,
        }}
      >
        <SettingsIcon />
      </Button>

      {/* Theme Panel */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            bottom: 70,
            right: 0,
            width: 320,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PaletteIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">Theme Customizer</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Color Presets */}
          <Typography variant="subtitle2" gutterBottom>
            Color Scheme
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {colorPresets.map((preset, index) => (
              <Chip
                key={preset.name}
                label={preset.name}
                onClick={() => handlePresetChange(index)}
                sx={{
                  backgroundColor:
                    selectedPreset === index ? "primary.main" : "grey.200",
                  color: selectedPreset === index ? "white" : "text.primary",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      selectedPreset === index ? "primary.dark" : "grey.300",
                  },
                }}
              />
            ))}
          </Box>

          {/* Dark Mode Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleDarkModeToggle}
                icon={<LightIcon />}
                checkedIcon={<DarkIcon />}
              />
            }
            label="Dark Mode"
            sx={{ mb: 2 }}
          />

          {/* Border Radius */}
          <Typography variant="subtitle2" gutterBottom>
            Border Radius: {borderRadius}px
          </Typography>
          <Slider
            value={borderRadius}
            onChange={(_, value) => handleBorderRadiusChange(value as number)}
            min={0}
            max={24}
            step={1}
            sx={{ mb: 3 }}
          />

          {/* Spacing */}
          <Typography variant="subtitle2" gutterBottom>
            Spacing: {spacing}px
          </Typography>
          <Slider
            value={spacing}
            onChange={(_, value) => handleSpacingChange(value as number)}
            min={4}
            max={16}
            step={1}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary">
            Changes are applied in real-time
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
