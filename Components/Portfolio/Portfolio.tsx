import React, { useState } from "react";
import { Box, Typography, Grid, Button, Divider, Link } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Architecture as ArchitectureIcon,
  BugReport as BugReportIcon,
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
import type { PortfolioProps } from "./Portfolio.type";

const Portfolio: React.FC<PortfolioProps> = ({ className }) => {
  const [expandedProject, setExpandedProject] = useState<string | false>(false);

  const handleAccordionChange =
    (projectId: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedProject(isExpanded ? projectId : false);
    };

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
          {PORTFOLIO_CONSTANTS.PROJECTS.map((project, index) => (
            <Grid key={project.id} component="div">
              <MotionWrapper
                variant="fadeInUp"
                duration={0.8}
                delay={index * 0.2}
              >
                <ProjectCard elevation={3}>
                  <ProjectHeader>
                    <Box sx={{ flexGrow: 1 }}>
                      <ProjectTitle variant="h4" gutterBottom>
                        {project.title}
                      </ProjectTitle>
                      <ProjectSubtitle variant="h6" gutterBottom>
                        {project.subtitle}
                      </ProjectSubtitle>
                      <ProjectDescription variant="body1" sx={{ mb: 3 }}>
                        {project.description}
                      </ProjectDescription>

                      <ProjectTech sx={{ mb: 3 }}>
                        {project.technologies.map((tech, techIndex) => (
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
                        <Button
                          component={Link}
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          startIcon={<GitHubIcon />}
                          sx={{ mr: 2 }}
                        >
                          View Code
                        </Button>
                        {project.liveUrl && (
                          <Button
                            component={Link}
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            startIcon={<LaunchIcon />}
                          >
                            Live Demo
                          </Button>
                        )}
                      </ProjectActions>
                    </Box>
                  </ProjectHeader>

                  <Divider sx={{ my: 3 }} />

                  <AccordionRoot
                    expanded={expandedProject === project.id}
                    onChange={handleAccordionChange(project.id)}
                  >
                    <AccordionSummaryRoot expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <ArchitectureIcon sx={{ mr: 1 }} />
                        Technical Details & Implementation
                      </Typography>
                    </AccordionSummaryRoot>
                    <AccordionDetailsRoot>
                      <Grid container spacing={3}>
                        {/* Problem & Solution */}
                        <Grid component="div">
                          <ProblemSolution>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ color: "primary.main" }}
                            >
                              <BugReportIcon
                                sx={{ mr: 1, verticalAlign: "middle" }}
                              />
                              Problem & Solution
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              <strong>Challenge:</strong> {project.problem}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              <strong>Approach:</strong> {project.solution}
                            </Typography>
                          </ProblemSolution>
                        </Grid>

                        {/* Architecture */}
                        <Grid component="div">
                          <ArchitectureSection>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ color: "primary.main" }}
                            >
                              <ArchitectureIcon
                                sx={{ mr: 1, verticalAlign: "middle" }}
                              />
                              Architecture & Design
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {project.architecture}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Key Features:
                              </Typography>
                              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                {project.keyFeatures.map(
                                  (feature, featureIndex) => (
                                    <li key={featureIndex}>
                                      <Typography variant="body2">
                                        {feature}
                                      </Typography>
                                    </li>
                                  )
                                )}
                              </ul>
                            </Box>
                          </ArchitectureSection>
                        </Grid>

                        {/* Code Examples */}
                        <Grid component="div">
                          <CodeExampleBox>
                            <Typography
                              variant="subtitle2"
                              sx={{ mb: 1, fontWeight: "bold" }}
                            >
                              Code Example:
                            </Typography>
                            {project.codeExamples.map(
                              (example, exampleIndex) => (
                                <Box key={exampleIndex} sx={{ mb: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ mb: 1, fontWeight: "bold" }}
                                  >
                                    {example.title}
                                  </Typography>
                                  <pre>{example.code}</pre>
                                  <Typography
                                    variant="body2"
                                    sx={{ mt: 1, color: "text.secondary" }}
                                  >
                                    {example.explanation}
                                  </Typography>
                                </Box>
                              )
                            )}
                          </CodeExampleBox>
                        </Grid>

                        {/* Technical Challenges */}
                        <Grid component="div">
                          <Box>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ color: "primary.main" }}
                            >
                              Technical Challenges & Solutions
                            </Typography>
                            {project.technicalChallenges.map(
                              (challenge, challengeIndex) => (
                                <Box key={challengeIndex} sx={{ mb: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {challenge.title}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 2 }}>
                                    <strong>Challenge:</strong>{" "}
                                    {challenge.description}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 2 }}>
                                    <strong>Solution:</strong>{" "}
                                    {challenge.solution}
                                  </Typography>
                                </Box>
                              )
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetailsRoot>
                  </AccordionRoot>
                </ProjectCard>
              </MotionWrapper>
            </Grid>
          ))}
        </Grid>
      </MotionWrapper>
    </PortfolioContainer>
  );
};

export default Portfolio;
