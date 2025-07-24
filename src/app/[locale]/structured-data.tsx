import { useTranslations } from "next-intl";

export default function StructuredData() {
  const t = useTranslations("metadata");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Omri Jukin",
    jobTitle: "Full Stack Developer",
    description: t("description"),
    url: "https://omrijukin.com",
    sameAs: [
      "https://github.com/Omri-Jukin",
      "https://linkedin.com/in/omrijukin",
    ],
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Web Development",
      "UI/UX Design",
      "Angular",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS SES",
      "AWS S3",
      "AWS Polly",
      "Prometheus",
      "Git",
      "GitHub",
      "GitLab",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      description: "Developing web applications with modern technologies",
    },
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
