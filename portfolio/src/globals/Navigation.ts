import { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "primary",
      type: "array",
      admin: {
        description: "Primary navigation items",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "href",
          type: "text",
          required: true,
        },
        {
          name: "external",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Is this an external link?",
          },
        },
      ],
    },
    {
      name: "secondary",
      type: "array",
      admin: {
        description: "Secondary navigation items",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "href",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "footer",
      type: "array",
      admin: {
        description: "Footer navigation items",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "href",
          type: "text",
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ req }) => {
        // Revalidate all pages when navigation changes
        if (req?.payload) {
          console.log("Navigation updated, revalidating all pages");
          // This would trigger revalidation for all pages
        }
      },
    ],
  },
};
