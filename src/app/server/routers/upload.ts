import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const uploadRouter = router({
  // Get upload URL and policy for client-side upload (admin only)
  getUploadUrl: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

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

      // Upload API is disabled on Worker. Return a message to use external storage.
      return {
        uploadUrl: null,
        maxFileSize: maxSize,
        allowedTypes,
        note: "Uploads disabled on Cloudflare Worker. Use Pages, R2, or external storage.",
      } as unknown as {
        uploadUrl: string;
        maxFileSize: number;
        allowedTypes: string[];
      };
    }),

  // Get upload statistics (admin only)
  getUploadStats: adminProcedure.query(async () => {
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
