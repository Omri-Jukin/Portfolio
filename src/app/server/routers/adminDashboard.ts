import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import {
  getDashboardSections,
  updateDashboardSectionOrder,
  initializeDashboardSections,
  DEFAULT_SECTIONS,
} from "$/db/adminDashboard/adminDashboard";

function getFallbackDashboardSections() {
  const now = new Date().toISOString();

  return DEFAULT_SECTIONS.map((section) => ({
    id: `fallback-${section.sectionKey}`,
    sectionKey: section.sectionKey,
    displayOrder: section.displayOrder,
    enabled: section.enabled,
    createdAt: now,
    updatedAt: now,
  }));
}

export const adminDashboardRouter = router({
  // Get dashboard sections in order (admin protected). When DB is unavailable, return default order so dashboard still renders.
  getSections: adminProcedure.query(async (opts) => {
    const { db } = opts.ctx;
    if (!db) {
      return getFallbackDashboardSections();
    }

    await initializeDashboardSections();
    const sections = await getDashboardSections();
    if (sections.length > 0) {
      return sections;
    }

    console.warn(
      "[adminDashboard] No enabled sections returned from DB. Falling back to default dashboard sections."
    );
    return getFallbackDashboardSections();
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
