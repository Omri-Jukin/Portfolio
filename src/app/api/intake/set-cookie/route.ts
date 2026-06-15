import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyIntakeSessionToken } from "#/lib/utils/sessionToken";

const MAX_COOKIE_AGE_SECONDS = 30 * 24 * 60 * 60;

/**
 * Route Handler to set the intake session cookie
 * Called when a valid custom link is accessed
 * Route: POST /api/intake/set-cookie
 */
export async function POST(request: NextRequest) {
  try {
    const { token, maxAge } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const payload = await verifyIntakeSessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const requestedMaxAge =
      typeof maxAge === "number" && Number.isFinite(maxAge) ? maxAge : null;
    const safeMaxAge = Math.min(
      Math.max(requestedMaxAge ?? MAX_COOKIE_AGE_SECONDS, 60),
      MAX_COOKIE_AGE_SECONDS
    );

    const cookieStore = await cookies();
    cookieStore.set("intake-session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: safeMaxAge,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to set cookie:", error);
    return NextResponse.json(
      { error: "Failed to set cookie" },
      { status: 500 }
    );
  }
}
