import { BlogPost, Category } from "./BlogPost.type";

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable Web Applications with Next.js 15",
    excerpt:
      "Learn how to leverage the latest features of Next.js 15 to build performant and scalable web applications.",
    author: "John Doe",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    category: "Web Development",
    tags: ["Next.js", "React", "Performance", "Scalability"],
    featured: true,
    image: "bg-gradient-to-br from-blue-400 to-indigo-500",
  },
  {
    id: 2,
    title: "The Future of State Management in React 19",
    excerpt:
      "Exploring the new state management patterns and hooks introduced in React 19 and how they change the way we build applications.",
    author: "John Doe",
    publishedAt: "2024-01-10",
    readTime: "12 min read",
    category: "React",
    tags: ["React", "State Management", "Hooks", "React 19"],
    featured: false,
    image: "bg-gradient-to-br from-green-400 to-teal-500",
  },
  {
    id: 3,
    title: "Optimizing Database Performance with Drizzle ORM",
    excerpt:
      "A deep dive into Drizzle ORM and how it can significantly improve your database query performance.",
    author: "John Doe",
    publishedAt: "2024-01-05",
    readTime: "10 min read",
    category: "Backend",
    tags: ["Database", "ORM", "Performance", "TypeScript"],
    featured: false,
    image: "bg-gradient-to-br from-purple-400 to-pink-500",
  },
  {
    id: 4,
    title: "Building a Portfolio with Payload CMS",
    excerpt:
      "Step-by-step guide to creating a modern portfolio website using Payload CMS and Next.js.",
    author: "John Doe",
    publishedAt: "2023-12-28",
    readTime: "15 min read",
    category: "CMS",
    tags: ["Payload CMS", "Next.js", "Portfolio", "Content Management"],
    featured: true,
    image: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    id: 5,
    title: "Deploying to Cloudflare Pages: Best Practices",
    excerpt:
      "Learn the best practices for deploying your Next.js applications to Cloudflare Pages with optimal performance.",
    author: "John Doe",
    publishedAt: "2023-12-20",
    readTime: "6 min read",
    category: "DevOps",
    tags: ["Cloudflare", "Deployment", "Performance", "Next.js"],
    featured: false,
    image: "bg-gradient-to-br from-red-400 to-pink-500",
  },
  {
    id: 6,
    title: "TypeScript Best Practices for Large Projects",
    excerpt:
      "Essential TypeScript patterns and practices that help maintain code quality in large-scale projects.",
    author: "John Doe",
    publishedAt: "2023-12-15",
    readTime: "14 min read",
    category: "TypeScript",
    tags: ["TypeScript", "Best Practices", "Code Quality", "Large Projects"],
    featured: false,
    image: "bg-gradient-to-br from-indigo-400 to-purple-500",
  },
];

export const categories: Category[] = [
  { id: 1, name: "All" },
  { id: 2, name: "Web Development" },
  { id: 3, name: "React" },
  { id: 4, name: "Backend" },
  { id: 5, name: "CMS" },
  { id: 6, name: "DevOps" },
  { id: 7, name: "TypeScript" },
];
