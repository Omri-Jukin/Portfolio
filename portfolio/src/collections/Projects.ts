import { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "featured", "order"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., "my-awesome-project")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
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
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
      ],
      defaultValue: "active",
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        description: "Brief description for project cards",
      },
    },
    {
      name: "problem",
      type: "richText",
      admin: {
        description: "What problem did this project solve?",
      },
    },
    {
      name: "approach",
      type: "richText",
      admin: {
        description: "How did you approach the solution?",
      },
    },
    {
      name: "impact",
      type: "richText",
      admin: {
        description: "What was the impact/result?",
      },
    },
    {
      name: "metrics",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      options: [
        { label: "Lead", value: "lead" },
        { label: "Frontend", value: "frontend" },
        { label: "Backend", value: "backend" },
        { label: "Full Stack", value: "fullstack" },
        { label: "Design", value: "design" },
      ],
    },
    {
      name: "skills",
      type: "relationship",
      relationTo: "skills",
      hasMany: true,
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
        },
      ],
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "repoUrl",
      type: "text",
      admin: {
        description: "GitHub repository URL",
      },
      validate: (value: string | null | undefined) => {
        if (value && !value.startsWith("https://github.com/")) {
          return "Must be a valid GitHub URL";
        }
        return true;
      },
    },
    {
      name: "liveUrl",
      type: "text",
      admin: {
        description: "Live demo URL",
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
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "SEO title (defaults to project title)",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description: "SEO description",
          },
        },
        {
          name: "openGraph",
          type: "group",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Revalidate project pages and related content
        if (req?.payload) {
          console.log(`Project "${doc.title}" updated, revalidating routes`);
          // This would trigger revalidation for project routes and homepage
        }
      },
    ],
  },
};
