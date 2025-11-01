import { eq, asc, desc, and, isNull, isNotNull, count, or } from "drizzle-orm";
import { getDB } from "../client";
import { workExperiences } from "../schema/schema.tables";
import { EmploymentType } from "../schema/schema.types";
import type {
  WorkExperience,
  WorkExperienceDB,
  NewWorkExperience,
  UpdateWorkExperience,
  WorkExperienceStatistics,
  WorkExperienceFilters,
} from "./WorkExperiences.type";
import { nanoid } from "nanoid";

// Helper function to get database client
const getDbClient = () => getDB();

// Helper function to transform DB dates to API strings
const transformDbToApi = (dbWorkExp: WorkExperienceDB): WorkExperience => ({
  ...dbWorkExp,
  startDate: dbWorkExp.startDate.toISOString(),
  endDate: dbWorkExp.endDate ? dbWorkExp.endDate.toISOString() : null,
  createdAt: dbWorkExp.createdAt.toISOString(),
  updatedAt: dbWorkExp.updatedAt ? dbWorkExp.updatedAt.toISOString() : null,
});

export class WorkExperienceManager {
  static async getAll(visibleOnly = false): Promise<WorkExperience[]> {
    const conditions = visibleOnly ? [eq(workExperiences.isVisible, true)] : [];

    const db = getDbClient();
    const results = await (
      await db
    )
      .select()
      .from(workExperiences)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        desc(workExperiences.startDate),
        asc(workExperiences.displayOrder)
      );

