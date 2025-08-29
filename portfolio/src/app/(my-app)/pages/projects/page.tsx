"use client";

import { Box, Typography, Container } from "@mui/material";
import { Card } from "@/components/Card";

const projects = [
  {
    id: "1",
    title: "Portfolio Website",
    description:
      "A modern portfolio built with Next.js 15, React 19, and Payload CMS.",
    href: "/projects/portfolio-website",
    tagline: "Web Development",
    color: "#1976d2",
    animation: "fade" as const,
    glow: true,
  },
  {
    id: "2",
    title: "E-commerce Platform",
    description:
      "A full-featured online store with payment integration and admin dashboard.",
    href: "/projects/ecommerce-platform",
    tagline: "E-commerce",
    color: "#dc004e",
    animation: "slide" as const,
    glow: true,
  },
  {
    id: "3",
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates.",
    href: "/projects/task-management",
    tagline: "Productivity",
    color: "#4caf50",
    animation: "scale" as const,
    glow: true,
  },
  {
    id: "4",
    title: "Weather Dashboard",
    description:
      "A beautiful weather application with location-based forecasts.",
    href: "/projects/weather-dashboard",
    tagline: "Utility",
    color: "#ff9800",
    animation: "bounce" as const,
    glow: true,
  },
];

export default function ProjectsPage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          My Projects
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          mb={6}
        >
          A showcase of my work and technical expertise
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {projects.map((project) => (
            <Box key={project.id}>
              <Card
                title={project.title}
                tagline={project.tagline}
                description={project.description}
                href={project.href}
                buttonText="View Project"
                color={project.color}
                animation={project.animation}
                glow={project.glow}
                gradient={true}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
