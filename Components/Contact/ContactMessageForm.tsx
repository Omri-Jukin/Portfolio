"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { api } from "$/trpc/client";
import { contactFormSchema } from "$/schemas";
import type { ContactFormData, ContactFormState } from "$/types";
import { ContactFormField, ContactFormPanel } from "./Contact.style";

const ContactMessageForm: React.FC = () => {
  const t = useTranslations("contact");
  const searchParams = useSearchParams();
  const submitContactForm = api.emails.submitContactForm.useMutation();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: searchParams.get("subject") ?? "",
    message: searchParams.get("message") ?? "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [state, setState] = useState<ContactFormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  const handleInputChange =
    (field: keyof ContactFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    const result = contactFormSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Partial<ContactFormData> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ContactFormData;
      newErrors[field] = issue.message;
    });
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    submitContactForm.mutate(formData, {
      onSuccess: () => {
        setState({ isSubmitting: false, isSubmitted: true, error: null });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      },
      onError: (error) => {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: error.message || t("form.error"),
        }));
      },
    });
  };

  const isFormDisabled = state.isSubmitting || submitContactForm.isPending;

  if (state.isSubmitted) {
    return (
      <ContactFormPanel>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CheckCircleIcon
            sx={{ fontSize: 56, color: "success.main", mb: 2 }}
          />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {t("form.success")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("description")}
          </Typography>
        </Box>
      </ContactFormPanel>
    );
  }

  return (
    <ContactFormPanel>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {t("form.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tell me about the role, team, stack, and ownership expectations - or send a focused technical brief if this is a selected project conversation.
      </Typography>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <ContactFormField
            label={t("form.name")}
            value={formData.name}
            onChange={handleInputChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isFormDisabled}
            required
          />
          <ContactFormField
            label={t("form.email")}
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isFormDisabled}
            required
          />
          <ContactFormField
            label={t("form.phone")}
            type="tel"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={isFormDisabled}
            required
          />
          <ContactFormField
            label={t("form.subject")}
            value={formData.subject}
            onChange={handleInputChange("subject")}
            error={!!errors.subject}
            helperText={errors.subject}
            disabled={isFormDisabled}
            required
          />
          <ContactFormField
            label={t("form.message")}
            value={formData.message}
            onChange={handleInputChange("message")}
            error={!!errors.message}
            helperText={errors.message}
            disabled={isFormDisabled}
            multiline
            rows={5}
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isFormDisabled}
            startIcon={
              isFormDisabled ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
          >
            {isFormDisabled ? t("form.sending") : t("form.submit")}
          </Button>
        </Stack>
      </Box>
    </ContactFormPanel>
  );
};

export default ContactMessageForm;
