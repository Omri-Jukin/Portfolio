export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookiesProps {
  isVisible?: boolean;
  onAcceptAll?: (preferences: CookiePreferences) => void;
  onAcceptSelected?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
  onCustomize?: () => void;
  className?: string;
}

export interface CookieCategory {
  id: keyof CookiePreferences;
  title: string;
  description: string;
  required?: boolean;
}

export interface CookiesState {
  isVisible: boolean;
  showCustomize: boolean;
  preferences: CookiePreferences;
}
