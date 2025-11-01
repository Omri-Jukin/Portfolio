import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDB } from "$/db/client";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(await getDB()) as Adapter,
  providers: [
    GoogleProvider({
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
    async session({ session, user }) {
      // Add custom fields to session
      if (session.user) {
        session.user.role = "admin";
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user info to JWT token
      if (user) {
        token.role = "admin";
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
