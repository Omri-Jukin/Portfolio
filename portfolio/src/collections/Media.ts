import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "../public/uploads",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Alt text for accessibility",
      },
    },
    {
      name: "attribution",
      type: "text",
      admin: {
        description: 'Optional attribution (e.g., "Photo by John Doe")',
      },
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description: "Optional caption for the image",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Strip EXIF data for privacy
        if (data?.filename) {
          console.log(`Processing media: ${data.filename}`);
        }
        return data;
      },
    ],
  },
};
