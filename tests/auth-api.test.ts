import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../src/app/server/router";
import { createContext } from "../src/app/server/context";
import { createUser, deleteUser } from "../lib/db/users/users";
import { getDB } from "../lib/db/client";
import { eq } from "drizzle-orm";
import { users } from "../lib/db/schema/schema.tables";

// Mock jose module to avoid ESM issues in Jest
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

// Test credentials
const TEST_USER = {
  email: "test-api-auth@example.com",
  password: "TestPassword123!",
  firstName: "Test",
  lastName: "User",
};

const TEST_USER_2 = {
  email: "test-api-auth-2@example.com",
  password: "TestPassword456!",
  firstName: "Test2",
  lastName: "User2",
};

// Mock JWT_SECRET for testing
const TEST_JWT_SECRET = "test-jwt-secret-key-for-testing-only";

describe("Auth API Integration Tests", () => {
  let testUserId: string | null = null;
  let testUserId2: string | null = null;
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  beforeEach(async () => {
    // Skip tests if DATABASE_URL is not set or in production
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping auth API tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      // Set test JWT_SECRET
      process.env.JWT_SECRET = TEST_JWT_SECRET;

      // Clean up any existing test users
      if (db) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, TEST_USER.email),
        });
        if (existingUser) {
          await deleteUser(existingUser.id);
        }

        const existingUser2 = await db.query.users.findFirst({
          where: eq(users.email, TEST_USER_2.email),
        });
        if (existingUser2) {
          await deleteUser(existingUser2.id);
        }
      }
    } catch (error) {
      console.error("Failed to setup test database:", error);
      throw error;
    }
  });

  afterEach(async () => {
    // Clean up test users after each test
    if (db) {
      if (testUserId) {
        try {
          await deleteUser(testUserId);
          testUserId = null;
        } catch (error) {
          console.error("Failed to cleanup test user:", error);
        }
      }
      if (testUserId2) {
        try {
          await deleteUser(testUserId2);
          testUserId2 = null;
        } catch (error) {
          console.error("Failed to cleanup test user 2:", error);
        }
      }
    }
  });

  // Helper function to create a tRPC request
  const createRequest = (path: string, input: unknown, method = "POST") => {
    // tRPC batch format: batch=1&input={"0":{"json":input}}
    const params = new URLSearchParams({
      batch: "1",
      input: JSON.stringify({
        0: { json: input },
      }),
    });
    const url = `http://localhost:3000/api/trpc/${path}?${params.toString()}`;
    return new Request(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Helper function to parse tRPC response
  const parseResponse = async (response: Response) => {
    const contentType = response.headers.get("Content-Type");

    // Ensure response is JSON
    expect(contentType).toContain("application/json");

    const text = await response.text();

    // Check if response is valid JSON (not HTML)
    expect(() => JSON.parse(text)).not.toThrow();
    expect(text).not.toContain("<!DOCTYPE");
    expect(text).not.toContain("<html");

    return JSON.parse(text);
  };

  describe("Registration API", () => {
    test("should register a new user and return JSON response", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const request = createRequest("auth.register", {
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      expect(response.status).toBe(200);
      const data = await parseResponse(response);

      // Verify response structure
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toBeDefined();
      expect(data[0].result).toBeDefined();
      expect(data[0].result.data).toBeDefined();

      const result = data[0].result.data;
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(TEST_USER.email);
      expect(result.user.firstName).toBe(TEST_USER.firstName);
      expect(result.user.lastName).toBe(TEST_USER.lastName);
      expect(result.message).toBeDefined();

      testUserId = result.user.id;
    });

    test("should prevent duplicate registration and return JSON error", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create first user
      const firstUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
      });
      testUserId = firstUser.id;

      // Try to register duplicate
      const request = createRequest("auth.register", {
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      // Should return error but still JSON
      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].result).toBeDefined();
      expect(data[0].result.data).toBeUndefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("CONFLICT");
      expect(data[0].result.error.message).toContain("already exists");
    });

    test("should validate input and return JSON error for invalid email", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const request = createRequest("auth.register", {
        email: "invalid-email",
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("BAD_REQUEST");
    });

    test("should handle database errors gracefully and return JSON", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create a request with invalid database context
      const request = createRequest("auth.register", {
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
      });

      // Mock context with null database
      const mockCreateContext = async () => ({
        db: null,
        user: null,
        resHeaders: new Headers(),
        origin: "http://localhost:3000",
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: mockCreateContext,
      });

      // Should still return JSON even with database error
      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("INTERNAL_SERVER_ERROR");
    });
  });

  describe("Login API", () => {
    test("should successfully login with correct credentials and return JSON", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create approved user first
      const newUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        status: "approved",
      });
      testUserId = newUser.id;

      const request = createRequest("auth.login", {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      expect(response.status).toBe(200);
      const data = await parseResponse(response);

      // Verify response structure
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].result).toBeDefined();
      expect(data[0].result.data).toBeDefined();

      const result = data[0].result.data;
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(TEST_USER.email);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");

      // Verify Set-Cookie header is present
      const setCookieHeader = response.headers.get("Set-Cookie");
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader).toContain("auth-token=");
    });

    test("should fail login with incorrect password and return JSON error", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create approved user first
      const newUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        status: "approved",
      });
      testUserId = newUser.id;

      const request = createRequest("auth.login", {
        email: TEST_USER.email,
        password: "WrongPassword123!",
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      // Should return error but still JSON
      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("UNAUTHORIZED");
      expect(data[0].result.error.message).toContain(
        "Invalid email or password"
      );
    });

    test("should fail login with non-existent email and return JSON error", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const request = createRequest("auth.login", {
        email: "nonexistent@example.com",
        password: TEST_USER.password,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("UNAUTHORIZED");
    });

    test("should reject login for pending users and return JSON error", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create pending user
      const newUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        status: "pending",
      });
      testUserId = newUser.id;

      const request = createRequest("auth.login", {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("FORBIDDEN");
      expect(data[0].result.error.message).toContain("pending approval");
    });

    test("should handle database unavailability gracefully and return JSON", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const request = createRequest("auth.login", {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      // Mock context with null database
      const mockCreateContext = async () => ({
        db: null,
        user: null,
        resHeaders: new Headers(),
        origin: "http://localhost:3000",
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: mockCreateContext,
      });

      // Should still return JSON even with database error
      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(data[0].result.error.message).toContain(
        "Database connection unavailable"
      );
    });

    test("should handle missing JWT_SECRET gracefully and return JSON error", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create approved user first
      const newUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        status: "approved",
      });
      testUserId = newUser.id;

      // Temporarily remove JWT_SECRET
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const request = createRequest("auth.login", {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      // Restore JWT_SECRET
      process.env.JWT_SECRET = originalSecret;

      // Should still return JSON even with JWT error
      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("INTERNAL_SERVER_ERROR");
    });

    test("should validate input and return JSON error for invalid email format", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const request = createRequest("auth.login", {
        email: "invalid-email",
        password: TEST_USER.password,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      const data = await parseResponse(response);

      expect(data).toBeDefined();
      expect(data[0].result.error).toBeDefined();
      expect(data[0].result.error.code).toBe("BAD_REQUEST");
    });
  });

  describe("JSON Response Guarantees", () => {
    test("should always return JSON content-type header", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const request = createRequest("auth.login", {
        email: "test@example.com",
        password: "password",
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext,
      });

      const contentType = response.headers.get("Content-Type");
      expect(contentType).toContain("application/json");
    });

    test("should never return HTML error pages", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Test various error scenarios
      const scenarios = [
        {
          path: "auth.login",
          input: { email: "invalid", password: "" },
          description: "Invalid input",
        },
        {
          path: "auth.register",
          input: { email: "", password: "", firstName: "", lastName: "" },
          description: "Empty input",
        },
      ];

      for (const scenario of scenarios) {
        const request = createRequest(scenario.path, scenario.input);

        const response = await fetchRequestHandler({
          endpoint: "/api/trpc",
          req: request,
          router: appRouter,
          createContext,
        });

        const text = await response.text();

        // Verify no HTML in response
        expect(text).not.toContain("<!DOCTYPE");
        expect(text).not.toContain("<html");
        expect(text).not.toContain("<body");

        // Verify it's valid JSON
        expect(() => JSON.parse(text)).not.toThrow();

        const data = JSON.parse(text);
        expect(data).toBeDefined();
      }
    });
  });
});
