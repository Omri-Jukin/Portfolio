import Badge from "@/components/Badge";
import Card from "@/components/Card";
import { Box, Typography } from "@mui/material";

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface SkillsGridProps {
  skills: Skill[];
  compact?: boolean;
}

export default function SkillsGrid({
  skills,
  compact = false,
}: SkillsGridProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  const getLevelColor = (level: number) => {
    if (level >= 90) return "success";
    if (level >= 70) return "primary";
    if (level >= 50) return "warning";
    return "default";
  };

  if (compact) {
    return (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <Box key={category} textAlign="center">
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              {category}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {categorySkills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant={getLevelColor(skill.level)}
                  size="sm"
                  className="block w-full"
                >
                  {skill.name}
                </Badge>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <Box key={category}>
          <Card
            title={category}
            description={`${categorySkills.length} skills`}
            href={`/skills/${category.toLowerCase()}`}
            color="#4ECDC4"
          />
        </Box>
      ))}
    </Box>
  );
}
