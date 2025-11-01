/**
 * ⚠️ DEPRECATED TEST FILE ⚠️
 *
 * This test file is for password-based authentication API which has been removed.
 * The application now uses Google OAuth exclusively via NextAuth.js
 *
 * These tests are kept for reference but are commented out.
 *
 * For OAuth authentication testing, see the NextAuth.js documentation:
 * https://next-auth.js.org/getting-started/client#testing
 */

import { describe, test } from "@jest/globals";

describe("Auth API Integration Tests (DEPRECATED - OAuth Only)", () => {
  test("OAuth authentication is now handled by NextAuth.js", () => {
    // This test suite is obsolete.
    // The application now uses Google OAuth exclusively.
    // Password-based authentication API has been removed.
    expect(true).toBe(true);
  });
});

// ==================================================================================
// ORIGINAL PASSWORD-BASED API TESTS - COMMENTED OUT FOR REFERENCE
// ==================================================================================

/*
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

describe("Auth API Integration Tests", () => {
  // ... rest of password-based API tests
});
*/
