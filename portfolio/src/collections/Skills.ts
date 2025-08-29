import { CollectionConfig } from "payload";

export const Skills: CollectionConfig = {
  slug: "skills",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "proficiency", "years", "featured"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
          ({ value, data }) => {
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
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Frontend", value: "frontend" },
        { label: "Backend", value: "backend" },
        { label: "DevOps", value: "devops" },
        { label: "Design", value: "design" },
        { label: "Data", value: "data" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "proficiency",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      admin: {
        description: "Skill level from 0-100",
      },
    },
    {
      name: "years",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description: "Years of experience",
      },
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional skill icon",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Brief description of the skill",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show on homepage",
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
      async ({ doc, req }) => {
        // Revalidate related content
        if (req?.payload) {
          console.log(`Skill "${doc.name}" updated, revalidating content`);
          // This would trigger revalidation for homepage and related project pages
        }
      },
    ],
  },
};
