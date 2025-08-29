import { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "enabled", "systemPage", "order"],
  },
  access: {
    read: ({ data }: { data?: { enabled?: boolean } }) =>
      data?.enabled === true,
    create: ({ req }: { req?: { user?: unknown } }) => Boolean(req?.user),
    update: ({ req }: { req?: { user?: unknown } }) => Boolean(req?.user),
    delete: ({ req }: { req?: { user?: unknown } }) => Boolean(req?.user),
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
        description: 'URL slug (e.g., "about-me" for /pages/about-me)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }: { value?: string; data?: { title?: string } }) => {
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
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "If disabled, this page will return 404",
      },
    },
    {
      name: "systemPage",
      type: "select",
      options: [
        { label: "Custom", value: "custom" },
        { label: "About", value: "about" },
        { label: "Contact", value: "contact" },
      ],
      defaultValue: "custom",
      admin: {
        description: "System pages may have dedicated routes",
      },
    },
    {
      name: "layoutBlocks",
      type: "array",
      fields: [
        {
          name: "blockType",
          type: "select",
          required: true,
          options: [
            { label: "Hero", value: "hero" },
            { label: "Text", value: "text" },
            { label: "Media", value: "media" },
            { label: "CTA", value: "cta" },
          ],
        },
        {
          name: "hero",
          type: "group",
          admin: {
            condition: (
              data: unknown,
              siblingData: Partial<{ blockType: string }>
            ) => siblingData?.blockType === "hero",
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "subtitle",
              type: "text",
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
          ],
        },
        {
          name: "text",
          type: "group",
          admin: {
            condition: (
              data: unknown,
              siblingData: Partial<{ blockType: string }>
            ) => siblingData?.blockType === "text",
          },
          fields: [
            {
              name: "content",
              type: "richText",
              required: true,
            },
          ],
        },
        {
          name: "media",
          type: "group",
          admin: {
            condition: (
              data: unknown,
              siblingData: Partial<{ blockType: string }>
            ) => siblingData?.blockType === "media",
          },
          fields: [
            {
              name: "images",
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
          ],
        },
        {
          name: "cta",
          type: "group",
          admin: {
            condition: (
              data: unknown,
              siblingData: Partial<{ blockType: string }>
            ) => siblingData?.blockType === "cta",
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
            },
          ],
        },
      ],
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        description: "Optional categories for organization",
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
            description: "SEO title (defaults to page title)",
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
      async ({
        doc,
        req,
      }: {
        doc: { title: string };
        req: { payload: unknown };
      }) => {
        // Revalidate the page and related content
        if (req?.payload) {
          console.log(`Page "${doc.title}" updated, revalidating routes`);
          // This would trigger revalidation for the page route
        }
      },
    ],
  },
};
