#!/usr/bin/env tsx

/**
 * Data Migration Script: Static Data to Database
 *
 * This script migrates static data from locale files and constants
 * to the new database CRUD system.
 *
 * Usage: npx tsx scripts/migrations/migrate-static-data.ts
 */

import { getDB } from "../../lib/db/client";
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { SkillManager } from "$/db/skills/SkillManager";

// Import static data
import enLocale from "../../locales/en.json";
import { PORTFOLIO_CONSTANTS } from "../../Components/Portfolio/Portfolio.const";
import {
  CodeExample,
  TechnicalChallenge,
} from "#/lib/db/projects/Projects.type";

async function migrateWorkExperiences() {
  console.log("🔄 Migrating Work Experiences...");

  const experiences = enLocale.career.experiences;
  let migrated = 0;

  for (const exp of experiences) {
    try {
      // Parse the time range
      const [startYear, endYear] = exp.time.split(" - ");
      const startDate = new Date(`${startYear}-01-01`);
      let endDate: Date | undefined;

      if (endYear && endYear !== "Present" && endYear !== "2025") {
        endDate = new Date(`${endYear}-12-31`);
      }

      // Extract technologies from details
      const techDetail = exp.details.find(
        (detail: string) =>
          detail.includes("Technical Stack:") ||
          detail.includes("Stack Técnico:")
      );

      const technologies = techDetail
        ? techDetail
            .split(":")[1]
            ?.split(",")
            .map((tech: string) => tech.trim()) || []
        : ["TypeScript", "React", "Node.js"]; // Default fallback

      // Extract achievements and responsibilities
      const achievements = exp.details
        .filter((detail: string) => !detail.includes("Technical Stack:"))
        .slice(0, 3); // Take first 3 as achievements

      const responsibilities = exp.details
        .filter((detail: string) => !detail.includes("Technical Stack:"))
        .slice(3); // Rest as responsibilities

      // Determine employment type and industry
      const employmentType = exp.role.toLowerCase().includes("freelance")
        ? "freelance"
        : exp.role.toLowerCase().includes("intern")
        ? "internship"
        : "full-time";

      const industry = exp.company.toLowerCase().includes("insurance")
        ? "Insurance"
        : exp.company.toLowerCase().includes("tech")
        ? "Technology"
        : "Technology";

      const workExpData = {
        role: exp.role,
        company: exp.company.split(",")[0], // Remove location from company name
        location: exp.company.includes(",")
          ? exp.company.split(",")[1].trim()
          : "Israel",
        startDate,
        endDate,
        description:
          exp.details[0]?.split(" - ")[1] || `${exp.role} at ${exp.company}`,
        achievements,
        technologies,
        responsibilities:
          responsibilities.length > 0 ? responsibilities : achievements,
        employmentType: employmentType as any,
        industry,
        displayOrder: migrated,
        isVisible: true,
        isFeatured: migrated === 0, // First experience is featured
        createdBy: "migration-script", // Will need to update with actual admin user ID
      };

      await WorkExperienceManager.create(workExpData);
      migrated++;
      console.log(`✅ Migrated: ${exp.role} at ${exp.company}`);
    } catch (error) {
      console.error(`❌ Failed to migrate: ${exp.role}`, error);
    }
  }

  console.log(`✅ Work Experiences migration completed: ${migrated} records\n`);
}

