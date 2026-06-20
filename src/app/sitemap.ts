import type { MetadataRoute } from "next";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { getPublishedPosts } from "$/db/blog/blog";

export const dynamic = "force-dynamic";

const siteUrl = "https://omrijukin.com";

const staticRoutes = ["", "/about", "/resume", "/contact", "/blog"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const projects = await ProjectManager.getAll(true);
    const posts = await getPublishedPosts();
    const projectEntries = projects
      .filter((project) => project.caseStudySlug)
      .map((project) => ({
        url: `${siteUrl}/projects/${project.caseStudySlug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    const postEntries = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticEntries, ...projectEntries, ...postEntries];
  } catch {
    return staticEntries;
  }
}
