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
    const slugMatch = pathname.match(/^\/(en|es|fr|he)\/intake\/([^\/]+)$/);
    if (slugMatch) {
      const [, locale, slug] = slugMatch;

      try {
        // Try to get custom link by slug
        const { getCustomLinkBySlug } = await import(
          "#/lib/db/intakes/customLinks"
        );
        const customLink = await getCustomLinkBySlug(slug);

        if (customLink) {
          // Check if link is expired
          if (customLink.expiresAt < new Date()) {
            const meetingUrl = new URL(`/${locale}/meeting`, request.url);
            return NextResponse.redirect(meetingUrl);
          }

          // Valid custom link with slug - set cookie and allow access
          const response = intlMiddleware(request);
          response.cookies.set("intake-session-token", customLink.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: Math.floor(
              (customLink.expiresAt.getTime() - Date.now()) / 1000
            ),
            path: "/",
          });
          return response;
        } else {
          // Slug not found, redirect to meeting page
          const meetingUrl = new URL(`/${locale}/meeting`, request.url);
          return NextResponse.redirect(meetingUrl);
        }
      } catch (error) {
        console.error("[Middleware] Failed to get custom link by slug:", error);
        const meetingUrl = new URL(`/${locale}/meeting`, request.url);
        return NextResponse.redirect(meetingUrl);
      }
    }

    // Check for custom token in URL query parameter (legacy support)
    const customToken = searchParams.get("token");

    // If custom token is provided, validate it and set cookie
    if (customToken) {
      console.log("[Middleware] Found custom token in URL, verifying...");
      try {
        const payload = await verifyIntakeSessionToken(customToken);
        console.log("[Middleware] Token verification result:", {
          hasPayload: !!payload,
          isCustomLink: payload?.isCustomLink,
          email: payload?.email,
        });

        if (payload && payload.isCustomLink === true) {
          // Valid custom token - set cookie and allow access
          console.log(
            "[Middleware] Valid custom link token, setting cookie and allowing access"
          );
          const response = intlMiddleware(request);
          response.cookies.set("intake-session-token", customToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60, // 30 days default for custom links
            path: "/",
          });
          return response;
        } else {
          // Token is valid but not a custom link token
          console.error("[Middleware] Token is valid but not a custom link:", {
            hasPayload: !!payload,
            isCustomLink: payload?.isCustomLink,
            email: payload?.email,
          });
        }
      } catch (error) {
        console.error("[Middleware] Failed to verify custom token:", error);
        // Fall through to redirect
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
      } catch (error) {
        console.error("Failed to verify session token:", error);
        // Fall through to validation
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
    } catch (error) {
      console.error("Failed to generate intake session token:", error);
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
