import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const adminBlogRouter = router({
  // Example protected admin procedure
  secretAdminAction: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      // Only accessible to authenticated admins
      return { result: `Admin says: ${input.message}` };
    }),
});
