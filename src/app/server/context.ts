import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import {
  createDbClient,
  createDbClientWithFallback,
  getEnvFromGlobal,
  debugGlobalScope,
} from "../../../lib/db/client";
import { D1Database } from "@cloudflare/workers-types";
import jwt from "jsonwebtoken";
import { getUserById } from "$/db/users/users";

// Type for Cloudflare environment
interface CloudflareEnv {
  DB: D1Database;
  JWT_SECRET?: string;
  NODE_ENV?: string;
}

// User type for authentication
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createContext({
  req,
  resHeaders,
  env,
}: FetchCreateContextFnOptions & { env?: CloudflareEnv }) {
  // Debug global scope to see what's available
  debugGlobalScope();

  // Create database client with D1 instance
  console.log("Context creation - env check:", {
    hasEnv: !!env,
    hasDB: !!env?.DB,
    envKeys: env ? Object.keys(env) : [],
  });

  // Try to get D1 database from env parameter first (Cloudflare Workers way)
  const d1Database = env?.DB;
  let db: ReturnType<typeof createDbClient> | null = null;

  if (d1Database) {
    db = createDbClient(d1Database);
    console.log("Database client created from env");
  } else {
    // Try using the new fallback method
    db = createDbClientWithFallback();
    console.log("Database client created from fallback:", !!db);
  }

  // Try multiple ways to access JWT_SECRET in Cloudflare Workers
  let JWT_SECRET = env?.JWT_SECRET;
  if (!JWT_SECRET) {
    JWT_SECRET = getEnvFromGlobal("JWT_SECRET");
  }
  if (!JWT_SECRET) {
    // Fallback to process.env (for development)
    JWT_SECRET = process.env.JWT_SECRET;
  }

  // Get NODE_ENV from environment
  let NODE_ENV = env?.NODE_ENV;
  if (!NODE_ENV) {
    NODE_ENV = getEnvFromGlobal("NODE_ENV");
  }
  if (!NODE_ENV) {
    NODE_ENV = process.env.NODE_ENV || "development";
  }

  // Debug logging
  console.log("Context Debug:", {
    hasDB: !!env?.DB,
    hasGlobalDB: !!(globalThis as Record<string, unknown>).DB,
    hasEnvJWT_SECRET: !!env?.JWT_SECRET,
    hasGlobalJWT_SECRET: !!getEnvFromGlobal("JWT_SECRET"),
    hasProcessJWT_SECRET: !!process.env.JWT_SECRET,
    NODE_ENV,
    JWT_SECRET_LENGTH: JWT_SECRET?.length || 0,
    JWT_SECRET_START: JWT_SECRET?.substring(0, 10) || "none",
    databaseClientCreated: !!db,
  });

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
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };

      // Fetch user from database to ensure they still exist and have correct role
      try {
        let user;
        if (db) {
          // Try with database client first
          user = await getUserById(decoded.userId, db);
        } else if (NODE_ENV === "development") {
          // Fallback to local D1 in development
          const { findUserByIdLocal } = await import(
            "../../../lib/db/remote-client"
          );
          user = await findUserByIdLocal(decoded.userId);
          if (user) {
            // Map the local user data to match the expected format
            user = {
              id: user.id,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
              status: user.status,
            };
          }
        } else {
          // In production, if no database client is available, we can't proceed
          console.error("No database client available in production");
          return null;
        }

        if (user && user.role === "admin") {
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
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
