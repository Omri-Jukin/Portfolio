import React, { useState } from "react";
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
  ProblemSolution,
  ArchitectureSection,
} from "./Portfolio.style";
import type {
  CodeExample,
  PortfolioProps,
  TechnicalChallenge,
} from "./Portfolio.type";
import { api } from "$/trpc/client";
import { format } from "date-fns";
import { ProjectStatusColor, ProjectTypeColor } from "#/lib/types";

const Portfolio: React.FC<PortfolioProps> = ({ className }) => {
  const [expandedProject, setExpandedProject] = useState<string | false>(false);

  // Fetch projects from database
  const {
    data: projects = [],
    isLoading,
    error,
  } = api.projects.getAll.useQuery({
    visibleOnly: true,
  });

  const handleAccordionChange =
    (projectId: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedProject(isExpanded ? projectId : false);
    };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "success",
      "in-progress": "warning",
      archived: "default",
      concept: "info",
    };
    return colors[status as keyof typeof colors] || "default";
  };

  const getProjectTypeColor = (type: string) => {
    const colors = {
      professional: "primary",
      personal: "secondary",
      "open-source": "info",
      academic: "warning",
    };
    return colors[type as keyof typeof colors] || "default";
  };

  const formatDateRange = (startDate: string, endDate?: string | null) => {
    const start = format(new Date(startDate), "MMM yyyy");
    const end = endDate ? format(new Date(endDate), "MMM yyyy") : "Ongoing";
    return `${start} - ${end}`;
  };

  if (isLoading) {
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

  // Use database data if available, fallback to static
  const projectsData =
    projects.length > 0 ? projects : PORTFOLIO_CONSTANTS.PROJECTS;
  const isUsingDatabase = projects.length > 0;

  if (error) {
    console.error("Error loading projects:", error);
  }

  return (
    <PortfolioContainer className={className}>
      <MotionWrapper variant="fadeInUp" duration={0.8}>
        <PortfolioHeader>
          <PortfolioTitle variant="h2" gutterBottom>
            Technical Portfolio
          </PortfolioTitle>
          <PortfolioSubtitle variant="h5">
            Detailed project showcase with technical implementations,
            problem-solving approaches, and code examples
          </PortfolioSubtitle>
        </PortfolioHeader>

        <Grid container spacing={4}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {projectsData.map((project: any, index: number) => {
            // Handle both database and static formats
            const projectId = isUsingDatabase ? project.id : project.id;
            const title = project.title;
            const subtitle = project.subtitle;
            const description = project.description;
            const technologies = project.technologies;
            const githubUrl = project.githubUrl;
            const liveUrl = isUsingDatabase ? project.liveUrl : project.liveUrl;
            const demoUrl = isUsingDatabase ? project.demoUrl : null;
            const status = isUsingDatabase ? project.status : "completed";
            const projectType = isUsingDatabase
              ? project.projectType
              : "personal";
            const isFeatured = isUsingDatabase ? project.isFeatured : false;
            const startDate = isUsingDatabase ? project.startDate : null;
            const endDate = isUsingDatabase ? project.endDate : null;
            const teamSize = isUsingDatabase ? project.teamSize : null;
            const keyFeatures = isUsingDatabase
              ? project.keyFeatures
              : project.keyFeatures;
            const technicalChallenges = isUsingDatabase
              ? project.technicalChallenges
              : project.technicalChallenges;
            const codeExamples = isUsingDatabase
              ? project.codeExamples
              : project.codeExamples;

            return (
              <Grid key={projectId} component="div">
                <MotionWrapper
                  variant="fadeInUp"
                  duration={0.8}
                  delay={index * 0.2}
                >
                  <ProjectCard elevation={3}>
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
                                    getStatusColor(status) as ProjectStatusColor
                                  }
                                  variant="outlined"
                                />
                                <Chip
                                  label={projectType.replace("-", " ")}
                                  size="small"
                                  color={
                                    getProjectTypeColor(
                                      projectType
                                    ) as ProjectTypeColor
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
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
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {teamSize}{" "}
                                  {teamSize === 1 ? "person" : "people"}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        <ProjectDescription variant="body1" sx={{ mb: 3 }}>
                          {description}
                        </ProjectDescription>

                        <ProjectTech sx={{ mb: 3 }}>
                          {technologies.map(
                            (tech: string, techIndex: number) => (
                              <TechChip
                                key={techIndex}
                                label={tech}
                                variant="outlined"
                                color="primary"
                                size="small"
                              />
                            )
                          )}
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
                          {liveUrl && (
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
                          {demoUrl && (
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
                        <Typography variant="h6">Technical Details</Typography>
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
                              Key Features
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
                        {!isUsingDatabase && (
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
                                Problem Statement
                              </Typography>
                              {project.problem && (
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                  {typeof project.problem === "string"
                                    ? project.problem
                                    : JSON.stringify(project.problem)}
                                </Typography>
                              )}

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
                                Solution Approach
                              </Typography>
                              {project.solution && (
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                  {typeof project.solution === "string"
                                    ? project.solution
                                    : JSON.stringify(project.solution)}
                                </Typography>
                              )}
                            </ProblemSolution>

                            {/* Architecture */}
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
                                Technical Architecture
                              </Typography>
                              {project.architecture && (
                                <Typography variant="body2">
                                  {typeof project.architecture === "string"
                                    ? project.architecture
                                    : JSON.stringify(project.architecture)}
                                </Typography>
                              )}
                            </ArchitectureSection>
                          </>
                        )}

                        {/* Technical Challenges */}
                        {technicalChallenges &&
                          technicalChallenges.length > 0 && (
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
                                Technical Challenges
                              </Typography>
                              {technicalChallenges.map(
                                (
                                  challenge: TechnicalChallenge,
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
                                      Challenge: {challenge.challenge}
                                    </Typography>
                                    <Typography variant="body2">
                                      Solution: {challenge.solution}
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
                              Code Examples
                            </Typography>
                            {codeExamples.map(
                              (example: CodeExample, exampleIndex: number) => (
                                <CodeExampleBox
                                  key={exampleIndex}
                                  sx={{ mb: 3 }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                    gutterBottom
                                  >
                                    {example.title}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 2 }}>
                                    {example.explanation}
                                  </Typography>
                                  <Box
                                    component="pre"
                                    sx={{
                                      backgroundColor: "grey.100",
                                      p: 2,
                                      borderRadius: 1,
                                      overflow: "auto",
                                      fontSize: "0.875rem",
                                      border: 1,
                                      borderColor: "grey.300",
                                    }}
                                  >
                                    <code>{example.code}</code>
                                  </Box>
                                  {example.explanation && (
                                    <Typography
                                      variant="body2"
                                      sx={{ mt: 2, fontStyle: "italic" }}
                                    >
                                      {example.explanation}
                                    </Typography>
                                  )}
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
          })}
        </Grid>
      </MotionWrapper>
    </PortfolioContainer>
  );
};

export default Portfolio;
