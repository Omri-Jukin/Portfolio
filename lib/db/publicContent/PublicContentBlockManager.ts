import { and, asc, eq } from "drizzle-orm";
import { getDB } from "../client";
import { publicContentBlocks } from "../schema/schema.tables";
import type {
  NewPublicContentBlock,
  PublicContentBlockDB,
} from "../schema/schema.types";

export type PublicContentBlock = Omit<
  PublicContentBlockDB,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string | null;
};

function transformBlock(block: PublicContentBlockDB): PublicContentBlock {
  return {
    ...block,
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt ? block.updatedAt.toISOString() : null,
  };
}

export class PublicContentBlockManager {
  static async getByPage({
    page,
    locale = "en",
    visibleOnly = true,
  }: {
    page: string;
    locale?: string;
    visibleOnly?: boolean;
  }): Promise<PublicContentBlock[]> {
    const db = await getDB();
    const conditions = [
      eq(publicContentBlocks.page, page),
      eq(publicContentBlocks.locale, locale),
    ];

    if (visibleOnly) {
      conditions.push(eq(publicContentBlocks.isVisible, true));
    }

    const rows = await db
      .select()
      .from(publicContentBlocks)
      .where(and(...conditions))
      .orderBy(
        asc(publicContentBlocks.displayOrder),
        asc(publicContentBlocks.sectionKey),
        asc(publicContentBlocks.blockKey)
      );

    return rows.map(transformBlock);
  }

  static async getBySection({
    page,
    sectionKey,
    locale = "en",
    visibleOnly = true,
  }: {
    page: string;
    sectionKey: string;
    locale?: string;
    visibleOnly?: boolean;
  }): Promise<PublicContentBlock[]> {
    const db = await getDB();
    const conditions = [
      eq(publicContentBlocks.page, page),
      eq(publicContentBlocks.locale, locale),
      eq(publicContentBlocks.sectionKey, sectionKey),
    ];

    if (visibleOnly) {
      conditions.push(eq(publicContentBlocks.isVisible, true));
    }

    const rows = await db
      .select()
      .from(publicContentBlocks)
      .where(and(...conditions))
      .orderBy(asc(publicContentBlocks.displayOrder));

    return rows.map(transformBlock);
  }

  static async getAllAdmin(): Promise<PublicContentBlock[]> {
    const db = await getDB();
    const rows = await db
      .select()
      .from(publicContentBlocks)
      .orderBy(
        asc(publicContentBlocks.page),
        asc(publicContentBlocks.locale),
        asc(publicContentBlocks.displayOrder)
      );

    return rows.map(transformBlock);
  }

  static async update(
    id: string,
    updates: Partial<Omit<NewPublicContentBlock, "id" | "createdAt">>
  ): Promise<PublicContentBlock | null> {
    const db = await getDB();
    await db
      .update(publicContentBlocks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(publicContentBlocks.id, id));

    const [row] = await db
      .select()
      .from(publicContentBlocks)
      .where(eq(publicContentBlocks.id, id))
      .limit(1);

    return row ? transformBlock(row) : null;
  }
}
