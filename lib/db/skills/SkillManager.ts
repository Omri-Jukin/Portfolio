import { eq, asc, desc, and, gte, lte, sql, count, avg } from "drizzle-orm";
import { getDB } from "../client";
import { skills } from "../schema/schema.tables";
import { SkillCategory, ProficiencyLevel } from "../schema/schema.types";
import type {
  Skill,
  SkillDB,
  NewSkill,
  UpdateSkill,
  SkillStatistics,
  SkillFilters,
} from "./Skills.type";
import { nanoid } from "nanoid";

// Helper function to get database client
const getDbClient = async () => getDB();

// Helper function to transform DB dates to API strings
const transformDbToApi = (dbSkill: SkillDB): Skill => ({
  ...dbSkill,
  lastUsed: dbSkill.lastUsed.toISOString(),
  createdAt: dbSkill.createdAt.toISOString(),
  updatedAt: dbSkill.updatedAt ? dbSkill.updatedAt.toISOString() : null,
});

export class SkillManager {
  static async getAll(visibleOnly = false): Promise<Skill[]> {
    const conditions = visibleOnly ? [eq(skills.isVisible, true)] : [];
    const db = await getDbClient();

    const results = await db
      .select()
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        asc(skills.displayOrder),
        desc(skills.proficiencyLevel),
        asc(skills.name)
      );

