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
    async signIn({ user, account }) {
      // Only allow specific admin email
      if (user.email === "omrijukin@gmail.com") {
        console.log("[AUTH] Admin user sign in:", {
          email: user.email,
          provider: account?.provider,
        });
        return true;
      }

      console.log("[AUTH] Unauthorized sign in attempt:", {
        email: user.email,
        provider: account?.provider,
      });
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Temporarily enabled for debugging
  trustHost: true, // Required for Cloudflare Workers
});
