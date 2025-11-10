/**
 * Test helper utilities for creating mock tRPC contexts
 */

import type { Context } from "@/app/server/context";
import { getDB } from "$/db/client";
import { randomUUID } from "crypto";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: "admin" | "editor" | "user" | "visitor";
}

export interface MockRequest {
  headers: Headers;
}

/**
 * Create a mock request object for testing
 */
export function createMockRequest(
  overrides?: Partial<MockRequest>
): MockRequest {
  const headers = new Headers();
  headers.set("origin", "http://localhost:3000");
  headers.set("host", "localhost:3000");

  return {
    headers,
    ...overrides,
  };
}

/**
 * Create a test context with optional user and database
 */
export async function createTestContext(
  user?: MockUser | null,
  db?: Awaited<ReturnType<typeof getDB>> | null
): Promise<Context> {
  const mockRequest = createMockRequest();

  // Get database if not provided
  let database = db;
  if (!database) {
    try {
      database = await getDB();
    } catch (error) {
      console.warn("Failed to get database in test context:", error);
      database = null;
    }
  }

  return {
    db: database,
    user: user || null,
    resHeaders: new Headers(),
    origin: "http://localhost:3000",
    req: mockRequest as unknown as Request,
  };
}

/**
 * Generate a valid UUID for testing
 */
export function generateTestUUID(): string {
  return randomUUID();
}

/**
 * Create a test user in the database for foreign key constraints
 */
export async function createTestUserInDb(
  db: Awaited<ReturnType<typeof getDB>>,
  user: MockUser
): Promise<string> {
  if (!db) {
    throw new Error("Database not available");
  }

  const { createUser } = await import("$/db/users/users");
  const { users } = await import("$/db/schema/schema.tables");
  const { eq } = await import("drizzle-orm");

  // Check if user already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email))
    .limit(1);

  if (existing.length > 0) {
    return existing[0]!.id;
  }

  // Create new user
  const created = await createUser(
    {
      email: user.email,
      password: "test-password-123",
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: "approved",
    },
    db
  );

  return created.id;
}

/**
 * Create a mock admin user
 */
export function createMockAdminUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: overrides?.id || generateTestUUID(),
    email: "admin@test.com",
    name: "Test Admin",
    firstName: "Test",
    lastName: "Admin",
    role: "admin",
    ...overrides,
  };
}

/**
 * Create a mock editor user
 */
export function createMockEditorUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: overrides?.id || generateTestUUID(),
    email: "editor@test.com",
    name: "Test Editor",
    firstName: "Test",
    lastName: "Editor",
    role: "editor",
    ...overrides,
  };
}

/**
 * Create a mock visitor user
 */
export function createMockVisitorUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: overrides?.id || generateTestUUID(),
    email: "visitor@test.com",
    name: "Test Visitor",
    firstName: "Test",
    lastName: "Visitor",
    role: "visitor",
    ...overrides,
  };
}
