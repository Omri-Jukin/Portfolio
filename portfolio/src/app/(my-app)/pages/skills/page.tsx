"use client";

import { Box, Container, Typography } from "@mui/material";
import { SkillsShowcase } from "@/components/SkillsShowcase";
import SkillsGrid from "@/components/SkillsGrid";

const mockSkills = [
  { name: "Next.js", level: 95, category: "Frontend" },
  { name: "React", level: 90, category: "Frontend" },
  { name: "TypeScript", level: 95, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 50, category: "Backend" },
  { name: "PostgreSQL", level: 82, category: "Database" },
  { name: "Docker", level: 50, category: "DevOps" },
  { name: "AWS", level: 60, category: "Cloud" },
  { name: "Git", level: 75, category: "Tools" },
  { name: "Jest", level: 75, category: "Testing" },
];

export default function SkillsPage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            Skills & Technologies
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A comprehensive overview of my technical expertise and experience
          </Typography>
        </Box>

        <SkillsShowcase
          title="Core Skills"
          subtitle="Technologies I work with daily"
          maxSkills={12}
          showCategories={true}
        />

        <Box mt={8}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            Skills by Category
          </Typography>
          <SkillsGrid skills={mockSkills} showLevels={true} compact={false} />
        </Box>
      </Box>
    </Container>
  );
}
