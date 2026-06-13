export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Omri Jukin",
    jobTitle: "Full-Stack TypeScript Engineer",
    description:
      "Full-stack engineer building production-ready TypeScript systems across frontend, backend, data, auth, integrations, internal tools, and deployment.",
    url: "https://omrijukin.com",
    sameAs: [
      "https://github.com/Omri-Jukin",
      "https://www.linkedin.com/in/omri-jukin/",
    ],
    knowsAbout: [
      "Full-stack TypeScript engineering",
      "TypeScript",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "tRPC",
      "Drizzle",
      "Internal tools",
      "Deployment workflows",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Full-Stack TypeScript Engineer",
      description:
        "Building production-ready TypeScript systems across product, platform, internal tools, and integrations.",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
