import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  getDashboardSections,
  updateDashboardSectionOrder,
  initializeDashboardSections,
} from "$/db/adminDashboard/adminDashboard";

export const adminDashboardRouter = router({
  // Get dashboard sections in order (admin protected)
  getSections: protectedProcedure.query(async (opts) => {
    const { user, db } = opts.ctx;
    if (!db) throw new Error("Database not available");
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await initializeDashboardSections();
    return await getDashboardSections();
  }),

  // Update dashboard section order (admin protected)
  updateSectionOrder: protectedProcedure
    .input(
      z.object({
        sections: z.array(
          z.object({
            sectionKey: z.string(),
            displayOrder: z.number(),
          })
        ),
      })
    )
    .mutation(async (opts) => {
      const { user, db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await updateDashboardSectionOrder(input);
      return { success: true };
    }),
});
