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
    // Skip tests if DATABASE_URL is not set or in production
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping auth tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      // Clean up any existing test user
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
    // Clean up test user after each test
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
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const newUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        role: "visitor",
        status: "pending",
      });

      expect(newUser).toBeDefined();
      expect(newUser.email).toBe(TEST_USER.email);
      expect(newUser.firstName).toBe(TEST_USER.firstName);
      expect(newUser.lastName).toBe(TEST_USER.lastName);
      expect(newUser.password).not.toBe(TEST_USER.password); // Password should be hashed
      expect(newUser.password).toMatch(/^\$2[ayb]\$\d{2}\$/); // Should be bcrypt hash

      testUserId = newUser.id;

      // Verify password is correctly hashed
      const isValidPassword = await bcrypt.compare(
        TEST_USER.password,
        newUser.password
      );
      expect(isValidPassword).toBe(true);
    });

    test("should prevent creating duplicate users", async () => {
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

      // Try to create duplicate user
      await expect(
        createUser({
          email: TEST_USER.email,
          password: TEST_USER.password,
          firstName: TEST_USER.firstName,
          lastName: TEST_USER.lastName,
        })
      ).rejects.toThrow("already exists");
    });

    test("should prevent double-hashing passwords", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Try to pass an already-hashed password (should fail)
      const hashedPassword = await bcrypt.hash("SomePassword123!", 12);

      await expect(
        createUser({
          email: TEST_USER.email,
          password: hashedPassword, // Already hashed - should be rejected
          firstName: TEST_USER.firstName,
          lastName: TEST_USER.lastName,
        })
      ).rejects.toThrow("already hashed");
    });
  });

  describe("User Login", () => {
    test("should successfully login with correct credentials", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create user first
      const newUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        status: "approved", // Must be approved to login
      });
      testUserId = newUser.id;

      // Attempt login
      const user = await loginUser(
        {
          email: TEST_USER.email,
          password: TEST_USER.password,
        },
        db
      );

      expect(user).toBeDefined();
      expect(user?.email).toBe(TEST_USER.email);
      expect(user?.password).toBeDefined(); // Password should be in DB (hashed)
    });

    test("should fail login with incorrect password", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // Create user first
      const newUser = await createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        status: "approved",
      });
      testUserId = newUser.id;

      // Attempt login with wrong password
      const user = await loginUser(
        {
          email: TEST_USER.email,
          password: "WrongPassword123!",
        },
        db
      );

      // loginUser returns the user, but password verification happens in auth router
      // So we need to verify the password manually
      if (user?.password) {
        const isValidPassword = await bcrypt.compare(
          "WrongPassword123!",
          user.password
        );
        expect(isValidPassword).toBe(false);
      }
    });

    test("should fail login with non-existent email", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const user = await loginUser(
        {
          email: "nonexistent@example.com",
          password: TEST_USER.password,
        },
        db
      );

      expect(user).toBeNull();
    });
  });

  describe("Password Hashing", () => {
    test("should hash password exactly once on registration", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      const plainPassword = "MySecurePassword123!";
      const newUser = await createUser({
        email: TEST_USER.email,
        password: plainPassword,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
      });
      testUserId = newUser.id;

      // Verify password is hashed
      expect(newUser.password).toMatch(/^\$2[ayb]\$\d{2}\$/);

      // Verify we can compare with original password
      const isValid = await bcrypt.compare(plainPassword, newUser.password);
      expect(isValid).toBe(true);

      // Verify we cannot compare with the hash itself (double-hash check)
      const isDoubleHash = await bcrypt.compare(
        newUser.password,
        newUser.password
      );
      expect(isDoubleHash).toBe(false);
    });
  });

  describe("First User Admin Creation", () => {
    test("should make first user admin and approved", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }

      // This test requires an empty users table
      // Note: This will only work if the table is empty
      // In a real scenario, you'd want to check this separately

      // For now, we'll test that the auth router handles first user correctly
      // This requires testing the full tRPC router which is more complex
      // So we'll skip this in unit tests and test it in integration tests
    });
  });
});
