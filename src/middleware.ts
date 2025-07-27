import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "es", "fr", "he"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Fallback to next-intl middleware for i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
