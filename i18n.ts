import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'es', 'fr', 'he'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ locale = defaultLocale }) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
}); 