    return results.map(transformDbToApi);
  }

  static async getById(id: string): Promise<WorkExperience | null> {
    const db = getDbClient();
    const result = await (await db)
      .select()
      .from(workExperiences)
      .where(eq(workExperiences.id, id))
      .limit(1);

    return result[0] ? transformDbToApi(result[0]) : null;
  }

  static async getByEmploymentType(
    employmentType: string,
    visibleOnly = false
  ): Promise<WorkExperience[]> {
    const db = getDbClient();
    const conditions = [
      eq(workExperiences.employmentType, employmentType as EmploymentType),
    ];
    if (visibleOnly) {
      conditions.push(eq(workExperiences.isVisible, true));
    }

    const results = await (
      await db
    )
      .select()
      .from(workExperiences)
      .where(and(...conditions))
      .orderBy(
        desc(workExperiences.startDate),
        asc(workExperiences.displayOrder)
      );

    return results.map(transformDbToApi);
  }

  static async getCurrentPosition(): Promise<WorkExperience | null> {
    const db = getDbClient();
    const result = await (
      await db
    )
      .select()
      .from(workExperiences)
      .where(
        and(
          isNull(workExperiences.endDate),
          eq(workExperiences.isVisible, true)
        )
      )
      .orderBy(desc(workExperiences.startDate))
      .limit(1);

    return result[0] ? transformDbToApi(result[0]) : null;
  }

  static async getFeatured(visibleOnly = true): Promise<WorkExperience[]> {
    const db = getDbClient();
    const conditions = [eq(workExperiences.isFeatured, true)];
    if (visibleOnly) {
      conditions.push(eq(workExperiences.isVisible, true));
    }

    const results = await (
      await db
    )
      .select()
      .from(workExperiences)
      .where(and(...conditions))
      .orderBy(
        desc(workExperiences.startDate),
        asc(workExperiences.displayOrder)
      );

    return results.map(transformDbToApi);
  }

  static async create(
    workExperience: Omit<NewWorkExperience, "id" | "createdAt">
  ): Promise<WorkExperience> {
    try {
      const id = nanoid();
      const now = new Date();

      const newWorkExperience: NewWorkExperience = {
        ...workExperience,
        id,
        createdAt: now,
        updatedAt: now,
      };

      const db = getDbClient();
      if (!db) throw new Error("Database connection not available");

      await (await db).insert(workExperiences).values(newWorkExperience);

      const created = await this.getById(id);
      if (!created) {
        throw new Error("Failed to retrieve created work experience");
      }

      return created;
    } catch (error) {
      console.error("Error creating work experience:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to create work experience: ${error.message}`);
      }
      throw new Error("Failed to create work experience: Unknown error");
    }
  }

  static async update(
    id: string,
    updates: Partial<Omit<NewWorkExperience, "id" | "createdAt">>
  ): Promise<WorkExperience | null> {
    const db = getDbClient();
    const now = new Date();

    await (
      await db
    )
      .update(workExperiences)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(workExperiences.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDbClient();
    const result = await (await db)
      .delete(workExperiences)
      .where(eq(workExperiences.id, id))
      .returning();

    return result.length > 0;
  }

  static async updateDisplayOrder(
    updates: { id: string; displayOrder: number }[]
  ): Promise<void> {
    const db = getDbClient();
    const now = new Date();

    for (const update of updates) {
      await (
        await db
      )
        .update(workExperiences)
        .set({
          displayOrder: update.displayOrder,
          updatedAt: now,
        })
        .where(eq(workExperiences.id, update.id));
    }
  }

  static async toggleVisibility(id: string): Promise<WorkExperience | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isVisible: !current.isVisible,
    });
  }

  static async toggleFeatured(id: string): Promise<WorkExperience | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isFeatured: !current.isFeatured,
    });
  }

  static async getStatistics(): Promise<WorkExperienceStatistics> {
    const db = getDbClient();

    // Get counts by employment type using raw SQL
    const employmentTypeStats = await (
      await db
    )
      .select({
        employmentType: workExperiences.employmentType,
        count: count(),
      })
      .from(workExperiences)
      .where(eq(workExperiences.isVisible, true))
      .groupBy(workExperiences.employmentType);

    // Get counts by industry using raw SQL
    const industryStats = await (
      await db
    )
      .select({
        industry: workExperiences.industry,
        count: count(),
      })
      .from(workExperiences)
      .where(eq(workExperiences.isVisible, true))
      .groupBy(workExperiences.industry);

    // Get total counts using raw SQL
    const totalVisible = await (
      await db
    )
      .select({
        count: count(),
      })
      .from(workExperiences)
      .where(eq(workExperiences.isVisible, true));

    const totalFeatured = await (
      await db
    )
      .select({
        count: count(),
      })
      .from(workExperiences)
      .where(
        and(
          eq(workExperiences.isVisible, true),
          eq(workExperiences.isFeatured, true)
        )
      );

    const total = await (
      await db
    )
      .select({
        count: count(),
      })
      .from(workExperiences);

    // Calculate total years of experience
    const allExperiences = await this.getAll(true);
    const totalYearsExperience = allExperiences.reduce((total, exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      const years =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);

    // Get current position
    const currentPosition = await this.getCurrentPosition();

    return {
      total: (total[0] as { count: number })?.count || 0,
      totalVisible: (totalVisible[0] as { count: number })?.count || 0,
      totalFeatured: (totalFeatured[0] as { count: number })?.count || 0,
      byEmploymentType: employmentTypeStats as {
        employmentType: string;
        count: number;
      }[],
      byIndustry: industryStats as {
        industry: string;
        count: number;
      }[],
      totalYearsExperience: Math.round(totalYearsExperience * 10) / 10, // Round to 1 decimal
      currentPosition,
    };
  }

  static async bulkUpdate(
    ids: string[],
    updates: UpdateWorkExperience
  ): Promise<WorkExperience[]> {
    const results = await Promise.all(
      ids.map((id) => this.update(id, updates))
    );
    return results.filter(Boolean) as WorkExperience[];
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
    filters?: WorkExperienceFilters
  ): Promise<WorkExperience[]> {
    const db = getDbClient();
    const conditions = [];

    // Text search across role, company, description
    if (query.trim()) {
      conditions.push(
        or(
          eq(workExperiences.role, "%" + query + "%"),
          eq(workExperiences.company, "%" + query + "%"),
          eq(workExperiences.description, "%" + query + "%"),
          eq(workExperiences.industry, "%" + query + "%")
        )
      );
    }

    // Apply filters
    if (filters?.employmentType) {
      conditions.push(
        eq(
          workExperiences.employmentType,
          filters.employmentType as EmploymentType
        )
      );
    }
    if (filters?.industry) {
      conditions.push(eq(workExperiences.industry, filters.industry));
    }
    if (filters?.isVisible !== undefined) {
      conditions.push(eq(workExperiences.isVisible, filters.isVisible));
    }
    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(workExperiences.isFeatured, filters.isFeatured));
    }
    if (filters?.isCurrent !== undefined) {
      if (filters.isCurrent) {
        conditions.push(isNull(workExperiences.endDate));
      } else {
        conditions.push(isNotNull(workExperiences.endDate));
      }
    }

    const results = await (
      await db
    )
      .select()
      .from(workExperiences)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        desc(workExperiences.startDate),
        asc(workExperiences.displayOrder)
      );

    return results.map(transformDbToApi);
  }
}
