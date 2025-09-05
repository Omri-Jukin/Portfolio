import { eq, asc, desc, and, sql, count } from "drizzle-orm";
import { getDB } from "../client";
import { projects } from "../schema/schema.tables";
import { ProjectStatus, ProjectType } from "../schema/schema.types";
import type {
  ProjectDB,
  NewProject,
  UpdateProject,
  ProjectStatistics,
  ProjectFilters,
} from "./Projects.type";
import { nanoid } from "nanoid";
import { IProject, TechnicalChallenge, CodeExample } from "#/lib";

// Helper function to get database client
const getDbClient = async () => getDB();

const transformDbToApi = (dbProject: ProjectDB): IProject => {
  // Map status to API ProjectStatus, excluding "deleted"
  const status = dbProject.status === "deleted" ? "archived" : dbProject.status;

  // Transform TTechnicalChallenges to TechnicalChallenge[]
  const technicalChallenges: TechnicalChallenge[] =
    dbProject.technicalChallenges.map((challenge, index) => ({
      id: `challenge-${index}`,
      title: challenge.challenge,
      problem: challenge.challenge,
      solution: challenge.solution,
      technologies: [],
      impact: "",
      project: dbProject.id,
    }));

  // Transform TCodeExamples to CodeExample[]
  const codeExamples: CodeExample[] = dbProject.codeExamples.map(
    (example, index) => ({
      id: `example-${index}`,
      title: example.title,
      description: example.explanation,
      language: example.language,
      code: example.code,
      explanation: example.explanation,
      project: dbProject.id,
      category: "general",
    })
  );

  return {
    ...dbProject,
    status,
    startDate: dbProject.startDate.toISOString(),
    endDate: dbProject.endDate ? dbProject.endDate.toISOString() : null,
    createdAt: dbProject.createdAt.toISOString(),
    updatedAt: dbProject.updatedAt ? dbProject.updatedAt.toISOString() : null,
    problem: dbProject.problem || null,
    solution: dbProject.solution || null,
    architecture: dbProject.architecture || null,
    titleTranslations: dbProject.titleTranslations || null,
    descriptionTranslations: dbProject.descriptionTranslations || null,
    technicalChallenges,
    codeExamples,
  };
};

export class ProjectManager {
  static async getAll(visibleOnly = false): Promise<IProject[]> {
    const conditions = visibleOnly ? [eq(projects.isVisible, true)] : [];

    const db = await getDbClient();
    const results = await db
      .select()
      .from(projects)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return results.map(transformDbToApi);
  }

  static async getById(id: string): Promise<IProject | null> {
    const db = await getDbClient();
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return result[0] ? transformDbToApi(result[0]) : null;
  }

  static async getByStatus(
    status: string,
    visibleOnly = false
  ): Promise<IProject[]> {
    const conditions = [eq(projects.status, status as ProjectStatus)];
    if (visibleOnly) {
      conditions.push(eq(projects.isVisible, true));
    }

    const db = await getDbClient();
    const results = await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return results.map(transformDbToApi);
  }

  static async getByType(
    projectType: string,
    visibleOnly = false
  ): Promise<IProject[]> {
    const conditions = [eq(projects.projectType, projectType as ProjectType)];
    if (visibleOnly) {
      conditions.push(eq(projects.isVisible, true));
    }

    const db = await getDbClient();
    const results = await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return results.map(transformDbToApi);
  }

  static async getByCategory(
    category: string,
    visibleOnly = false
  ): Promise<IProject[]> {
    const conditions = [
      sql`JSON_EXTRACT(${projects.categories}, '$') LIKE ${
        '%"' + category + '"%'
      }`,
    ];
    if (visibleOnly) {
      conditions.push(eq(projects.isVisible, true));
    }

    const db = await getDbClient();
    const results = await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return results.map(transformDbToApi);
  }

  static async getFeatured(visibleOnly = true): Promise<IProject[]> {
    const conditions = [eq(projects.isFeatured, true)];
    if (visibleOnly) {
      conditions.push(eq(projects.isVisible, true));
    }

    const db = await getDbClient();
    const results = await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return results.map(transformDbToApi);
  }

  static async getOpenSource(visibleOnly = true): Promise<IProject[]> {
    const conditions = [eq(projects.isOpenSource, true)];
    if (visibleOnly) {
      conditions.push(eq(projects.isVisible, true));
    }

    const db = await getDbClient();
    const results = await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return results.map(transformDbToApi);
  }

  static async create(
    project: Omit<NewProject, "id" | "createdAt">
  ): Promise<IProject> {
    const id = nanoid();
    const now = new Date();

    const newProject: NewProject = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDbClient();
    await db.insert(projects).values(newProject);

    const created = await this.getById(id);
    if (!created) {
      throw new Error("Failed to create project");
    }

    return created;
  }

