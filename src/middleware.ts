import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  generateIntakeSessionToken,
  verifyIntakeSessionToken,
} from "#/lib/utils/sessionToken";
import { canAccessAdminSync } from "#/lib/auth/rbac";

const supportedLocales = ["en", "es", "fr", "he"] as const;
const localeCookieName = "NEXT_LOCALE";

function isSupportedLocale(value: string) {
  return supportedLocales.includes(value as (typeof supportedLocales)[number]);
}

function redirectFromLocalePrefix(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split("/");
  const prefixedLocale = pathSegments[1];

  if (!isSupportedLocale(prefixedLocale)) return null;

  const cleanPath = `/${pathSegments.slice(2).join("/")}`.replace(/\/$/, "") || "/";
  const redirectUrl = new URL(cleanPath, request.url);
  redirectUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(localeCookieName, prefixedLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

function withNoIndex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function getLegacyEnglishPath(pathname: string) {
  if (pathname.startsWith("/services/intake")) {
    return `/en${pathname.replace(/^\/services/, "")}`;
  }

  if (pathname === "/services/meeting") {
    return "/en/meeting";
  }

  const serviceProposalMatch = pathname.match(/^\/services\/p\/([^/]+)$/);
  if (serviceProposalMatch) {
    return `/en/p/${serviceProposalMatch[1]}`;
  }

  return `/en${pathname}`;
}

function rewriteToLegacyEnglishRoute(request: NextRequest) {
  const rewriteUrl = new URL(
    getLegacyEnglishPath(request.nextUrl.pathname),
    request.url
  );
  rewriteUrl.search = request.nextUrl.search;
  const response = NextResponse.rewrite(rewriteUrl);

  if (request.nextUrl.pathname.startsWith("/services/")) {
    return withNoIndex(response);
  }

  return response;
}

function getMeetingRedirectPath(pathname: string) {
  return pathname.startsWith("/services/") ? "/services/meeting" : "/meeting";
}

async function protectDashboard(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const dashboardRouteRegex = /^\/((en|es|fr|he)\/)?dashboard(\/|$)/;

  if (!dashboardRouteRegex.test(pathname)) return null;

  try {
    const sessionCookie = request.cookies.get("next-auth.session-token");
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      if (sessionCookie) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (token.role as string) || "visitor";
    if (!canAccessAdminSync(role)) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

async function protectLegacyIntake(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const intakeRouteRegex = /^\/(services\/)?intake(\/.*)?$/;

  if (!intakeRouteRegex.test(pathname)) return null;

  if (
    pathname === "/services/intake" ||
    /^\/services\/intake\/[^/]+$/.test(pathname)
  ) {
    return withNoIndex(NextResponse.next());
  }

  if (pathname === "/intake" || pathname === "/services/intake") {
    return rewriteToLegacyEnglishRoute(request);
  }

  const cookieHeader = request.headers.get("cookie");
  const intakeSessionToken = cookieHeader
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("intake-session-token="))
    ?.split("=")[1];

  const slugMatch = pathname.match(/^\/(services\/)?intake\/([^/]+)$/);
  if (slugMatch) {
    return rewriteToLegacyEnglishRoute(request);
  }

  const customToken = searchParams.get("token");
  if (customToken) {
    try {
      const payload = await verifyIntakeSessionToken(customToken);

      if (payload && payload.isCustomLink === true) {
        const response = rewriteToLegacyEnglishRoute(request);
        response.cookies.set("intake-session-token", customToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        return response;
      }
    } catch {
      // Invalid token - fall through to meeting validation.
    }
  }

  if (intakeSessionToken) {
    try {
      const payload = await verifyIntakeSessionToken(intakeSessionToken);
      if (payload) {
        return rewriteToLegacyEnglishRoute(request);
      }
    } catch {
      // Invalid session token - fall through to meeting validation.
    }
  }

  const inviteeEmail = searchParams.get("inviteeEmail");
  const eventUri = searchParams.get("eventUri");
  const meetingRedirectPath = getMeetingRedirectPath(pathname);

  if (!inviteeEmail || !eventUri) {
    return withNoIndex(
      NextResponse.redirect(new URL(meetingRedirectPath, request.url))
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inviteeEmail)) {
    return withNoIndex(
      NextResponse.redirect(new URL(meetingRedirectPath, request.url))
    );
  }

  try {
    const sessionToken = await generateIntakeSessionToken({
      email: inviteeEmail,
      eventUri,
      inviteeUri: searchParams.get("inviteeUri") || undefined,
    });

    const response = rewriteToLegacyEnglishRoute(request);
    response.cookies.set("intake-session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return withNoIndex(
      NextResponse.redirect(new URL(meetingRedirectPath, request.url))
    );
  }
}

function rewriteLegacyFreelanceRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/services/meeting" || /^\/services\/p\/[^/]+$/.test(pathname)) {
    return withNoIndex(NextResponse.next());
  }

  if (pathname === "/meeting") {
    return withNoIndex(
      NextResponse.redirect(new URL("/services/meeting", request.url))
    );
  }

  const legacyProposalMatch = pathname.match(/^\/p\/([^/]+)$/);
  if (legacyProposalMatch) {
    return withNoIndex(
      NextResponse.redirect(
        new URL(`/services/p/${legacyProposalMatch[1]}`, request.url)
      )
    );
  }

  return null;
}

export default async function middleware(request: NextRequest) {
  const localeRedirect = redirectFromLocalePrefix(request);
  if (localeRedirect) return localeRedirect;

  const dashboardResponse = await protectDashboard(request);
  if (dashboardResponse) return dashboardResponse;

  const intakeResponse = await protectLegacyIntake(request);
  if (intakeResponse) return intakeResponse;

  const legacyFreelanceResponse = rewriteLegacyFreelanceRoutes(request);
  if (legacyFreelanceResponse) return legacyFreelanceResponse;

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
