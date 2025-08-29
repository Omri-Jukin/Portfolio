export interface SearchResult {
  id: string;
  title: string;
  type: "project" | "blog" | "skill";
  description?: string;
  url: string;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  showSuggestions?: boolean;
  fullWidth?: boolean;
}
