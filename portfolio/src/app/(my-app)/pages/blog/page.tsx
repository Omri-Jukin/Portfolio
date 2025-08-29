"use client";

import { Box, Container, Typography } from "@mui/material";
import { BlogPost } from "@/components/BlogPosts";

export default function BlogPage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            Blog & Insights
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sharing knowledge, experiences, and insights about modern web
            development, technology trends, and best practices.
          </Typography>
        </Box>

        <BlogPost
          title="Featured Articles"
          subtitle="Latest insights and tutorials"
          maxPosts={6}
          showFeatured={true}
          showCategories={true}
        />
      </Box>
    </Container>
  );
}
