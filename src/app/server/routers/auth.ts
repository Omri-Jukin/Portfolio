import { z } from "zod";
import { router, procedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  loginUser,
  createUser,
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../../../../lib/db/users/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // 7 days

export const authRouter = router({
  // Register new user (public - requires admin approval)
  register: procedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Create user with pending status
        const newUser = await createUser({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          password: hashedPassword,
          role: "visitor", // Default role for new registrations
          status: "pending", // Requires admin approval
        });

        return {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            status: newUser.status,
          },
          message: "Registration successful! Please wait for admin approval.",
        };
      } catch (error) {
        console.error("Registration error:", error);
        if (
          error instanceof Error &&
          error.message.includes("already exists")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this email already exists",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
    }),

  // Login with email and password (only approved users)
  login: procedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      try {
        // Find user by email
        const user = await loginUser(input);

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

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

        // Verify password
        const isValidPassword = await bcrypt.compare(
          input.password,
          user.password
        );

        if (!isValidPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        // Set HTTP-only cookie
        if (ctx.resHeaders) {
          ctx.resHeaders.set(
            "Set-Cookie",
            `auth-token=${token}; HttpOnly; Path=/; Max-Age=${
              7 * 24 * 60 * 60
            }; SameSite=Strict; Secure=${process.env.NODE_ENV === "production"}`
          );
        }

        // Return user data (without password)
        return {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
          },
          token,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),

  // Get pending users (admin only)
  getPendingUsers: procedure.query(async (opts) => {
    const { ctx } = opts;

    // Check if user is admin
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view pending users",
      });
    }

    try {
      const pendingUsers = await getPendingUsers();
      return pendingUsers.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      }));
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch pending users",
      });
    }
  }),

  // Approve user (admin only)
  approveUser: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      // Check if user is admin
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can approve users",
        });
      }

      try {
        const approvedUser = await approveUser(input.id);
        return {
          user: {
            id: approvedUser.id,
            email: approvedUser.email,
            firstName: approvedUser.firstName,
            lastName: approvedUser.lastName,
            role: approvedUser.role,
            status: approvedUser.status,
          },
          message: "User approved successfully",
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to approve user",
        });
      }
    }),

  // Reject user (admin only)
  rejectUser: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      // Check if user is admin
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can reject users",
        });
      }

      try {
        const rejectedUser = await rejectUser(input.id);
        return {
          user: {
            id: rejectedUser.id,
            email: rejectedUser.email,
            firstName: rejectedUser.firstName,
            lastName: rejectedUser.lastName,
            role: rejectedUser.role,
            status: rejectedUser.status,
          },
          message: "User rejected successfully",
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject user",
        });
      }
    }),

  // Logout (clear cookie)
  logout: procedure.mutation(async (opts) => {
    const { ctx } = opts;

    // Clear the auth cookie
    if (ctx.resHeaders) {
      ctx.resHeaders.set(
        "Set-Cookie",
        "auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
      );
    }

    return { success: true };
  }),

  // Get current user
  me: procedure.query(async (opts) => {
    const { ctx } = opts;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    return {
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        name: ctx.user.name,
        role: ctx.user.role,
      },
    };
  }),

  // Refresh token (optional - for extending session)
  refresh: procedure.mutation(async (opts) => {
    const { ctx } = opts;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      {
        userId: ctx.user.id,
        email: ctx.user.email,
        role: ctx.user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set new cookie
    if (ctx.resHeaders) {
      ctx.resHeaders.set(
        "Set-Cookie",
        `auth-token=${newToken}; HttpOnly; Path=/; Max-Age=${
          7 * 24 * 60 * 60
        }; SameSite=Strict; Secure=${process.env.NODE_ENV === "production"}`
      );
    }

    return {
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        name: ctx.user.name,
        role: ctx.user.role,
      },
      token: newToken,
    };
  }),
});
