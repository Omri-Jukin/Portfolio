"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  SelectChangeEvent,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { api } from "$/trpc/client";
import Snackbar from "~/Snackbar";

interface BlogPostDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BlogPostDialog: React.FC<BlogPostDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dialogTab, setDialogTab] = useState(0);
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
      handleClose();
      onSuccess?.();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create blog post",
        severity: "error",
      });
    },
  });

  const uploadUrlMutation = api.upload.getUploadUrl.useMutation();

  const handleInputChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      status: event.target.value as typeof formData.status,
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
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select an image file",
        severity: "error",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "Image size must be less than 5MB",
        severity: "error",
      });
      return;
    }

    setUploading(true);
    try {
      const { uploadUrl } = await uploadUrlMutation.mutateAsync({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadedImage(uploadUrl);
      setFormData((prev) => ({
        ...prev,
        imageUrl: uploadUrl,
        imageAlt: file.name,
      }));

      setSnackbar({
        open: true,
        message: "Image uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setSnackbar({
        open: true,
        message: "Failed to upload image",
        severity: "error",
      });
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

  const handleClose = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "draft",
      tags: [],
      imageUrl: "",
      imageAlt: "",
    });
    setNewTag("");
    setUploadedImage(null);
    setDialogTab(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            overflow: "auto",
          },
        }}
      >
        <DialogTitle>Create New Blog Post</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={dialogTab}
              onChange={(_, newValue) => setDialogTab(newValue)}
            >
              <Tab label="Basic Info" />
              <Tab label="Content" />
              <Tab label="Media & Tags" />
            </Tabs>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Tab 0: Basic Info */}
            {dialogTab === 0 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                  fullWidth
                  required
                />

                <Box sx={{ display: "flex", gap: 2 }}>
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
                    sx={{ minWidth: 120 }}
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
                  helperText="Brief description of the post"
                />

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleStatusChange}
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Tab 1: Content */}
            {dialogTab === 1 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  label="Content"
                  value={formData.content}
                  onChange={handleInputChange("content")}
                  fullWidth
                  multiline
                  rows={15}
                  required
                  helperText="Write your blog post content here. Markdown is supported."
                />
              </Box>
            )}

            {/* Tab 2: Media & Tags */}
            {dialogTab === 2 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                {/* Image Upload */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Featured Image
                  </Typography>
                  {uploadedImage ? (
                    <Card sx={{ maxWidth: 300, mb: 2 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={uploadedImage}
                        alt={formData.imageAlt}
                      />
                      <Box
                        sx={{
                          p: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" noWrap>
                          {formData.imageAlt}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={handleRemoveImage}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Card>
                  ) : (
                    <Box
                      sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 2,
                        p: 4,
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "action.hover",
                        },
                      }}
                      onClick={triggerFileUpload}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <CloudUpload
                        sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                      />
                      <Typography variant="body1" gutterBottom>
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PNG, JPG, GIF up to 5MB
                      </Typography>
                    </Box>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  {uploading && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <CircularProgress size={16} />
                      <Typography variant="body2">Uploading...</Typography>
                    </Box>
                  )}
                </Box>

                {/* Tags */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                  >
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
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      label="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={createPostMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              createPostMutation.isPending ||
              !formData.title ||
              !formData.slug ||
              !formData.content
            }
            startIcon={
              createPostMutation.isPending ? (
                <CircularProgress size={16} />
              ) : null
            }
          >
            {createPostMutation.isPending ? "Creating..." : "Create Post"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default BlogPostDialog;
