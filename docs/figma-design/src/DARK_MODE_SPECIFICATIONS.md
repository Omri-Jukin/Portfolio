# Dark Mode Specifications

This document provides complete dark mode color specifications and implementation details for the portfolio design using MUI's theme system.

---

## Color Palette Comparison

### Background Colors

| Element | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| Page Background | `#F8FAFC` (slate-50) | `#0F172A` (slate-900) | Main page background |
| Card/Paper Background | `#FFFFFF` (white) | `#1E293B` (slate-800) | Cards, modals, paper surfaces |
| Secondary Background | `#F1F5F9` (slate-100) | `#334155` (slate-700) | Tabs container, badges, hover states |
| Elevated Surface | `#FFFFFF` (white) | `#334155` (slate-700) | Elevated cards, popovers |

### Text Colors

| Element | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| Primary Text | `#0F172A` (slate-900) | `#F1F5F9` (slate-100) | Headings, main content |
| Secondary Text | `#475569` (slate-600) | `#94A3B8` (slate-400) | Descriptions, labels |
| Tertiary Text | `#64748B` (slate-500) | `#64748B` (slate-500) | Captions, hints (stays same) |
| Disabled Text | `#94A3B8` (slate-400) | `#475569` (slate-600) | Disabled states |
| On Primary | `#FFFFFF` (white) | `#FFFFFF` (white) | Text on blue buttons |

### Border Colors

| Element | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| Default Border | `#E2E8F0` (slate-200) | `#334155` (slate-700) | Card borders, dividers |
| Subtle Border | `#F1F5F9` (slate-100) | `#475569` (slate-600) | Light separators |
| Input Border | `#E2E8F0` (slate-200) | `#475569` (slate-600) | Form inputs |
| Focus Border | `#2563EB` (blue-600) | `#3B82F6` (blue-500) | Focused elements |

### Primary/Accent Colors

| Element | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| Primary Blue | `#2563EB` (blue-600) | `#3B82F6` (blue-500) | Primary buttons, links |
| Primary Hover | `#1E40AF` (blue-700) | `#60A5FA` (blue-400) | Hover state |
| Primary Active | `#1E3A8A` (blue-800) | `#2563EB` (blue-600) | Active/pressed state |
| Success | `#10B981` (green-600) | `#34D399` (green-400) | Success states |
| Warning | `#F59E0B` (amber-500) | `#FBBF24` (amber-400) | Warning states |
| Error | `#EF4444` (red-500) | `#F87171` (red-400) | Error states |

### Gradients

Gradients remain mostly the same but may need slight adjustment in dark mode:

**Employer CTA (Blue-Cyan):**
- Light: `linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)`
- Dark: `linear-gradient(135deg, #3B82F6 0%, #22D3EE 100%)` (slightly lighter)

**Client CTA (Purple-Pink):**
- Light: `linear-gradient(135deg, #9333EA 0%, #EC4899 100%)`
- Dark: `linear-gradient(135deg, #A855F7 0%, #F472B6 100%)` (slightly lighter)

---

## MUI Theme Configuration

### Complete Theme Setup

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo, useState } from 'react';

