"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import { useRouter } from "next/navigation";

const AdminBlogDashboard = () => {
  const router = useRouter();
  const { data: posts, isLoading, error, refetch } = api.blog.getAll.useQuery();

  const deletePostMutation = api.blog.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Blog Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/admin/blog/new")}
        >
          Create New Post
        </Button>
      </Box>

      {posts && posts.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map(
                (
                  post: any // eslint-disable-line @typescript-eslint/no-explicit-any
                ) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{post.title}</Typography>
                      {post.excerpt && (
                        <Typography variant="body2" color="text.secondary">
                          {post.excerpt.substring(0, 100)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {post.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.status}
                        color={
                          post.status === "published" ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {post.tags?.slice(0, 3).map(
                          (
                            tag: any // eslint-disable-line @typescript-eslint/no-explicit-any
                          ) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          )
                        )}
                        {post.tags && post.tags.length > 3 && (
                          <Chip
                            label={`+${post.tags.length - 3}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            router.push(`/admin/blog/${post.id}/edit`)
                          }
                          aria-label="Edit post"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(post.id)}
                          aria-label="Delete post"
                          color="error"
                          disabled={deletePostMutation.isPending}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No blog posts found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first blog post to get started.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/admin/blog/new")}
          >
            Create First Post
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default AdminBlogDashboard;
