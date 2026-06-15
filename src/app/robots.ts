import type { MetadataRoute } from "next";

const siteUrl = "https://omrijukin.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/services/",
          "/login",
          "/403",
          "/intake/",
          "/meeting",
          "/p/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
