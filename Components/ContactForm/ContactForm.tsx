"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { api } from "$/trpc/client";
import { contactFormSchema } from "$/schemas";
import type { ContactFormData, ContactFormProps } from "./ContactForm.type";

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, onError }) => {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submitContactForm = api.emails.submitContactForm.useMutation({
    onSuccess: () => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
      onSuccess?.();
    },
    onError: (error) => {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
      setIsSubmitting(false);
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
    },
  });

  const handleInputChange =
    (field: keyof ContactFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Clear error status when user starts typing
      if (submitStatus === "error") {
        setSubmitStatus("idle");
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Validate form data
      const validatedData = contactFormSchema.parse(formData);
      setIsSubmitting(true);
      setSubmitStatus("idle");

      await submitContactForm.mutateAsync(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Validation failed. Please check your inputs.");
      }
      setSubmitStatus("error");
      setIsSubmitting(false);
    }
  };

  return (
    <MotionWrapper variant="fadeInUp" duration={0.8} delay={0.2}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          {t("form.title")}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          {t("form.description")}
        </Typography>

        {submitStatus === "success" && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t("form.success")}
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage || t("form.error")}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label={t("form.name")}
            value={formData.name}
            onChange={handleInputChange("name")}
            required
            fullWidth
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label={t("form.email")}
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
            fullWidth
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label={t("form.message")}
            value={formData.message}
            onChange={handleInputChange("message")}
            required
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            endIcon={
              isSubmitting ? <CircularProgress size={20} /> : <SendIcon />
            }
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "linear-gradient(45deg, #22D3EE 30%, #7C3AED 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #06B6D4 30%, #5B21B6 90%)",
              },
            }}
          >
            {isSubmitting ? t("form.sending") : t("form.submit")}
          </Button>
        </Box>
      </Paper>
    </MotionWrapper>
  );
};

export default ContactForm;