function App() {
  const [mode, setMode] = useState('light'); // or 'dark'

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#3B82F6' : '#2563EB',
            dark: mode === 'dark' ? '#2563EB' : '#1E40AF',
            light: mode === 'dark' ? '#60A5FA' : '#3B82F6',
          },
          secondary: {
            main: mode === 'dark' ? '#A855F7' : '#9333EA',
            dark: mode === 'dark' ? '#9333EA' : '#7E22CE',
            light: mode === 'dark' ? '#C084FC' : '#A855F7',
          },
          background: {
            default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
            paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#F1F5F9' : '#0F172A',
            secondary: mode === 'dark' ? '#94A3B8' : '#475569',
            disabled: mode === 'dark' ? '#475569' : '#94A3B8',
          },
          divider: mode === 'dark' ? '#334155' : '#E2E8F0',
          action: {
            active: mode === 'dark' ? '#94A3B8' : '#475569',
            hover: mode === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(71, 85, 105, 0.04)',
            selected: mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(71, 85, 105, 0.08)',
            disabled: mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(71, 85, 105, 0.3)',
            disabledBackground: mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(71, 85, 105, 0.12)',
          },
          success: {
            main: mode === 'dark' ? '#34D399' : '#10B981',
            dark: mode === 'dark' ? '#10B981' : '#059669',
            light: mode === 'dark' ? '#6EE7B7' : '#34D399',
          },
          warning: {
            main: mode === 'dark' ? '#FBBF24' : '#F59E0B',
            dark: mode === 'dark' ? '#F59E0B' : '#D97706',
            light: mode === 'dark' ? '#FCD34D' : '#FBBF24',
          },
          error: {
            main: mode === 'dark' ? '#F87171' : '#EF4444',
            dark: mode === 'dark' ? '#EF4444' : '#DC2626',
            light: mode === 'dark' ? '#FCA5A5' : '#F87171',
          },
          grey: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
        },
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          // ... typography config (same for both modes)
        },
        shape: {
          borderRadius: 8,
        },
        shadows: [
          'none',
          // Level 1
          mode === 'dark'
            ? '0 1px 2px rgba(0, 0, 0, 0.3)'
            : '0 1px 2px rgba(0, 0, 0, 0.05)',
          // Level 2
          mode === 'dark'
            ? '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.24)'
            : '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          // Level 3
          mode === 'dark'
            ? '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.25)'
            : '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
          // Level 4
          mode === 'dark'
            ? '0 10px 15px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
          // ... more shadow levels
        ],
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

---

## Component-Specific Dark Mode Adjustments

### Header

**Light Mode:**
```jsx
<AppBar
  sx={{
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid',
    borderColor: 'divider',
  }}
>
```

**Dark Mode:**
```jsx
<AppBar
  sx={{
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800 with opacity
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid',
    borderColor: 'divider',
  }}
>
```

**Theme-aware (Recommended):**
```jsx
<AppBar
  sx={{
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(30, 41, 59, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid',
    borderColor: 'divider',
  }}
>
```

### Cards

Cards automatically adapt when using theme colors:

```jsx
<Card
  sx={{
    backgroundColor: 'background.paper', // Auto-adapts
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider', // Auto-adapts
  }}
>
```

### Badges/Chips

**Light Mode:**
```jsx
<Chip
  label="React"
  sx={{
    backgroundColor: 'grey.100',
    color: 'text.secondary',
  }}
/>
```

