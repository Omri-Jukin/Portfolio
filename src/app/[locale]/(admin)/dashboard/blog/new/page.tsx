"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControl,
  InputBase,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
  SelectChangeEvent,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { api } from "$/trpc/client";
import { useRouter, useParams } from "next/navigation";
import Snackbar from "~/Snackbar";

const AdminBlogNew = () => {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    status: "draft" as
      | "draft"
      | "published"
      | "archived"
      | "scheduled"
      | "deleted",
    tags: [] as string[],
    imageUrl: "",
    imageAlt: "",
  });
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ url: string; type: string; name: string }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info" | "warning",
  });

  const createPostMutation = api.blog.create.useMutation({
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Blog post created successfully!",
        severity: "success",
      });
      setTimeout(() => {
        router.push(`/${locale}/dashboard/blog`);
      }, 2000);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create blog post",
        severity: "error",
      });
    },
  });

  const handleInputChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
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
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      // Upload all selected files
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "blog"); // Store in blog folder

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Upload failed");
        }

        return {
          url: result.url,
          type: result.fileType,
          name: result.fileName,
        };
      });

      const uploaded = await Promise.all(uploadPromises);

      // Add to uploaded files list
      setUploadedFiles((prev) => [...prev, ...uploaded]);

      // If first file is an image, set it as featured image
      const firstImage = uploaded.find((f) => f.type.startsWith("image/"));
      if (firstImage && !formData.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: firstImage.url,
          imageAlt: firstImage.name,
        }));
      }

      setSnackbar({
        open: true,
        message: `Successfully uploaded ${uploaded.length} file(s)`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "Upload failed",
        severity: "error",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (urlToRemove: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.url !== urlToRemove));
    // If removing the featured image, clear it
    if (formData.imageUrl === urlToRemove) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: "",
        imageAlt: "",
      }));
    }
  };

  const handleSetFeaturedImage = (url: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
      imageAlt: name,
    }));
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a mock event object for the file upload handler
      const mockEvent = {
        target: { files: Array.from(files) },
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

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Blog Post
      </Typography>

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

          {/* Media Upload Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Media Files (Images & Videos)
            </Typography>

            {/* File input - now visible with custom styling */}
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                backgroundColor: "background.paper",
              }}
            >
              <Box
                component="label"
                htmlFor="file-upload-input"
                sx={{
                  display: "block",
                  width: "100%",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Select Files:
                </Typography>
                <InputBase
                  id="file-upload-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  inputProps={{ accept: "image/*,video/*", multiple: true }}
                  disabled={uploading}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    borderRadius: "4px",
                    cursor: uploading ? "not-allowed" : "pointer",
                  }}
                  title="Select image or video files to upload"
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Select multiple files. Images: JPEG, PNG, GIF, WebP (max 5MB) |
                Videos: MP4, WebM, OGG (max 50MB)
              </Typography>
            </Box>

            {/* Drag and drop area */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: "2px dashed",
                borderColor: "grey.300",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                mb: 2,
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
              onClick={triggerFileUpload}
            >
              <CloudUpload sx={{ fontSize: 48, color: "grey.500", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {uploading ? "Uploading..." : "Or Drag & Drop Files Here"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to browse or drag and drop images/videos
              </Typography>
              {uploading && <CircularProgress size={20} sx={{ mt: 1 }} />}
            </Box>

            {/* Uploaded files gallery */}
            {uploadedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Uploaded Files ({uploadedFiles.length})
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      sm: "repeat(3, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {uploadedFiles.map((file, index) => (
                    <Card key={index} sx={{ position: "relative" }}>
                      {file.type.startsWith("image/") ? (
                        <CardMedia
                          component="img"
                          height="150"
                          image={file.url}
                          alt={file.name}
                          sx={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 150,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "grey.100",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Video
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          display: "flex",
                          gap: 0.5,
                        }}
                      >
                        {file.type.startsWith("image/") &&
                          formData.imageUrl !== file.url && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleSetFeaturedImage(file.url, file.name)
                              }
                              sx={{
                                backgroundColor: "primary.main",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "primary.dark",
                                },
                              }}
                              title="Set as featured image"
                            >
                              <CloudUpload fontSize="small" />
                            </IconButton>
                          )}
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(file.url)}
                          sx={{
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "error.dark",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                      {formData.imageUrl === file.url && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 4,
                            left: 4,
                            backgroundColor: "primary.main",
                            color: "white",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="caption">Featured</Typography>
                        </Box>
                      )}
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
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
              onClick={() => router.push(`/${locale}/dashboard/blog`)}
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

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
};

export default AdminBlogNew;
