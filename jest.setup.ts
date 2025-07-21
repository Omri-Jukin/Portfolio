import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return "/en";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

// Mock Three.js and React Three Fiber
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: any }) => ({
    type: "div",
    props: { "data-testid": "canvas", children },
  }),
  useFrame: jest.fn(),
}));

// Mock Material-UI components
jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => ({
    type: "div",
    props: { ...props, children },
  }),
  Typography: ({ children, ...props }: any) => ({
    type: "div",
    props: { ...props, children },
  }),
  Button: ({ children, ...props }: any) => ({
    type: "button",
    props: { ...props, children },
  }),
  Card: ({ children, ...props }: any) => ({
    type: "div",
    props: { ...props, children },
  }),
  TextField: ({ label, ...props }: any) => ({
    type: "input",
    props: { "aria-label": label, ...props },
  }),
  Alert: ({ children, ...props }: any) => ({
    type: "div",
    props: { ...props, children },
  }),
  CircularProgress: (props: any) => ({ type: "div", props }),
  Paper: ({ children, ...props }: any) => ({
    type: "div",
    props: { ...props, children },
  }),
}));

jest.mock("@mui/icons-material", () => ({
  Email: () => ({ type: "div", props: { "data-testid": "email-icon" } }),
  Phone: () => ({ type: "div", props: { "data-testid": "phone-icon" } }),
  Schedule: () => ({ type: "div", props: { "data-testid": "schedule-icon" } }),
  LocationOn: () => ({
    type: "div",
    props: { "data-testid": "location-icon" },
  }),
  Send: () => ({ type: "div", props: { "data-testid": "send-icon" } }),
  CheckCircle: () => ({
    type: "div",
    props: { "data-testid": "check-circle-icon" },
  }),
}));

jest.mock("@react-three/drei", () => ({
  PresentationControls: ({ children }: { children: any }) => ({
    type: "div",
    props: { "data-testid": "presentation-controls", children },
  }),
  TorusKnot: () => ({ type: "div", props: { "data-testid": "torus-knot" } }),
  Stars: () => ({ type: "div", props: { "data-testid": "stars" } }),
  Polyhedron: () => ({ type: "div", props: { "data-testid": "polyhedron" } }),
}));

// Mock Material-UI theme
jest.mock("@mui/material/styles", () => ({
  useTheme: () => ({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
      text: { primary: "#000000", secondary: "#666666" },
      background: { paper: "#ffffff", default: "#f5f5f5" },
      warm: { primary: "#ff6b6b", secondary: "#ff8e8e" },
      cool: { primary: "#4ecdc4", secondary: "#45b7aa" },
      neutral: { primary: "#95a5a6" },
    },
    spacing: (factor: number) => `${8 * factor}px`,
    shape: { borderRadius: 4 },
    shadows: [
      "none",
      "0px 2px 1px -1px rgba(0,0,0,0.2)",
      "0px 1px 1px 0px rgba(0,0,0,0.14)",
      "0px 1px 3px 0px rgba(0,0,0,0.12)",
      "0px 2px 4px -1px rgba(0,0,0,0.2)",
      "0px 3px 5px -1px rgba(0,0,0,0.2)",
      "0px 3px 5px -1px rgba(0,0,0,0.2)",
      "0px 4px 5px -2px rgba(0,0,0,0.2)",
      "0px 5px 5px -3px rgba(0,0,0,0.2)",
      "0px 5px 6px -3px rgba(0,0,0,0.2)",
    ],
    breakpoints: {
      down: (key: string) =>
        `@media (max-width: ${key === "sm" ? "600px" : "960px"})`,
    },
    direction: "ltr",
    animations: {
      bobbing: "0.6s ease-in-out infinite",
      rotating: "1s linear infinite",
    },
  }),
  styled: (component: any) => (styles: any) => component,
  createTheme: () => ({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
      text: { primary: "#000000", secondary: "#666666" },
      background: { paper: "#ffffff", default: "#f5f5f5" },
      warm: { primary: "#ff6b6b", secondary: "#ff8e8e" },
      cool: { primary: "#4ecdc4", secondary: "#45b7aa" },
      neutral: { primary: "#95a5a6" },
    },
    spacing: (factor: number) => `${8 * factor}px`,
    shape: { borderRadius: 4 },
    shadows: [
      "none",
      "0px 2px 1px -1px rgba(0,0,0,0.2)",
      "0px 1px 1px 0px rgba(0,0,0,0.14)",
      "0px 1px 3px 0px rgba(0,0,0,0.12)",
      "0px 2px 4px -1px rgba(0,0,0,0.2)",
      "0px 3px 5px -1px rgba(0,0,0,0.2)",
      "0px 3px 5px -1px rgba(0,0,0,0.2)",
      "0px 4px 5px -2px rgba(0,0,0,0.2)",
      "0px 5px 5px -3px rgba(0,0,0,0.2)",
      "0px 5px 6px -3px rgba(0,0,0,0.2)",
    ],
    breakpoints: {
      down: (key: string) =>
        `@media (max-width: ${key === "sm" ? "600px" : "960px"})`,
    },
    direction: "ltr",
    animations: {
      bobbing: "0.6s ease-in-out infinite",
      rotating: "1s linear infinite",
    },
  }),
}));
