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
  // Drizzle doesn't support dynamic column names in .set(), so we use raw SQL
  const whereClause =
    conditions.length > 1 ? and(...conditions) : conditions[0]!;

  // Get the table name from the table's internal metadata
  // Drizzle stores the table name in a symbol
  const tableNameSymbol = Symbol.for("drizzle:Name");
  const tableWithSymbol = table as unknown as Record<symbol, string>;
  const tableName = tableWithSymbol[tableNameSymbol] || "unknown_table";
  const columnName = orderColumn.name;

  // Build the WHERE clause SQL using Drizzle's SQL builder
  // Use sql template to embed the whereClause SQL object directly
  // sql.identifier is used for safe table/column name quoting
  await db.execute(
    sql`UPDATE ${sql.identifier(tableName)} SET ${sql.identifier(
      columnName
    )} = ${sql.identifier(columnName)} + 1 WHERE ${whereClause}`
  );
}
