"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  SelectChangeEvent,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { api } from "$/trpc/client";
import { useRouter } from "next/navigation";

const AdminBlogNew = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    status: "draft" as "draft" | "published",
    tags: [] as string[],
    imageUrl: "",
    imageAlt: "",
  });
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPostMutation = api.blog.create.useMutation({
    onSuccess: (data) => {
      setSuccess("Blog post created successfully!");
      setError(null);
      setTimeout(() => {
        router.push("/admin/blog");
      }, 2000);
    },
    onError: (error) => {
      setError(error.message || "Failed to create blog post");
      setSuccess(null);
    },
  });

  const uploadUrlMutation = api.upload.getUploadUrl.useMutation();

  const handleInputChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (error) setError(null);
      if (success) setSuccess(null);
    };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // First, validate the file through tRPC
      const uploadConfig = await uploadUrlMutation.mutateAsync({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Then upload the file
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadConfig.uploadUrl, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadedImage(result.url);
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url,
        imageAlt: file.name,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
      imageAlt: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Create a mock event object for the file upload handler
      const mockEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createPostMutation.mutate(formData);
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Blog Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={handleInputChange("title")}
            fullWidth
            required
            helperText="Enter the blog post title"
          />

          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            <TextField
              label="Slug"
              value={formData.slug}
              onChange={handleInputChange("slug")}
              fullWidth
              required
              helperText="URL-friendly version of the title"
            />
            <Button
              variant="outlined"
              onClick={generateSlug}
              disabled={!formData.title}
            >
              Generate
            </Button>
          </Box>

          <TextField
            label="Excerpt"
            value={formData.excerpt}
            onChange={handleInputChange("excerpt")}
            fullWidth
            multiline
            rows={3}
            helperText="Brief summary of the blog post"
          />

          <TextField
            label="Content"
            value={formData.content}
            onChange={handleInputChange("content")}
            fullWidth
            multiline
            rows={15}
            required
            helperText="Main content of the blog post (supports markdown)"
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e: SelectChangeEvent<string>) =>
                handleInputChange("status")(
                  e as React.ChangeEvent<HTMLInputElement>
                )
              }
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                size="small"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          {/* Image Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Featured Image
            </Typography>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: "none" }}
            />

            {uploadedImage ? (
              <Card sx={{ maxWidth: 400, mb: 2 }}>
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={uploadedImage}
                    alt={formData.imageAlt || "Uploaded image"}
                    sx={{ objectFit: "cover" }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ) : (
              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                  border: "2px dashed",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  p: 3,
                  width: "100%",
                  maxWidth: 400,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={triggerFileUpload}
              >
                <CloudUpload sx={{ fontSize: 48, color: "grey.500", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {uploading ? "Uploading..." : "Upload Image"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to browse or drag and drop
                </Typography>
                {uploading && <CircularProgress size={20} sx={{ mt: 1 }} />}
              </Box>
            )}

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
            </Typography>
          </Box>

          {/* Manual Image URL input (fallback) */}
          <TextField
            label="Image URL (optional)"
            value={formData.imageUrl}
            onChange={handleInputChange("imageUrl")}
            fullWidth
            helperText="Or enter an image URL directly"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Image Alt Text"
            value={formData.imageAlt}
            onChange={handleInputChange("imageAlt")}
            fullWidth
            helperText="Accessibility description for the image"
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/admin/blog")}
              disabled={createPostMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createPostMutation.isPending}
              startIcon={
                createPostMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : null
              }
            >
              {createPostMutation.isPending ? "Creating..." : "Create Post"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default AdminBlogNew;
