import { NextRequest, NextResponse } from "next/server";
import { requireAdminAccess } from "$/api/auth";

export async function POST(request: NextRequest) {
  // Require admin access
  try {
    await requireAdminAccess();
  } catch (error: unknown) {
    console.error("Admin access required:", error);
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  console.log("Upload request received");
  console.log(request.body);
  // File system writes are not supported on Cloudflare Workers without R2 or KV.
  // This endpoint is disabled in the Worker to reduce bundle size and Node polyfills.
  return NextResponse.json(
    {
      error:
        "Uploads are not supported on the Cloudflare Worker. Use Pages, R2, or another storage backend.",
    },
    { status: 501 }
  );
}
