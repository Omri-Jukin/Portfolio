import { Locale } from "./LanguageSwitcher.type";

// Available locales
export const AVAILABLE_LOCALES = ["en", "es", "fr", "he"] as const;

// Language names mapping
export const LANGUAGE_NAMES = {
  en: "English",
  es: "Español",
  fr: "Français",
  he: "עברית",
} as const;

// Language flags mapping (for future use)
export const LANGUAGE_FLAGS = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  he: "🇮🇱",
} as const;

// Default locale
export const DEFAULT_LOCALE = "en" as const;

// Language switcher configuration
export const LANGUAGE_SWITCHER_CONFIG = {
  ANIMATION_DURATION: 0.2,
  MENU_WIDTH: 200,
  ITEM_HEIGHT: 48,
} as const;

// Utility functions
export const getLanguageName = (locale: Locale) => {
  return LANGUAGE_NAMES[locale] || locale;
};

export const getTargetPath = (targetLocale: Locale, pathname: string) => {
  const segments = pathname.split("/");
  // Remove empty first segment and the current locale (second segment)
  const pathWithoutLocale = segments.slice(2).join("/");
  // Return the new path with the target locale
  return `/${targetLocale}/${pathWithoutLocale}`;
};
