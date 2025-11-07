// IMPORTANT: Polyfills must be at the top before any imports that use them
// Polyfill Request/Response for Jest environment (needed for Next.js server components)
// Only polyfill if not already available (Node 18+ has these built-in)
// Define Headers first since Request/Response depend on it
if (typeof globalThis.Headers === "undefined") {
  try {
    // Try to use undici if available (Node 18+)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Headers } = require("undici");
    globalThis.Headers = Headers;
  } catch {
    // Fallback: create minimal Headers polyfill
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Headers = class MockHeaders {
      private map = new Map<string, string>();
      constructor(init?: HeadersInit) {
        if (init) {
          if (Array.isArray(init)) {
            init.forEach(([key, value]) => this.set(key, value));
          } else if (init instanceof Headers) {
            init.forEach((value, key) => this.set(key, value));
          } else {
            Object.entries(init).forEach(([key, value]) =>
              this.set(key, value)
            );
          }
        }
      }
      get(name: string) {
        return this.map.get(name.toLowerCase()) || null;
      }
      set(name: string, value: string) {
        this.map.set(name.toLowerCase(), value);
      }
      has(name: string) {
        return this.map.has(name.toLowerCase());
      }
      forEach(callback: (value: string, key: string) => void) {
        this.map.forEach(callback);
      }
    };
  }
}

if (typeof globalThis.Request === "undefined") {
  try {
    // Try to use undici if available (Node 18+)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Request, Response } = require("undici");
    globalThis.Request = Request;
    globalThis.Response = Response;
  } catch {
    // Fallback: create minimal polyfills
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Request = class MockRequest {
      private _url: string;
      method: string;
      headers: InstanceType<typeof globalThis.Headers>;
      constructor(input: string | Request, init?: RequestInit) {
        this._url = typeof input === "string" ? input : input.url;
        this.method = init?.method || "GET";
        this.headers = new globalThis.Headers(init?.headers);
      }
      get url(): string {
        return this._url;
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Response = class MockResponse {
      status: number;
      statusText: string;
      headers: InstanceType<typeof globalThis.Headers>;
      ok: boolean;
      body?: BodyInit;
      constructor(body?: BodyInit, init?: ResponseInit) {
        this.body = body;
        this.status = init?.status || 200;
        this.statusText = init?.statusText || "OK";
        this.headers = new globalThis.Headers(init?.headers);
        this.ok = this.status >= 200 && this.status < 300;
      }
    };
  }
}

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "@testing-library/jest-dom";

// Mock jose module globally to avoid ESM issues
jest.mock("jose", () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue("mock-jwt-token"),
  })),
  jwtVerify: jest.fn().mockResolvedValue({
    payload: {
      userId: "test-user-id",
      email: "test@example.com",
      role: "admin",
    },
  }),
}));

// Mock nanoid module globally to avoid ESM issues
jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "mock-nanoid-id"),
}));

// Polyfill TextDecoder/TextEncoder for Jest environment (needed for Neon database client)
if (typeof globalThis.TextDecoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TextDecoder, TextEncoder } = require("util");
  globalThis.TextDecoder = TextDecoder;
  globalThis.TextEncoder = TextEncoder;
}

// Polyfill setImmediate for Jest environment (needed for postgres client)
if (typeof globalThis.setImmediate === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).setImmediate = (
    callback: (...args: unknown[]) => void,
    ...args: unknown[]
  ) => {
    return setTimeout(() => callback(...args), 0);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).clearImmediate = (id: NodeJS.Timeout) => {
    clearTimeout(id);
  };
}

// Polyfill Request/Response for Jest environment (needed for Next.js server components)
// Only polyfill if not already available (Node 18+ has these built-in)
// Define Headers first since Request/Response depend on it
if (typeof globalThis.Headers === "undefined") {
  try {
    // Try to use undici if available (Node 18+)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Headers } = require("undici");
    globalThis.Headers = Headers;
  } catch {
    // Fallback: create minimal Headers polyfill
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Headers = class MockHeaders {
      private map = new Map<string, string>();
      constructor(init?: HeadersInit) {
        if (init) {
          if (Array.isArray(init)) {
            init.forEach(([key, value]) => this.set(key, value));
          } else if (init instanceof Headers) {
            init.forEach((value, key) => this.set(key, value));
          } else {
            Object.entries(init).forEach(([key, value]) =>
              this.set(key, value)
            );
          }
        }
      }
      get(name: string) {
        return this.map.get(name.toLowerCase()) || null;
      }
      set(name: string, value: string) {
        this.map.set(name.toLowerCase(), value);
      }
      has(name: string) {
        return this.map.has(name.toLowerCase());
      }
      forEach(callback: (value: string, key: string) => void) {
        this.map.forEach(callback);
      }
    };
  }
}

if (typeof globalThis.Request === "undefined") {
  try {
    // Try to use undici if available (Node 18+)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Request, Response } = require("undici");
    globalThis.Request = Request;
    globalThis.Response = Response;
  } catch {
    // Fallback: create minimal polyfills
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Request = class MockRequest {
      private _url: string;
      method: string;
      headers: InstanceType<typeof globalThis.Headers>;
      constructor(input: string | Request, init?: RequestInit) {
        this._url = typeof input === "string" ? input : input.url;
        this.method = init?.method || "GET";
        this.headers = new globalThis.Headers(init?.headers);
      }
      get url(): string {
        return this._url;
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Response = class MockResponse {
      status: number;
      statusText: string;
      headers: InstanceType<typeof globalThis.Headers>;
      ok: boolean;
      body?: BodyInit;
      constructor(body?: BodyInit, init?: ResponseInit) {
        this.body = body;
        this.status = init?.status || 200;
        this.statusText = init?.statusText || "OK";
        this.headers = new globalThis.Headers(init?.headers);
        this.ok = this.status >= 200 && this.status < 300;
      }
    };
  }
}

// Mock certifications module to avoid top-level await issues
jest.mock("$/db/certifications/certifications", () => ({
  CertificationsService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

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
  Canvas: ({ children }: { children: React.ReactNode }) => ({
    type: "div",
    props: { "data-testid": "canvas", children },
  }),
  useFrame: jest.fn(),
}));

// Mock Material-UI components
jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }: React.ComponentProps<typeof Box>) => ({
    type: "div",
    props: { ...props, children },
  }),
  Typography: ({
    children,
    ...props
  }: React.ComponentProps<typeof Typography>) => ({
    type: "div",
    props: { ...props, children },
  }),
  Button: ({ children, ...props }: React.ComponentProps<typeof Button>) => ({
    type: "button",
    props: { ...props, children },
  }),
  Card: ({ children, ...props }: React.ComponentProps<typeof Card>) => ({
    type: "div",
    props: { ...props, children },
  }),
  TextField: ({ label, ...props }: React.ComponentProps<typeof TextField>) => ({
    type: "input",
    props: { "aria-label": label, ...props },
  }),
  Alert: ({ children, ...props }: React.ComponentProps<typeof Alert>) => ({
    type: "div",
    props: { ...props, children },
  }),
  CircularProgress: (props: React.ComponentProps<typeof CircularProgress>) => ({
    type: "div",
    props,
  }),
  Paper: ({ children, ...props }: React.ComponentProps<typeof Paper>) => ({
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
  PresentationControls: ({ children }: { children: React.ReactNode }) => ({
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
  styled: (component: React.Component) => () => component,
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
