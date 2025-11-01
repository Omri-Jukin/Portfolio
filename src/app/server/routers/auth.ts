import { router, procedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  // Get current user from session
  me: procedure.query(async (opts) => {
    const { ctx } = opts;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    return {
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        name: ctx.user.name,
        role: ctx.user.role,
      },
    };
  }),

  // Logout is handled by NextAuth signOut on client side
  // This endpoint can be used for additional cleanup if needed
  logout: procedure.mutation(async () => {
    // NextAuth handles session cleanup
    // This is kept for backward compatibility
    return { success: true };
  }),
});
