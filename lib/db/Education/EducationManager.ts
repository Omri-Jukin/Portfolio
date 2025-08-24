import { eq, desc, asc, and, or, like, count, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDB } from "../client";
import { education } from "../schema/schema.tables";
import type {
  Education,
  NewEducation,
  UpdateEducation,
  EducationFilters,
  EducationStatistics,
  EducationSearchResult,
  BulkEducationUpdateResult,
  BulkEducationDeleteResult,
  EducationReorderItem,
  EducationDB,
} from "./Education.type";
import { DegreeType, EducationStatus } from "../schema/schema.types";

export class EducationManager {
  /**
   * Get all education records
   */
  static async getAll(visibleOnly = true): Promise<Education[]> {
    const db = await getDB();

    const whereCondition = visibleOnly
      ? eq(education.isVisible, true)
      : undefined;

    const results = await db
      .select()
      .from(education)
      .where(whereCondition)
      .orderBy(asc(education.displayOrder), desc(education.startDate));

    return results.map(this.transformToAPIType);
  }

  /**
   * Get education by ID
   */
  static async getById(id: string): Promise<Education | null> {
    const db = await getDB();

    const result = await db
      .select()
      .from(education)
      .where(eq(education.id, id))
      .limit(1);

    if (result.length === 0) return null;
    return this.transformToAPIType(result[0]);
  }

  /**
   * Get education by degree type
   */
  static async getByDegreeType(
    degreeType: DegreeType,
    visibleOnly = true
  ): Promise<Education[]> {
    const db = await getDB();

    const whereConditions = [eq(education.degreeType, degreeType)];
    if (visibleOnly) {
      whereConditions.push(eq(education.isVisible, true));
    }

    const results = await db
      .select()
      .from(education)
      .where(and(...whereConditions))
      .orderBy(asc(education.displayOrder), desc(education.startDate));

    return results.map(this.transformToAPIType);
  }

  /**
   * Get education by status
   */
  static async getByStatus(
    status: EducationStatus,
    visibleOnly = true
  ): Promise<Education[]> {
    const db = await getDB();

    const whereConditions = [eq(education.status, status)];
    if (visibleOnly) {
      whereConditions.push(eq(education.isVisible, true));
    }

    const results = await db
      .select()
      .from(education)
      .where(and(...whereConditions))
      .orderBy(asc(education.displayOrder), desc(education.startDate));

    return results.map(this.transformToAPIType);
  }

  /**
   * Search education records
   */
  static async search(
    query: string,
    filters?: EducationFilters
  ): Promise<EducationSearchResult> {
    const db = await getDB();

    const whereConditions = [
      or(
        like(education.institution, `%${query}%`),
        like(education.degree, `%${query}%`),
        like(education.fieldOfStudy, `%${query}%`),
        like(education.location, `%${query}%`)
      ),
    ];

    if (filters?.degreeType) {
      whereConditions.push(eq(education.degreeType, filters.degreeType));
    }
    if (filters?.status) {
      whereConditions.push(eq(education.status, filters.status));
    }
    if (filters?.isVisible !== undefined) {
      whereConditions.push(eq(education.isVisible, filters.isVisible));
    }
    if (filters?.fieldOfStudy) {
      whereConditions.push(
        like(education.fieldOfStudy, `%${filters.fieldOfStudy}%`)
      );
    }

    const results = await db
      .select()
      .from(education)
      .where(and(...whereConditions))
      .orderBy(asc(education.displayOrder), desc(education.startDate));

    return {
      education: results.map(this.transformToAPIType),
      total: results.length,
    };
  }

  /**
   * Create new education record
   */
  static async create(data: Omit<NewEducation, "id">): Promise<Education> {
    const db = await getDB();

    const id = nanoid();
    const now = new Date();

    const educationData = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(education).values(educationData);

    const created = await this.getById(id);
    if (!created) {
      throw new Error("Failed to create education record");
    }

    return created;
  }

  /**
   * Update education record
   */
  static async update(
    id: string,
    data: UpdateEducation
  ): Promise<Education | null> {
    const db = await getDB();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await db.update(education).set(updateData).where(eq(education.id, id));

    return this.getById(id);
  }

  /**
   * Delete education record
   */
  static async delete(id: string): Promise<boolean> {
    const db = await getDB();

    const result = await db.delete(education).where(eq(education.id, id));

    return result.changes > 0;
  }

