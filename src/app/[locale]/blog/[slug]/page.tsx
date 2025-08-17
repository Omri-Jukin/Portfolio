"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "next/navigation";
import { api } from "$/trpc/client";
import TagChip from "~/TagChip";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const {
    data: post,
    isLoading,
    error,
  } = api.blog.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography>Loading post...</Typography>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography color="error">
          Post not found or error loading post.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        {post.title}
      </Typography>
      <Box sx={{ color: "text.secondary", mb: 2 }}>
        By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
        {post.publishedAt &&
          ` • Published ${new Date(post.publishedAt).toLocaleDateString()}`}
      </Box>
      {post.excerpt && (
        <Typography variant="h6" sx={{ mb: 3, fontStyle: "italic" }}>
          {post.excerpt}
        </Typography>
      )}
      <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
        {post.content}
      </Typography>
      {post.tags && post.tags.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tags:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {post.tags.map((tag: string) => (
              <TagChip tag={tag} key={tag} />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}
