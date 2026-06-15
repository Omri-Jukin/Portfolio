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
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));