**Dark Mode (automatic with theme):**
- Background becomes slate-700 (#334155)
- Text color becomes slate-400 (#94A3B8)

### Gradient CTA Cards

Gradients need manual adjustment in dark mode:

```jsx
<Card
  sx={{
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 100%)'
        : 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    color: 'white',
  }}
>
```

### Project Card Gradients

```jsx
// Blue gradient
background: (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #60A5FA 0%, #22D3EE 100%)'
    : 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'

// Purple gradient
background: (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #C084FC 0%, #F472B6 100%)'
    : 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)'

// Orange gradient
background: (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #FB923C 0%, #F87171 100%)'
    : 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)'
```

### Inputs

TextField automatically adapts, but you can customize:

```jsx
<TextField
  sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'background.paper',
      '& fieldset': {
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.500' : 'grey.400',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
  }}
/>
```

### Tabs Container

**Light Mode:**
```jsx
<Tabs
  sx={{
    backgroundColor: 'grey.100', // #F1F5F9
    borderRadius: 2,
  }}
>
```

**Dark Mode (automatic):**
- Background becomes slate-700 (#334155)

**Active Tab:**
```jsx
<Tab
  sx={{
    '&.Mui-selected': {
      backgroundColor: 'background.paper', // white in light, slate-800 in dark
      color: 'text.primary',
    },
  }}
/>
```

---

## Page Background

The page uses a gradient background that needs adjustment:

**Light Mode:**
```jsx
<Box
  sx={{
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
  }}
>
```

**Dark Mode:**
```jsx
<Box
  sx={{
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0F172A, #1E293B)',
  }}
>
```

**Theme-aware:**
```jsx
<Box
  sx={{
    minHeight: '100vh',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(to bottom right, #0F172A, #1E293B)'
        : 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
  }}
>
```

---

## Dark Mode Toggle Component

### Toggle Button

```jsx
import { IconButton } from '@mui/material';
import { Sun, Moon } from 'lucide-react';

function DarkModeToggle({ mode, setMode }) {
  return (
    <IconButton
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      sx={{
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </IconButton>
  );
}
```

### With Animation

```jsx
import { IconButton, useTheme } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

function DarkModeToggle({ mode, setMode }) {
  return (
    <IconButton
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      component={motion.button}
      whileTap={{ scale: 0.9 }}
      sx={{
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <motion.div
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: mode === 'dark' ? 360 : 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </IconButton>
  );
}
```

---

## Shadows in Dark Mode

Shadows need to be darker and more pronounced in dark mode:

| Elevation | Light Mode | Dark Mode |
|-----------|-----------|-----------|
| Level 1 | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` |
| Level 2 | `0 1px 3px rgba(0,0,0,0.1)` | `0 1px 3px rgba(0,0,0,0.4)` |
| Level 3 | `0 4px 6px rgba(0,0,0,0.07)` | `0 4px 6px rgba(0,0,0,0.4)` |
| Level 4 | `0 10px 15px rgba(0,0,0,0.1)` | `0 10px 15px rgba(0,0,0,0.5)` |

---

## Icons in Dark Mode

Icons automatically adapt when using theme colors:

```jsx
import { Mail } from 'lucide-react';
import { useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Mail 
      size={20} 
      color={theme.palette.text.secondary} // Auto-adapts
    />
  );
}
```

Or use MUI's SvgIcon wrapper:

```jsx
import { SvgIcon } from '@mui/material';
import { Mail } from 'lucide-react';

<SvgIcon component={Mail} sx={{ color: 'text.secondary' }} />
```

---

## Hover States in Dark Mode

Hover backgrounds need adjustment:

**Light Mode:**
- Hover: `rgba(0, 0, 0, 0.04)` or `#F8FAFC`

**Dark Mode:**
- Hover: `rgba(255, 255, 255, 0.08)` or `#334155`

**Example:**
```jsx
<Button
  sx={{
    '&:hover': {
      backgroundColor: (theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.04)',
    },
  }}
>
```

---

## Status Colors in Dark Mode

**Availability Dots:**

Light Mode:
- Green (available): `#10B981`
- Yellow (limited): `#F59E0B`
- Red (unavailable): `#EF4444`

Dark Mode:
- Green (available): `#34D399`
- Yellow (limited): `#FBBF24`
- Red (unavailable): `#F87171`

```jsx
<Box
  sx={{
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark' ? '#34D399' : '#10B981',
  }}
/>
```

---

## Complete Dark Mode Example

### Full Page Component

```jsx
import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, IconButton } from '@mui/material';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#3B82F6' : '#2563EB',
          },
          background: {
            default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
            paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#F1F5F9' : '#0F172A',
            secondary: mode === 'dark' ? '#94A3B8' : '#475569',
          },
          divider: mode === 'dark' ? '#334155' : '#E2E8F0',
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies background color to body */}
      
      <Box sx={{
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(to bottom right, #0F172A, #1E293B)'
            : 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
      }}>
        {/* Dark mode toggle */}
        <IconButton
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          sx={{ position: 'fixed', top: 16, right: 16 }}
        >
          {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>

        {/* Your content */}
      </Box>
    </ThemeProvider>
  );
}
```

---

## Testing Dark Mode

### Checklist

- [ ] All text is readable (sufficient contrast)
- [ ] All icons are visible
- [ ] Borders are visible (not too subtle)
- [ ] Cards stand out from background
- [ ] Hover states are visible
- [ ] Focus states are visible
- [ ] Gradients look good (not too bright/dark)
- [ ] Shadows are noticeable but not harsh
- [ ] Status colors are distinct
- [ ] Form inputs are clearly editable

### Contrast Testing

Use WCAG contrast checker:
- Normal text: 4.5:1 minimum
- Large text (≥18px): 3:1 minimum
- UI components: 3:1 minimum

**Common Issues in Dark Mode:**
- Light gray text on dark gray background (poor contrast)
- Subtle borders disappear
- Shadows too dark (create harsh edges)
- Blue links hard to read on dark background

---

## Best Practices

1. **Always use theme colors** instead of hardcoded hex values
2. **Test both modes** during development
3. **Use CssBaseline** to ensure proper background application
4. **Persist mode preference** in localStorage
5. **Provide toggle in accessible location** (header recommended)
6. **Increase shadow opacity** in dark mode for depth perception
7. **Lighten primary colors slightly** in dark mode for better visibility
8. **Test on actual devices** - dark mode looks different on OLED vs LCD

---

This completes the dark mode specifications. All components should automatically adapt when using the theme configuration provided.
