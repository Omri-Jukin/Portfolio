export interface PortfolioProps {
  className?: string;
  /** Use static portfolio data instead of CMS rows (default: true). */
  preferStatic?: boolean;
  /** Limit and order projects by id. */
  featuredProjectIds?: string[];
  /** Auto-expand the project matching the URL hash. */
  expandFromHash?: boolean;
  /** Show the built-in page header (default: true). */
  showHeader?: boolean;
}

export interface CodeExample {
  language?: string;
  title: string;
  code: string;
  explanation: string;
}

export interface TechnicalChallenge {
  challenge?: string;
  title?: string;
  description?: string;
  problem?: string;
  solution: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  problem: string;
  solution: string;
  architecture: string;
  keyFeatures: string[];
  codeExamples: CodeExample[];
  technicalChallenges: TechnicalChallenge[];
}
