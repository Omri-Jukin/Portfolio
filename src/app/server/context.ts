// Do not load dotenv in the Worker. Environment comes from Cloudflare.

import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDB } from "$/db/client";
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
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  try {
    // Use Cloudflare D1 (both local and production)
    db = await getDB();
  } catch (error) {
    console.error("Failed to create database client:", error);

    // In development, we'll skip database operations for now
    // This allows the app to run without D1 binding
    if (process.env.NODE_ENV === "development") {
      console.log("Running in development mode without D1 binding");
      db = null;
    } else {
      db = null;
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
      const decoded = payload as {
        userId: string;
        email: string;
        role: string;
      };

      // Fetch user from database to ensure they still exist and have correct role
      try {
        let user;
        if (db) {
          // This is a D1 database, safe to pass to getUserById
          user = await getUserById(decoded.userId, db);
        } else {
          // If no database client is available, we can't proceed
          console.error("No database client available");
          return null;
        }

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
