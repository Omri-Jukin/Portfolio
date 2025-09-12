import { eq, and, desc, asc, sql } from "drizzle-orm";
import { education } from "../schema/schema.tables";
import { getDbClient } from "../client";
import type {
  Education,
  NewEducation,
  EducationFilters,
} from "../schema/schema.types";

// Transform database record to API format
const transformDbToApi = (
  dbRecord: typeof education.$inferSelect
): Education => ({
  id: dbRecord.id,
  institution: dbRecord.institution,
  degree: dbRecord.degree,
  degreeType: dbRecord.degreeType,
  fieldOfStudy: dbRecord.fieldOfStudy,
  startDate: dbRecord.startDate.toISOString(),
  endDate: dbRecord.endDate?.toISOString() || null,
  status: dbRecord.status,
  gpa: dbRecord.gpa,
  achievements: dbRecord.achievements || [],
  coursework: dbRecord.coursework || [],
  projects: dbRecord.projects || [],
  extracurriculars: dbRecord.extracurriculars || [],
  location: dbRecord.location,
  institutionUrl: dbRecord.institutionUrl,
  certificateUrl: dbRecord.certificateUrl,
  transcript: dbRecord.transcript,
  isVisible: dbRecord.isVisible,
  displayOrder: dbRecord.displayOrder,
  institutionTranslations: dbRecord.institutionTranslations || {},
  degreeTranslations: dbRecord.degreeTranslations || {},
  fieldOfStudyTranslations: dbRecord.fieldOfStudyTranslations || {},
  createdAt: dbRecord.createdAt.toISOString(),
  updatedAt: dbRecord.updatedAt?.toISOString() || null,
  createdBy: dbRecord.createdBy,
});

export class EducationManager {
  static async getAll(visibleOnly = false): Promise<Education[]> {
    const conditions = visibleOnly ? [eq(education.isVisible, true)] : [];

    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const results = await db
      .select()
      .from(education)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(education.startDate), asc(education.displayOrder));

    return results.map(transformDbToApi);
  }

  static async getById(id: string): Promise<Education | null> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const result = await db
      .select()
      .from(education)
      .where(eq(education.id, id))
      .limit(1);

    return result.length > 0 ? transformDbToApi(result[0]) : null;
  }

  static async getByDegreeType(
    degreeType: string,
    visibleOnly = true
  ): Promise<Education[]> {
    const conditions = [
      eq(
        education.degreeType,
        degreeType as
          | "bachelor"
          | "master"
          | "phd"
          | "diploma"
          | "certificate"
          | "bootcamp"
      ),
      ...(visibleOnly ? [eq(education.isVisible, true)] : []),
    ];

    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const results = await db
      .select()
      .from(education)
      .where(and(...conditions))
      .orderBy(desc(education.startDate), asc(education.displayOrder));

    return results.map(transformDbToApi);
  }

  static async getFeatured(visibleOnly = true): Promise<Education[]> {
    // Since isFeatured doesn't exist in the schema, return all visible education
    const conditions = visibleOnly ? [eq(education.isVisible, true)] : [];

    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const results = await db
      .select()
      .from(education)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(education.startDate), asc(education.displayOrder));

    return results.map(transformDbToApi);
  }

  static async getStatistics(): Promise<{
    total: number;
    visible: number;
    byDegreeType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const allEducation = await db.select().from(education);

    const total = allEducation.length;
    const visible = allEducation.filter((edu) => edu.isVisible).length;

    const byDegreeType = allEducation.reduce((acc, edu) => {
      acc[edu.degreeType] = (acc[edu.degreeType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = allEducation.reduce((acc, edu) => {
      acc[edu.status] = (acc[edu.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      visible,
      byDegreeType,
      byStatus,
    };
  }

  static async search(
    query: string,
    filters?: EducationFilters
  ): Promise<Education[]> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const conditions = [];

    // Text search across institution, degree, fieldOfStudy
    if (query.trim()) {
      conditions.push(
        sql`(
          ${education.institution} LIKE ${"%" + query + "%"} OR 
          ${education.degree} LIKE ${"%" + query + "%"} OR 
          ${education.fieldOfStudy} LIKE ${"%" + query + "%"}
        )`
      );
    }

    // Apply filters
    if (filters?.degreeType) {
      conditions.push(
        eq(
          education.degreeType,
          filters.degreeType as
            | "bachelor"
            | "master"
            | "phd"
            | "diploma"
            | "certificate"
            | "bootcamp"
        )
      );
    }
    if (filters?.status) {
      conditions.push(
        eq(
          education.status,
          filters.status as
            | "completed"
            | "in-progress"
            | "transferred"
            | "dropped"
            | "deleted"
        )
      );
    }
    if (filters?.isVisible !== undefined) {
      conditions.push(eq(education.isVisible, filters.isVisible));
    }

    const results = await db
      .select()
      .from(education)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(education.startDate), asc(education.displayOrder));

    return results.map(transformDbToApi);
  }

  static async create(data: NewEducation): Promise<Education> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const newEducation = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const result = await db.insert(education).values(newEducation).returning();
    return transformDbToApi(result[0]);
  }

  static async update(
    id: string,
    data: Partial<NewEducation>
  ): Promise<Education> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .update(education)
      .set(updateData)
      .where(eq(education.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error("Education record not found");
    }

    return transformDbToApi(result[0]);
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const result = await db
      .delete(education)
      .where(eq(education.id, id))
      .returning();

    return result.length > 0;
  }

  static async bulkUpdateOrder(
    updates: Array<{ id: string; displayOrder: number }>
  ): Promise<Education[]> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const results: Education[] = [];

    for (const update of updates) {
      const result = await db
        .update(education)
        .set({
          displayOrder: update.displayOrder,
          updatedAt: new Date(),
        })
        .where(eq(education.id, update.id))
        .returning();

      if (result.length > 0) {
        results.push(transformDbToApi(result[0]));
      }
    }

    return results;
  }

  static async bulkDelete(
    ids: string[]
  ): Promise<{ success: boolean; deletedCount: number }> {
    const db = await getDbClient();
    if (!db) throw new Error("Database connection failed");

    const result = await db
      .delete(education)
      .where(sql`${education.id} IN (${ids.map((id) => `'${id}'`).join(",")})`)
      .returning();

    return {
      success: true,
      deletedCount: result.length,
    };
  }
}
