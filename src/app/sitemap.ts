import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://omrijukin.com";
  const locales = ["en", "es", "fr", "he"];

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Home page for each locale
  locales.forEach((locale) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    });

    // Main sections as anchor links
    const sections = ["about", "career", "projects", "contact"];
    sections.forEach((section) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}#${section}-section`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    });
  });

  // Root redirect
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  });

  // Static pages
  const staticPages = ["/resume", "/calendly"];

  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}

