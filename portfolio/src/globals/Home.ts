import { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: "home",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "hero",
      type: "group",
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
      name: "intro",
      type: "richText",
      admin: {
        description: "Introduction section below hero",
      },
    },
    {
      name: "featuredProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      admin: {
        description: "Projects to showcase on homepage",
      },
    },
    {
      name: "featuredPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      admin: {
        description: "Blog posts to showcase on homepage",
      },
    },
    {
      name: "featuredTestimonials",
      type: "relationship",
      relationTo: "testimonials",
      hasMany: true,
      admin: {
        description: "Testimonials to showcase on homepage",
      },
    },
    {
      name: "featuredSkills",
      type: "relationship",
      relationTo: "skills",
      hasMany: true,
      admin: {
        description: "Skills to showcase on homepage",
      },
    },
    {
      name: "featuredExperience",
      type: "relationship",
      relationTo: "work-experience",
      hasMany: true,
      admin: {
        description: "Work experience to showcase on homepage",
      },
    },
    {
      name: "featuredCertifications",
      type: "relationship",
      relationTo: "certifications",
      hasMany: true,
      admin: {
        description: "Certifications to showcase on homepage",
      },
    },
    {
      name: "cta",
      type: "group",
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
  hooks: {
    afterChange: [
      async ({ req }) => {
        // Revalidate homepage
        if (req?.payload) {
          console.log("Home global updated, revalidating homepage");
          // This would trigger revalidation for the homepage
        }
      },
    ],
  },
};
