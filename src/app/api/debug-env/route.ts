import { NextResponse } from "next/server";

export async function GET() {
  // Check if OAuth credentials are accessible
  const hasGoogleClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  return NextResponse.json({
    env_check: {
      GOOGLE_CLIENT_ID: hasGoogleClientId ? "SET" : "MISSING",
      GOOGLE_CLIENT_SECRET: hasGoogleClientSecret ? "SET" : "MISSING",
      NEXTAUTH_SECRET: hasNextAuthSecret ? "SET" : "MISSING",
      NEXTAUTH_URL: nextAuthUrl || "MISSING",
    },
    message: "This endpoint should be removed after debugging",
  });
}
