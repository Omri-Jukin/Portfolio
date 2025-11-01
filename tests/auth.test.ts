/**
 * ⚠️ DEPRECATED TEST FILE ⚠️
 *
 * This test file is for password-based authentication which has been removed.
 * The application now uses Google OAuth exclusively via NextAuth.js
 *
 * These tests are kept for reference but are commented out.
 *
 * For OAuth authentication testing, see the NextAuth.js documentation:
 * https://next-auth.js.org/getting-started/client#testing
 */

import { describe, test } from "@jest/globals";

describe("Authentication Flow (DEPRECATED - OAuth Only)", () => {
  test("OAuth authentication is now handled by NextAuth.js", () => {
    // This test suite is obsolete.
    // The application now uses Google OAuth exclusively.
    // Password-based authentication has been removed.
    expect(true).toBe(true);
  });
});

// ==================================================================================
// ORIGINAL PASSWORD-BASED TESTS - COMMENTED OUT FOR REFERENCE
// ==================================================================================

/*
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { createUser, loginUser, deleteUser } from "../lib/db/users/users";
import { getDB } from "../lib/db/client";
import { eq } from "drizzle-orm";
import { users } from "../lib/db/schema/schema.tables";
import bcrypt from "bcryptjs";

// Test credentials
const TEST_USER = {
  email: "test-auth@example.com",
  password: "TestPassword123!",
  firstName: "Test",
  lastName: "User",
};

describe("Authentication Flow", () => {
  let testUserId: string | null = null;
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping auth tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (db) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, TEST_USER.email),
        });
        if (existingUser) {
          await deleteUser(existingUser.id);
        }
      }
    } catch (error) {
      console.error("Failed to setup test database:", error);
      throw error;
    }
  });

  afterEach(async () => {
    if (db && testUserId) {
      try {
        await deleteUser(testUserId);
        testUserId = null;
      } catch (error) {
        console.error("Failed to cleanup test user:", error);
      }
    }
  });

  describe("User Registration", () => {
    test("should create a new user with hashed password", async () => {
      // ... rest of tests
    });
  });
});
*/
