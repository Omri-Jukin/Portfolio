export interface ResumeLanguageSelectorProps {
  onLanguageSelect?: (languageCode: string) => void;
  onDownload?: (languageCode: string) => void;
  isLoading?: boolean;
  selectedLanguage?: string;
}
