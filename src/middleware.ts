import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import {
  generateIntakeSessionToken,
  verifyIntakeSessionToken,
} from "#/lib/utils/sessionToken";

const intlMiddleware = createMiddleware({
  locales: ["en", "es", "fr", "he"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Protect all /[locale]/admin routes
  const adminRouteRegex = /^\/(en|es|fr|he)\/admin(\/|$)/;
  if (adminRouteRegex.test(pathname)) {
    // Check for auth token in cookies
    const cookieHeader = request.headers.get("cookie");
    const isAuthenticated = cookieHeader?.includes("auth-token=");

    if (!isAuthenticated) {
      const loginUrl = new URL(`/${pathname.split("/")[1]}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect intake route - validate meeting parameters, custom token, or slug
  const intakeRouteRegex = /^\/(en|es|fr|he)\/intake(\/.*)?$/;
  if (intakeRouteRegex.test(pathname)) {
    const cookieHeader = request.headers.get("cookie");
    const intakeSessionToken = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("intake-session-token="))
      ?.split("=")[1];

    // Check for slug-based route: /[locale]/intake/[slug]
    // Note: We can't do database queries in middleware (Edge Runtime limitation)
    // Validation will be done in the page component instead
    const slugMatch = pathname.match(/^\/(en|es|fr|he)\/intake\/([^\/]+)$/);
    if (slugMatch) {
      // For slug-based routes, just allow the request to proceed
      // The page component will handle validation and show not-found if invalid
      // This avoids Edge Runtime limitations with database connections
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[Middleware] Allowing slug-based route - validation will happen in page component`
        );
      }
      return intlMiddleware(request);
    }

    // Check for custom token in URL query parameter (legacy support)
    const customToken = searchParams.get("token");

    // If custom token is provided, validate it and set cookie
    if (customToken) {
      try {
        const payload = await verifyIntakeSessionToken(customToken);

        if (payload && payload.isCustomLink === true) {
          // Valid custom token - set cookie and allow access
          const response = intlMiddleware(request);
          response.cookies.set("intake-session-token", customToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60, // 30 days default for custom links
            path: "/",
          });
          return response;
        }
      } catch {
        // Invalid token - fall through to redirect
      }
    }

    // Check if valid session token exists in cookie
    if (intakeSessionToken) {
      try {
        const payload = await verifyIntakeSessionToken(intakeSessionToken);
        if (payload) {
          // Valid token exists, allow access
          return intlMiddleware(request);
        }
      } catch {
        // Invalid session token - fall through to validation
      }
    }

    // No valid token, validate meeting parameters (from Calendly/meeting booking)
    const inviteeEmail = searchParams.get("inviteeEmail");
    const eventUri = searchParams.get("eventUri");

    // Require at least email and eventUri for meeting-based access
    if (!inviteeEmail || !eventUri) {
      const locale = pathname.split("/")[1] || "en";
      const meetingUrl = new URL(`/${locale}/meeting`, request.url);
      return NextResponse.redirect(meetingUrl);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteeEmail)) {
      const locale = pathname.split("/")[1] || "en";
      const meetingUrl = new URL(`/${locale}/meeting`, request.url);
      return NextResponse.redirect(meetingUrl);
    }

    // Generate session token
    try {
      const sessionToken = await generateIntakeSessionToken({
        email: inviteeEmail,
        eventUri,
        inviteeUri: searchParams.get("inviteeUri") || undefined,
      });

      // Create response with session token cookie
      const response = intlMiddleware(request);
      response.cookies.set("intake-session-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      return response;
    } catch {
      // Failed to generate token - redirect to meeting
      const locale = pathname.split("/")[1] || "en";
      const meetingUrl = new URL(`/${locale}/meeting`, request.url);
      return NextResponse.redirect(meetingUrl);
    }
  }

  // Fallback to next-intl middleware for i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
