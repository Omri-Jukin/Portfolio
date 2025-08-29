# Calendly Component

A React component that integrates Calendly scheduling with your portfolio's theme system.

## Features

- 🎨 **Theme Integration**: Automatically uses your portfolio's color palette
- 🎯 **Customizable**: Override theme colors with custom props
- 📱 **Mobile Responsive**: Full-width button on mobile devices
- ♿ **Accessible**: Proper contrast and focus states
- 📍 **Smart Positioning**: Intuitive position strings for easy placement
- 📏 **Rem-based**: Responsive units that scale with user preferences

## Usage

### Basic Usage (Uses Theme Colors)
```tsx
import CalendlyBadge from '@/Components/Calendly';

<CalendlyBadge 
  url="https://calendly.com/omrijukin/30min"
  text="Schedule a meeting"
/>
```

### Custom Colors
```tsx
<CalendlyBadge 
  url="https://calendly.com/omrijukin/30min"
  text="Book a call"
  backgroundColor="#FF6B6B"  // Custom button color
  textColor="#ffffff"        // Custom text color
/>
```

### With Smart Positioning
```tsx
// Floating button in bottom-right corner
<CalendlyBadge 
  url="https://calendly.com/omrijukin/30min"
  text="Schedule now"
  position="bottom-right"
/>

// Centered at the top
<CalendlyBadge 
  url="https://calendly.com/omrijukin/30min"
  text="Let's talk!"
  position="top-center"
/>

// Bottom center
<CalendlyBadge 
  url="https://calendly.com/omrijukin/30min"
  text="Book meeting"
  position="bottom-center"
/>

// Center of the page
<CalendlyBadge 
  url="https://calendly.com/omrijukin/30min"
  text="Get started"
  position="center"
/>
```

### With Custom Styling
```tsx
<CalendlyBadge 
  url="https://calendly.com/omrijukin/30min"
  text="Let's talk!"
  className="my-custom-calendly-button"
/>
```

## Theme Colors

The component uses these theme colors by default:

- **Button Background**: `theme.palette.calendly.primary` (#4ECDC4 - Teal)
- **Button Text**: `theme.palette.calendly.contrastText` (#ffffff - White)
- **Page Background**: `theme.palette.calendly.background` (#f8f9fa - Light gray)
- **Page Text**: `theme.palette.text.primary` (#2C3E50 - Dark blue-gray)

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `url` | `string` | ✅ | - | Your Calendly scheduling page URL |
| `text` | `string` | ✅ | - | Button text |
| `backgroundColor` | `string` | ❌ | Theme primary | Button background color |
| `textColor` | `string` | ❌ | Theme contrast | Button text color |
| `position` | `Position` | ❌ | - | Smart positioning (see below) |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

## Position Options

The `position` prop accepts these intuitive values:

| Position | Description | Use Case |
|----------|-------------|----------|
| `"top-left"` | Top-left corner | Header area placement |
| `"top-center"` | Top center | Banner-style placement |
| `"top-right"` | Top-right corner | Header navigation area |
| `"center-left"` | Left side, vertically centered | Sidebar placement |
| `"center"` | Dead center of container | Modal-style placement |
| `"center-right"` | Right side, vertically centered | Sidebar placement |
| `"bottom-left"` | Bottom-left corner | Footer area |
| `"bottom-center"` | Bottom center | Call-to-action area |
| `"bottom-right"` | Bottom-right corner | Floating action button |

### Position Examples

```tsx
// Floating action button (most common)
<CalendlyBadge position="bottom-right" />

// Header call-to-action
<CalendlyBadge position="top-center" />

// Sidebar placement
<CalendlyBadge position="center-right" />

// Centered modal-style
<CalendlyBadge position="center" />
```

## Mobile Responsive

The component automatically adapts to mobile devices:

### Desktop (768px+)
- Uses the specified position prop
- Standard button sizing
- Absolute positioning with rem-based spacing

### Mobile (< 768px)
- **Fixed positioning** at bottom of screen
- **Full-width button** spanning the entire width
- **Larger touch targets** with increased padding
- **Enhanced typography** for better readability

### Mobile Behavior
```css
/* On mobile, the button becomes a full-width bottom bar */
@media (max-width: 768px) {
  .calendly-container {
    position: fixed !important;
    bottom: 1rem !important;
    left: 1rem !important;
    right: 1rem !important;
  }
  
  .calendly-container button {
    width: 100% !important;
    padding: 1rem 1.5rem !important;
    font-size: 1.125rem !important;
  }
}
```

## Styling

The component includes:
- Modern button design with rounded corners
- Smooth hover transitions
- Subtle shadow effects
- Responsive padding and typography
- Proper contrast ratios for accessibility
- Smart absolute positioning with z-index management
- Rem-based units for better accessibility
- Mobile-first responsive design 