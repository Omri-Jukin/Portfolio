// Do not load dotenv in the Worker. Environment comes from Cloudflare.

import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getToken } from "next-auth/jwt";
import { eq } from "drizzle-orm";
import { getDB, getMockDB } from "$/db/client";
import { users } from "$/db/schema/schema.tables";
import { auth } from "../../../auth";

// User type for authentication
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
}

const DB_CONTEXT_TIMEOUT_MS = 6000;
const OWNER_ADMIN_EMAIL = "omrijukin@gmail.com";

function resolveRole(email: string, role?: string) {
  return role || (email === OWNER_ADMIN_EMAIL ? "admin" : "visitor");
}

function getUserFromSession(sessionUser: {
  id?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}): AuthenticatedUser {
  const name = sessionUser.name || "";

  const email = sessionUser.email || "";

  return {
    id: sessionUser.id || "",
    email,
    name,
    firstName: name.split(" ")[0] || "",
    lastName: name.split(" ").slice(1).join(" ") || "",
    role: resolveRole(email, sessionUser.role),
  };
}

function getUserFromToken(token: Record<string, unknown>): AuthenticatedUser {
  const name = typeof token.name === "string" ? token.name : "";
  const email = typeof token.email === "string" ? token.email : "";
  const role = typeof token.role === "string" ? token.role : undefined;
  const id =
    (typeof token.sub === "string" && token.sub) ||
    (typeof token.id === "string" && token.id) ||
    "";

  return {
    id,
    email,
    name,
    firstName: name.split(" ")[0] || "",
    lastName: name.split(" ").slice(1).join(" ") || "",
    role: resolveRole(email, role),
  };
}

async function resolvePortfolioUser(
  db: Awaited<ReturnType<typeof getDB>> | null,
  sessionUser: AuthenticatedUser | null,
): Promise<AuthenticatedUser | null> {
  if (!db || !sessionUser?.email) {
    return sessionUser;
  }

  try {
    const [portfolioUser] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, sessionUser.email))
      .limit(1);

    if (!portfolioUser) {
      return sessionUser;
    }

    const name =
      `${portfolioUser.firstName} ${portfolioUser.lastName}`.trim() ||
      sessionUser.name;

    return {
      ...sessionUser,
      id: portfolioUser.id,
      email: portfolioUser.email,
      name,
      firstName: portfolioUser.firstName || sessionUser.firstName,
      lastName: portfolioUser.lastName || sessionUser.lastName,
      role: resolveRole(portfolioUser.email, portfolioUser.role),
    };
  } catch (error) {
    console.error("Failed to resolve portfolio user:", error);
    return sessionUser;
  }
}

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  // Create database client (with timeout so dashboard never hangs indefinitely)
  let db: Awaited<ReturnType<typeof getDB>> | null;

  try {
    const dbPromise = getDB();
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error("Database connection timeout")),
        DB_CONTEXT_TIMEOUT_MS,
      ),
    );
    db = await Promise.race([dbPromise, timeoutPromise]);
  } catch (error) {
    console.error("Failed to create database client:", error);

    const isTimeout =
      error instanceof Error &&
      error.message === "Database connection timeout";

    // During build time, allow the app to continue without database connection
    const isBuildTime =
      typeof process !== "undefined" &&
      (process.env.NEXT_PHASE === "phase-production-build" ||
        process.env.NEXT_PHASE === "phase-development-build");

    if (
      isBuildTime ||
      (process.env.NODE_ENV === "production" &&
        !process.env.VERCEL &&
        error instanceof Error &&
        error.message.includes("Database not available during build"))
    ) {
      // Skipping database connection during build time
      db = getMockDB();
    } else if (isTimeout) {
      // Timeout: continue without DB so auth/session still work; dashboard can show default sections
      console.error("Database connection timed out - continuing without DB");
      db = null;
    } else {
      console.error(
        "CRITICAL: Database connection failed - this is required for the app to function",
      );

      if (process.env.NODE_ENV === "production") {
        db = null;
      } else {
        throw new Error(
          `Database connection failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }
  }

  // Get user from Auth.js session
  let user: AuthenticatedUser | null = null;

  try {
    const session = await auth();
    if (session?.user) {
      user = getUserFromSession(session.user);
    }
  } catch (error) {
    console.error("Failed to get Auth.js session:", error);
  }

  if (!user) {
    try {
      const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
        cookieName: "next-auth.session-token",
      });

      if (token) {
        user = getUserFromToken(token);
      }
    } catch (error) {
      console.error("Failed to get session token:", error);
    }
  }

  user = await resolvePortfolioUser(db, user);

  // Extract origin from request for URL generation
  const origin =
    req.headers.get("origin") ||
    (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ||
    (process.env.NODE_ENV === "production"
      ? `https://${
          process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "") ||
          "omrijukin.com"
        }`
      : "http://localhost:3000");

  return {
    db,
    user,
    resHeaders,
    origin,
    req, // Include request for audit logging
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
