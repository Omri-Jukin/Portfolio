import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set("intake-session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge || 30 * 24 * 60 * 60, // 30 days default
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
