import { z } from "zod";
import { router, procedure } from "../trpc";
import {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../../../../lib/db/users/users";

export const usersRouter = router({
  // Authentication
  login: procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      
      const user = await loginUser(input);
      
      // In a real app, generate and return JWT token here
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
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
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
      role: z.enum(["admin", "visitor"]).default("admin"),
    }))
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      return await createUser(input);
    }),

  getById: procedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
      return await getUserById(input.id);
    }),

  update: procedure
    .input(z.object({
      id: z.string(),
      email: z.string().email().optional(),
      name: z.string().optional(),
      password: z.string().min(6).optional(),
    }))
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      
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