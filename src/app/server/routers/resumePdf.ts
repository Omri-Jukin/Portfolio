import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, editorProcedure } from "../trpc";
import { CertificationsService } from "$/db/certifications/certifications";
import { EducationManager } from "$/db/Education/EducationManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { PublicContentBlockManager } from "$/db/publicContent/PublicContentBlockManager";
import { SkillManager } from "$/db/skills/SkillManager";
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";
import type { ResumePdfSectionKey } from "$/types";

const ResumePdfItemTypeSchema = z.enum([
  "profileBlock",
  "workExperience",
  "project",
  "skill",
  "education",
  "certification",
]);

const ResumePdfSectionKeySchema = z.enum([
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "additionalExperience",
]);

const DEFAULT_PDF_SECTION_ORDER: ResumePdfSectionKey[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "additionalExperience",
  "education",
  "certifications",
];

function normalizePdfSectionOrder(value: unknown): ResumePdfSectionKey[] {
  const allowed = new Set<ResumePdfSectionKey>(DEFAULT_PDF_SECTION_ORDER);
  const seen = new Set<ResumePdfSectionKey>();
  const ordered: ResumePdfSectionKey[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item !== "string") continue;
      const section = item as ResumePdfSectionKey;
      if (!allowed.has(section) || seen.has(section)) continue;
      ordered.push(section);
      seen.add(section);
    }
  }

  return [
    ...ordered,
    ...DEFAULT_PDF_SECTION_ORDER.filter((item) => !seen.has(item)),
  ];
}

async function getResumeProfileBlock() {
  const blocks = await PublicContentBlockManager.getBySection({
    page: "resume",
    sectionKey: "profile",
    locale: "en",
    visibleOnly: false,
  });

  return blocks.find((block) => block.blockKey === "profile") ?? null;
}

function getBlockMetadata(block: { metadata: unknown }) {
  return block.metadata && typeof block.metadata === "object"
    ? block.metadata
    : {};
}

export const resumePdfRouter = router({
  getOverview: editorProcedure.query(async () => {
    const [
      profileBlocks,
      workExperiences,
      projects,
      skills,
      education,
      certifications,
    ] = await Promise.all([
      PublicContentBlockManager.getBySection({
        page: "resume",
        sectionKey: "profile",
        locale: "en",
        visibleOnly: false,
      }),
      WorkExperienceManager.getAll(false),
      ProjectManager.getAll(false),
      SkillManager.getAll(false),
      EducationManager.getAll(false),
      CertificationsService.getAll(false),
    ]);
    const profile = profileBlocks.find((block) => block.blockKey === "profile");
    const metadata = profile ? getBlockMetadata(profile) : {};

    return {
      profileBlocks,
      workExperiences,
      projects,
      skills,
      education,
      certifications,
      pdfSectionOrder: normalizePdfSectionOrder(
        (metadata as { pdfSectionOrder?: unknown }).pdfSectionOrder
      ),
    };
  }),

  toggleInclusion: editorProcedure
    .input(
      z.object({
        type: ResumePdfItemTypeSchema,
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      switch (input.type) {
        case "profileBlock": {
          const block = await PublicContentBlockManager.getById(input.id);
          if (!block) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Resume profile block not found",
            });
          }

          return PublicContentBlockManager.update(input.id, {
            isFeatured: !block.isFeatured,
          });
        }

        case "workExperience": {
          const updated = await WorkExperienceManager.toggleResumeFeatured(
            input.id
          );
          if (!updated) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Work experience not found",
            });
          }
          return updated;
        }

        case "project": {
          const updated = await ProjectManager.toggleResumeFeatured(input.id);
          if (!updated) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Project not found",
            });
          }
          return updated;
        }

        case "skill": {
          const updated = await SkillManager.toggleResumeFeatured(input.id);
          if (!updated) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Skill not found",
            });
          }
          return updated;
        }

        case "education":
          return EducationManager.toggleResumeFeatured(input.id);

        case "certification": {
          const updated = await CertificationsService.toggleResumeFeatured(
            input.id
          );
          if (!updated) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Certification not found",
            });
          }
          return updated;
        }
      }
    }),

  toggleDateFormat: editorProcedure.mutation(async () => {
    const profile = await getResumeProfileBlock();

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resume profile block not found",
      });
    }

    const metadata = getBlockMetadata(profile);
    const currentFormat =
      (metadata as { pdfDateFormat?: unknown }).pdfDateFormat === "year"
        ? "year"
        : "month-year";
    const nextFormat = currentFormat === "year" ? "month-year" : "year";

    return PublicContentBlockManager.update(profile.id, {
      metadata: {
        ...metadata,
        pdfDateFormat: nextFormat,
      },
    });
  }),

  updateSectionOrder: editorProcedure
    .input(
      z.object({
        sectionOrder: z.array(ResumePdfSectionKeySchema).min(1),
      })
    )
    .mutation(async ({ input }) => {
      const profile = await getResumeProfileBlock();

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume profile block not found",
        });
      }

      const metadata = getBlockMetadata(profile);
      const pdfSectionOrder = normalizePdfSectionOrder(input.sectionOrder);

      return PublicContentBlockManager.update(profile.id, {
        metadata: {
          ...metadata,
          pdfSectionOrder,
        },
      });
    }),
});
