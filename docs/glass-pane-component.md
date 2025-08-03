# GlassPane Component

A configurable glassmorphism component that creates translucent, blurred glass-like effects with customizable properties.

## Overview

The GlassPane component creates a glassmorphism effect similar to the one shown in the image, where a semi-transparent overlay creates a frosted glass appearance. It's highly configurable and can be used to create various glass-like UI elements.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `"200px"` | Width of the glass pane |
| `height` | `string` | `"100px"` | Height of the glass pane |
| `rotate` | `string` | `"0deg"` | Rotation angle (e.g., "15deg", "-10deg") |
| `borderRadius` | `string` | `"16px"` | Border radius for rounded corners |
| `border` | `string` | `"1px solid rgba(0, 0, 0, 1)"` | Border style |
| `backdropFilter` | `string` | `"blur(5.3px)"` | CSS backdrop-filter property |
| `WebkitBackdropFilter` | `string` | `"blur(5.3px)"` | Webkit backdrop-filter for Safari |
| `boxShadow` | `string` | `"0 4px 30px rgba(0, 0, 0, 0.1)"` | Box shadow effect |
| `background` | `string` | `"rgba(0, 0, 0, 0.28)"` | Background color with transparency |
| `opacity` | `number` | `1` | Overall opacity (0-1) |
| `zIndex` | `number` | `1` | Z-index for layering |
| `position` | `string` | `"relative"` | CSS position property |
| `display` | `string` | `"flex"` | CSS display property |
| `alignItems` | `string` | `"center"` | CSS align-items property |
| `justifyContent` | `string` | `"center"` | CSS justify-content property |
| `transition` | `string` | `"all 0.3s ease-in-out"` | CSS transition property |
| `cursor` | `string` | `"pointer"` | CSS cursor property |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles |
| `onClick` | `(event: React.MouseEvent<HTMLDivElement>) => void` | - | Click event handler |
| `onMouseEnter` | `(event: React.MouseEvent<HTMLDivElement>) => void` | - | Mouse enter event handler |
| `onMouseLeave` | `(event: React.MouseEvent<HTMLDivElement>) => void` | - | Mouse leave event handler |
| `children` | `React.ReactNode` | - | Content to display inside the glass pane |

## Usage Examples

### Basic GlassPane
```tsx
import { GlassPane } from "#/Components";

<GlassPane
  width="200px"
  height="100px"
  background="rgba(255, 0, 0, 0.3)"
  border="1px solid rgba(255, 0, 0, 0.5)"
>
  <Typography>Basic GlassPane</Typography>
</GlassPane>
```

### Rotated GlassPane
```tsx
<GlassPane
  width="200px"
  height="100px"
  rotate="15deg"
  background="rgba(0, 255, 0, 0.3)"
  border="1px solid rgba(0, 255, 0, 0.5)"
>
  <Typography>Rotated GlassPane</Typography>
</GlassPane>
```

### Circular GlassPane
```tsx
<GlassPane
  width="100px"
  height="100px"
  borderRadius="50%"
  background="rgba(0, 0, 255, 0.3)"
  border="1px solid rgba(0, 0, 255, 0.5)"
>
  <Typography>Circle</Typography>
</GlassPane>
```

### Interactive GlassPane with Hover Effects
```tsx
<GlassPane
  width="200px"
  height="120px"
  background="rgba(138, 43, 226, 0.3)"
  border="1px solid rgba(138, 43, 226, 0.5)"
  transition="all 0.3s ease-in-out"
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
    e.currentTarget.style.background = "rgba(138, 43, 226, 0.5)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
    e.currentTarget.style.background = "rgba(138, 43, 226, 0.3)";
  }}
>
  <Typography>Hover me!</Typography>
</GlassPane>
```

### GlassPane with Custom Blur and Shadow
```tsx
<GlassPane
  width="200px"
  height="100px"
  backdropFilter="blur(20px)"
  WebkitBackdropFilter="blur(20px)"
  boxShadow="0 8px 32px rgba(255, 0, 255, 0.3)"
  background="rgba(255, 0, 255, 0.3)"
  border="1px solid rgba(255, 0, 255, 0.5)"
>
  <Typography>Custom Effects</Typography>
</GlassPane>
```

## Demo Component

The `GlassPaneDemo` component showcases various configurations and interactive examples of the GlassPane component. It's available in the examples page under the "UI/UX Elements" tab.

## Browser Support

The component uses modern CSS properties like `backdrop-filter` and `WebkitBackdropFilter`. For best compatibility:

- Modern browsers: Full support
- Safari: Requires `WebkitBackdropFilter` prefix
- Older browsers: May fall back to basic transparency without blur effects

## Tips

1. **Background Colors**: Use rgba() colors with low alpha values (0.1-0.5) for the best glassmorphism effect
2. **Blur Intensity**: Adjust `backdropFilter` blur values (5px-20px) for different levels of transparency
3. **Layering**: Use `zIndex` to control the stacking order of multiple glass panes
4. **Performance**: Be mindful of using too many glass panes with heavy blur effects on mobile devices
5. **Accessibility**: Ensure sufficient contrast between the glass pane content and background 