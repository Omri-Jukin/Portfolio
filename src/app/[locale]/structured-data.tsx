import { useTranslations } from "next-intl";

export default function StructuredData() {
  const t = useTranslations("metadata");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Omri Jukin",
    alternateName: "Omri Jukin",
    jobTitle: "Full Stack Developer",
    description: t("description"),
    url: "https://omrijukin.com",
    image: "https://omrijukin.com/Watercolor_Profile_Picture.png",
    email: "omrijukin@gmail.com",
    telephone: "+972-52-334-4064",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IL",
      addressRegion: "Israel",
    },
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
      "tRPC",
      "Drizzle ORM",
      "Material-UI",
      "Tailwind CSS",
      "JavaScript",
      "HTML5",
      "CSS3",
      "REST APIs",
      "GraphQL",
      "Microservices",
      "Cloud Architecture",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      description:
        "Developing scalable web applications with modern technologies including React, Next.js, TypeScript, Node.js, and cloud services",
      occupationLocation: {
        "@type": "Country",
        name: "Israel",
      },
    },
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
      description: "Independent software development and consulting services",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Self-Taught Developer",
    },
    award: [
      "2+ Years building resilient products",
      "15+ End-to-end launches across sectors",
      "100% Critical flows covered by automation",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Full Stack Development",
        description:
          "Self-taught expertise in modern web development technologies",
      },
    ],
    memberOf: [
      {
        "@type": "Organization",
        name: "GitHub Community",
        url: "https://github.com/Omri-Jukin",
      },
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Omri Jukin Portfolio",
    description: t("description"),
    url: "https://omrijukin.com",
    author: {
      "@type": "Person",
      name: "Omri Jukin",
    },
    inLanguage: ["en", "es", "fr", "he"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://omrijukin.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Omri Jukin Development Services",
    description: "Professional full-stack development and consulting services",
    url: "https://omrijukin.com",
    logo: "https://omrijukin.com/logo.png",
    founder: {
      "@type": "Person",
      name: "Omri Jukin",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+972-52-334-4064",
      contactType: "customer service",
      email: "omrijukin@gmail.com",
      availableLanguage: ["English", "Hebrew"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IL",
    },
    sameAs: [
      "https://github.com/Omri-Jukin",
      "https://linkedin.com/in/omrijukin",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
    </>
  );
}
