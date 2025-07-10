import { users } from "../schema/schema.tables";
import { eq } from "drizzle-orm";
import { dbClient } from "../client";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../schema/schema.tables";

// Simple types for portfolio user management
export type CreateUserInput = {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateUserInput = {
  id: string;
  email?: string;
  name?: string;
  password?: string;
};

export const createUser = async (input: CreateUserInput) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
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
      password: input.password, // In production, hash this!
      name: input.name,
      role: input.role || "admin",
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
    throw new Error("Database client not available.");
  }

  const user = await dbClient.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user || user.password !== input.password) {
    throw new Error("Invalid email or password.");
  }

  return user;
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

export const updateUser = async (input: UpdateUserInput) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updateData: Partial<typeof users.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.email) updateData.email = input.email;
  if (input.name) updateData.name = input.name;
  if (input.password) updateData.password = input.password;

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
    throw new Error("User not found.");
  }

  return deletedUser[0];
};
