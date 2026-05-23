import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Architecture as ArchitectureIcon,
  BugReport as BugReportIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { PORTFOLIO_CONSTANTS } from "./Portfolio.const";
import {
  PortfolioContainer,
  PortfolioHeader,
  PortfolioTitle,
  PortfolioSubtitle,
  ProjectCard,
  ProjectHeader,
  ProjectTitle,
  ProjectSubtitle,
  ProjectDescription,
  ProjectTech,
  ProjectActions,
  AccordionRoot,
  AccordionSummaryRoot,
  AccordionDetailsRoot,
  TechChip,
  CodeExampleBox,
  CodeBlockPre,
  ProblemSolution,
  ArchitectureSection,
  StyledList,
} from "./Portfolio.style";
import type { PortfolioProps, TechnicalChallenge as PortfolioTechnicalChallenge } from "./Portfolio.type";
import { api } from "$/trpc/client";
import { format } from "date-fns";
import type {
  ProjectStatus,
  ProjectType,
  CodeExample,
  ProjectStatusColor,
  ProjectTypeColor,
  IProject,
} from "#/lib";

const Portfolio: React.FC<PortfolioProps> = ({
  className,
  preferStatic = true,
  featuredProjectIds,
  expandFromHash = false,
  showHeader = true,
}) => {
  const t = useTranslations("portfolio");
  const [expandedProject, setExpandedProject] = useState<string | false>(false);

  const {
    data: projects = [],
    isLoading,
    error,
  } = api.projects.getAll.useQuery(
    { visibleOnly: true },
    { enabled: !preferStatic }
  );

  useEffect(() => {
    if (!expandFromHash) {
      return;
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      setExpandedProject(hash);
    }
  }, [expandFromHash]);

  const handleAccordionChange =
    (projectId: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedProject(isExpanded ? projectId : false);
    };

  const getStatusColor = (status: ProjectStatus) => {
    const colors: Record<ProjectStatus, ProjectStatusColor> = {
      completed: "success",
      "in-progress": "warning",
      archived: "default",
      concept: "info",
      deleted: "error",
      cancelled: "error",
    };
    return colors[status];
  };

  const getProjectTypeColor = (type: ProjectType) => {
    const colors: Record<ProjectType, ProjectTypeColor> = {
      professional: "primary",
      personal: "secondary",
      "open-source": "info",
      academic: "warning",
    };
    return colors[type];
  };

  const formatDateRange = (startDate: string, endDate?: string | null) => {
    const start = format(new Date(startDate), "MMM yyyy");
    const end = endDate ? format(new Date(endDate), "MMM yyyy") : "Ongoing";
    return `${start} - ${end}`;
  };

  // Transform database projects to IProject format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformProject = (project: any): IProject => ({
    id: project.id,
    createdById: project.createdById,
    createdBy: project.createdBy,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    isVisible: project.isVisible,
    displayOrder: project.displayOrder,
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    longDescription: project.longDescription || null,
    technologies: project.technologies,
    categories: project.categories,
    status: project.status,
    projectType: project.projectType,
    startDate: project.startDate,
    endDate: project.endDate || null,
    githubUrl: project.githubUrl || null,
    liveUrl: project.liveUrl || null,
    demoUrl: project.demoUrl || null,
    documentationUrl: project.documentationUrl || null,
    images: project.images,
    keyFeatures: project.keyFeatures,
    technicalChallenges: project.technicalChallenges,
    codeExamples: project.codeExamples,
    teamSize: project.teamSize || null,
    myRole: project.myRole || null,
    clientName: project.clientName || null,
    budget: project.budget || null,
    isFeatured: project.isFeatured,
    problem: project.problem || null,
    solution: project.solution || null,
    architecture: project.architecture || null,
    titleTranslations: project.titleTranslations || null,
    descriptionTranslations: project.descriptionTranslations || null,
  });

  const isUsingDatabase = !preferStatic && projects.length > 0;

  const projectsData = useMemo(() => {
    const source = isUsingDatabase
      ? projects.map(transformProject)
      : PORTFOLIO_CONSTANTS.PROJECTS;

    if (!featuredProjectIds?.length) {
      return source;
    }

    const byId = new Map(source.map((project) => [project.id, project]));
    return featuredProjectIds
      .map((id) => byId.get(id))
      .filter((project): project is (typeof source)[number] => Boolean(project));
  }, [featuredProjectIds, isUsingDatabase, projects]);

  const getChallengeLabel = (challenge: PortfolioTechnicalChallenge) =>
    challenge.problem ??
    challenge.description ??
    challenge.title ??
    challenge.challenge ??
    "";

  if (!preferStatic && isLoading) {
    return (
      <PortfolioContainer className={className}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </PortfolioContainer>
    );
  }

  const ProjectsData = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return projectsData.map((project: any, index: number) => {
      // Handle both database and static formats
      const projectId = project.id;
      const title = project.title;
      const subtitle = project.subtitle;
      const description = project.description;
      const technologies = project.technologies;
      const githubUrl = project.githubUrl;
      const liveUrl = project.liveUrl;
      const demoUrl = project.demoUrl;
      const status = project.status;
      const projectType = project.projectType;
      const isFeatured = project.isFeatured;
      const startDate = project.startDate;
      const endDate = project.endDate;
      const teamSize = project.teamSize;
      const keyFeatures = project.keyFeatures;
      const technicalChallenges = project.technicalChallenges;
      const codeExamples = project.codeExamples;

      return (
        <Grid key={projectId} component="div">
          <MotionWrapper variant="fadeInUp" duration={0.8} delay={index * 0.2}>
            <ProjectCard elevation={0} id={projectId}>
              <ProjectHeader>
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ProjectTitle variant="h4">{title}</ProjectTitle>
                      {isFeatured && <StarIcon color="primary" />}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {isUsingDatabase && (
                        <>
                          <Chip
                            label={status.replace("-", " ")}
                            size="small"
                            color={
                              getStatusColor(status) as
                                | "success"
                                | "warning"
                                | "default"
                                | "info"
                            }
                            variant="outlined"
                          />
                          <Chip
                            label={projectType.replace("-", " ")}
                            size="small"
                            color={
                              getProjectTypeColor(projectType) as
                                | "primary"
                                | "secondary"
                                | "info"
                                | "warning"
                            }
                            variant="filled"
                          />
                        </>
                      )}
                    </Box>
                  </Box>

                  <ProjectSubtitle variant="h6" gutterBottom>
                    {subtitle}
                  </ProjectSubtitle>

                  {/* Project metadata */}
                  {isUsingDatabase && startDate && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDateRange(startDate, endDate)}
                        </Typography>
                      </Box>
                      {teamSize && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PeopleIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {teamSize} {teamSize === 1 ? "person" : "people"}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  <ProjectDescription variant="body1" sx={{ mb: 3 }}>
                    {description}
                  </ProjectDescription>

                  <ProjectTech sx={{ mb: 3 }}>
                    {technologies.map((tech: string, techIndex: number) => (
                      <TechChip
                        key={techIndex}
                        label={tech}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    ))}
                  </ProjectTech>

                  <ProjectActions>
                    {githubUrl && (
                      <Button
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        GitHub
                      </Button>
                    )}
                    {liveUrl && !String(liveUrl).includes("[") && (
                      <Button
                        variant="contained"
                        startIcon={<LaunchIcon />}
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        Live Demo
                      </Button>
                    )}
                    {demoUrl && !String(demoUrl).includes("[") && (
                      <Button
                        variant="outlined"
                        startIcon={<LaunchIcon />}
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        Demo
                      </Button>
                    )}
                  </ProjectActions>
                </Box>
              </ProjectHeader>

              {/* Detailed sections */}
              <AccordionRoot
                expanded={expandedProject === projectId}
                onChange={handleAccordionChange(projectId)}
              >
                <AccordionSummaryRoot expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{t("technicalDetails")}</Typography>
                </AccordionSummaryRoot>
                <AccordionDetailsRoot>
                  {/* Key Features */}
                  {keyFeatures && keyFeatures.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <StarIcon color="primary" />
                        {t("keyFeatures")}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {keyFeatures.map(
                          (feature: string, featureIndex: number) => (
                            <Typography
                              key={featureIndex}
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              • {feature}
                            </Typography>
                          )
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Problem & Solution */}
                  {typeof project.problem === "string" && (
                    <>
                      <ProblemSolution sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <BugReportIcon color="secondary" />
                          {t("problemSolution")}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {project.problem}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <strong>{t("approach")}</strong> {project.solution}
                        </Typography>
                      </ProblemSolution>

                      <ArchitectureSection sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <ArchitectureIcon color="info" />
                          {t("architecture")}
                        </Typography>
                        <Typography variant="body2">
                          {project.architecture}
                        </Typography>
                      </ArchitectureSection>
                    </>
                  )}

                  {typeof project.problem === "object" &&
                    project.problem !== null && (
                    <>
                      <ProblemSolution sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <BugReportIcon color="secondary" />
                          {t("problemSolution")}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                          <strong>{project.problem?.title}</strong>
                          <br />
                          {project.problem?.description}
                          <br />
                          <em>Impact: {project.problem?.impact}</em>
                          {project.problem?.constraints &&
                            project.problem.constraints.length > 0 && (
                              <>
                                <br />
                                <strong>Constraints:</strong>{" "}
                                {project.problem.constraints.join(", ")}
                              </>
                            )}
                        </Typography>

                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <ArchitectureIcon color="primary" />
                          {t("approach")}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Approach:</strong>{" "}
                          {project.solution?.approach}
                          <br />
                          <strong>Methodology:</strong>{" "}
                          {project.solution?.methodology}
                          <br />
                          <strong>Key Decisions:</strong>
                          <StyledList>
                            {project.solution?.keyDecisions.map(
                              (decision: string, idx: number) => (
                                <li key={idx}>{decision}</li>
                              )
                            )}
                          </StyledList>
                          {project.solution?.alternatives &&
                            project.solution.alternatives.length > 0 && (
                              <>
                                <strong>Alternatives Considered:</strong>
                                <StyledList>
                                  {project.solution.alternatives.map(
                                    (alt: string, idx: number) => (
                                      <li key={idx}>{alt}</li>
                                    )
                                  )}
                                </StyledList>
                              </>
                            )}
                        </Typography>
                      </ProblemSolution>

                      <ArchitectureSection sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <ArchitectureIcon color="info" />
                          {t("architecture")}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Overview:</strong>{" "}
                          {project.architecture?.overview}
                          <br />
                          <strong>Components:</strong>
                          <StyledList>
                            {project.architecture?.components.map(
                              (component: string, idx: number) => (
                                <li key={idx}>{component}</li>
                              )
                            )}
                          </StyledList>
                          <strong>Data Flow:</strong>{" "}
                          {project.architecture?.dataFlow}
                          <br />
                          <strong>Technologies:</strong>{" "}
                          {project.architecture?.technologies.join(", ")}
                          <br />
                          <strong>Design Patterns:</strong>{" "}
                          {project.architecture?.patterns.join(", ")}
                          {project.architecture?.scalability && (
                            <>
                              <br />
                              <strong>Scalability:</strong>{" "}
                              {project.architecture.scalability}
                            </>
                          )}
                          {project.architecture?.security && (
                            <>
                              <br />
                              <strong>Security:</strong>{" "}
                              {project.architecture.security}
                            </>
                          )}
                        </Typography>
                      </ArchitectureSection>
                    </>
                  )}

                  {/* Technical Challenges */}
                  {technicalChallenges && technicalChallenges.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <BugReportIcon color="warning" />
                        {t("technicalChallenges")}
                      </Typography>
                      {technicalChallenges.map(
                        (
                          challenge: PortfolioTechnicalChallenge,
                          challengeIndex: number
                        ) => (
                          <Box
                            key={challengeIndex}
                            sx={{
                              mb: 2,
                              p: 2,
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {t("challenge")} {getChallengeLabel(challenge)}
                            </Typography>
                            <Typography variant="body2">
                              {t("solution")} {challenge.solution}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  )}

                  {/* Code Examples */}
                  {codeExamples && codeExamples.length > 0 && (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {t("codeExamples")}
                      </Typography>
                      {codeExamples.map(
                        (example: CodeExample, exampleIndex: number) => (
                          <CodeExampleBox key={exampleIndex} sx={{ mb: 3 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              gutterBottom
                              color="text.primary"
                            >
                              {example.title}
                            </Typography>
                            {example.explanation && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                {example.explanation}
                              </Typography>
                            )}
                            <CodeBlockPre>
                              <code>{example.code}</code>
                            </CodeBlockPre>
                          </CodeExampleBox>
                        )
                      )}
                    </Box>
                  )}
                </AccordionDetailsRoot>
              </AccordionRoot>
            </ProjectCard>
          </MotionWrapper>
        </Grid>
      );
    });
  };

  if (error) {
    console.error("Error loading projects:", error);
  }

  return (
    <PortfolioContainer className={className}>
      <MotionWrapper variant="fadeInUp" duration={0.8}>
        {showHeader && (
          <PortfolioHeader>
            <PortfolioTitle variant="h2" gutterBottom>
              {t("title")}
            </PortfolioTitle>
            <PortfolioSubtitle variant="h5">
              {t("subtitle")}
            </PortfolioSubtitle>
          </PortfolioHeader>
        )}

        <Grid container spacing={3}>
          <ProjectsData />
        </Grid>
      </MotionWrapper>
    </PortfolioContainer>
  );
};

export default Portfolio;
