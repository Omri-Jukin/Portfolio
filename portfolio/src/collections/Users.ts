import { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "approved"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
      defaultValue: "editor",
    },
    {
      name: "approved",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "User must be approved to access admin",
      },
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Profile picture",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Ensure new users start as unapproved
        if (!req?.user && data) {
          data.approved = false;
        }
        return data;
      },
    ],
  },
};
