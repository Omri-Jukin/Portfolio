import { CollectionConfig } from "payload";

export const WorkExperience: CollectionConfig = {
  slug: "work-experience",
  admin: {
    useAsTitle: "role",
    defaultColumns: ["company", "role", "startDate", "endDate", "type"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Company logo",
      },
    },
    {
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "startDate",
      type: "date",
      required: true,
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        description: "Leave empty if current position",
      },
    },
    {
      name: "location",
      type: "text",
      admin: {
        description: "Work location (city, country)",
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Full-time", value: "full-time" },
        { label: "Part-time", value: "part-time" },
        { label: "Contract", value: "contract" },
      ],
      defaultValue: "full-time",
    },
    {
      name: "highlights",
      type: "richText",
      admin: {
        description: "Key achievements and responsibilities",
      },
    },
    {
      name: "skills",
      type: "relationship",
      relationTo: "skills",
      hasMany: true,
    },
    {
      name: "projects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
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
          console.log(
            `Work experience at "${doc.company}" updated, revalidating content`
          );
          // This would trigger revalidation for homepage and related project pages
        }
      },
    ],
  },
};
