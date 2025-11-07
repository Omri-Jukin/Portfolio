import { NextRequest, NextResponse } from "next/server";
import { requireAdminAccess } from "$/api/auth";
import { nanoid } from "nanoid";
import {
  uploadToSupabaseStorage,
  ensureBucketExists,
} from "$/supabase/storage";

// Maximum file size: 50MB for videos, 5MB for images
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

// Storage bucket name for blog media
const BLOG_MEDIA_BUCKET = "blog-media";

export async function POST(request: NextRequest) {
  // Require admin access
  try {
    await requireAdminAccess(request);
  } catch (error: unknown) {
    console.error("Admin access required:", error);
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "blog"; // Default to blog folder

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine file type and max size
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types: ${[
            ...ALLOWED_IMAGE_TYPES,
            ...ALLOWED_VIDEO_TYPES,
          ].join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size: ${
            maxSize / 1024 / 1024
          }MB for ${isImage ? "images" : "videos"}`,
        },
        { status: 400 }
      );
    }

    // Ensure bucket exists
    await ensureBucketExists(BLOG_MEDIA_BUCKET);

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFileName = `${Date.now()}-${nanoid()}.${fileExtension}`;
    const filePath = `${folder}/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { url, path } = await uploadToSupabaseStorage(
      BLOG_MEDIA_BUCKET,
      filePath,
      file
    );

    return NextResponse.json({
      success: true,
      url: url, // Public URL from Supabase
      fileName: uniqueFileName,
      fileType: file.type,
      fileSize: file.size,
      path: path, // Storage path for future reference
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
