import { users } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import { dbClient } from "../client";
import { v4 as uuidv4 } from "uuid";
import { UserRole, UserStatus } from "../schema/schema.tables";
import {
  insertUser as insertUserRemote,
  findUserByEmail as findUserByEmailRemote,
} from "../remote-client";

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
  if (!dbClient) {
    console.error("DB CLIENT IS NULL! Check your Wrangler/D1 setup.");
    console.log("Attempting to use remote D1 database...");

    // In development, we can use remote D1 commands
    if (process.env.NODE_ENV === "development") {
      try {
        // Check if user already exists
        const existingUser = await findUserByEmailRemote(input.email);
        if (existingUser) {
          throw new Error("User with this email already exists.");
        }

        // Create user using remote D1
        const userId = uuidv4();
        await insertUserRemote({
          id: userId,
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role || "visitor",
          status: input.status || "pending",
        });

        // Return the created user
        return {
          id: userId,
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role || "visitor",
          status: input.status || "pending",
          createdAt: new Date(),
        };
      } catch (error) {
        console.error("Remote D1 createUser failed:", error);
        throw error;
      }
    }

    throw new Error(
      "Database client not available. Please use 'npx wrangler dev --local' for development."
    );
  }

  // Check if user already exists
  const existingUser = await dbClient.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const newUser = await dbClient
    .insert(users)
    .values({
      id: uuidv4(),
      email: input.email,
      password: input.password, // This should be hashed before calling this function
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role || "visitor",
      status: input.status || "pending",
      createdAt: new Date(),
    })
    .returning();

  if (!newUser.length) {
    throw new Error("Failed to create user.");
  }

  return newUser[0];
};

export const loginUser = async (input: LoginInput) => {
  if (!dbClient) {
    console.log("Using remote D1 for loginUser...");

    // In development, use remote D1
    if (process.env.NODE_ENV === "development") {
      try {
        const user = await findUserByEmailRemote(input.email);
        return user;
      } catch (error) {
        console.error("Remote D1 loginUser failed:", error);
        return null;
      }
    }

    throw new Error("Database client not available.");
  }

  const user = await dbClient.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    return null; // Return null instead of throwing error for better error handling
  }

  return user; // Return the full user object, password verification should be done in the auth router
};

export const getUserById = async (id: string) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const user = await dbClient.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const getPendingUsers = async () => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const pendingUsers = await dbClient.query.users.findMany({
    where: eq(users.status, "pending"),
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  return pendingUsers;
};

export const approveUser = async (id: string) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
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
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updateData: Partial<typeof users.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.email) updateData.email = input.email;
  if (input.firstName) updateData.firstName = input.firstName;
  if (input.lastName) updateData.lastName = input.lastName;
  if (input.password) updateData.password = input.password;
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
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deletedUser = await dbClient
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  if (!deletedUser.length) {
    throw new Error("Failed to delete user.");
  }

  return deletedUser[0];
};
