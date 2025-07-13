import { getPublishedPosts } from "@/../lib/db/blog/blog";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import BlogPageClient from "./BlogPageClient";

// Local type for blog posts used in this page
interface Post {
  id: string;
  title: string;
  excerpt?: string;
  publishedAt?: number;
  createdAt: number;
  slug: string;
}

// Local type for raw blog post objects returned by getPublishedPosts
interface RawPost {
  id: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  slug: string;
}

export default async function BlogPage() {
  try {
    const rawPosts: RawPost[] = await getPublishedPosts();
    const posts: Post[] = rawPosts.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt ?? undefined,
      publishedAt: p.publishedAt ? p.publishedAt.getTime() : undefined,
      createdAt: p.createdAt.getTime(),
      slug: p.slug,
    }));

    return <BlogPageClient posts={posts} />;
  } catch {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Blog
        </Typography>
        <Typography color="error">
          Error loading blog posts. Please try again later.
        </Typography>
      </Container>
    );
  }
}
