import { z } from "zod";
import { router, procedure } from "../trpc";
import {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} from "$/db/users/users";
import { User } from "#/lib/db/users/users.type";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  // Authentication
  login: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      const userResult = await loginUser(input);

      // Check if userResult is an error object or null
      if (
        !userResult ||
        (typeof userResult === "object" &&
          "success" in userResult &&
          !userResult.success)
      ) {
        throw new Error("Invalid email or password");
      }

      // At this point, userResult is guaranteed to be a user object
      const user = userResult as User;

      // Check if user is approved
      if (user.status !== "approved") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            user.status === "pending"
              ? "Your account is pending approval. Please wait for admin approval."
              : "Your account has been rejected. Please contact support.",
        });
      }

      // In a real app, generate and return JWT token here
      return {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        },
        token: "mock-jwt-token", // Replace with real JWT
      };
    }),

  // Get current user
  me: procedure.query(async (opts) => {
    const { user } = opts.ctx;
    if (!user) {
      throw new Error("Not authenticated");
    }

    return user;
  }),

  // Admin routes
  create: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        role: z.enum(["admin", "visitor"]).default("visitor"),
      })
    )
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      // Split the name into firstName and lastName
      const nameParts = input.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // SECURITY: Passwords MUST be provided in plain text from the frontend.
      // createUser() will hash the password exactly once before storing.
      return await createUser({
        email: input.email,
        password: input.password, // Plain text password - will be hashed once in createUser()
        firstName,
        lastName,
        role: input.role,
      });
    }),

  getById: procedure.input(z.object({ id: z.string() })).query(async (opts) => {
    const { db, user } = opts.ctx;
    const { input } = opts;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await getUserById(input.id);
  }),

  update: procedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email().optional(),
        name: z.string().optional(),
        password: z.string().min(6).optional(),
      })
    )
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      // SECURITY: If password is provided, it MUST be in plain text from the frontend.
      // updateUser() will hash the password exactly once before storing.
      return await updateUser(input);
    }),

  delete: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await deleteUser(input.id);
    }),
});
