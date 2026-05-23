export type ProjectsProps = Record<never, never>;

export interface FeaturedProject {
  id: string;
  title: string;
  summary: string;
  audience: string;
  problem: string;
  stack: string[];
  architecture: string;
  role: string;
  proof: string;
  githubUrl: string;
  liveUrl?: string;
  caseStudyUrl: string;
}
