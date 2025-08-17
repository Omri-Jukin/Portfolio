export interface ResumeLanguageSelectorProps {
  onLanguageSelect?: (languageCode: string) => void;
  onGenerateDocuments?: (options: DocumentGenerationOptions) => void;
  isLoading?: boolean;
  selectedLanguage?: string;
}

export interface DocumentGenerationOptions {
  language: string;
  documentTypes: string[];
  customization: {
    includeCodeExamples: boolean;
    includeTechnicalChallenges: boolean;
    includeArchitectureDetails: boolean;
  };
}