  /**
   * Toggle visibility
   */
  static async toggleVisibility(id: string): Promise<Education | null> {
    const db = await getDB();

    const existing = await this.getById(id);
    if (!existing) return null;

    await db
      .update(education)
      .set({
        isVisible: !existing.isVisible,
        updatedAt: new Date(),
      })
      .where(eq(education.id, id));

    return this.getById(id);
  }

  /**
   * Update display order for multiple education records
   */
  static async updateDisplayOrder(
    reorderItems: EducationReorderItem[]
  ): Promise<void> {
    const db = await getDB();

    for (const item of reorderItems) {
      await db
        .update(education)
        .set({
          displayOrder: item.displayOrder,
          updatedAt: new Date(),
        })
        .where(eq(education.id, item.id));
    }
  }

  /**
   * Get education statistics
   */
  static async getStatistics(): Promise<EducationStatistics> {
    const db = await getDB();

    // Total counts
    const totalResult = await db.select({ total: count() }).from(education);

    const totalVisibleResult = await db
      .select({ total: count() })
      .from(education)
      .where(eq(education.isVisible, true));

    // By degree type
    const byDegreeTypeResult = await db
      .select({
        degreeType: education.degreeType,
        count: count(),
      })
      .from(education)
      .groupBy(education.degreeType);

    // By status
    const byStatusResult = await db
      .select({
        status: education.status,
        count: count(),
      })
      .from(education)
      .groupBy(education.status);

    // By field of study
    const byFieldOfStudyResult = await db
      .select({
        fieldOfStudy: education.fieldOfStudy,
        count: count(),
      })
      .from(education)
      .groupBy(education.fieldOfStudy);

    // Average GPA (only for numeric GPAs)
    const avgGpaResult = await db
      .select({
        avgGpa: sql<number>`avg(CAST(${education.gpa} AS REAL))`,
      })
      .from(education)
      .where(
        sql`${education.gpa} IS NOT NULL AND ${education.gpa} REGEXP '^[0-9]+\.?[0-9]*$'`
      );

    return {
      total: totalResult[0]?.total || 0,
      totalVisible: totalVisibleResult[0]?.total || 0,
      byDegreeType: byDegreeTypeResult.map((item) => ({
        degreeType: item.degreeType as DegreeType,
        count: item.count,
      })),
      byStatus: byStatusResult.map((item) => ({
        status: item.status as EducationStatus,
        count: item.count,
      })),
      byFieldOfStudy: byFieldOfStudyResult.map((item) => ({
        fieldOfStudy: item.fieldOfStudy,
        count: item.count,
      })),
      averageGpa: avgGpaResult[0]?.avgGpa || undefined,
    };
  }

  /**
   * Bulk update education records
   */
  static async bulkUpdate(
    ids: string[],
    updates: UpdateEducation
  ): Promise<BulkEducationUpdateResult> {
    const db = await getDB();

    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const id of ids) {
      try {
        const result = await db
          .update(education)
          .set({
            ...updates,
            updatedAt: new Date(),
          })
          .where(eq(education.id, id));

        if (result.changes > 0) {
          updated++;
        } else {
          failed++;
          errors.push(`Education record ${id} not found`);
        }
      } catch (error) {
        failed++;
        errors.push(
          `Failed to update ${id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    return { updated, failed, errors };
  }

  /**
   * Bulk delete education records
   */
  static async bulkDelete(ids: string[]): Promise<BulkEducationDeleteResult> {
    const db = await getDB();

    let deleted = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const id of ids) {
      try {
        const result = await db.delete(education).where(eq(education.id, id));

        if (result.changes > 0) {
          deleted++;
        } else {
          failed++;
          errors.push(`Education record ${id} not found`);
        }
      } catch (error) {
        failed++;
        errors.push(
          `Failed to delete ${id}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    return { deleted, failed, errors };
  }

  /**
   * Transform database type to API type (convert dates to strings)
   */
  private static transformToAPIType(dbEducation: EducationDB): Education {
    return {
      ...dbEducation,
      startDate: dbEducation.startDate.toISOString(),
      endDate: dbEducation.endDate ? dbEducation.endDate.toISOString() : null,
      createdAt: dbEducation.createdAt.toISOString(),
      updatedAt: dbEducation.updatedAt
        ? dbEducation.updatedAt.toISOString()
        : null,
    };
  }
}
