import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { createDbClient } from "../../../lib/db/client";
import { D1Database } from "@cloudflare/workers-types";
import jwt from "jsonwebtoken";
import { getUserById } from "$/db/users/users";
import { executeRemoteD1Query } from "$/db/remote-client";

// Load environment variables
import dotenv from "dotenv";

// Load .env.local first, then .env, then .env.example
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// Type for Cloudflare environment
interface CloudflareEnv extends D1Database {
  DB: D1Database; // D1 Database
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
  // Create database client with D1 instance
  const db = env?.DB ? createDbClient(env.DB) : null;

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  // Get JWT secret from environment (works in both development and production)
  const JWT_SECRET = process.env.JWT_SECRET;

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
        } else if (process.env.NODE_ENV === "development") {
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
        } else if (process.env.NODE_ENV === "production") {
          // Fallback to remote D1 in production
          const results = await executeRemoteD1Query(
            `SELECT * FROM users WHERE id = '${decoded.userId}';`
          );

          if (results.length > 0) {
            const userData = results[0];
            user = {
              id: userData.id,
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              role: userData.role,
              status: userData.status,
            };
          }
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
