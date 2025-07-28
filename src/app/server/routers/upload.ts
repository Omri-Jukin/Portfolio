import { z } from "zod";
import { router, procedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const uploadRouter = router({
  // Get upload URL and policy for client-side upload
  getUploadUrl: procedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      // Check if user is admin
      if (!ctx.user || ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can upload files",
        });
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(input.fileType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid file type. Only images are allowed.",
        });
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (input.fileSize > maxSize) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File too large. Maximum size is 5MB.",
        });
      }

      // Return the upload endpoint URL
      return {
        uploadUrl: "/api/upload",
        maxFileSize: maxSize,
        allowedTypes,
      };
    }),

  // Get upload statistics (admin only)
  getUploadStats: procedure.query(async (opts) => {
    const { ctx } = opts;

    // Check if user is admin
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view upload stats",
      });
    }

    // This could return upload statistics, file count, etc.
    return {
      totalUploads: 0, // You could implement this by tracking uploads
      maxFileSize: 5 * 1024 * 1024,
      allowedTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
    };
  }),
});
