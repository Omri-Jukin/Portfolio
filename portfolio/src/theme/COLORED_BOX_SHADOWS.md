# Colored Box Shadows with Conic Gradients

## Overview

The theme now includes dynamic colored box shadows that automatically extract colors from conic gradients and apply them to shadow effects. This creates a cohesive visual experience where shadows match the color scheme of the gradients they're associated with.

## How It Works

### 1. Color Extraction
The `extractColorsFromGradient` function parses conic gradient strings and extracts hex color values using regex pattern matching.

### 2. Shadow Generation
The `createColoredBoxShadows` function:
- Takes all conic gradients as input
- Extracts colors from each gradient
- Creates box shadows using the extracted colors with different opacity levels
- Returns an array of shadow objects for each gradient type

### 3. Shadow Structure
Each gradient type gets its own set of shadows with different intensities:
- `none`: No shadow
- `light`: Subtle shadow using primary color with 20% opacity
- `medium`: Medium shadow using primary and secondary colors with 30% and 25% opacity
- `heavy`: Strong shadow using primary, secondary, and accent colors with 40% and 35% opacity

## Usage

### In Styled Components
```typescript
const StyledBox = styled(Box)(({ theme }) => ({
  // Use shadows based on gradient type
  boxShadow: theme.boxShadows[0]?.light, // First gradient type, light shadow
  '&:hover': {
    boxShadow: theme.boxShadows[1]?.medium, // Second gradient type, medium shadow
  }
}));
```

### Available Gradient Types
The following gradient types have corresponding colored shadows:
- `phone`
- `email`
- `github`
- `linkedin`
- `whatsapp`
- `telegram`
- `warm`
- `coolWarm`
- `cool`
- `neutral`
- `dark`
- `sunset`
- `ocean`
- `forest`
- `galaxy`
- `aurora`
- `fire`
- `spring`

## Example

```typescript
// Warm gradient: conic-gradient(from 180deg, #FF6B6B, #FF8A65, #FFB347, #FFD700, #FFEAA7)
// Extracted colors: #FF6B6B, #FF8A65, #FFB347, #FFD700, #FFEAA7

// Generated shadows:
{
  none: "none",
  light: "0 1px 2px #FF6B6B20, 0 1px 1px #FF8A6515",
  medium: "0 2px 4px #FF6B6B30, 1px 1px 2px #FF8A6525",
  heavy: "0 3px 6px #FF6B6B40, 1px 1px 3px #FFB34735"
}
```

## Benefits

1. **Visual Consistency**: Shadows automatically match the color scheme of their associated gradients
2. **Dynamic Theming**: Changes to gradients automatically update corresponding shadows
3. **Reduced Maintenance**: No need to manually maintain shadow color values
4. **Enhanced UX**: More cohesive and polished visual experience

## Demo Component

See `Components/BoxShadowDemo/BoxShadowDemo.tsx` for a visual demonstration of all colored box shadows. 