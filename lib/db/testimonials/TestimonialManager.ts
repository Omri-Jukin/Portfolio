import { eq, asc, desc, and, count } from "drizzle-orm";
import { getDB } from "../client";
import { testimonials } from "../schema/schema.tables";
import type {
  Testimonial,
  TestimonialDB,
  NewTestimonial,
  UpdateTestimonial,
} from "../schema/schema.types";
import { nanoid } from "nanoid";

// Helper function to get database client
const getDbClient = async () => getDB();

// Helper function to transform DB dates to API strings
const transformDbToApi = (dbTestimonial: TestimonialDB): Testimonial => ({
  ...dbTestimonial,
  createdAt: dbTestimonial.createdAt.toISOString(),
  updatedAt: dbTestimonial.updatedAt
    ? dbTestimonial.updatedAt.toISOString()
    : null,
  verificationDate: dbTestimonial.verificationDate
    ? dbTestimonial.verificationDate.toISOString()
    : null,
});

export class TestimonialManager {
  static async getAll(visibleOnly = false): Promise<Testimonial[]> {
    const conditions = visibleOnly ? [eq(testimonials.isVisible, true)] : [];
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }

    const results = await db
      .select()
      .from(testimonials)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt));

    return results.map(transformDbToApi);
  }

  static async getById(id: string): Promise<Testimonial | null> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);

    return result[0] ? transformDbToApi(result[0]) : null;
  }

  static async getFeatured(
    limit = 10,
    visibleOnly = true
  ): Promise<Testimonial[]> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const conditions = [eq(testimonials.isFeatured, true)];
    if (visibleOnly) {
      conditions.push(eq(testimonials.isVisible, true));
    }

    const results = await db
      .select()
      .from(testimonials)
      .where(and(...conditions))
      .orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt))
      .limit(limit);

    return results.map(transformDbToApi);
  }

  static async getVerified(visibleOnly = true): Promise<Testimonial[]> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const conditions = [eq(testimonials.isVerified, true)];
    if (visibleOnly) {
      conditions.push(eq(testimonials.isVisible, true));
    }

    const results = await db
      .select()
      .from(testimonials)
      .where(and(...conditions))
      .orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt));

    return results.map(transformDbToApi);
  }

  static async create(
    testimonial: Omit<NewTestimonial, "id" | "createdAt">
  ): Promise<Testimonial> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const id = nanoid();
    const now = new Date();

    const newTestimonial: NewTestimonial = {
      ...testimonial,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(testimonials).values(newTestimonial);

    const created = await this.getById(id);
    if (!created) {
      throw new Error("Failed to create testimonial");
    }

    return created;
  }

  static async update(
    id: string,
    updates: Partial<Omit<NewTestimonial, "id" | "createdAt">>
  ): Promise<Testimonial | null> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const now = new Date();

    await db
      .update(testimonials)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(testimonials.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();

    return result.length > 0;
  }

  static async updateDisplayOrder(
    updates: { id: string; displayOrder: number }[]
  ): Promise<void> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const now = new Date();

    for (const update of updates) {
      await db
        .update(testimonials)
        .set({
          displayOrder: update.displayOrder,
          updatedAt: now,
        })
        .where(eq(testimonials.id, update.id));
    }
  }

  static async toggleVisibility(id: string): Promise<Testimonial | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isVisible: !current.isVisible,
    });
  }

  static async toggleFeatured(id: string): Promise<Testimonial | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isFeatured: !current.isFeatured,
    });
  }

  static async verify(id: string): Promise<Testimonial | null> {
    const now = new Date();
    return await this.update(id, {
      isVerified: true,
      verificationDate: now,
    });
  }

  static async getStatistics(): Promise<{
    total: number;
    totalVisible: number;
    featured: number;
    verified: number;
  }> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }

    const totalVisible = await db
      .select({ count: count() })
      .from(testimonials)
      .where(eq(testimonials.isVisible, true));

    const total = await db.select({ count: count() }).from(testimonials);

    const featured = await db
      .select({ count: count() })
      .from(testimonials)
      .where(
        and(eq(testimonials.isVisible, true), eq(testimonials.isFeatured, true))
      );

    const verified = await db
      .select({ count: count() })
      .from(testimonials)
      .where(
        and(eq(testimonials.isVisible, true), eq(testimonials.isVerified, true))
      );

    return {
      total: total[0]?.count || 0,
      totalVisible: totalVisible[0]?.count || 0,
      featured: featured[0]?.count || 0,
      verified: verified[0]?.count || 0,
    };
  }

  static async bulkUpdate(
    ids: string[],
    updates: UpdateTestimonial
  ): Promise<Testimonial[]> {
    const results = await Promise.all(
      ids.map((id) => this.update(id, updates))
    );
    return results.filter(Boolean) as Testimonial[];
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
}
