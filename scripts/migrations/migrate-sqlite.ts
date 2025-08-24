#!/usr/bin/env tsx

/**
 * SQLite Direct Migration Script
 *
 * This script uses direct SQLite operations to bypass Cloudflare context issues
 * in development mode.
 *
 * Usage: npx tsx scripts/migrations/migrate-sqlite.ts
 */

import Database from "better-sqlite3";
import path from "path";

// Import static data
import enLocale from "../../locales/en.json";
import { PORTFOLIO_CONSTANTS } from "~/Portfolio/Portfolio.const";

const DB_PATH = path.join(process.cwd(), "portfolio.db");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function migrateWorkExperiences(db: any) {
  console.log("🔄 Migrating Work Experiences...");

  const experiences = enLocale.career.experiences;
  let migrated = 0;

  // Create table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS work_experiences (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      description TEXT NOT NULL,
      achievements TEXT NOT NULL DEFAULT '[]',
      responsibilities TEXT NOT NULL DEFAULT '[]',
      technologies TEXT NOT NULL DEFAULT '[]',
      employment_type TEXT NOT NULL DEFAULT 'full-time',
      industry TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_visible INTEGER NOT NULL DEFAULT 1,
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT NOT NULL
    )
  `);

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO work_experiences
    (id, role, company, location, start_date, end_date, description, achievements, responsibilities, technologies, employment_type, industry, display_order, is_visible, is_featured, created_at, updated_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const exp of experiences) {
    try {
      // Parse the time range
      const [startYear, endYear] = exp.time.split(" - ");
      const startDate = `${startYear}-01-01`;
      let endDate: string | null = null;

      if (endYear && endYear !== "Present" && endYear !== "2025") {
        endDate = `${endYear}-12-31`;
      }

      const workExpData = [
        `workexp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exp.role,
        exp.company.split(",")[0],
        exp.company.includes(",") ? exp.company.split(",")[1].trim() : "Israel",
        startDate,
        endDate,
        exp.details[0]?.split(" - ")[1] || `${exp.role} at ${exp.company}`,
        JSON.stringify(exp.details.slice(0, 3)),
        JSON.stringify(exp.details.slice(3)),
        JSON.stringify(["TypeScript", "React", "Node.js"]),
        "full-time",
        "Technology",
        migrated,
        1,
        migrated === 0 ? 1 : 0,
        new Date().toISOString(),
        new Date().toISOString(),
        "migration-script",
      ];

      insertStmt.run(...workExpData);
      migrated++;
      console.log(`✅ Migrated: ${exp.role} at ${exp.company}`);
    } catch (error) {
      console.error(`❌ Failed to migrate: ${exp.role}`, error);
    }
  }

  console.log(`✅ Work Experiences migration completed: ${migrated} records\n`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function migrateProjects(db: any) {
  console.log("🔄 Migrating Projects...");

  const projectList = PORTFOLIO_CONSTANTS.PROJECTS;
  let migrated = 0;

  // Create table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      technologies TEXT NOT NULL DEFAULT '[]',
      categories TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'completed',
      project_type TEXT NOT NULL DEFAULT 'personal',
      start_date TEXT NOT NULL,
      end_date TEXT,
      github_url TEXT,
      live_url TEXT,
      demo_url TEXT,
      documentation_url TEXT,
      images TEXT NOT NULL DEFAULT '[]',
      key_features TEXT NOT NULL DEFAULT '[]',
      technical_challenges TEXT NOT NULL DEFAULT '[]',
      code_examples TEXT NOT NULL DEFAULT '[]',
      team_size INTEGER,
      my_role TEXT,
      client_name TEXT,
      budget TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_visible INTEGER NOT NULL DEFAULT 1,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_open_source INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT NOT NULL
    )
  `);

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO projects
    (id, title, subtitle, description, long_description, technologies, categories, status, project_type, start_date, end_date, github_url, live_url, demo_url, documentation_url, images, key_features, technical_challenges, code_examples, team_size, my_role, client_name, budget, display_order, is_visible, is_featured, is_open_source, created_at, updated_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const project of projectList) {
    try {
      // Estimate project dates
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear - 1}-01-01`;
      const endDate =
        project.id === "portfolio" ? null : `${currentYear}-06-01`;

      const projectData = [
        `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        project.title,
        project.subtitle,
        project.description,
        project.solution || null,
        JSON.stringify(project.technologies),
        JSON.stringify(["web", "full-stack"]),
        "completed",
        project.githubUrl.includes("ClipWhisperer")
          ? "open-source"
          : "personal",
        startDate,
        endDate,
        project.githubUrl || null,
        project.liveUrl || null,
        null,
        null,
        JSON.stringify([]),
        JSON.stringify(project.keyFeatures),
        JSON.stringify([]),
        JSON.stringify([]),
        null,
        null,
        null,
        null,
        migrated,
        1,
        migrated < 3 ? 1 : 0,
        project.githubUrl.includes("github.com") ? 1 : 0,
        new Date().toISOString(),
        new Date().toISOString(),
        "migration-script",
      ];

      insertStmt.run(...projectData);
      migrated++;
      console.log(`✅ Migrated: ${project.title}`);
    } catch (error) {
      console.error(`❌ Failed to migrate: ${project.title}`, error);
    }
  }

  console.log(`✅ Projects migration completed: ${migrated} records\n`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function migrateSkills(db: any) {
  console.log("🔄 Migrating Skills...");

  const skillsData = enLocale.skills;
  let migrated = 0;

  // Create table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT,
      proficiency_level INTEGER NOT NULL,
      proficiency_label TEXT NOT NULL,
      years_of_experience INTEGER NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      related_skills TEXT NOT NULL DEFAULT '[]',
      certifications TEXT NOT NULL DEFAULT '[]',
      projects TEXT NOT NULL DEFAULT '[]',
      last_used TEXT NOT NULL,
      is_visible INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT NOT NULL
    )
  `);

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO skills
    (id, name, category, sub_category, proficiency_level, proficiency_label, years_of_experience, description, icon, color, related_skills, certifications, projects, last_used, is_visible, display_order, created_at, updated_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

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

        const skillData = [
          `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          technology,
          "technical",
          skillCategory.name,
          proficiencyLevel,
          proficiencyLabel,
          yearsOfExperience,
          `${skillCategory.name} technology`,
          null,
          null,
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([]),
          new Date().toISOString(),
          1,
          migrated,
          new Date().toISOString(),
          new Date().toISOString(),
          "migration-script",
        ];

        insertStmt.run(...skillData);
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
      "🚀 Starting SQLite direct migration from static files to database...\n"
    );

    // Create database connection
    const db = new Database(DB_PATH);
    console.log(`✅ Database connection established at ${DB_PATH}\n`);

    // Run migrations
    await migrateWorkExperiences(db);
    await migrateProjects(db);
    await migrateSkills(db);

    // Close database
    db.close();

    console.log("🎉 Data migration completed successfully!");
    console.log("\n📝 Next Steps:");
    console.log("1. Review migrated data in the database");
    console.log("2. Test the new CRUD functionality");
    console.log("3. Update frontend components to use database data");
    console.log("4. Deploy to production with proper Cloudflare D1 setup");
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
if (typeof require !== "undefined" && require.main === module) {
  main();
}
