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
    },
  }),
}));
