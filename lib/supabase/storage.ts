/**
 * Supabase Storage client for file uploads
 * Uses Supabase Storage API for cloud file storage
 */

import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable is required"
  );
}

if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable is required"
  );
}

// Create Supabase client with service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Upload a file to Supabase Storage
 * @param bucket - Storage bucket name (e.g., "blog-media")
 * @param filePath - Path within the bucket (e.g., "images/photo.jpg")
 * @param file - File object to upload
 * @returns Public URL of the uploaded file
 */
export async function uploadToSupabaseStorage(
  bucket: string,
  filePath: string,
  file: File | Buffer | ArrayBuffer
): Promise<{ url: string; path: string }> {
  // Convert file to Uint8Array (compatible with Supabase Storage)
  let fileData: Uint8Array;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    fileData = new Uint8Array(arrayBuffer);
  } else if (file instanceof Buffer) {
    fileData = new Uint8Array(file);
  } else {
    fileData = new Uint8Array(file);
  }

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileData, {
      contentType: file instanceof File ? file.type : undefined,
      upsert: false, // Don't overwrite existing files
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - Storage bucket name
 * @param filePath - Path to the file within the bucket
 */
export async function deleteFromSupabaseStorage(
  bucket: string,
  filePath: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(`Supabase Storage delete failed: ${error.message}`);
  }
}

/**
 * Check if a bucket exists, create it if it doesn't
 * @param bucket - Storage bucket name
 */
export async function ensureBucketExists(bucket: string): Promise<void> {
  // List buckets to check if it exists
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`);
  }

  const bucketExists = buckets?.some((b) => b.name === bucket);

  if (!bucketExists) {
    // Create bucket (public for easy access)
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
      ],
    });

    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }
  }
}
