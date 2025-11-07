import { eq, asc, and, count } from "drizzle-orm";
import { getDB } from "../client";
import { services } from "../schema/schema.tables";
import { ServiceCategory } from "../schema/schema.types";
import type {
  Service,
  ServiceDB,
  NewService,
  UpdateService,
} from "../schema/schema.types";
import { nanoid } from "nanoid";

// Helper function to get database client
const getDbClient = async () => getDB();

// Helper function to transform DB dates to API strings
const transformDbToApi = (dbService: ServiceDB): Service => ({
  ...dbService,
  createdAt: dbService.createdAt.toISOString(),
  updatedAt: dbService.updatedAt ? dbService.updatedAt.toISOString() : null,
});

export class ServiceManager {
  static async getAll(activeOnly = false): Promise<Service[]> {
    const conditions = activeOnly ? [eq(services.isActive, true)] : [];
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }

    const results = await db
      .select()
      .from(services)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(services.displayOrder), asc(services.name));

    return results.map(transformDbToApi);
  }

  static async getById(id: string): Promise<Service | null> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    return result[0] ? transformDbToApi(result[0]) : null;
  }

  static async getByCategory(
    category: string,
    activeOnly = false
  ): Promise<Service[]> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const conditions = [eq(services.category, category as ServiceCategory)];
    if (activeOnly) {
      conditions.push(eq(services.isActive, true));
    }

    const results = await db
      .select()
      .from(services)
      .where(and(...conditions))
      .orderBy(asc(services.displayOrder), asc(services.name));

    return results.map(transformDbToApi);
  }

  static async getPopular(limit = 10, activeOnly = true): Promise<Service[]> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const conditions = [eq(services.isPopular, true)];
    if (activeOnly) {
      conditions.push(eq(services.isActive, true));
    }

    const results = await db
      .select()
      .from(services)
      .where(and(...conditions))
      .orderBy(asc(services.displayOrder), asc(services.name))
      .limit(limit);

    return results.map(transformDbToApi);
  }

  static async create(
    service: Omit<NewService, "id" | "createdAt">
  ): Promise<Service> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const id = nanoid();
    const now = new Date();

    const newService: NewService = {
      ...service,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(services).values(newService);

    const created = await this.getById(id);
    if (!created) {
      throw new Error("Failed to create service");
    }

    return created;
  }

  static async update(
    id: string,
    updates: Partial<Omit<NewService, "id" | "createdAt">>
  ): Promise<Service | null> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const now = new Date();

    await db
      .update(services)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(services.id, id));

    return await this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }
    const result = await db
      .delete(services)
      .where(eq(services.id, id))
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
        .update(services)
        .set({
          displayOrder: update.displayOrder,
          updatedAt: now,
        })
        .where(eq(services.id, update.id));
    }
  }

  static async toggleVisibility(id: string): Promise<Service | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isActive: !current.isActive,
    });
  }

  static async togglePopular(id: string): Promise<Service | null> {
    const current = await this.getById(id);
    if (!current) return null;

    return await this.update(id, {
      isPopular: !current.isPopular,
    });
  }

  static async getStatistics(): Promise<{
    total: number;
    totalActive: number;
    byCategory: Array<{ category: string; count: number }>;
    popular: number;
  }> {
    const db = await getDbClient();
    if (!db) {
      throw new Error("Database not available");
    }

    const categoryStats = await db
      .select({
        category: services.category,
        count: count(),
      })
      .from(services)
      .where(eq(services.isActive, true))
      .groupBy(services.category);

    const totalActive = await db
      .select({ count: count() })
      .from(services)
      .where(eq(services.isActive, true));

    const total = await db.select({ count: count() }).from(services);

    const popular = await db
      .select({ count: count() })
      .from(services)
      .where(and(eq(services.isActive, true), eq(services.isPopular, true)));

    return {
      total: total[0]?.count || 0,
      totalActive: totalActive[0]?.count || 0,
      byCategory: categoryStats.map((stat) => ({
        category: stat.category,
        count: stat.count,
      })),
      popular: popular[0]?.count || 0,
    };
  }

  static async bulkUpdate(
    ids: string[],
    updates: UpdateService
  ): Promise<Service[]> {
    const results = await Promise.all(
      ids.map((id) => this.update(id, updates))
    );
    return results.filter(Boolean) as Service[];
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