    return results.map(transformDbToApi);
  }

  static async getById(id: string): Promise<Skill | null> {
    const db = await getDbClient();
    const result = await db
      .select()
      .from(skills)
      .where(eq(skills.id, id))
      .limit(1);

    return result[0] ? transformDbToApi(result[0]) : null;
  }

  static async getByCategory(
    category: string,
    visibleOnly = false
  ): Promise<Skill[]> {
    const db = await getDbClient();
    const conditions = [eq(skills.category, category as SkillCategory)];
    if (visibleOnly) {
      conditions.push(eq(skills.isVisible, true));
    }

    const results = await db
      .select()
      .from(skills)
      .where(and(...conditions))
      .orderBy(
        asc(skills.displayOrder),
        desc(skills.proficiencyLevel),
        asc(skills.name)
      );

    return results.map(transformDbToApi);
  }

  static async getByProficiencyLevel(
    proficiencyLevel: string,
    visibleOnly = false
  ): Promise<Skill[]> {
    const db = await getDbClient();
    const conditions = [
      eq(skills.proficiencyLabel, proficiencyLevel as ProficiencyLevel),
    ];
    if (visibleOnly) {
      conditions.push(eq(skills.isVisible, true));
    }

    const results = await db
      .select()
      .from(skills)
      .where(and(...conditions))
      .orderBy(
        asc(skills.displayOrder),
        desc(skills.proficiencyLevel),
        asc(skills.name)
      );

    return results.map(transformDbToApi);
  }

  static async getTopSkills(limit = 10, visibleOnly = true): Promise<Skill[]> {
    const db = await getDbClient();
    const conditions = visibleOnly ? [eq(skills.isVisible, true)] : [];

    const results = await db
      .select()
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        desc(skills.proficiencyLevel),
        desc(skills.yearsOfExperience),
        asc(skills.name)
      )
      .limit(limit);

    return results.map(transformDbToApi);
  }

  static async getRecentlyUsed(
    monthsBack = 12,
    visibleOnly = true
  ): Promise<Skill[]> {
    const db = await getDbClient();
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);

    const conditions = [gte(skills.lastUsed, cutoffDate)];
    if (visibleOnly) {
      conditions.push(eq(skills.isVisible, true));
    }

    const results = await db
      .select()
      .from(skills)
      .where(and(...conditions))
      .orderBy(desc(skills.lastUsed), desc(skills.proficiencyLevel));

    return results.map(transformDbToApi);
  }

  static async create(
    skill: Omit<NewSkill, "id" | "createdAt">
  ): Promise<Skill> {
    const db = await getDbClient();
    const id = nanoid();
    const now = new Date();

    const newSkill: NewSkill = {
      ...skill,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(skills).values(newSkill);

    const created = await this.getById(id);
    if (!created) {
      throw new Error("Failed to create skill");
    }

    return created;
  }

  static async update(
    id: string,
    updates: Partial<Omit<NewSkill, "id" | "createdAt">>
  ): Promise<Skill | null> {
    const db = await getDbClient();
    const now = new Date();

    await db
      .update(skills)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(skills.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDbClient();
    const result = await db.delete(skills).where(eq(skills.id, id));

    return result.changes > 0;
  }

  static async updateDisplayOrder(
    updates: { id: string; displayOrder: number }[]
  ): Promise<void> {
    const db = await getDbClient();
    const now = new Date();

    for (const update of updates) {
      await db
        .update(skills)
        .set({
          displayOrder: update.displayOrder,
          updatedAt: now,
        })
        .where(eq(skills.id, update.id));
    }
  }

  static async toggleVisibility(id: string): Promise<Skill | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isVisible: !current.isVisible,
    });
  }

  static async updateLastUsed(id: string): Promise<Skill | null> {
    return await this.update(id, {
      lastUsed: new Date(),
    });
  }

  static async getStatistics(): Promise<SkillStatistics> {
    const db = await getDbClient();
    // Get counts and averages by category
    const categoryStats = await db
      .select({
        category: skills.category,
        count: count(),
        averageProficiency: avg(skills.proficiencyLevel),
      })
      .from(skills)
      .where(eq(skills.isVisible, true))
      .groupBy(skills.category);

    // Get counts by proficiency level

    const proficiencyStats = await db
      .select({
        proficiencyLabel: skills.proficiencyLabel,
        count: count(),
      })
      .from(skills)
      .where(eq(skills.isVisible, true))
      .groupBy(skills.proficiencyLabel);

    // Get total counts
    const totalVisible = await db
      .select({ count: count() })
      .from(skills)
      .where(eq(skills.isVisible, true));

    const total = await db.select({ count: count() }).from(skills);

    // Get average experience
    const avgExperience = await db
      .select({ avgExp: avg(skills.yearsOfExperience) })
      .from(skills)
      .where(eq(skills.isVisible, true));

    // Get top skills and recently used
    const topSkills = await this.getTopSkills(5, true);
    const recentlyUsed = await this.getRecentlyUsed(6, true); // 6 months

    return {
      total: total[0]?.count || 0,
      totalVisible: totalVisible[0]?.count || 0,
      byCategory: categoryStats.map((stat) => ({
        category: stat.category,
        count: stat.count,
        averageProficiency:
          Math.round((Number(stat.averageProficiency) || 0) * 10) / 10,
      })),
      byProficiencyLevel: proficiencyStats,
      topSkills: topSkills.map((skill) => ({
        skill,
        proficiencyLevel: skill.proficiencyLevel,
      })),
      recentlyUsed,
      averageExperience:
        Math.round((Number(avgExperience[0]?.avgExp) || 0) * 10) / 10,
    };
  }

  static async bulkUpdate(
    ids: string[],
    updates: UpdateSkill
  ): Promise<Skill[]> {
    const results = await Promise.all(
      ids.map((id) => this.update(id, updates))
    );
    return results.filter(Boolean) as Skill[];
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

  static async search(query: string, filters?: SkillFilters): Promise<Skill[]> {
    const db = await getDbClient();
    const conditions = [];

    // Text search across name, description
    if (query.trim()) {
      conditions.push(
        sql`(
          ${skills.name} LIKE ${"%" + query + "%"} OR
          ${skills.description} LIKE ${"%" + query + "%"} OR
          ${skills.subCategory} LIKE ${"%" + query + "%"}
        )`
      );
    }

    // Apply filters
    if (filters?.category) {
      conditions.push(eq(skills.category, filters.category as SkillCategory));
    }
    if (filters?.subCategory) {
      conditions.push(eq(skills.subCategory, filters.subCategory));
    }
    if (filters?.proficiencyLabel) {
      conditions.push(
        eq(
          skills.proficiencyLabel,
          filters.proficiencyLabel as ProficiencyLevel
        )
      );
    }
    if (filters?.minProficiency !== undefined) {
      conditions.push(gte(skills.proficiencyLevel, filters.minProficiency));
    }
    if (filters?.maxProficiency !== undefined) {
      conditions.push(lte(skills.proficiencyLevel, filters.maxProficiency));
    }
    if (filters?.minExperience !== undefined) {
      conditions.push(gte(skills.yearsOfExperience, filters.minExperience));
    }
    if (filters?.isVisible !== undefined) {
      conditions.push(eq(skills.isVisible, filters.isVisible));
    }
    if (filters?.usedRecently !== undefined && filters.usedRecently) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      conditions.push(gte(skills.lastUsed, oneYearAgo));
    }

    const results = await db
      .select()
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        asc(skills.displayOrder),
        desc(skills.proficiencyLevel),
        asc(skills.name)
      );

    return results.map(transformDbToApi);
  }
}
