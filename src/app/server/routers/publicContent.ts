import { z } from "zod";
import { router, procedure, editorProcedure } from "../trpc";
import { PublicContentBlockManager } from "$/db/publicContent/PublicContentBlockManager";
import { canEditContentSync } from "#/lib/auth/rbac";

const PublicContentBlockTypeSchema = z.enum([
  "section",
  "hero",
  "metric",
  "card",
  "link",
  "question",
  "list",
  "cta",
]);

const UpdatePublicContentBlockSchema = z.object({
  page: z.string().min(1).max(100).optional(),
  locale: z.string().min(2).max(12).optional(),
  sectionKey: z.string().min(1).max(100).optional(),
  blockKey: z.string().min(1).max(100).optional(),
  blockType: PublicContentBlockTypeSchema.optional(),
  title: z.string().max(1000).nullable().optional(),
  subtitle: z.string().max(2000).nullable().optional(),
  body: z.string().max(8000).nullable().optional(),
  href: z.string().max(1000).nullable().optional(),
  ctaLabel: z.string().max(200).nullable().optional(),
  items: z.array(z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

function canReadHiddenContent(role: string | undefined) {
  return canEditContentSync(role || "visitor");
}

export const publicContentRouter = router({
  getByPage: procedure
    .input(
      z.object({
        page: z.string().min(1).max(100),
        locale: z.string().min(2).max(12).default("en"),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return PublicContentBlockManager.getByPage({
        ...input,
        visibleOnly: input.visibleOnly || !canReadHiddenContent(ctx.user?.role),
      });
    }),

  getBySection: procedure
    .input(
      z.object({
        page: z.string().min(1).max(100),
        sectionKey: z.string().min(1).max(100),
        locale: z.string().min(2).max(12).default("en"),
        visibleOnly: z.boolean().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      return PublicContentBlockManager.getBySection({
        ...input,
        visibleOnly: input.visibleOnly || !canReadHiddenContent(ctx.user?.role),
      });
    }),

  getAllAdmin: editorProcedure.query(async () => {
    return PublicContentBlockManager.getAllAdmin();
  }),

  update: editorProcedure
    .input(
      z.object({
        id: z.string().min(1),
        data: UpdatePublicContentBlockSchema,
      })
    )
    .mutation(async ({ input }) => {
      return PublicContentBlockManager.update(input.id, input.data);
    }),

  reorder: editorProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            id: z.string().min(1),
            displayOrder: z.number().int().min(0),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      await PublicContentBlockManager.updateDisplayOrder(input.updates);
      return { success: true };
    }),
});
