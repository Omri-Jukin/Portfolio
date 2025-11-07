import { adminProcedure, router } from "../trpc";
import { z } from "zod";

export const adminBlogRouter = router({
  // Example protected admin procedure
  secretAdminAction: adminProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      // Only accessible to authenticated admins
      return { result: `Admin says: ${input.message}` };
    }),
});
