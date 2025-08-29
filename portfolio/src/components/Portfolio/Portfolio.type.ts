export interface PortfolioProps {
  className?: string;
}

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export interface TechnicalChallenge {
  challenge: string;
  title: string;
  description: string;
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
