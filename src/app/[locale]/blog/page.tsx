"use client";

import { api } from "$/trpc/client";
import NextLink from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

export default function BlogPage() {
  const { data: posts, isLoading, error } = api.blog.getPublished.useQuery();

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom>
          Blog
        </Typography>
        <Typography>Loading blog posts...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom>
          Blog
        </Typography>
        <Typography color="error">
          Error loading blog posts. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        Blog
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {posts?.map(
          (
            post: any // eslint-disable-line @typescript-eslint/no-explicit-any
          ) => (
            <Box key={post.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease-in-out",
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
                    alt={post.imageAlt || post.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Link
                    component={NextLink}
                    href={`/blog/${post.slug}`}
                    underline="hover"
                    aria-label={`Read post: ${post.title}`}
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      display: "block",
                      mb: 1,
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {post.title}
                  </Link>
                  {post.excerpt && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, flexGrow: 1 }}
                    >
                      {post.excerpt}
                    </Typography>
                  )}
                  <Box sx={{ mt: "auto" }}>
                    <Typography variant="caption" color="text.secondary">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    {post.tags && post.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <Typography
                            key={tag}
                            variant="caption"
                            sx={{
                              backgroundColor: "primary.light",
                              color: "primary.contrastText",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              mr: 0.5,
                              fontSize: "0.7rem",
                            }}
                          >
                            {tag}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )
        )}
      </Box>
      {(!posts || posts.length === 0) && (
        <Typography variant="body1" color="text.secondary">
          No blog posts published yet.
        </Typography>
      )}
    </Container>
  );
}