  static async update(
    id: string,
    updates: Partial<Omit<NewProject, "id" | "createdAt">>
  ): Promise<IProject | null> {
    const now = new Date();

    const db = await getDbClient();
    await db
      .update(projects)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(projects.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDbClient();
    const result = await db.delete(projects).where(eq(projects.id, id));

    return result.changes > 0;
  }

  static async updateDisplayOrder(
    updates: { id: string; displayOrder: number }[]
  ): Promise<void> {
    const now = new Date();

    for (const update of updates) {
      const db = await getDbClient();
      await db
        .update(projects)
        .set({
          displayOrder: update.displayOrder,
          updatedAt: now,
        })
        .where(eq(projects.id, update.id));
    }
  }

  static async toggleVisibility(id: string): Promise<IProject | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isVisible: !current.isVisible,
    });
  }

  static async toggleFeatured(id: string): Promise<IProject | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isFeatured: !current.isFeatured,
    });
  }

  static async getStatistics(): Promise<ProjectStatistics> {
    // Get counts by status
    const db = await getDbClient();
    const statusStats = await db
      .select({
        status: projects.status,
        count: count(),
      })
      .from(projects)
      .where(eq(projects.isVisible, true))
      .groupBy(projects.status);

    // Get counts by type
    const typeStats = await db
      .select({
        projectType: projects.projectType,
        count: count(),
      })
      .from(projects)
      .where(eq(projects.isVisible, true))
      .groupBy(projects.projectType);

    // Get total counts
    const totalVisible = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.isVisible, true));

    const totalFeatured = await db
      .select({ count: count() })
      .from(projects)
      .where(and(eq(projects.isVisible, true), eq(projects.isFeatured, true)));

    const totalOpenSource = await db
      .select({ count: count() })
      .from(projects)
      .where(
        and(eq(projects.isVisible, true), eq(projects.isOpenSource, true))
      );

    const total = await db.select({ count: count() }).from(projects);

    // Get all projects to calculate categories and technologies
    const allProjects = await this.getAll(true);

    // Calculate category statistics
    const categoryMap = new Map<string, number>();
    const techMap = new Map<string, number>();

    allProjects.forEach((project) => {
      // Count categories
      project.categories.forEach((category) => {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      // Count technologies
      project.technologies.forEach((tech) => {
        techMap.set(tech, (techMap.get(tech) || 0) + 1);
      });
    });

    const byCategory = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const topTechnologies = Array.from(techMap.entries())
      .map(([technology, count]) => ({ technology, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 technologies

    return {
      total: total[0]?.count || 0,
      totalVisible: totalVisible[0]?.count || 0,
      totalFeatured: totalFeatured[0]?.count || 0,
      totalOpenSource: totalOpenSource[0]?.count || 0,
      byStatus: statusStats,
      byType: typeStats,
      byCategory,
      topTechnologies,
    };
  }

  static async bulkUpdate(
    ids: string[],
    updates: UpdateProject
  ): Promise<IProject[]> {
    const results = await Promise.all(
      ids.map((id) => this.update(id, updates))
    );
    return results.filter(Boolean) as IProject[];
  }

  static async bulkDelete(
    ids: string[]
  ): Promise<{ success: boolean; deletedCount: number }> {
    const results = await Promise.all(ids.map((id) => this.delete(id)));
    return {
      success: true,
      deletedCount: results.filter(Boolean).length,
    };
  }

  static async search(
    query: string,
    filters?: ProjectFilters
  ): Promise<IProject[]> {
    const conditions = [];

    // Text search across title, description, technologies
    if (query.trim()) {
      conditions.push(
        sql`(
          ${projects.title} LIKE ${"%" + query + "%"} OR 
          ${projects.description} LIKE ${"%" + query + "%"} OR 
          ${projects.longDescription} LIKE ${"%" + query + "%"} OR
          JSON_EXTRACT(${projects.technologies}, '$') LIKE ${
          "%" + query + "%"
        } OR
          JSON_EXTRACT(${projects.categories}, '$') LIKE ${"%" + query + "%"}
        )`
      );
    }

    // Apply filters
    if (filters?.status) {
      conditions.push(eq(projects.status, filters.status as ProjectStatus));
    }
    if (filters?.projectType) {
      conditions.push(
        eq(projects.projectType, filters.projectType as ProjectType)
      );
    }
    if (filters?.category) {
      conditions.push(
        sql`JSON_EXTRACT(${projects.categories}, '$') LIKE ${
          '%"' + filters.category + '"%'
        }`
      );
    }
    if (filters?.technology) {
      conditions.push(
        sql`JSON_EXTRACT(${projects.technologies}, '$') LIKE ${
          '%"' + filters.technology + '"%'
        }`
      );
    }
    if (filters?.isVisible !== undefined) {
      conditions.push(eq(projects.isVisible, filters.isVisible));
    }
    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(projects.isFeatured, filters.isFeatured));
    }
    if (filters?.isOpenSource !== undefined) {
      conditions.push(eq(projects.isOpenSource, filters.isOpenSource));
    }

    const db = await getDbClient();
    const results = await db
      .select()
      .from(projects)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(projects.displayOrder), desc(projects.startDate));

    return results.map(transformDbToApi);
  }
}
