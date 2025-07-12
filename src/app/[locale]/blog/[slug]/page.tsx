import { getPostBySlug } from "../../../../../lib/db/blog/blog";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    return notFound();
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {post.title}
      </Typography>
      <Box sx={{ color: "text.secondary", mb: 2 }}>
        By {post.authorId} • {new Date(post.createdAt).toLocaleDateString()}
        {post.publishedAt &&
          ` • Published ${new Date(post.publishedAt).toLocaleDateString()}`}
      </Box>
      {post.excerpt && (
        <Typography variant="h6" sx={{ mb: 3, fontStyle: "italic" }}>
          {post.excerpt}
        </Typography>
      )}
      <Typography
        variant="body1"
        component="div"
        sx={{ whiteSpace: "pre-line" }}
      >
        {post.content}
      </Typography>
      {post.tags && post.tags.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tags:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {post.tags.map((tag, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.875rem",
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}
