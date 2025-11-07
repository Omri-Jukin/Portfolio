import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getDB } from "./lib/db/client";
import {
  user as nextAuthUserTable,
  users,
} from "./lib/db/schema/schema.tables";
import { eq } from "drizzle-orm";

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

        // Fetch user role from database
        try {
          const db = await getDB();
          if (db && user.email) {
            // First, check if user exists in the "user" table (NextAuth admin users)
            const [nextAuthUser] = await db
              .select()
              .from(nextAuthUserTable)
              .where(eq(nextAuthUserTable.email, user.email))
              .limit(1);

            if (nextAuthUser) {
              // User exists in NextAuth "user" table - they're an admin
              token.role = "admin";
            } else {
              // User not in "user" table, check "users" table (visitors/employers/customers)
              const [dbUser] = await db
                .select({ role: users.role })
                .from(users)
                .where(eq(users.email, user.email))
                .limit(1);

              if (dbUser) {
                // User exists in "users" table, use their role
                token.role = dbUser.role || "visitor";
              } else {
                // User doesn't exist in either table
                // This shouldn't happen for OAuth users (signIn callback should prevent it)
                // But if it does, default to visitor
                token.role = "visitor";
              }
            }
          } else {
            // Database unavailable, default to visitor for security
            token.role = "visitor";
          }
        } catch (error) {
          console.error("Failed to fetch user role from database:", error);
          // On error, default to visitor for security
          token.role = "visitor";
        }
      } else {
        // On subsequent requests, user is undefined but token should already have role
        // Only refresh role if it's missing (to avoid unnecessary DB calls and logs)
        if (token.email && !token.role) {
          try {
            const db = await getDB();
            if (db) {
              // Check "user" table first (admin users)
              const [nextAuthUser] = await db
                .select()
                .from(nextAuthUserTable)
                .where(eq(nextAuthUserTable.email, token.email as string))
                .limit(1);

              if (nextAuthUser) {
                token.role = "admin";
              } else {
                // Check "users" table
                const [dbUser] = await db
                  .select({ role: users.role })
                  .from(users)
                  .where(eq(users.email, token.email as string))
                  .limit(1);

                if (dbUser) {
                  token.role = dbUser.role || "visitor";
                } else {
                  // User not found, keep existing role or default to visitor
                  token.role = (token.role as string) || "visitor";
                }
              }
            }
          } catch (error) {
            console.error("Failed to refresh user role from database:", error);
            // Keep existing role or default to visitor
            token.role = (token.role as string) || "visitor";
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
