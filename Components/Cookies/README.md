# Cookies Banner Component

A comprehensive, GDPR-compliant cookies banner component with customizable preferences and modern styling.

## Features

- 🍪 **GDPR Compliant**: Handles necessary, analytics, marketing, and preference cookies
- 🎨 **Modern Design**: Beautiful, responsive design with smooth animations
- ⚙️ **Customizable**: Granular control over cookie categories
- 💾 **Persistent**: Remembers user preferences in localStorage
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 📱 **Responsive**: Works perfectly on all device sizes
- 🎭 **Animated**: Smooth transitions using Framer Motion

## Usage

### Basic Usage

```tsx
import Cookies from '@/Components/Cookies';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Cookies />
    </div>
  );
}
```

### Advanced Usage with Callbacks

```tsx
import Cookies, { CookiePreferences } from '@/Components/Cookies';

function App() {
  const handleAcceptAll = (preferences: CookiePreferences) => {
    console.log('All cookies accepted:', preferences);
    // Initialize analytics, marketing tools, etc.
  };

  const handleAcceptSelected = (preferences: CookiePreferences) => {
    console.log('Selected cookies accepted:', preferences);
    // Initialize only selected cookie types
  };

  const handleDecline = () => {
    console.log('Cookies declined');
    // Handle minimal cookie setup
  };

  const handleCustomize = () => {
    console.log('Customize clicked');
    // Track customization interaction
  };

  return (
    <div>
      {/* Your app content */}
      <Cookies
        onAcceptAll={handleAcceptAll}
        onAcceptSelected={handleAcceptSelected}
        onDecline={handleDecline}
        onCustomize={handleCustomize}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | `true` | Controls initial visibility |
| `onAcceptAll` | `(preferences: CookiePreferences) => void` | - | Callback when all cookies are accepted |
| `onAcceptSelected` | `(preferences: CookiePreferences) => void` | - | Callback when selected cookies are accepted |
| `onDecline` | `() => void` | - | Callback when cookies are declined |
| `onCustomize` | `() => void` | - | Callback when customize is clicked |
| `className` | `string` | - | Additional CSS class |

## Cookie Categories

The component manages four cookie categories:

1. **Necessary** (Required): Essential for website functionality
2. **Analytics**: Website usage analytics and performance monitoring
3. **Marketing**: Advertising and marketing tracking
4. **Preferences**: User preference storage and personalization

## Storage

User preferences are automatically saved to `localStorage` under the key `cookie-preferences`. The component will not show again if preferences have been previously set.

## Styling

The component uses styled-components with a dark theme that includes:
- Backdrop blur effects
- Smooth animations
- Responsive design
- High contrast for accessibility
- Modern gradient buttons

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader friendly
- High contrast mode support
- Focus management

## Browser Support

- Modern browsers with ES6+ support
- Requires `localStorage` support
- CSS Grid and Flexbox support

## Customization

You can customize the appearance by modifying the styled components in `Cookies.style.tsx` or by passing custom CSS classes via the `className` prop. 