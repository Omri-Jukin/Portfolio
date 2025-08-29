import { getRequestConfig } from "next-intl/server";
import { en, es, fr, he } from "./locales/index";

export const locales = ["en", "es", "fr", "he"] as const;
export const defaultLocale = "en" as const;

const localeMessages = {
  en,
  es,
  fr,
  he,
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    locale = defaultLocale;
  }

  const messages = localeMessages[locale as keyof typeof localeMessages];

  return {
    locale,
    messages,
  };
});
