import type {
  TechnicalPortfolioData,
  TechnicalProject,
  CodeExample,
  ArchitectureDecision,
} from "../types";

//! Import TechnicalChallenge from types.ts - this will use the last exported one
import type { TechnicalChallenge } from "../types";

//! Types for locale data structure
interface LocaleData {
  metadata?: { title?: string };
  technicalPortfolio?: {
    overview?: { title?: string };
    projects?: Array<{
      name?: string;
      title?: string;
      description?: string;
      technologies?: string[];
      architecture?: {
        overview?: string;
        patterns?: string[];
        decisions?: string[];
      };
      technicalChallenges?: Array<{
        title: string;
        problem: string;
        solution: string;
        impact: string;
      }>;
      codeExamples?: Array<{
        title: string;
        description: string;
        language: string;
        code: string;
        explanation: string;
      }>;
      repository?: string;
      liveUrl?: string;
      screenshots?: string[];
    }>;
    codeExamples?: Record<
      string,
      Array<{
        title: string;
        description: string;
        language: string;
        code: string;
        explanation: string;
      }>
    >;
    technicalChallenges?: {
      challenges?: Array<{
        title: string;
        problem: string;
        solution: string;
        technologies?: string[];
        impact: string;
      }>;
    };
  };
}

export function extractTechnicalPortfolioData(
  localeData: LocaleData
): TechnicalPortfolioData {
  const technicalPortfolio = localeData.technicalPortfolio;

  if (!technicalPortfolio) {
    throw new Error("Technical portfolio data not found in locale");
  }

  //! Extract projects from the technical portfolio
  const projects: TechnicalProject[] =
    technicalPortfolio.projects?.map((project, index: number) => ({
      id: `project-${index + 1}`,
      name: project.name || project.title || `Project ${index + 1}`,
      description: project.description || "",
      technologies: project.technologies || [],
      architecture: {
        overview: project.architecture?.overview || "",
        patterns: project.architecture?.patterns || [],
        decisions: project.architecture?.decisions || [],
      },
      technicalChallenges:
        project.technicalChallenges?.map((challenge) => ({
          title: challenge.title,
          problem: challenge.problem,
          solution: challenge.solution,
          impact: challenge.impact,
        })) || [],
      codeExamples:
        project.codeExamples?.map((example) => ({
          title: example.title,
          description: example.description,
          language: example.language,
          code: example.code,
          explanation: example.explanation,
        })) || [],
      repository: project.repository,
      liveUrl: project.liveUrl,
      screenshots: project.screenshots || [],
    })) || [];

  //! Extract standalone code examples
  const codeExamples: CodeExample[] = [];

  //! Add code examples from projects
  projects.forEach((project) => {
    project.codeExamples.forEach((example) => {
      codeExamples.push({
        id: `code-${codeExamples.length + 1}`,
        title: example.title,
        description: example.description,
        language: example.language,
        code: example.code,
        explanation: example.explanation,
        project: project.name,
        category: "Project Code",
      });
    });
  });

  //! Add standalone code examples from technicalPortfolio.codeExamples
  if (technicalPortfolio.codeExamples) {
    Object.entries(technicalPortfolio.codeExamples).forEach(
      ([category, examples]) => {
        if (Array.isArray(examples)) {
          examples.forEach((example) => {
            codeExamples.push({
              id: `code-${codeExamples.length + 1}`,
              title: example.title,
              description: example.description,
              language: example.language,
              code: example.code,
              explanation: example.explanation,
              project: "Portfolio Website",
              category: category,
            });
          });
        }
      }
    );
  }

  //! Extract technical challenges
  const technicalChallenges: TechnicalChallenge[] = [];

  //! Add challenges from projects
  projects.forEach((project) => {
    project.technicalChallenges.forEach((challenge) => {
      technicalChallenges.push({
        id: `challenge-${technicalChallenges.length + 1}`,
        title: challenge.title,
        problem: challenge.problem,
        solution: challenge.solution,
        technologies: project.technologies || [],
        impact: challenge.impact,
        project: project.name,
      });
    });
  });

  //! Add standalone challenges from technicalPortfolio.technicalChallenges
  if (technicalPortfolio.technicalChallenges?.challenges) {
    technicalPortfolio.technicalChallenges.challenges.forEach((challenge) => {
      technicalChallenges.push({
        id: `challenge-${technicalChallenges.length + 1}`,
        title: challenge.title,
        problem: challenge.problem,
        solution: challenge.solution,
        technologies: challenge.technologies || [],
        impact: challenge.impact,
        project: "Portfolio Website",
      });
    });
  }

  //! Extract architecture decisions
  const architecture: ArchitectureDecision[] = [];

  //! Add architecture decisions from projects
  projects.forEach((project) => {
    project.architecture.decisions.forEach((decision) => {
      architecture.push({
        id: `arch-${architecture.length + 1}`,
        title: `${project.name} - ${decision}`,
        context: project.architecture.overview,
        decision: decision,
        consequences: [],
        alternatives: [],
        project: project.name,
      });
    });
  });

  return {
    meta: {
      title: technicalPortfolio.overview?.title || "Technical Portfolio",
      author: localeData.metadata?.title || "Developer",
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
    },
    projects,
    codeExamples,
    technicalChallenges,
    architecture,
  };
}
