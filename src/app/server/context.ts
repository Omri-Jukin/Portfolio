// Do not load dotenv in the Worker. Environment comes from Cloudflare.

import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDB, getMockDB } from "$/db/client";
import * as jose from "jose";
import { getUserById } from "$/db/users/users";

// User type for authentication
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  // Create database client
  let db: Awaited<ReturnType<typeof getDB>> | null;

  try {
    // Use Cloudflare D1 (both local and production)
    db = await getDB();
  } catch (error) {
    console.error("Failed to create database client:", error);

    // During build time, allow the app to continue without database connection
    if (
      process.env.NODE_ENV === "production" &&
      !process.env.VERCEL &&
      error instanceof Error &&
      error.message.includes("Database not available during build")
    ) {
      console.warn("Skipping database connection during build time");
      // Return a mock database client for build time
      db = getMockDB();
    } else {
      console.error(
        "CRITICAL: Database connection failed - this is required for the app to function"
      );

      // Database connection is mandatory - throw error to prevent app from running
      throw new Error(
        `Database connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get JWT_SECRET from Cloudflare context or process.env in dev
  const JWT_SECRET =
    (globalThis as { __env?: { JWT_SECRET?: string } }).__env?.JWT_SECRET ||
    process.env.JWT_SECRET;

  if (!JWT_SECRET || JWT_SECRET === "your-secret-key-change-in-production") {
    console.error("JWT_SECRET is not properly configured");
  }

  // Get user from JWT token in cookies
  async function getUserFromToken(): Promise<AuthenticatedUser | null> {
    try {
      // Get token from cookies
      const cookieHeader = req.headers.get("cookie");
      if (!cookieHeader) return null;

      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const token = cookies["auth-token"];
      if (!token) return null;

      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
      }

      // Verify JWT token
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);

      // Type guard for payload structure
      if (
        !payload ||
        typeof payload !== "object" ||
        !("userId" in payload) ||
        !("email" in payload) ||
        !("role" in payload)
      ) {
        throw new Error("Invalid token payload structure");
      }

      const decoded = {
        userId: String(payload.userId),
        email: String(payload.email),
        role: String(payload.role),
      };

      // Fetch user from database to ensure they still exist and have correct role
      try {
        // Skip user fetching during build time when database is not available
        if (!db) {
          console.warn("Skipping user fetch during build time");
          return null;
        }

        // Database client is guaranteed to be available
        const user = await getUserById(decoded.userId, db);

        if (user && user.role === "admin") {
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
        }
      } catch (error) {
        console.error("Failed to fetch user from database:", error);
        return null;
      }

      return null;
    } catch (error) {
      // Token is invalid or expired
      console.error("JWT verification failed:", error);
      return null;
    }
  }

  const user = await getUserFromToken();

  return {
    db,
    user,
    resHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
