# Responsive Layout System

This directory contains a comprehensive responsive layout system that automatically adapts to different screen sizes, providing optimal user experiences for both mobile and desktop devices.

## Components

### ResponsiveLayout
The main wrapper component that automatically switches between mobile and desktop layouts based on screen size or manual control.

```tsx
import ResponsiveLayout from "./Components/Providers/ResponsiveLayout";

function MyPage() {
  return (
    <ResponsiveLayout>
      {/* Your content here */}
    </ResponsiveLayout>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render |
| `isMobile` | `boolean \| undefined` | `undefined` | Force mobile/desktop layout. If undefined, uses media query |
| `forceLayout` | `'mobile' \| 'desktop' \| 'auto'` | `'auto'` | Override layout detection completely |

### MobileLayout
Mobile-specific layout with touch-friendly optimizations:
- Smaller padding (16px)
- Touch-friendly button sizes (3.5rem minimum)
- Mobile-optimized typography
- Smooth scrolling with `-webkit-overflow-scrolling: touch`
- Disabled tap highlights

### RegularLayout
Desktop layout with spacious design:
- Larger padding (20px 40px)
- Standard typography sizes
- Desktop-optimized spacing

## Usage Examples

### Basic Usage (Auto Detection)
```tsx
import ResponsiveLayout from "./Components/Providers/ResponsiveLayout";

export default function MyPage() {
  return (
    <ResponsiveLayout>
      <Typography variant="h1">My Responsive Page</Typography>
      <Button variant="rounded">Touch-Friendly Button</Button>
    </ResponsiveLayout>
  );
}
```

### Manual Mobile State Control
```tsx
import ResponsiveLayout from "./Components/Providers/ResponsiveLayout";

export default function MyPage({ isMobileView }: { isMobileView: boolean }) {
  return (
    <ResponsiveLayout isMobile={isMobileView}>
      <Typography variant="h1">Controlled Layout</Typography>
      <Button variant="rounded">Adaptive Button</Button>
    </ResponsiveLayout>
  );
}
```

### Force Specific Layout
```tsx
// Force mobile layout regardless of screen size
<ResponsiveLayout forceLayout="mobile">
  <YourContent />
</ResponsiveLayout>

// Force desktop layout regardless of screen size
<ResponsiveLayout forceLayout="desktop">
  <YourContent />
</ResponsiveLayout>

// Use auto detection (default behavior)
<ResponsiveLayout forceLayout="auto">
  <YourContent />
</ResponsiveLayout>
```

### Dynamic Layout Control
```tsx
import { useState } from "react";
import ResponsiveLayout from "./Components/Providers/ResponsiveLayout";

export default function DynamicLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [forceLayout, setForceLayout] = useState<'mobile' | 'desktop' | 'auto'>('auto');

  return (
    <ResponsiveLayout isMobile={isMobile} forceLayout={forceLayout}>
      <Box>
        <Button onClick={() => setIsMobile(!isMobile)}>
          Toggle Mobile State
        </Button>
        <Button onClick={() => setForceLayout('mobile')}>
          Force Mobile
        </Button>
        <Button onClick={() => setForceLayout('desktop')}>
          Force Desktop
        </Button>
        <Button onClick={() => setForceLayout('auto')}>
          Auto Detect
        </Button>
      </Box>
    </ResponsiveLayout>
  );
}
```

### With Responsive Grid
```tsx
<ResponsiveLayout>
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",           // 1 column on mobile
        md: "repeat(2, 1fr)", // 2 columns on tablet
        lg: "repeat(3, 1fr)", // 3 columns on desktop
      },
      gap: { xs: 2, md: 3 },
    }}
  >
    {/* Grid items */}
  </Box>
</ResponsiveLayout>
```

### Responsive Spacing
```tsx
<Box
  sx={{
    padding: { xs: 2, md: 4 },
    margin: { xs: 1, md: 2 },
    gap: { xs: 1, md: 2 },
  }}
>
  {/* Content with responsive spacing */}
</Box>
```

## Layout Detection Logic

The component uses the following logic to determine which layout to render:

1. **If `forceLayout` is set:**
   - `"mobile"` → Always render MobileLayout
   - `"desktop"` → Always render RegularLayout
   - `"auto"` → Continue to step 2

2. **If `isMobile` prop is provided:**
   - `true` → Render MobileLayout
   - `false` → Render RegularLayout
   - `undefined` → Continue to step 3

3. **Fallback to media query:**
   - Uses `useMediaQuery(theme.breakpoints.down("sm"))`
   - Returns `true` for mobile, `false` for desktop

## Theme Features

The theme has been enhanced with mobile-responsive features:

### Responsive Typography
All typography variants automatically scale down on smaller screens:

- **H1**: 2.5rem → 2rem (md) → 1.75rem (sm)
- **H2**: 2rem → 1.75rem (md) → 1.5rem (sm)
- **H3**: 1.75rem → 1.5rem (md) → 1.25rem (sm)
- **Body1**: 1rem → 0.875rem (md) → 0.8125rem (sm)

### Mobile-Optimized Components
- **Buttons**: Minimum 3.5rem touch targets with responsive padding
- **Cards**: Responsive spacing and typography
- **Containers**: Adaptive padding for different screen sizes

### Breakpoints
Uses custom MUI breakpoints:
- `xs`: 0px - 639px (mobile)
- `sm`: 640px - 767px (tablet)
- `md`: 768px - 1023px (small desktop)
- `ml`: 1024px - 1279px (medium desktop)
- `lg`: 1280px - 1439px (desktop)
- `xl`: 1440px - 1919px (large desktop)
- `xxl`: 1920px - 2559px (extra large)
- `xxxl`: 2560px - 3839px (ultra wide)
- `xxxxl`: 3840px+ (4K+)

## Best Practices

1. **Use `forceLayout` for testing** - Force specific layouts during development
2. **Use `isMobile` for state-driven layouts** - When you have external state management
3. **Default to `auto` for production** - Let the component handle responsive behavior
4. **Test on multiple screen sizes** to ensure proper adaptation
5. **Use touch-friendly sizes** (3.5rem minimum) for interactive elements
6. **Leverage responsive typography** instead of hardcoding font sizes

## Mobile Optimizations

- **Touch Targets**: All buttons and interactive elements have minimum 3.5rem size
- **Smooth Scrolling**: Enabled for better mobile scrolling experience
- **Tap Highlights**: Disabled for cleaner mobile interactions
- **Typography**: Automatically scaled for mobile readability
- **Spacing**: Reduced padding and margins for mobile screens

## Browser Support

- Modern browsers with CSS Grid support
- iOS Safari 10.3+
- Chrome 57+
- Firefox 52+
- Edge 16+ 