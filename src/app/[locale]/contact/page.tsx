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
      console.log("Contact form submitted successfully!");
      setState((prev) => ({ ...prev, isSubmitted: true, isSubmitting: false }));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: (error) => {
      console.error("Contact form submission failed:", error);
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

  const getBrandBgColor = (
    platform: keyof typeof Constants.SOCIALS_BG_COLORS
  ) => {
    return Constants.SOCIALS_BG_COLORS[platform];
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
    console.log("=== Form Validation Debug ===");
    console.log("Current form data:", formData);
    console.log("Name length:", formData.name.length);
    console.log("Email:", formData.email);
    console.log("Phone length:", formData.phone.length);
    console.log("Subject length:", formData.subject.length);
    console.log("Message length:", formData.message.length);

    try {
      contactFormSchema.parse(formData);
      console.log("Validation passed!");
      setErrors({});
      return true;
    } catch (error) {
      console.log("Validation failed with error:", error);
      if (error instanceof Error) {
        const zodError = error as {
          errors?: Array<{ path: string[]; message: string }>;
        };
        const newErrors: Partial<ContactFormData> = {};

        zodError.errors?.forEach((err: { path: string[]; message: string }) => {
          const field = err.path[0] as keyof ContactFormData;
          newErrors[field] = err.message;
          console.log(`Field "${field}" failed validation:`, err.message);
        });

        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("=== Form Submit Handler Called ===");

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    console.log("Form validation passed, submitting...");
    console.log("Form data:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      messageLength: formData.message.length,
    });

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    console.log("Calling submitContactForm.mutate...");

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
          console.log("Mutation onSuccess callback called");
          setState((prev) => ({ ...prev, isSubmitted: true }));
        },
        onError: (error) => {
          console.error("Mutation onError callback called:", error);
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

        {/* Direct Contact Cards */}
        <Styled.ContactSection>
          <Styled.ContactSectionTitle variant="h6">
            Connect
          </Styled.ContactSectionTitle>
          <Styled.ContactCardsContainer>
            {/* Email Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon color={getBrandBgColor("EMAIL")}>
                {Constants.SOCIAL_ICONS.EMAIL}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle variant="h6">
                {t("social.email.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle variant="body2"></Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                variant="outlined"
                size="small"
                brandColor={getBrandBgColor("EMAIL")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.EMAIL, "_blank")
                }
              >
                {t("social.email.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* Phone Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon color={getBrandBgColor("PHONE")}>
                {Constants.SOCIAL_ICONS.PHONE}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle variant="h6">
                {t("social.phone.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle variant="body2"></Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                variant="outlined"
                size="small"
                brandColor={getBrandBgColor("PHONE")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.PHONE, "_blank")
                }
              >
                {t("social.phone.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>
          </Styled.ContactCardsContainer>
        </Styled.ContactSection>

        {/* Social Media Cards */}
        <Styled.ContactSection>
          <Styled.ContactSectionTitle variant="h6">
            {t("social.title")}
          </Styled.ContactSectionTitle>
          <Styled.ContactCardsContainer>
            {/* GitHub Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon color={getBrandBgColor("GITHUB")}>
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
                brandColor={getBrandBgColor("GITHUB")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.GITHUB, "_blank")
                }
              >
                {t("social.github.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* LinkedIn Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon color={getBrandBgColor("LINKEDIN")}>
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
                brandColor={getBrandBgColor("LINKEDIN")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.LINKEDIN, "_blank")
                }
              >
                {t("social.linkedin.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* WhatsApp Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon color={getBrandBgColor("WHATSAPP")}>
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
                brandColor={getBrandBgColor("WHATSAPP")}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.WHATSAPP, "_blank")
                }
              >
                {t("social.whatsapp.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* Telegram Card */}
            <Styled.ContactCard variant="social" clickable>
              <Styled.ContactCardIcon color={getBrandBgColor("TELEGRAM")}>
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
                brandColor={getBrandBgColor("TELEGRAM")}
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
