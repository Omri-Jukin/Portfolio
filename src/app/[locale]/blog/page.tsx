"use client";

import { api } from "$/trpc/client";
import NextLink from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        Blog
      </Typography>
      <List>
        {posts?.map(
          (
            post: any // eslint-disable-line @typescript-eslint/no-explicit-any
          ) => (
            <ListItem disablePadding sx={{ mb: 2 }} key={post.slug}>
              <Box>
                <Link
                  component={NextLink}
                  href={`/blog/${post.slug}`}
                  underline="hover"
                  aria-label={`Read post: ${post.title}`}
                  sx={{ fontWeight: 500, fontSize: "1.1rem", display: "block" }}
                >
                  {post.title}
                </Link>
                {post.excerpt && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {post.excerpt}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </ListItem>
          )
        )}
      </List>
      {(!posts || posts.length === 0) && (
        <Typography variant="body1" color="text.secondary">
          No blog posts published yet.
        </Typography>
      )}
    </Container>
  );
}
