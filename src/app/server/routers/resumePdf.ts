import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, editorProcedure } from "../trpc";
import { CertificationsService } from "$/db/certifications/certifications";
import { EducationManager } from "$/db/Education/EducationManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { PublicContentBlockManager } from "$/db/publicContent/PublicContentBlockManager";
import { SkillManager } from "$/db/skills/SkillManager";
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";

const ResumePdfItemTypeSchema = z.enum([
  "profileBlock",
  "workExperience",
  "project",
  "skill",
  "education",
  "certification",
]);

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

    return {
      profileBlocks,
      workExperiences,
      projects,
      skills,
      education,
      certifications,
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
    const blocks = await PublicContentBlockManager.getBySection({
      page: "resume",
      sectionKey: "profile",
      locale: "en",
      visibleOnly: false,
    });
    const profile = blocks.find((block) => block.blockKey === "profile");

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resume profile block not found",
      });
    }

    const metadata =
      profile.metadata && typeof profile.metadata === "object"
        ? profile.metadata
        : {};
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
});
