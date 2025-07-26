"use client";

import { api } from "$/trpc/client";
import { CircularProgress, Box, Typography } from "@mui/material";
import {
  contactFormSchema,
  type ContactFormData,
  type ContactFormState,
} from "./page.type";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as Common from "~/Common/Common.style";
import * as Styled from "./page.style";
import * as Constants from "./page.const";
import { useTheme } from "@mui/material/styles";
import {
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";

export default function ContactPage() {
  const theme = useTheme();
  const submitContactForm = api.emails.submitContactForm.useMutation({
    onSuccess: () => {
      setState((prev) => ({ ...prev, isSubmitted: true, isSubmitting: false }));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: (error) => {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message || "An unexpected error occurred",
      }));
    },
  });

  // Helper function to get appropriate color based on theme mode
  const getBrandColor = (platform: keyof typeof Constants.SOCIALS_COLORS) => {
    return theme.palette.mode === "dark"
      ? Constants.SOCIALS_COLORS_DARK[platform]
      : Constants.SOCIALS_COLORS_LIGHT[platform];
  };

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

    // Submit the form using the mutation
    submitContactForm.mutate(
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
      {
        onSuccess: () => {
          setState((prev) => ({ ...prev, isSubmitted: true }));
        },
        onError: (error) => {
          setState((prev) => ({
            ...prev,
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          }));
        },
      }
    );
  };

  const isFormDisabled = state.isSubmitting || submitContactForm.isPending;

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

        {/* Social Media Cards */}
        <Styled.ContactSection>
          <Styled.ContactSectionTitle variant="h6">
            {t("social.title")}
          </Styled.ContactSectionTitle>
          <Styled.ContactCardsContainer>
            {/* GitHub Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon>
                {Constants.SOCIAL_ICONS.GITHUB}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle variant="h6">
                {t("social.github.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle variant="body2">
                {t("social.github.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                variant="outlined"
                size="small"
                brandColor={getBrandColor("GITHUB")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.GITHUB, "_blank")
                }
              >
                {t("social.github.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* LinkedIn Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon>
                {Constants.SOCIAL_ICONS.LINKEDIN}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle variant="h6">
                {t("social.linkedin.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle variant="body2">
                {t("social.linkedin.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                variant="outlined"
                size="small"
                brandColor={getBrandColor("LINKEDIN")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.LINKEDIN, "_blank")
                }
              >
                {t("social.linkedin.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* WhatsApp Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon>
                {Constants.SOCIAL_ICONS.WHATSAPP}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle variant="h6">
                {t("social.whatsapp.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle variant="body2">
                {t("social.whatsapp.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                variant="outlined"
                size="small"
                brandColor={getBrandColor("WHATSAPP")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.WHATSAPP, "_blank")
                }
              >
                {t("social.whatsapp.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* Telegram Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon>
                {Constants.SOCIAL_ICONS.TELEGRAM}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle variant="h6">
                {t("social.telegram.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle variant="body2">
                {t("social.telegram.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                variant="outlined"
                size="small"
                brandColor={getBrandColor("TELEGRAM")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.TELEGRAM, "_blank")
                }
              >
                {t("social.telegram.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>
          </Styled.ContactCardsContainer>
        </Styled.ContactSection>

        {/* Additional Information */}
        <Styled.AdditionalInfoCard>
          <Styled.AdditionalInfoTitle variant="h6">
            {t("additional.title")}
          </Styled.AdditionalInfoTitle>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Styled.AdditionalInfoItem>
              <LanguageIcon color="action" />
              <Typography variant="body1">{t("additional.website")}</Typography>
            </Styled.AdditionalInfoItem>
            <Styled.AdditionalInfoItem>
              <AccessTimeIcon color="action" />
              <Typography variant="body1">
                {t("additional.timezone")}
              </Typography>
            </Styled.AdditionalInfoItem>
            <Styled.AdditionalInfoItem>
              <FlagIcon color="action" />
              <Typography variant="body1">
                {t("additional.citizenship")}
              </Typography>
            </Styled.AdditionalInfoItem>
          </Box>
        </Styled.AdditionalInfoCard>
      </Styled.FormContainer>
    </Common.PageContainer>
  );
}
