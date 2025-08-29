import { CollectionConfig, PayloadRequest, User } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "description", "order"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user: User | null } }) =>
      Boolean(user),
    update: ({ req: { user } }: { req: { user: User | null } }) =>
      Boolean(user),
    delete: ({ req: { user } }: { req: { user: User | null } }) =>
      Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Auto-generated from name",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }: { value?: string; data?: { name?: string } }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Optional description for this category",
      },
    },
    {
      name: "color",
      type: "text",
      admin: {
        description: "Hex color code (e.g., #3B82F6)",
      },
      validate: (value: unknown) => {
        if (typeof value === "string" && !/^#[0-9A-F]{6}$/i.test(value)) {
          return "Must be a valid hex color code";
        }
        return true;
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Order for display (lower numbers first)",
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }: { doc: { name: string }; req: PayloadRequest }) => {
        // Revalidate related content
        if (req?.payload) {
          // This would trigger revalidation for related projects, posts, pages
          console.log(
            `Category "${doc.name}" updated, revalidating related content`
          );
        }
      },
    ],
  },
};
