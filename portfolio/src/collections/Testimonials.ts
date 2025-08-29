import { CollectionConfig, PayloadRequest } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "authorName",
    defaultColumns: [
      "authorName",
      "company",
      "rating",
      "featured",
      "visibility",
    ],
  },
  access: {
    read: () => true,
    create: ({ req }: { req: { user: unknown } }) => Boolean(req?.user),
    update: ({ req }: { req: { user: unknown } }) => Boolean(req?.user),
    delete: ({ req }: { req: { user: unknown } }) => Boolean(req?.user),
  },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
      admin: {
        description: "The testimonial quote",
      },
    },
    {
      name: "authorName",
      type: "text",
      required: true,
    },
    {
      name: "authorTitle",
      type: "text",
      admin: {
        description: "Author's job title",
      },
    },
    {
      name: "company",
      type: "text",
      admin: {
        description: "Author's company",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Author's profile picture",
      },
    },
    {
      name: "rating",
      type: "select",
      options: [
        { label: "5 Stars", value: "5" },
        { label: "4 Stars", value: "4" },
        { label: "3 Stars", value: "3" },
        { label: "2 Stars", value: "2" },
        { label: "1 Star", value: "1" },
      ],
      admin: {
        description: "Rating out of 5 stars",
      },
    },
    {
      name: "project",
      type: "relationship",
      relationTo: "projects",
      admin: {
        description: "Related project (optional)",
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
      name: "date",
      type: "date",
      defaultValue: () => new Date(),
    },
    {
      name: "source",
      type: "text",
      admin: {
        description: 'Source of testimonial (e.g., "LinkedIn", "Email")',
      },
    },
    {
      name: "visibility",
      type: "select",
      required: true,
      options: [
        { label: "Public", value: "public" },
        { label: "Hidden", value: "hidden" },
      ],
      defaultValue: "public",
    },
  ],
  hooks: {
    afterChange: [
      async ({
        doc,
        req,
      }: {
        doc: { authorName: string };
        req: PayloadRequest;
      }) => {
        // Revalidate related content
        if (req?.payload) {
          console.log(
            `Testimonial from "${doc.authorName}" updated, revalidating content`
          );
          // This would trigger revalidation for homepage and related project pages
        }
      },
    ],
  },
};
