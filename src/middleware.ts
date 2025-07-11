import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '../i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Don't add locale prefix for default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|fr|he)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
}; 