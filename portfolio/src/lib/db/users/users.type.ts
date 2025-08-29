import { users } from "../schema/schema.tables";

export type User = typeof users.$inferSelect;
