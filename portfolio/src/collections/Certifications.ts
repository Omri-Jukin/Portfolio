import { CollectionConfig } from "payload";

export const Certifications: CollectionConfig = {
  slug: "certifications",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "issuer", "issueDate", "status", "featured"],
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
      name: "issuer",
      type: "text",
      required: true,
    },
    {
      name: "issueDate",
      type: "date",
      required: true,
    },
    {
      name: "expiryDate",
      type: "date",
      admin: {
        description: "Leave empty if no expiration",
      },
    },
    {
      name: "credentialId",
      type: "text",
      admin: {
        description: "Certificate ID or verification code",
      },
    },
    {
      name: "verifyUrl",
      type: "text",
      admin: {
        description: "URL to verify the certification",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Issuer logo or certificate image",
      },
    },
    {
      name: "skills",
      type: "relationship",
      relationTo: "skills",
      hasMany: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Expired", value: "expired" },
        { label: "In Progress", value: "in-progress" },
      ],
      defaultValue: "active",
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Auto-update status based on expiry date
            if (data?.expiryDate && new Date(data.expiryDate) < new Date()) {
              data.status = "expired";
            }
            return data;
          },
        ],
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
          console.log(
            `Certification "${doc.title}" updated, revalidating content`
          );
          // This would trigger revalidation for homepage and related skill pages
        }
      },
    ],
  },
};
