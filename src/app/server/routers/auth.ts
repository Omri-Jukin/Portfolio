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
      const startTime = Date.now();

      // Enhanced logging for production debugging
      console.log("[AUTH] Registration attempt started:", {
        email: input.email,
        firstName: input.firstName,
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV,
        hasDb: !!ctx.db,
      });

      // Check database availability first
      if (!ctx.db) {
        console.error(
          "[AUTH] Database connection unavailable during registration"
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection unavailable. Please try again later.",
        });
      }

      try {
        // Check if this is the first user (make them admin)
        let isFirstUser = false;
        try {
          console.log("[AUTH] Checking if this is the first user");
          const existingUsers = await ctx.db.query.users.findMany({
            limit: 1,
          });
          isFirstUser = existingUsers.length === 0;
          console.log("[AUTH] First user check result:", {
            isFirstUser,
            existingUserCount: existingUsers.length,
          });
        } catch (dbError) {
          console.error("[AUTH] Database query failed during registration:", {
            error: dbError instanceof Error ? dbError.message : String(dbError),
            stack: dbError instanceof Error ? dbError.stack : undefined,
            email: input.email,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error. Please try again later.",
          });
        }

        // Create user with appropriate role and status
        // SECURITY: Passwords MUST be provided in plain text from the frontend.
        // createUser() will hash the password exactly once before storing.
        // Never hash passwords before passing them to createUser().
        let newUser;
        try {
          console.log("[AUTH] Attempting to create user:", {
            email: input.email,
            role: isFirstUser ? "admin" : "visitor",
            status: isFirstUser ? "approved" : "pending",
          });

          // Use the database client from context to avoid connection issues
          newUser = await createUser(
            {
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
              password: input.password, // Plain text password - will be hashed once in createUser()
              role: isFirstUser ? "admin" : "visitor", // First user becomes admin
              status: isFirstUser ? "approved" : "pending", // First user is auto-approved
            },
            ctx.db // Pass the database client from context
          );

          console.log("[AUTH] User created successfully:", {
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
          });
        } catch (createError) {
          console.error("[AUTH] Error creating user:", {
            error:
              createError instanceof Error
                ? createError.message
                : String(createError),
            stack: createError instanceof Error ? createError.stack : undefined,
            errorType: createError?.constructor?.name || typeof createError,
            email: input.email,
            // Check if it's a database connection error
            isDbConnectionError:
              createError instanceof Error &&
              (createError.message.includes("DATABASE_URL") ||
                createError.message.includes("Database connection failed") ||
                createError.message.includes("Database client not available")),
          });

          // Handle duplicate user error
          if (
            createError instanceof Error &&
            createError.message.includes("already exists")
          ) {
            console.log("[AUTH] Duplicate user detected");
            throw new TRPCError({
              code: "CONFLICT",
              message: "User with this email already exists",
            });
          }

          // Handle database errors with more specific messaging
          const errorMessage =
            createError instanceof Error
              ? createError.message
              : "Unknown error";
          console.error(
            "[AUTH] Database error during user creation:",
            errorMessage
          );

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error. Please try again later.",
          });
        }

        const duration = Date.now() - startTime;
        console.log("[AUTH] Registration successful:", {
          email: newUser.email,
          userId: newUser.id,
          role: newUser.role,
          status: newUser.status,
          isFirstUser,
          duration: `${duration}ms`,
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
        const duration = Date.now() - startTime;

        // If it's already a TRPCError, log and re-throw it
        if (error instanceof TRPCError) {
          console.error("[AUTH] Registration failed (TRPCError):", {
            code: error.code,
            message: error.message,
            email: input.email,
            duration: `${duration}ms`,
          });
          throw error;
        }

        // Log unexpected errors with full details
        console.error("[AUTH] Unexpected registration error:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          email: input.email,
          duration: `${duration}ms`,
          errorType: error?.constructor?.name || typeof error,
        });

        // Convert any other errors to TRPCError with proper JSON format
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? `Registration failed: ${error.message}`
              : "An unexpected error occurred during registration. Please try again.",
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
      const startTime = Date.now();

      // Enhanced logging for production debugging
      console.log("[AUTH] Login attempt started:", {
        email: input.email,
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV,
        hasDb: !!ctx.db,
        hasUser: !!ctx.user,
      });

      // Check database availability first
      if (!ctx.db) {
        console.error("[AUTH] Database connection unavailable during login");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection unavailable. Please try again later.",
        });
      }

      try {
        // Get JWT secret from context environment
        const JWT_SECRET =
          (ctx as ExtendedContext).env?.JWT_SECRET ||
          process.env.JWT_SECRET ||
          "JWT_SECRET_KEY";
        const NODE_ENV =
          (ctx as ExtendedContext).env?.NODE_ENV ||
          process.env.NODE_ENV ||
          "development";

        console.log("[AUTH] Environment check:", {
          hasJwtSecret: !!JWT_SECRET && JWT_SECRET !== "JWT_SECRET_KEY",
          nodeEnv: NODE_ENV,
          jwtSecretLength: JWT_SECRET?.length || 0,
        });

        if (!JWT_SECRET || JWT_SECRET === "JWT_SECRET_KEY") {
          console.error("[AUTH] JWT_SECRET is not properly configured");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Server configuration error. Please contact support.",
          });
        }

        // Find user by email - pass the database client from context
        let userResult;
        try {
          console.log("[AUTH] Attempting to find user in database");
          userResult = await loginUser(input, ctx.db);
          console.log("[AUTH] User lookup result:", {
            found: !!userResult,
            hasEmail: !!userResult?.email,
          });
        } catch (dbError) {
          console.error("[AUTH] Database error during login:", {
            error: dbError instanceof Error ? dbError.message : String(dbError),
            stack: dbError instanceof Error ? dbError.stack : undefined,
            email: input.email,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error. Please try again later.",
          });
        }

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
          console.error("[AUTH] User password is missing for:", user.email);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        let isValidPassword = false;
        try {
          console.log("[AUTH] Verifying password");
          isValidPassword = await bcrypt.compare(input.password, user.password);
        } catch (bcryptError) {
          console.error("[AUTH] Bcrypt error during password comparison:", {
            error:
              bcryptError instanceof Error
                ? bcryptError.message
                : String(bcryptError),
            email: input.email,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Authentication error. Please try again.",
          });
        }

        if (!isValidPassword) {
          console.error("[AUTH] Password mismatch for user:", user.email);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Generate JWT token
        let token: string;
        try {
          console.log("[AUTH] Generating JWT token");
          const secret = new TextEncoder().encode(JWT_SECRET);
          token = await new jose.SignJWT({
            userId: user.id,
            email: user.email,
            role: user.role,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(JWT_EXPIRES_IN)
            .sign(secret);
          console.log("[AUTH] JWT token generated successfully");
        } catch (jwtError) {
          console.error("[AUTH] JWT signing error:", {
            error:
              jwtError instanceof Error ? jwtError.message : String(jwtError),
            email: user.email,
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Authentication error. Please try again.",
          });
        }

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
          console.log("[AUTH] Cookie set in response headers");
        }

        const duration = Date.now() - startTime;
        console.log("[AUTH] Login successful:", {
          email: user.email,
          userId: user.id,
          role: user.role,
          duration: `${duration}ms`,
        });

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
        const duration = Date.now() - startTime;

        // If it's already a TRPCError, log and re-throw it
        if (error instanceof TRPCError) {
          console.error("[AUTH] Login failed (TRPCError):", {
            code: error.code,
            message: error.message,
            email: input.email,
            duration: `${duration}ms`,
          });
          throw error;
        }

        // Log unexpected errors with full details
        console.error("[AUTH] Unexpected login error:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          email: input.email,
          duration: `${duration}ms`,
          errorType: error?.constructor?.name || typeof error,
        });

        // Convert any other errors to TRPCError with proper JSON format
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? `Login failed: ${error.message}`
              : "An unexpected error occurred during login. Please try again.",
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
