import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getDB } from "./lib/db/client";
import {
  user as nextAuthUserTable,
  users,
} from "./lib/db/schema/schema.tables";
import { eq } from "drizzle-orm";

const DB_ROLE_FETCH_TIMEOUT_MS = 4000;

async function fetchRoleFromDBWithTimeout(email: string): Promise<string> {
  const timeout = new Promise<string>((_, reject) =>
    setTimeout(
      () => reject(new Error("Role fetch timeout")),
      DB_ROLE_FETCH_TIMEOUT_MS
    )
  );
  const fetchRole = async (): Promise<string> => {
    const db = await getDB();
    if (!db) return email === "omrijukin@gmail.com" ? "admin" : "visitor";
    const [nextAuthUser] = await db
      .select()
      .from(nextAuthUserTable)
      .where(eq(nextAuthUserTable.email, email))
      .limit(1);
    if (nextAuthUser) return "admin";
    const [dbUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (dbUser?.role) return dbUser.role;
    return email === "omrijukin@gmail.com" ? "admin" : "visitor";
  };
  return Promise.race([fetchRole(), timeout]);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow specific admin email
      if (user.email === "omrijukin@gmail.com") {
        return true;
      }
      return false; // Reject all other users
    },
    async redirect({ url, baseUrl }) {
      // If the URL is the signIn page, redirect to dashboard instead
      if (url.includes("/login") || url.includes("/signin")) {
        return `${baseUrl}/en/dashboard`;
      }

      // If redirect URL is provided and is relative, use it
      if (url.startsWith("/")) {
        // Don't redirect to login/signin pages
        if (url.includes("/login") || url.includes("/signin")) {
          const dashboardUrl = `${baseUrl}/en/dashboard`;
          return dashboardUrl;
        }
        return `${baseUrl}${url}`;
      }

      // If redirect URL is absolute and same origin, use it
      if (url.startsWith(baseUrl)) {
        // Don't redirect to login/signin pages
        if (url.includes("/login") || url.includes("/signin")) {
          return `${baseUrl}/en/dashboard`;
        }
        return url;
      }

      // Default redirect to dashboard
      return `${baseUrl}/en/dashboard`;
    },
    async session({ session, token }) {
      // Add custom fields to session from JWT token
      if (session.user && token) {
        session.user.role = (token.role as string) || "visitor";
        session.user.id = token.sub || "";
      }
      return session;
    },
    async jwt({ token, user }) {
      // On first sign in, user object is provided
      if (user) {
        token.email = user.email || undefined;
        token.name = user.name || undefined;

        // Fetch user role from database (with timeout so redirect never hangs)
        try {
          if (user.email) {
            token.role = await fetchRoleFromDBWithTimeout(user.email);
          } else {
            token.role = "visitor";
          }
        } catch (error) {
          console.error("Failed to fetch user role from database:", error);
          token.role = user.email === "omrijukin@gmail.com" ? "admin" : "visitor";
        }
      } else {
        // On subsequent requests, user is undefined but token should already have role
        // Only refresh role if it's missing (with timeout to avoid hanging)
        if (token.email && !token.role) {
          try {
            token.role = await fetchRoleFromDBWithTimeout(token.email as string);
          } catch (error) {
            console.error("Failed to refresh user role from database:", error);
            token.role = token.email === "omrijukin@gmail.com" ? "admin" : "visitor";
          }
        }
      }

      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // Works for iOS Safari and mobile browsers
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS required in production
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      // CSRF = Cross-Site Request Forgery
      // This is the token that is used to prevent CSRF attacks
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // Base URL for OAuth redirects (important for mobile browsers)
  basePath: "/api/auth",
  // Auth.js v5 uses AUTH_SECRET, fallback to NEXTAUTH_SECRET for compatibility
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  trustHost: true, // Required for Cloudflare Workers
});
