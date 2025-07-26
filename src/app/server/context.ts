import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { createDbClient } from "../../../lib/db/client";
import { D1Database } from "@cloudflare/workers-types";
import jwt from "jsonwebtoken";
import { getUserById } from "../../../lib/db/users/users";

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

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function createContext({
  req,
  resHeaders,
  env,
}: FetchCreateContextFnOptions & { env?: CloudflareEnv }) {
  // Create database client with D1 instance
  const db = env?.DB ? createDbClient(env.DB) : null;

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

      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };

      // Fetch user from database to ensure they still exist and have correct role
      if (db) {
        try {
          const user = await getUserById(decoded.userId);
          if (user && user.role === "admin") {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        } catch (error) {
          console.error("Failed to fetch user from database:", error);
          return null;
        }
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
