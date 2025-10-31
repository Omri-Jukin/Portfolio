import { z } from "zod";
import { router, procedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  loginUser,
  createUser,
  getPendingUsers,
  approveUser,
  rejectUser,
} from "$/db/users/users";
import * as jose from "jose";
import bcrypt from "bcryptjs";
import { User } from "$/db/users/users.type";

const JWT_EXPIRES_IN = "7d"; // 7 days

// Extend the context type to include environment variables
interface ExtendedContext {
  env?: {
    JWT_SECRET?: string;
    NODE_ENV?: string;
  };
}

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
      const { input, ctx } = opts;

      try {
        // Check if this is the first user (make them admin)
        let isFirstUser = false;
        if (ctx.db) {
          try {
            const existingUsers = await ctx.db.query.users.findMany({
              limit: 1,
            });
            isFirstUser = existingUsers.length === 0;
          } catch (dbError) {
            console.error("Database query failed:", dbError);
            throw new Error(`Database query failed: ${dbError}`);
          }
        } else {
          console.error("No database client available in context");
          throw new Error("Database client not available");
        }

        // Create user with appropriate role and status
        // SECURITY: Passwords MUST be provided in plain text from the frontend.
        // createUser() will hash the password exactly once before storing.
        // Never hash passwords before passing them to createUser().
        const newUser = await createUser({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          password: input.password, // Plain text password - will be hashed once in createUser()
          role: isFirstUser ? "admin" : "visitor", // First user becomes admin
          status: isFirstUser ? "approved" : "pending", // First user is auto-approved
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
          message: isFirstUser
            ? "Admin account created successfully! You can now log in."
            : "Registration successful! Please wait for admin approval.",
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
          message: `Failed to create user: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
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
        // Get JWT secret from context environment
        const JWT_SECRET =
          (ctx as ExtendedContext).env?.JWT_SECRET ||
          process.env.JWT_SECRET ||
          "your-secret-key-change-in-production";
        const NODE_ENV =
          (ctx as ExtendedContext).env?.NODE_ENV ||
          process.env.NODE_ENV ||
          "development";

        // Find user by email - pass the database client from context
        const userResult = await loginUser(input, ctx.db || undefined);

        // Check if userResult is an error object or null
        if (
          !userResult ||
          (typeof userResult === "object" &&
            "success" in userResult &&
            !userResult.success)
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
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

        // Verify password
        if (!user.password) {
          console.error("User password is missing for:", user.email);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        const isValidPassword = await bcrypt.compare(
          input.password,
          user.password
        );

        if (!isValidPassword) {
          console.error("Password mismatch for user:", user.email);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Generate JWT token
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new jose.SignJWT({
          userId: user.id,
          email: user.email,
          role: user.role,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime(JWT_EXPIRES_IN)
          .sign(secret);

        // Set HTTP-only cookie
        if (ctx.resHeaders) {
          const isProduction = NODE_ENV === "production";
          const cookieOptions = [
            `auth-token=${token}`,
            "HttpOnly",
            "Path=/",
            `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
            "SameSite=Lax", // Changed from Strict to Lax for better compatibility
            ...(isProduction ? ["Secure"] : []), // Only add Secure in production
          ].join("; ");

          ctx.resHeaders.set("Set-Cookie", cookieOptions);
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
        console.error("Login error:", error);
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
            email: "email" in approvedUser ? approvedUser.email : "",
            firstName:
              "firstName" in approvedUser ? approvedUser.firstName : "",
            lastName: "lastName" in approvedUser ? approvedUser.lastName : "",
            role: "role" in approvedUser ? approvedUser.role : "visitor",
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
            email: "email" in rejectedUser ? rejectedUser.email : "",
            firstName:
              "firstName" in rejectedUser ? rejectedUser.firstName : "",
            lastName: "lastName" in rejectedUser ? rejectedUser.lastName : "",
            role: "role" in rejectedUser ? rejectedUser.role : "visitor",
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

    // Get NODE_ENV from context environment
    const NODE_ENV =
      (ctx as ExtendedContext).env?.NODE_ENV ||
      process.env.NODE_ENV ||
      "development";

    // Clear the auth cookie
    if (ctx.resHeaders) {
      const isProduction = NODE_ENV === "production";
      const cookieOptions = [
        "auth-token=",
        "HttpOnly",
        "Path=/",
        "Max-Age=0",
        "SameSite=Lax",
        ...(isProduction ? ["Secure"] : []),
      ].join("; ");

      ctx.resHeaders.set("Set-Cookie", cookieOptions);
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

    // Get JWT secret and NODE_ENV from context environment
    const JWT_SECRET =
      (ctx as ExtendedContext).env?.JWT_SECRET ||
      process.env.JWT_SECRET ||
      "your-secret-key-change-in-production";
    const NODE_ENV =
      (ctx as ExtendedContext).env?.NODE_ENV ||
      process.env.NODE_ENV ||
      "development";

    // Generate new token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const newToken = await new jose.SignJWT({
      userId: ctx.user.id,
      email: ctx.user.email,
      role: ctx.user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(secret);

    // Set new cookie
    if (ctx.resHeaders) {
      const isProduction = NODE_ENV === "production";
      const cookieOptions = [
        `auth-token=${newToken}`,
        "HttpOnly",
        "Path=/",
        `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
        "SameSite=Lax", // Changed from Strict to Lax for better compatibility
        ...(isProduction ? ["Secure"] : []), // Only add Secure in production
      ].join("; ");

      ctx.resHeaders.set("Set-Cookie", cookieOptions);
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
