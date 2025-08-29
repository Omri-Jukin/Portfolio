"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  AlertColor,
} from "@mui/material";
import { trpc } from "@/lib/trpc";
import { Loading } from "@/components/Loading";
import { GridContainer } from "../Common";

interface SkillsShowcaseProps {
  title?: string;
  subtitle?: string;
  maxSkills?: number;
  showCategories?: boolean;
}

export default function SkillsShowcase({
  title = "Skills & Technologies",
  subtitle = "Technologies I work with",
  maxSkills = 12,
  showCategories = true,
}: SkillsShowcaseProps) {
  const {
    data: skills,
    isLoading,
    error,
  } = trpc.skills.list.useQuery({
    limit: maxSkills,
  });

  const { data: categories } = trpc.skills.categories.useQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error" variant="body1">
          Failed to load skills: {error.message}
        </Typography>
      </Box>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          No skills found
        </Typography>
      </Box>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "success";
      case "advanced":
        return "primary";
      case "intermediate":
        return "warning";
      case "beginner":
        return "default";
      default:
        return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "error",
    ];
    const index = categories?.indexOf(category) ?? 0;
    return colors[index % colors.length];
  };

  return (
    <Box py={4}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
      </Box>

      {showCategories && categories && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                color={getCategoryColor(category) as AlertColor}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        {skills.map((skill) => (
          <GridContainer key={skill.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography variant="h3" gutterBottom>
                  {skill.icon}
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                  {skill.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {skill.description}
                </Typography>
                <Box display="flex" justifyContent="center" gap={1} mt={2}>
                  <Chip
                    label={skill.level}
                    color={getLevelColor(skill.level) as AlertColor}
                    size="small"
                  />
                  <Chip
                    label={`${skill.yearsOfExperience} years`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </GridContainer>
        ))}
      </Grid>
    </Box>
  );
}
