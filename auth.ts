import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

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
    async session({ session, token }) {
      // Add custom fields to session from JWT token
      if (session.user && token) {
        session.user.role = "admin";
        session.user.id = token.sub || "";
      }
      return session;
    },
    async jwt({ token, user }) {
      // Store user info in JWT token on first sign in
      if (user) {
        token.role = "admin";
        token.email = user.email || undefined;
        token.name = user.name || undefined;
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
