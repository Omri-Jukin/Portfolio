# Portfolio UI Component Library

A modern, accessible React component library built with Material-UI, TypeScript, and Framer Motion. Features stunning animations, 3D graphics, and responsive design patterns.

## 🚀 Features

- **Modern React** - Built with React 18+ and TypeScript
- **Material-UI Integration** - Seamless MUI theme integration
- **3D Graphics** - Three.js powered galaxy and DNA animations
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Full theme support
- **Accessibility** - WCAG compliant components
- **TypeScript** - Full type safety

## 📦 Installation

```bash
npm install @your-org/ui-library
# or
yarn add @your-org/ui-library
# or
pnpm add @your-org/ui-library
```

## 🔧 Setup

### Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled framer-motion three @react-three/fiber @react-three/drei
```

### Theme Provider Setup

```tsx
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@your-org/ui-library';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## 🎨 Components

### Core Components

#### Button
Customizable button with multiple variants including gradient, neon, and glass effects.

```tsx
import { Button } from '@your-org/ui-library';

// Basic usage
<Button variant="contained">Click me</Button>

// Gradient button
<Button variant="gradient">Gradient Button</Button>

// Neon button
<Button variant="neon">Neon Button</Button>

// Glass button
<Button variant="glass">Glass Button</Button>
```

**Props:**
- `variant`: `"contained" | "outlined" | "text" | "gradient" | "neon" | "glass"`
- `color`: `"primary" | "secondary" | "error" | "warning" | "info" | "success"`
- `size`: `"small" | "medium" | "large"`

#### Card
Enhanced card component with animations and effects.

```tsx
import { Card } from '@your-org/ui-library';

<Card
  title="Card Title"
  description="Card description"
  href="/link"
  animation="fade"
  gradient={true}
  glow={true}
/>
```

**Props:**
- `title`: string
- `description`: string
- `href`: string
- `animation`: `"fade" | "slide" | "scale" | "bounce"`
- `gradient`: boolean
- `glow`: boolean

### Animation Components

#### AnimatedBackground
3D animated backgrounds with path-based animations.

```tsx
import { AnimatedBackground } from '@your-org/ui-library';

<AnimatedBackground
  animationType="dna"
  path="/about"
  manualOverride={false}
/>
```

**Animation Types:**
- `"torusKnot"` - Home page default
- `"dna"` - About/Career pages
- `"stars"` - Contact/Admin pages
- `"polyhedron"` - Blog pages

#### AnimatedText
Text with hover animations and color transitions.

```tsx
import { AnimatedText } from '@your-org/ui-library';

<AnimatedText
  type="scaleUp"
  fontSize="4rem"
  length={5}
>
  Hello World
</AnimatedText>
```

**Animation Types:**
- `"scaleUp" | "scaleDown"`
- `"fadeIn" | "fadeOut"`
- `"slideUp" | "slideDown"`

#### DNAHelix
3D DNA helix animation with customizable rotation.

```tsx
import { DNAHelix } from '@your-org/ui-library';

<DNAHelix spinning={true} position={[0, 0, 5]} />
```

### Layout Components

#### ResponsiveLayout
Automatic responsive layout switching.

```tsx
import { ResponsiveLayout } from '@your-org/ui-library';

<ResponsiveLayout isMobile={isMobile} forceLayout="auto">
  {children}
</ResponsiveLayout>
```

#### MotionWrapper
Framer Motion wrapper for consistent animations.

```tsx
import { MotionWrapper } from '@your-org/ui-library';

<MotionWrapper
  variant="fadeIn"
  duration={0.6}
  delay={0.2}
>
  {children}
</MotionWrapper>
```

**Animation Variants:**
- `"fadeIn" | "fadeInUp" | "fadeInDown"`
- `"slideUp" | "slideDown" | "slideLeft" | "slideRight"`
- `"scale" | "rotate" | "bounce" | "stagger"`

### Interactive Components

#### DarkModeToggle
Theme switching with smooth transitions.

```tsx
import { DarkModeToggle } from '@your-org/ui-library';

<DarkModeToggle
  isDark={isDarkMode}
  onToggle={handleThemeToggle}
/>
```

#### LanguageSwitcher
Multi-language support with locale switching.

```tsx
import { LanguageSwitcher } from '@your-org/ui-library';

<LanguageSwitcher />
```

**Supported Locales:**
- `"en"` - English
- `"es"` - Spanish
- `"fr"` - French
- `"he"` - Hebrew

### Specialized Components

#### ThreeGalaxy
Interactive 3D galaxy with customizable parameters.

```tsx
import { ThreeGalaxy } from '@your-org/ui-library';

<ThreeGalaxy
  count={30000}
  branches={4}
  spin={1.5}
  insideColor="#ff6b6b"
  outsideColor="#4ecdc4"
  animateColors={true}
  intensity="medium"
  speed="normal"
>
  <div>Content over galaxy</div>
</ThreeGalaxy>
```

**Props:**
- `count`: number of particles
- `branches`: number of spiral arms
- `spin`: spiral tightness
- `insideColor`: center color
- `outsideColor`: edge color
- `animateColors`: color animation
- `intensity`: `"low" | "medium" | "high"`
- `speed`: `"slow" | "normal" | "fast"`

#### BrokenGlass
Glass morphism effect with customizable intensity.

```tsx
import { BrokenGlass } from '@your-org/ui-library';

<BrokenGlass intensity="medium" animation={true}>
  <div>Content behind glass</div>
</BrokenGlass>
```

## 🎯 Usage Examples

### Basic Portfolio Section

```tsx
import { 
  About, 
  Services, 
  Projects, 
  Contact,
  AnimatedBackground 
} from '@your-org/ui-library';

function Portfolio() {
  return (
    <>
      <AnimatedBackground animationType="dna" />
      
      <About onSkillClick={handleSkillClick} />
      <Services onServiceClick={handleServiceClick} />
      <Projects />
      <Contact locale="en" onContactClick={handleContact} />
    </>
  );
}
```

### Custom Theme Integration

```tsx
import { createTheme } from '@mui/material/styles';
import { theme } from '@your-org/ui-library';

const customTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#4ecdc4',
    },
  },
});
```

## 🛠 Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/ui-library.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build

# Run tests
npm test

# Run Storybook
npm run storybook
```

### Project Structure

```
src/
├── components/
│   ├── About/
│   ├── AnimatedBackground/
│   ├── AnimatedText/
│   ├── Button/
│   ├── Card/
│   ├── DarkModeToggle/
│   ├── DNAHelix/
│   ├── LanguageSwitcher/
│   ├── MotionWrapper/
│   ├── ThreeGalaxy/
│   └── ...
├── theme/
│   ├── index.ts
│   └── theme.ts
├── types/
│   └── index.ts
└── index.ts
```

## 📚 Storybook

View all components with interactive examples:

```bash
npm run storybook
```

Visit `http://localhost:6006` to explore components.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Publishing

### Build

```bash
npm run build
```

### Publish

```bash
npm publish
```

### Version Management

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Add Storybook stories for new components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@your-org.com
- 💬 Discord: [Join our community](https://discord.gg/your-org)
- 📖 Documentation: [docs.your-org.com](https://docs.your-org.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/ui-library/issues)

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the base components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Three.js](https://threejs.org/) for 3D graphics
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for React Three.js integration

---

Made with ❤️ by [Your Organization](https://your-org.com)
