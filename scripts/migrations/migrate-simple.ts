#!/usr/bin/env tsx

/**
 * Simple Data Migration Script: Direct Database Operations
 *
 * This script migrates static data directly to the database using the client
 * without importing the managers to avoid top-level await issues.
 *
 * Usage: npx tsx scripts/migrations/migrate-simple.ts
 */

import { getDB } from "../../lib/db/client";
import {
  workExperiences,
  projects,
  skills,
} from "../../lib/db/schema/schema.tables";

// Import static data
import enLocale from "../../locales/en.json";
import { PORTFOLIO_CONSTANTS } from "../../Components/Portfolio/Portfolio.const";

async function migrateWorkExperiences() {
  console.log("🔄 Migrating Work Experiences...");

  const db = await getDB();
  const experiences = enLocale.career.experiences;
  let migrated = 0;

  for (const exp of experiences) {
    try {
      // Parse the time range
      const [startYear, endYear] = exp.time.split(" - ");
      const startDate = new Date(`${startYear}-01-01`);
      let endDate: Date | null = null;

      if (endYear && endYear !== "Present" && endYear !== "2025") {
        endDate = new Date(`${endYear}-12-31`);
      }

      const workExpData = {
        id: `workexp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: exp.role,
        company: exp.company.split(",")[0],
        location: exp.company.includes(",")
          ? exp.company.split(",")[1].trim()
          : "Israel",
        startDate,
        endDate,
        description:
          exp.details[0]?.split(" - ")[1] || `${exp.role} at ${exp.company}`,
        achievements: exp.details.slice(0, 3),
        responsibilities: exp.details.slice(3),
        technologies: ["TypeScript", "React", "Node.js"], // Default fallback
        employmentType: "full-time" as const,
        industry: "Technology",
        displayOrder: migrated,
        isVisible: true,
        isFeatured: migrated === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "migration-script",
      };

      await db.insert(workExperiences).values(workExpData);
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

  const db = await getDB();
  const projectList = PORTFOLIO_CONSTANTS.PROJECTS;
  let migrated = 0;

  for (const project of projectList) {
    try {
      // Estimate project dates
      const currentYear = new Date().getFullYear();
      const startDate = new Date(`${currentYear - 1}-01-01`);
      const endDate =
        project.id === "portfolio" ? null : new Date(`${currentYear}-06-01`);

      const projectData = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        longDescription: project.solution || null,
        technologies: project.technologies,
        categories: ["web", "full-stack"],
        status: "completed" as const,
        projectType: project.githubUrl.includes("ClipWhisperer")
          ? ("open-source" as const)
          : ("personal" as const),
        startDate,
        endDate,
        githubUrl: project.githubUrl || null,
        liveUrl: project.liveUrl || null,
        demoUrl: null,
        documentationUrl: null,
        images: [],
        keyFeatures: project.keyFeatures,
        technicalChallenges: [],
        codeExamples: [],
        teamSize: null,
        myRole: null,
        clientName: null,
        budget: null,
        displayOrder: migrated,
        isVisible: true,
        isFeatured: migrated < 3,
        isOpenSource: project.githubUrl.includes("github.com"),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "migration-script",
      };

      await db.insert(projects).values(projectData);
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

  const db = await getDB();
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

        const yearsOfExperience = Math.max(
          1,
          Math.floor(proficiencyLevel / 20)
        );

        const skillData = {
          id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: technology,
          category: "technical" as const,
          subCategory: skillCategory.name,
          proficiencyLevel,
          proficiencyLabel: proficiencyLabel as any,
          yearsOfExperience,
          description: `${skillCategory.name} technology`,
          icon: null,
          color: null,
          relatedSkills: [],
          certifications: [],
          projects: [],
          lastUsed: new Date(),
          isVisible: true,
          displayOrder: migrated,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "migration-script",
        };

        await db.insert(skills).values(skillData);
        migrated++;
        console.log(`✅ Migrated: ${technology} (${skillCategory.name})`);
      } catch (error) {
        console.error(`❌ Failed to migrate: ${technology}`, error);
      }
    }
  }

  console.log(`✅ Skills migration completed: ${migrated} records\n`);
}

async function main() {
  try {
    console.log(
      "🚀 Starting simple data migration from static files to database...\n"
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
