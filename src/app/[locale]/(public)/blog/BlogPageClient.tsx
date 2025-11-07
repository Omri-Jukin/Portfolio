"use client";

import { Container, Typography, List, Box } from "@mui/material";
import Card from "#/Components/Card";
import MotionWrapper from "#/Components/MotionWrapper";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string | null;
  createdAt: string;
}

interface BlogPageClientProps {
  posts: Post[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          data-aos="fade-down"
          data-aos-duration="250"
        >
          Blog
        </Typography>
      </MotionWrapper>

      <List>
        {posts.map((post: Post, index: number) => (
          <MotionWrapper
            key={post.id}
            variant="slideUp"
            duration={0.6}
            delay={0.4 + index * 0.1}
          >
            <Box
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={200 + index * 100}
            >
              <Card
                title={post.title}
                description={post.excerpt}
                date={
                  post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : new Date(post.createdAt).toLocaleDateString()
                }
                href={`/blog/${post.slug}`}
              />
            </Box>
          </MotionWrapper>
        ))}
      </List>

      {posts.length === 0 && (
        <MotionWrapper variant="fadeIn" duration={0.8} delay={0.4}>
          <Typography
            variant="body1"
            color="text.secondary"
            data-aos="fade-up"
            data-aos-duration="250"
            data-aos-delay="200"
          >
            No blog posts published yet.
          </Typography>
        </MotionWrapper>
      )}
    </Container>
  );
}
