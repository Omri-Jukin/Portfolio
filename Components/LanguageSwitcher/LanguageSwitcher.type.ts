export interface LanguageSwitcherProps {
  currentLocale: string;
  availableLocales: string[];
  onLocaleChange: (locale: string) => void;
}

export type Locale = "en" | "es" | "fr" | "he";
