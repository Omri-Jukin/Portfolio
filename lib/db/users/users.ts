import { eq } from "drizzle-orm";
import { getDB } from "../client";
import { users } from "../schema/schema.tables";
import { UserRole, UserStatus } from "../schema/schema.types";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
// Removed remote-client fallbacks to avoid Node polyfills in edge runtime

/**
 * ============================================================================
 * PASSWORD HANDLING CONTRACT
 * ============================================================================
 *
 * SECURITY RULE: Passwords MUST be provided in PLAIN TEXT from the frontend.
 *
 * Flow:
 * 1. Frontend sends plain text password → tRPC API → Database functions
 * 2. Database functions (createUser, updateUser) hash the password ONCE using bcrypt
 * 3. Hashed password is stored in the database
 *
 * NEVER:
 * - Hash passwords on the frontend
 * - Hash passwords before passing to createUser() or updateUser()
 * - Pass already-hashed passwords to these functions
 *
 * The ensurePasswordHashedOnce() function will detect and reject
 * already-hashed passwords to prevent double-hashing.
 *
 * ============================================================================
 */

/**
 * Checks if a password string is already hashed (bcrypt format).
 * Bcrypt hashes start with $2a$, $2b$, or $2y$ followed by cost and salt.
 */
function isPasswordHashed(password: string): boolean {
  return /^\$2[ayb]\$\d{2}\$/.test(password);
}

/**
 * Ensures a password is hashed exactly once.
 * If the password is already hashed, it throws an error.
 * This prevents double-hashing scenarios.
 */
async function ensurePasswordHashedOnce(
  plainPassword: string
): Promise<string> {
  if (isPasswordHashed(plainPassword)) {
    throw new Error(
      "Password is already hashed. Passwords must be provided in plain text and will be hashed automatically."
    );
  }
  return await bcrypt.hash(plainPassword, 12);
}

// Simple types for portfolio user management
export type CreateUserInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  status?: UserStatus;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateUserInput = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
};

export const createUser = async (input: CreateUserInput) => {
  try {
    const dbClient = await getDB();

    // Check if user already exists
    const existingUser = await dbClient.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // Hash password once - ensure it's not already hashed
    // Passwords MUST be provided in plain text from the frontend
    const hashedPassword = await ensurePasswordHashedOnce(input.password);

    const newUser = await dbClient
      .insert(users)
      .values({
        id: uuidv4(),
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role || "visitor",
        status: input.status || "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newUser[0]) {
      throw new Error("Failed to create user.");
    }

    return newUser[0];
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error(
      "Database client not available. Please check your Supabase DATABASE_URL configuration."
    );
  }
};

export const loginUser = async (
  input: LoginInput,
  db?: Awaited<ReturnType<typeof getDB>>
) => {
  // Use the provided db client (from context) or try to get a new one
  let client: Awaited<ReturnType<typeof getDB>> | null = db || null;
  if (!client) {
    try {
      client = await getDB();
    } catch (error) {
      console.error("Failed to get database client:", error);
      client = null;
    }
  }

  if (!client) {
    if (process.env.NODE_ENV === "development") {
      // No local fallback; require Supabase connection
    }

    // In production, we can't use shell commands, so we need to throw an error
    // The database client should be available from the context in production
    throw new Error(
      "Database client not available. Please check your Supabase DATABASE_URL configuration."
    );
  }

  try {
    const user = await client.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      return null; // Return null instead of throwing error for better error handling
    }

    return user; // Return the full user object, password verification should be done in the auth router
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export const getUserById = async (
  id: string,
  db?: Awaited<ReturnType<typeof getDB>>
) => {
  // Use the provided db client (from context) or try to get a new one
  let client: Awaited<ReturnType<typeof getDB>> | null = db || null;
  if (!client) {
    try {
      client = await getDB();
    } catch (error) {
      console.error("Failed to get database client:", error);
      client = null;
    }
  }

  if (!client) {
    if (process.env.NODE_ENV === "development") {
      // No local fallback; require Supabase connection
    }

    // In production, we can't use shell commands, so we need to throw an error
    throw new Error(
      "Database client not available. Please check your Supabase DATABASE_URL configuration."
    );
  }

  const user = await client.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const getPendingUsers = async () => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    if (process.env.NODE_ENV === "development") {
      // No remote fallback; require Supabase connection
    }

    throw new Error(
      "Database client not available. Please check your Supabase DATABASE_URL configuration."
    );
  }

  const pendingUsers = await dbClient.query.users.findMany({
    where: eq(users.status, "pending"),
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  return pendingUsers;
};

export const approveUser = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    if (process.env.NODE_ENV === "development") {
      // No remote fallback; require Supabase connection
    }

    throw new Error(
      "Database client not available. Please check your Supabase DATABASE_URL configuration."
    );
  }

  const updatedUser = await dbClient
    .update(users)
    .set({
      status: "approved",
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser.length) {
    throw new Error("Failed to approve user.");
  }

  return updatedUser[0];
};

export const rejectUser = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updatedUser = await dbClient
    .update(users)
    .set({
      status: "rejected",
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser.length) {
    throw new Error("Failed to reject user.");
  }

  return updatedUser[0];
};

export const updateUser = async (input: UpdateUserInput) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updateData: Partial<typeof users.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.email) updateData.email = input.email;
  if (input.firstName) updateData.firstName = input.firstName;
  if (input.lastName) updateData.lastName = input.lastName;
  if (input.password) {
    // Hash password once - ensure it's not already hashed
    // Passwords MUST be provided in plain text from the frontend
    updateData.password = await ensurePasswordHashedOnce(input.password);
  }
  if (input.role) updateData.role = input.role;
  if (input.status) updateData.status = input.status;

  const updatedUser = await dbClient
    .update(users)
    .set(updateData)
    .where(eq(users.id, input.id))
    .returning();

  if (!updatedUser.length) {
    throw new Error("Failed to update user.");
  }

  return updatedUser[0];
};

export const deleteUser = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deletedUser = await dbClient
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  if (!deletedUser.length) {
    throw new Error("User not found.");
  }

  return deletedUser[0];
};
