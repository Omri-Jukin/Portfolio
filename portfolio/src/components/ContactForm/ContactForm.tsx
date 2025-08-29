"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  title?: string;
  subtitle?: string;
}

export default function ContactForm({
  title = "Get In Touch",
  subtitle = "I'd love to hear from you. Send me a message!",
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange =
    (field: keyof ContactFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setShowSuccess(true);
    } catch {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name && formData.email && formData.subject && formData.message;

  return (
    <Box py={4}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "grid", gap: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
              }}
            >
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                required
                variant="outlined"
              />
            </Box>
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={handleChange("subject")}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={6}
              value={formData.message}
              onChange={handleChange("message")}
              required
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isFormValid || isSubmitting}
              startIcon={<SendIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Message sent successfully! I&apos;ll get back to you soon.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          Failed to send message. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
