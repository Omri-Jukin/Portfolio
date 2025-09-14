import {
  eq,
  asc,
  desc,
  and,
  isNotNull,
  sql,
  count,
  inArray,
} from "drizzle-orm";
import { getDB } from "../client";
import { certifications } from "../schema/schema.tables";
import { CertificationCategory } from "../schema/schema.types";
import type {
  Certification,
  NewCertification,
  CertificationDB,
} from "../schema/schema.types";
import { nanoid } from "nanoid";

const db = await getDB();

// Helper function to transform DB dates to API strings
const transformDbToApi = (dbCert: CertificationDB): Certification => ({
  ...dbCert,
  issueDate: dbCert.issueDate.toISOString(),
  expiryDate: dbCert.expiryDate ? dbCert.expiryDate.toISOString() : null,
  createdAt: dbCert.createdAt.toISOString(),
  updatedAt: dbCert.updatedAt ? dbCert.updatedAt.toISOString() : null,
});

export class CertificationsService {
  static async getAll(visibleOnly = false): Promise<Certification[]> {
    const conditions = visibleOnly ? [eq(certifications.isVisible, true)] : [];

    const results = await db
      .select()
      .from(certifications)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        asc(certifications.displayOrder),
        desc(certifications.issueDate)
      );

    return results.map(transformDbToApi);
  }

  static async getById(id: string): Promise<Certification | null> {
    const result = await db
      .select()
      .from(certifications)
      .where(eq(certifications.id, id))
      .limit(1);

    return result[0] ? transformDbToApi(result[0]) : null;
  }

  static async getByCategory(
    category: string,
    visibleOnly = false
  ): Promise<Certification[]> {
    const conditions = [
      eq(certifications.category, category as CertificationCategory),
    ];
    if (visibleOnly) {
      conditions.push(eq(certifications.isVisible, true));
    }

    const results = await db
      .select()
      .from(certifications)
      .where(and(...conditions))
      .orderBy(
        asc(certifications.displayOrder),
        desc(certifications.issueDate)
      );

    return results.map(transformDbToApi);
  }

  static async create(
    certification: Omit<NewCertification, "id" | "createdAt">
  ): Promise<Certification> {
    const id = nanoid();
    const now = new Date();

    const newCertification: NewCertification = {
      ...certification,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(certifications).values(newCertification);

    const created = await this.getById(id);
    if (!created) {
      throw new Error("Failed to create certification");
    }

    return created;
  }

  static async update(
    id: string,
    updates: Partial<Omit<NewCertification, "id" | "createdAt">>
  ): Promise<Certification | null> {
    const now = new Date();

    await db
      .update(certifications)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(certifications.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(certifications)
      .where(eq(certifications.id, id));

    return result.length > 0;
  }

  static async updateDisplayOrder(
    updates: { id: string; displayOrder: number }[]
  ): Promise<void> {
    const now = new Date();

    for (const update of updates) {
      await db
        .update(certifications)
        .set({
          displayOrder: update.displayOrder,
          updatedAt: now,
        })
        .where(eq(certifications.id, update.id));
    }
  }

  static async toggleVisibility(id: string): Promise<Certification | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isVisible: !current.isVisible,
    });
  }

  static async getExpiredCertifications(): Promise<Certification[]> {
    const now = new Date();

    const results = await db
      .select()
      .from(certifications)
      .where(
        and(
          eq(certifications.status, "active"),
          isNotNull(certifications.expiryDate),
          sql`${certifications.expiryDate} < ${now.toISOString()}`
        )
      )
      .orderBy(asc(certifications.expiryDate));

    return results.map(transformDbToApi);
  }

  static async markAsExpired(ids: string[]): Promise<void> {
    const now = new Date();

    await db
      .update(certifications)
      .set({
        status: "expired",
        updatedAt: now,
      })
      .where(inArray(certifications.id, ids));
  }

  static async getStatistics() {
    // Get counts by category
    const categoryStats = await db
      .select({
        category: certifications.category,
        count: count(),
      })
      .from(certifications)
      .where(eq(certifications.isVisible, true))
      .groupBy(certifications.category);

    // Get total counts
    const totalActive = await db
      .select({ count: count() })
      .from(certifications)
      .where(
        and(
          eq(certifications.isVisible, true),
          eq(certifications.status, "active")
        )
      );

    const totalExpired = await db
      .select({ count: count() })
      .from(certifications)
      .where(eq(certifications.status, "expired"));

    return {
      byCategory: categoryStats,
      totalActive: totalActive[0]?.count || 0,
      totalExpired: totalExpired[0]?.count || 0,
      total: (totalActive[0]?.count || 0) + (totalExpired[0]?.count || 0),
    };
  }
}
