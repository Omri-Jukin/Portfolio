import { and, gte, sql, type SQL } from "drizzle-orm";
import type { PgTable, PgColumn } from "drizzle-orm/pg-core";

/**
 * Increment order values for rows that have the same or greater order value
 * This prevents conflicts when inserting a new row with a specific order
 *
 * @param db - Database client
 * @param table - Table to update
 * @param orderColumn - Column reference for the order field (e.g., table.order)
 * @param newOrder - The order value being inserted
 * @param whereConditions - Optional additional WHERE conditions (e.g., for scoped ordering)
 */
export async function incrementOrdersForConflict<T extends PgTable>(
  db: Awaited<ReturnType<typeof import("../client").getDB>>,
  table: T,
  orderColumn: PgColumn,
  newOrder: number,
  whereConditions?: SQL[]
): Promise<void> {
  if (!db) {
    throw new Error("Database not available");
  }

  // Build WHERE conditions
  const conditions: SQL[] = [gte(orderColumn, newOrder)];
  if (whereConditions && whereConditions.length > 0) {
    conditions.push(...whereConditions);
  }

  // Increment all rows with order >= newOrder
  // Use sql template to reference the column and increment it
  // Use the column reference directly (orderColumn is already a PgColumn)
  await db
    .update(table)
    .set({
      [orderColumn.name]: sql`${orderColumn} + 1`,
    } as Record<string, SQL>)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0]!);
}
