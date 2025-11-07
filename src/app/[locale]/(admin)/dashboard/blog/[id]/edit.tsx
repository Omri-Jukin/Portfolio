import React from "react";
import { Box, Button, Link, Typography } from "@mui/material";

const AdminBlogEdit = () => {
  const posts = [
    { id: 1, title: "Post 1", content: "Content 1" },
    { id: 2, title: "Post 2", content: "Content 2" },
    { id: 3, title: "Post 3", content: "Content 3" },
  ];
  return (
    <Box>
      {/* choosing the desired post */}
      <Typography variant="h1">Edit Blog Post</Typography>
      {posts.map((post) => (
        <Box
          key={post.id}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h2">{post.title}</Typography>
          <Typography variant="body1">{post.content}</Typography>
          <Link href={`/dashboard/blog/${post.id}/edit`} underline="none">
            <Button
              variant="contained"
              color="primary"
              size="small"
              aria-label={`Edit post: ${post.title}`}
            >
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/blog/${post.id}/delete`} underline="none">
            <Button
              variant="contained"
              color="secondary"
              size="small"
              aria-label={`Delete post: ${post.title}`}
            >
              Delete
            </Button>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default AdminBlogEdit;
