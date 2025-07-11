import { getPublishedPosts } from '../../../lib/db/blog/blog';
import NextLink from 'next/link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

export default async function BlogPage() {
  try {
    const posts = await getPublishedPosts();

    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Blog
        </Typography>
        <List>
          {posts.map(post => (
            <ListItem key={post.id} disablePadding sx={{ mb: 2 }}>
              <Box>
                <Link
                  component={NextLink}
                  href={`/blog/${post.slug}`}
                  underline="hover"
                  sx={{ fontWeight: 500, fontSize: '1.1rem', display: 'block' }}
                >
                  {post.title}
                </Link>
                {post.excerpt && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {post.excerpt}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
        {posts.length === 0 && (
          <Typography variant="body1" color="text.secondary">
            No blog posts published yet.
          </Typography>
        )}
      </Container>
    );
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