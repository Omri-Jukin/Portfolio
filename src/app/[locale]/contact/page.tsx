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
import {
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";

export default function ContactPage() {
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
    <Common.PageContainer id="contact-page">
      <Styled.FormContainer id="contact-form">
        <Styled.FormTitle variant="h4" id="contact-form-title">
          {t("form.title")}
        </Styled.FormTitle>
        <Styled.FormDescription variant="body1" id="contact-form-description">
          {t("form.description")}
        </Styled.FormDescription>

        {state.error && (
          <Styled.ErrorMessage severity="error" id="contact-form-error">
            {state.error}
          </Styled.ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <Styled.FormField
            id="contact-form-name"
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
            id="contact-form-email"
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
            id="contact-form-phone"
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
            id="contact-form-subject"
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
            id="contact-form-message"
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
            id="contact-form-submit"
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
          <Styled.ContactSectionTitle variant="h6" id="contact-section-title">
            Connect
          </Styled.ContactSectionTitle>
          <Styled.ContactCardsContainer>
            {/* Email Card */}
            <Styled.ContactCard clickable id="contact-card-email">
              <Styled.ContactCardIcon color={getBrandBgColor("EMAIL")}>
                {Constants.SOCIAL_ICONS.EMAIL}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle
                variant="h6"
                id="contact-card-email-title"
              >
                {t("social.email.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle
                variant="body2"
                id="contact-card-email-subtitle"
              ></Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                id="contact-card-email-button"
                variant="outlined"
                size="small"
                brandColor={"#FFFFFF"}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.EMAIL, "_blank")
                }
              >
                {t("social.email.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* Phone Card */}
            <Styled.ContactCard clickable id="contact-card-phone">
              <Styled.ContactCardIcon color={getBrandBgColor("PHONE")}>
                {Constants.SOCIAL_ICONS.PHONE}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle
                variant="h6"
                id="contact-card-phone-title"
              >
                {t("social.phone.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle
                variant="body2"
                id="contact-card-phone-subtitle"
              ></Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                id="contact-card-phone-button"
                variant="outlined"
                size="small"
                brandColor={"#FFFFFF"}
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
          <Styled.ContactSectionTitle variant="h6" id="contact-section-title">
            {t("social.title")}
          </Styled.ContactSectionTitle>
          <Styled.ContactCardsContainer>
            {/* GitHub Card */}
            <Styled.ContactCard clickable id="contact-card-github">
              <Styled.ContactCardIcon color={getBrandBgColor("GITHUB")}>
                {Constants.SOCIAL_ICONS.GITHUB}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle
                variant="h6"
                id="contact-card-github-title"
              >
                {t("social.github.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle
                variant="body2"
                id="contact-card-github-subtitle"
              >
                {t("social.github.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                id="contact-card-github-button"
                variant="outlined"
                size="small"
                brandColor={"#FFFFFF"}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.GITHUB, "_blank")
                }
              >
                {t("social.github.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* LinkedIn Card */}
            <Styled.ContactCard clickable id="contact-card-linkedin">
              <Styled.ContactCardIcon
                color={getBrandBgColor("LINKEDIN")}
                id="contact-card-linkedin-icon"
              >
                {Constants.SOCIAL_ICONS.LINKEDIN}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle
                variant="h6"
                id="contact-card-linkedin-title"
              >
                {t("social.linkedin.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle
                variant="body2"
                id="contact-card-linkedin-subtitle"
              >
                {t("social.linkedin.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                variant="outlined"
                size="small"
                brandColor={"#FFFFFF"}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.LINKEDIN, "_blank")
                }
              >
                {t("social.linkedin.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* WhatsApp Card */}
            <Styled.ContactCard clickable id="contact-card-whatsapp">
              <Styled.ContactCardIcon color={getBrandBgColor("WHATSAPP")}>
                {Constants.SOCIAL_ICONS.WHATSAPP}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle
                variant="h6"
                id="contact-card-whatsapp-title"
              >
                {t("social.whatsapp.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle
                variant="body2"
                id="contact-card-whatsapp-subtitle"
              >
                {t("social.whatsapp.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                id="contact-card-whatsapp-button"
                variant="outlined"
                size="small"
                brandColor={"#FFFFFF"}
                onClick={() =>
                  window.open(Constants.SOCIAL_LINKS.WHATSAPP, "_blank")
                }
              >
                {t("social.whatsapp.button")}
              </Styled.ContactCardButton>
            </Styled.ContactCard>

            {/* Telegram Card */}
            <Styled.ContactCard clickable id="contact-card-telegram">
              <Styled.ContactCardIcon color={getBrandBgColor("TELEGRAM")}>
                {Constants.SOCIAL_ICONS.TELEGRAM}
              </Styled.ContactCardIcon>
              <Styled.ContactCardTitle
                variant="h6"
                id="contact-card-telegram-title"
              >
                {t("social.telegram.title")}
              </Styled.ContactCardTitle>
              <Styled.ContactCardSubtitle
                variant="body2"
                id="contact-card-telegram-subtitle"
              >
                {t("social.telegram.username")}
              </Styled.ContactCardSubtitle>
              <Styled.ContactCardButton
                id="contact-card-telegram-button"
                variant="outlined"
                size="small"
                brandColor={"#FFFFFF"}
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
          <Styled.AdditionalInfoTitle variant="h6" id="additional-info-title">
            {t("additional.title")}
          </Styled.AdditionalInfoTitle>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Styled.AdditionalInfoItem id="additional-info-item-website">
              <LanguageIcon color="action" />
              <Typography
                variant="body1"
                id="additional-info-item-website-text"
              >
                {t("additional.website")}
              </Typography>
            </Styled.AdditionalInfoItem>
            <Styled.AdditionalInfoItem id="additional-info-item-timezone">
              <AccessTimeIcon color="action" />
              <Typography
                variant="body1"
                id="additional-info-item-timezone-text"
              >
                {t("additional.timezone")}
              </Typography>
            </Styled.AdditionalInfoItem>
            <Styled.AdditionalInfoItem id="additional-info-item-citizenship">
              <FlagIcon color="action" />
              <Typography
                variant="body1"
                id="additional-info-item-citizenship-text"
              >
                {t("additional.citizenship")}
              </Typography>
            </Styled.AdditionalInfoItem>
          </Box>
        </Styled.AdditionalInfoCard>
      </Styled.FormContainer>
    </Common.PageContainer>
  );
}
