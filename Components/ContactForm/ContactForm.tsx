"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import * as Common from "~/Common/Common.style";
import * as Styled from "./ContactForm.style";
import type {
  ContactFormData,
  ContactFormProps,
  ContactFormState,
} from "./ContactForm.type";
import { contactFormSchema } from "./ContactForm.type";
import { CircularProgress } from "@mui/material";

export default function ContactForm({
  onSubmit,
  isLoading = false,
}: ContactFormProps) {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
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

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const zodError = error as {
          errors?: Array<{ path: string[]; message: string }>;
        };
        const newErrors: Partial<ContactFormData> = {};

        zodError.errors?.forEach((err: { path: string[]; message: string }) => {
          const field = err.path[0] as keyof ContactFormData;
          newErrors[field] = err.message;
        });

        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      setState((prev) => ({ ...prev, isSubmitting: false, isSubmitted: true }));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }));
    }
  };

  const isFormDisabled = state.isSubmitting || isLoading;

  if (state.isSubmitted) {
    return (
      <Common.PageContainer>
        <Styled.FormContainer>
          <Styled.SuccessMessage severity="success" icon={<CheckCircleIcon />}>
            {t("form.success")}
          </Styled.SuccessMessage>
          <Styled.SubmitButton
            onClick={() =>
              setState((prev) => ({ ...prev, isSubmitted: false }))
            }
            variant="contained"
            color="primary"
          >
            Send Another Message
          </Styled.SubmitButton>
        </Styled.FormContainer>
      </Common.PageContainer>
    );
  }

  return (
    <Common.PageContainer>
      <Styled.FormContainer>
        <Styled.FormTitle variant="h4">{t("form.title")}</Styled.FormTitle>

        <Styled.FormDescription variant="body1">
          {t("form.description")}
        </Styled.FormDescription>

        {state.error && (
          <Styled.ErrorMessage severity="error">
            {state.error}
          </Styled.ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <Styled.FormField
            label={t("form.name")}
            value={formData.name}
            onChange={handleInputChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isFormDisabled}
            fullWidth
            required
          />

          <Styled.FormField
            label={t("form.email")}
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isFormDisabled}
            fullWidth
            required
          />

          <Styled.FormField
            label={t("form.phone")}
            type="tel"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={isFormDisabled}
            fullWidth
            required
          />

          <Styled.FormField
            label={t("form.subject")}
            value={formData.subject}
            onChange={handleInputChange("subject")}
            error={!!errors.subject}
            helperText={errors.subject}
            disabled={isFormDisabled}
            fullWidth
            required
          />

          <Styled.MessageField
            label={t("form.message")}
            value={formData.message}
            onChange={handleInputChange("message")}
            error={!!errors.message}
            helperText={errors.message}
            disabled={isFormDisabled}
            fullWidth
            multiline
            rows={6}
            required
          />

          <Styled.SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFormDisabled}
            startIcon={
              isFormDisabled ? (
                <Styled.LoadingContainer>
                  <CircularProgress size={20} />
                </Styled.LoadingContainer>
              ) : (
                <SendIcon />
              )
            }
          >
            {isFormDisabled ? t("form.sending") : t("form.submit")}
          </Styled.SubmitButton>
        </form>

        <Styled.ContactInfo>
          <Styled.ContactInfoTitle variant="h6">
            {t("info.title")}
          </Styled.ContactInfoTitle>

          <Styled.ContactInfoItem>
            <EmailIcon color="primary" />
            <span>
              {t("info.email")}: {t("email")}
            </span>
          </Styled.ContactInfoItem>

          <Styled.ContactInfoItem>
            <PhoneIcon color="primary" />
            <span>
              {t("info.phone")}: {t("phone")}
            </span>
          </Styled.ContactInfoItem>

          <Styled.ContactInfoItem>
            <ScheduleIcon color="primary" />
            <span>
              {t("info.timezone")}: {t("timezone")}
            </span>
          </Styled.ContactInfoItem>

          <Styled.ContactInfoItem>
            <LocationIcon color="primary" />
            <span>
              {t("info.location")}: {t("location.israel")}
            </span>
          </Styled.ContactInfoItem>
        </Styled.ContactInfo>
      </Styled.FormContainer>
    </Common.PageContainer>
  );
}
