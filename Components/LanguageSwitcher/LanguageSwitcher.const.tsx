import { Locale } from "./LanguageSwitcher.type";

export const getLanguageName = (locale: Locale) => {
  const names: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    he: "Hebrew",
  };
  return names[locale] || locale;
};

export const getTargetPath = (targetLocale: Locale, pathname: string) => {
  const segments = pathname.split("/");
  // Remove empty first segment and the current locale (second segment)
  const pathWithoutLocale = segments.slice(2).join("/");
  // Return the new path with the target locale
  return `/${targetLocale}/${pathWithoutLocale}`;
};
