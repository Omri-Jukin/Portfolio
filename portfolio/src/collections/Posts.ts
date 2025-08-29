import { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "featured", "author"],
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
        description: 'URL slug (e.g., "my-blog-post")',
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
      name: "date",
      type: "date",
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        description: "Brief description for post previews",
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "readingTime",
      type: "number",
      admin: {
        description: "Reading time in minutes (auto-calculated)",
        readOnly: true,
      },
    },
    {
      name: "author",
      type: "text",
      defaultValue: "Admin",
      admin: {
        description: "Author name",
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
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "SEO title (defaults to post title)",
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
    beforeChange: [
      async ({ data }) => {
        // Calculate reading time based on content
        if (data?.content) {
          const wordCount = JSON.stringify(data.content).split(" ").length;
          data.readingTime = Math.ceil(wordCount / 200); // 200 words per minute
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Revalidate post pages and related content
        if (req?.payload) {
          console.log(`Post "${doc.title}" updated, revalidating routes`);
          // This would trigger revalidation for post routes and homepage
        }
      },
    ],
  },
};
