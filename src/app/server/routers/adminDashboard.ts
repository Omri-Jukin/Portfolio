import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import {
  getDashboardSections,
  updateDashboardSectionOrder,
  initializeDashboardSections,
  DEFAULT_SECTIONS,
} from "$/db/adminDashboard/adminDashboard";

export const adminDashboardRouter = router({
  // Get dashboard sections in order (admin protected). When DB is unavailable, return default order so dashboard still renders.
  getSections: adminProcedure.query(async (opts) => {
    const { db } = opts.ctx;
    if (!db) {
      const now = new Date().toISOString();
      return DEFAULT_SECTIONS.map((s) => ({
        id: `fallback-${s.sectionKey}`,
        sectionKey: s.sectionKey,
        displayOrder: s.displayOrder,
        enabled: s.enabled,
        createdAt: now,
        updatedAt: now,
      }));
    }

    await initializeDashboardSections();
    return await getDashboardSections();
  }),

  // Update dashboard section order (admin protected)
  updateSectionOrder: adminProcedure
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
      const { db } = opts.ctx;
      const { input } = opts;
      if (!db) throw new Error("Database not available");

      await updateDashboardSectionOrder(input);
      return { success: true };
    }),
});
