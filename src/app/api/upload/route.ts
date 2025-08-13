import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