async function migrateProjects() {
  console.log("🔄 Migrating Projects...");

  const projects = PORTFOLIO_CONSTANTS.PROJECTS;
  let migrated = 0;

  for (const project of projects) {
    try {
      // Estimate project dates (since not in static data)
      const currentYear = new Date().getFullYear();
      const startDate = new Date(`${currentYear - 1}-01-01`);
      const endDate =
        project.id === "portfolio"
          ? undefined
          : new Date(`${currentYear}-06-01`);

      const projectData = {
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        longDescription: project.solution,
        technologies: project.technologies,
        categories: ["web", "full-stack"], // Default categories
        status: "completed" as const,
        projectType: project.githubUrl.includes("ClipWhisperer")
          ? ("open-source" as const)
          : ("personal" as const),
        startDate,
        endDate,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        keyFeatures: project.keyFeatures,
        technicalChallenges: project.technicalChallenges.map((challenge) => ({
          title: challenge.title,
          challenge: challenge.challenge,
          description: challenge.description,
          solution: challenge.solution,
        })) as TechnicalChallenge[],
        codeExamples: project.codeExamples.map((example) => ({
          language: example.language,
          title: example.title,
          code: example.code,
          explanation: example.explanation,
        })) as CodeExample[],
        displayOrder: migrated,
        isVisible: true,
        isFeatured: migrated < 3, // First 3 projects are featured
        isOpenSource: project.githubUrl.includes("github.com"),
        createdBy: "migration-script",
      };

      await ProjectManager.create(projectData);
      migrated++;
      console.log(`✅ Migrated: ${project.title}`);
    } catch (error) {
      console.error(`❌ Failed to migrate: ${project.title}`, error);
    }
  }

  console.log(`✅ Projects migration completed: ${migrated} records\n`);
}

async function migrateSkills() {
  console.log("🔄 Migrating Skills...");

  const skillsData = enLocale.skills;
  let migrated = 0;

  // Migrate technical skills
  for (const skillCategory of skillsData.categories.technical.skills) {
    for (const technology of skillCategory.technologies) {
      try {
        const proficiencyLevel = skillCategory.level;
        const proficiencyLabel =
          proficiencyLevel >= 90
            ? "expert"
            : proficiencyLevel >= 75
            ? "advanced"
            : proficiencyLevel >= 50
            ? "intermediate"
            : "beginner";

        // Estimate years of experience based on proficiency
        const yearsOfExperience = Math.max(
          1,
          Math.floor(proficiencyLevel / 20)
        );

        const skillData = {
          name: technology,
          category: "technical" as const,
          subCategory: skillCategory.name,
          proficiencyLevel,
          proficiencyLabel: proficiencyLabel as any,
          yearsOfExperience,
          description: `${skillCategory.name} technology`,
          lastUsed: new Date(), // Assume recently used
          displayOrder: migrated,
          isVisible: true,
          createdBy: "migration-script",
        };

        await SkillManager.create(skillData);
        migrated++;
        console.log(`✅ Migrated: ${technology} (${skillCategory.name})`);
      } catch (error) {
        console.error(`❌ Failed to migrate: ${technology}`, error);
      }
    }
  }

  // Migrate soft skills
  if (skillsData.categories.soft?.skills) {
    for (const softSkill of skillsData.categories.soft.skills) {
      try {
        const skillData = {
          name: softSkill.name,
          category: "soft" as const,
          proficiencyLevel: softSkill.level || 80,
          proficiencyLabel: "advanced" as const,
          yearsOfExperience: 3,
          description: softSkill.description || `${softSkill.name} skill`,
          lastUsed: new Date(),
          displayOrder: migrated,
          isVisible: true,
          createdBy: "migration-script",
        };

        await SkillManager.create(skillData);
        migrated++;
        console.log(`✅ Migrated: ${softSkill.name} (Soft Skill)`);
      } catch (error) {
        console.error(`❌ Failed to migrate: ${softSkill.name}`, error);
      }
    }
  }

  console.log(`✅ Skills migration completed: ${migrated} records\n`);
}

async function main() {
  try {
    console.log(
      "🚀 Starting data migration from static files to database...\n"
    );

    // Ensure database connection
    const db = await getDB();
    console.log("✅ Database connection established\n");

    // Run migrations
    await migrateWorkExperiences();
    await migrateProjects();
    await migrateSkills();

    console.log("🎉 Data migration completed successfully!");
    console.log("\n📝 Next Steps:");
    console.log("1. Update the 'createdBy' field with actual admin user IDs");
    console.log("2. Review migrated data in the admin interface");
    console.log("3. Update frontend components to use database data");
    console.log("4. Test the new CRUD functionality");
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}
