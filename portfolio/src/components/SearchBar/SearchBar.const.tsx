import { SearchResult } from "./SearchBar.type";

export const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Portfolio Website",
    type: "project",
    description: "A modern portfolio built with Next.js 15 and React 19",
    url: "/projects/portfolio-website",
  },
  {
    id: "2",
    title: "Next.js 15 Features",
    type: "blog",
    description: "Exploring the latest features in Next.js 15",
    url: "/blog/nextjs-15-features",
  },
  {
    id: "3",
    title: "React",
    type: "skill",
    description: "Frontend framework expertise",
    url: "/skills/react",
  },
  {
    id: "4",
    title: "TypeScript Best Practices",
    type: "blog",
    description: "Essential TypeScript patterns for large projects",
    url: "/blog/typescript-best-practices",
  },
  {
    id: "5",
    title: "E-commerce Platform",
    type: "project",
    description: "Full-featured online store with payment integration",
    url: "/projects/ecommerce-platform",
  },
];

export const popularSearchTerms = [
  "React",
  "Next.js",
  "TypeScript",
  "Portfolio",
  "Blog",
];

export const getTypeIcon = (type: string) => {
  switch (type) {
    case "project":
      return "🚀";
    case "blog":
      return "📝";
    case "skill":
      return "⚡";
    default:
      return "🔍";
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "project":
      return "primary.main";
    case "blog":
      return "secondary.main";
    case "skill":
      return "success.main";
    default:
      return "text.secondary";
  }
};
