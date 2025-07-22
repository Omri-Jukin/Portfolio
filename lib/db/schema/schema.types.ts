import * as Tables from "./schema.tables";

export type Post = typeof Tables.blogPosts.$inferSelect;
export type User = typeof Tables.users.$inferSelect;
export const Inquiry = Tables.contactInquiries.$inferSelect;
