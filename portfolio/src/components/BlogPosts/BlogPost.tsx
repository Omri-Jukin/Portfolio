"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import { CalendarToday, Person, AccessTime } from "@mui/icons-material";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
  slug: string;
}

interface BlogPostProps {
  title?: string;
  subtitle?: string;
  maxPosts?: number;
  showFeatured?: boolean;
  showCategories?: boolean;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable Web Applications with Next.js 15",
    excerpt:
      "Learn how to leverage the latest features of Next.js 15 to build performant and scalable web applications.",
    author: "John Doe",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Web Development",
    tags: ["Next.js", "React", "Performance", "Scalability"],
    featured: true,
    imageUrl: "/api/placeholder/600/300",
    slug: "building-scalable-web-applications-nextjs-15",
  },
  {
    id: "2",
    title: "The Future of State Management in React 19",
    excerpt:
      "Exploring the new state management patterns and hooks introduced in React 19 and how they change the way we build applications.",
    author: "John Doe",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "React",
    tags: ["React", "State Management", "Hooks", "React 19"],
    featured: false,
    imageUrl: "/api/placeholder/600/300",
    slug: "future-state-management-react-19",
  },
  {
    id: "3",
    title: "Optimizing Database Performance with Drizzle ORM",
    excerpt:
      "A deep dive into Drizzle ORM and how it can significantly improve your database query performance.",
    author: "John Doe",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Backend",
    tags: ["Database", "ORM", "Performance", "TypeScript"],
    featured: false,
    imageUrl: "/api/placeholder/600/300",
    slug: "optimizing-database-performance-drizzle-orm",
  },
  {
    id: "4",
    title: "Building a Portfolio with Payload CMS",
    excerpt:
      "Step-by-step guide to creating a modern portfolio website using Payload CMS and Next.js.",
    author: "John Doe",
    date: "2023-12-28",
    readTime: "15 min read",
    category: "CMS",
    tags: ["Payload CMS", "Next.js", "Portfolio", "Content Management"],
    featured: true,
    imageUrl: "/api/placeholder/600/300",
    slug: "building-portfolio-payload-cms",
  },
  {
    id: "5",
    title: "Deploying to Cloudflare Pages: Best Practices",
    excerpt:
      "Learn the best practices for deploying your Next.js applications to Cloudflare Pages with optimal performance.",
    author: "John Doe",
    date: "2023-12-20",
    readTime: "6 min read",
    category: "DevOps",
    tags: ["Cloudflare", "Deployment", "Performance", "Next.js"],
    featured: false,
    imageUrl: "/api/placeholder/600/300",
    slug: "deploying-cloudflare-pages-best-practices",
  },
  {
    id: "6",
    title: "TypeScript Best Practices for Large Projects",
    excerpt:
      "Essential TypeScript patterns and practices that help maintain code quality in large-scale projects.",
    author: "John Doe",
    date: "2023-12-15",
    readTime: "14 min read",
    category: "TypeScript",
    tags: ["TypeScript", "Best Practices", "Code Quality", "Large Projects"],
    featured: false,
    imageUrl: "/api/placeholder/600/300",
    slug: "typescript-best-practices-large-projects",
  },
];

const categories = [
  "All",
  "Web Development",
  "React",
  "Backend",
  "CMS",
  "DevOps",
  "TypeScript",
];

export default function BlogPost({
  title = "Latest Blog Posts",
  subtitle = "Insights and tutorials about modern web development",
  maxPosts = 6,
  showFeatured = true,
  showCategories = true,
}: BlogPostProps) {
  const postsToShow = mockBlogPosts.slice(0, maxPosts);
  const featuredPosts = postsToShow.filter((post) => post.featured);
  const regularPosts = postsToShow.filter((post) => !post.featured);

  return (
    <Box py={4}>
      {title && (
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Categories */}
      {showCategories && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Featured Posts */}
      {showFeatured && featuredPosts.length > 0 && (
        <Box mb={6}>
          <Typography variant="h5" component="h3" gutterBottom>
            Featured Articles
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 4,
            }}
          >
            {featuredPosts.map((post) => (
              <Box key={post.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  {post.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.imageUrl}
                      alt={post.title}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Chip
                        label="Featured"
                        size="small"
                        color="primary"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      component="h4"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {post.title}
                      </Link>
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, flexGrow: 1 }}
                    >
                      {post.excerpt}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        fontSize: "0.8rem",
                        color: "text.secondary",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Person fontSize="small" />
                        {post.author}
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarToday fontSize="small" />
                        {new Date(post.date).toLocaleDateString()}
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AccessTime fontSize="small" />
                        {post.readTime}
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      {post.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      ))}
                    </Box>

                    <Button
                      component={Link}
                      href={`/blog/${post.slug}`}
                      variant="outlined"
                      size="small"
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Regular Posts */}
      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          All Articles
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {regularPosts.map((post) => (
            <Box key={post.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                }}
              >
                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.imageUrl}
                    alt={post.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    variant="body2"
                    color="primary"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    {post.category}
                  </Typography>

                  <Typography
                    variant="h6"
                    component="h4"
                    gutterBottom
                    sx={{ fontWeight: 600, lineHeight: 1.3 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {post.title}
                    </Link>
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {post.excerpt}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      fontSize: "0.8rem",
                      color: "text.secondary",
                    }}
                  >
                    <CalendarToday fontSize="small" />
                    {new Date(post.date).toLocaleDateString()}
                    <Box sx={{ mx: 1 }}>•</Box>
                    <AccessTime fontSize="small" />
                    {post.readTime}
                  </Box>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                  >
                    {post.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.6rem" }}
                      />
                    ))}
                  </Box>

                  <Button
                    component={Link}
                    href={`/blog/${post.slug}`}
                    variant="text"
                    size="small"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Newsletter Signup */}
      <Paper
        elevation={2}
        sx={{
          mt: 8,
          p: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          Stay Updated
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
          Get the latest articles, tutorials, and insights delivered straight to
          your inbox. No spam, just valuable content.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            Subscribe to Newsletter
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
