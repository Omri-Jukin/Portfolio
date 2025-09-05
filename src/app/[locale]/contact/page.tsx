"use client";

import { api } from "$/trpc/client";
import {
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Alert,
  Zoom,
  Button,
} from "@mui/material";
import {
  contactFormSchema,
  type ContactFormData,
  type ContactFormState,
} from "./page.type";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as Styled from "./page.style";
import * as Constants from "./page.const";
import {
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  ContactMail as ContactMailIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import { ResponsiveBackground } from "~/ScrollingSections";
import { Typography as CustomTypography } from "~/Typography";

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
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
      <ResponsiveBackground>
        <MotionWrapper>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              px: 2,
            }}
          >
            <Card
              sx={{
                maxWidth: 500,
                width: "100%",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Zoom in={true} timeout={500}>
                  <Box>
                    <CheckCircleIcon
                      sx={{
                        fontSize: 80,
                        color: "success.main",
                        mb: 3,
                      }}
                    />
                    <CustomTypography
                      variant="h3"
                      color="textPrimary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {t("form.success")}
                    </CustomTypography>
                    <CustomTypography
                      variant="h6"
                      color="textSecondary"
                      sx={{ mb: 4, lineHeight: 1.6 }}
                    >
                      Thank you for reaching out! I&apos;ll get back to you as
                      soon as possible.
                    </CustomTypography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() =>
                        setState((prev) => ({ ...prev, isSubmitted: false }))
                      }
                      startIcon={<MessageIcon />}
                      sx={{
                        background:
                          "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Send Another Message
                    </Button>
                  </Box>
                </Zoom>
              </CardContent>
            </Card>
          </Box>
        </MotionWrapper>
      </ResponsiveBackground>
    );
  }

  return (
    <ResponsiveBackground>
      <MotionWrapper>
        <Box
          id="contact-page-main-content"
          sx={{
            minHeight: "100vh",
            py: { xs: 6, md: 8 },
            px: { xs: 2, md: 4 },
            maxWidth: "1400px",
            mx: "auto",
            gap: 4,
          }}
        >
          {/* Enhanced Header Section */}
          <Box
            id="contact-page-header"
            sx={{
              textAlign: "center",
              mb: 8,
              position: "relative",
            }}
          >
            {/* Decorative background elements */}
            <Box
              id="contact-page-header-background"
              sx={{
                position: "absolute",
                top: "-50px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "200px",
                height: "200px",
                background:
                  "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
                borderRadius: "50%",
                zIndex: 0,
              }}
            />

            <Box
              id="contact-page-header-title"
              sx={{ position: "relative", zIndex: 1 }}
            >
              <CustomTypography
                id="contact-page-header-title-text"
                variant="h1"
                color="textPrimary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  mb: 4,
                  fontSize: { xs: "3rem", md: "4rem" },
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Box
                  id="contact-page-header-title-icon"
                  sx={{
                    p: 2,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <ContactMailIcon sx={{ fontSize: "2rem", color: "white" }} />
                </Box>
                {t("form.title")}
              </CustomTypography>

              <CustomTypography
                id="contact-page-header-title-description"
                variant="h5"
                color="textSecondary"
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  lineHeight: 1.8,
                  fontWeight: 400,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                }}
              >
                {t("form.description")}
              </CustomTypography>
            </Box>
          </Box>

          {/* Enhanced Main Content - Single Column */}
          <Box
            id="contact-page-main-content-container"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              marginTop: 4,
              marginBottom: 4,
              gap: 6,
            }}
          >
            {/* Enhanced Contact Form */}
            <Card
              id="contact-page-main-content-card-container"
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                height: "fit-content",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                },
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box
                  id="contact-page-main-content-card-content-container"
                  sx={{ textAlign: "center", mb: 5 }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{ mb: 3 }}
                  >
                    <Box
                      id="contact-page-main-content-card-content-container-icon"
                      sx={{
                        p: 2,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      <MessageIcon sx={{ fontSize: 28, color: "white" }} />
                    </Box>
                    <Typography
                      id="contact-page-main-content-card-content-container-title"
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        fontSize: { xs: "1.8rem", md: "2.2rem" },
                      }}
                    >
                      Send Message
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body1"
                    id="contact-page-main-content-card-content-container-description"
                    sx={{
                      color: "text.secondary",
                      fontSize: "1.1rem",
                      maxWidth: "400px",
                      mx: "auto",
                    }}
                  >
                    Fill out the form below and I&apos;ll get back to you within
                    24 hours
                  </Typography>
                </Box>

                {state.error && (
                  <Alert
                    severity="error"
                    id="contact-page-main-content-card-content-container-error"
                    sx={{
                      mb: 4,
                      borderRadius: 2,
                      "& .MuiAlert-message": {
                        fontSize: "1rem",
                      },
                    }}
                  >
                    {state.error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack
                    id="contact-page-main-content-card-content-container-form"
                    spacing={4}
                  >
                    <Styled.FormField
                      id="contact-page-main-content-card-content-container-form-name"
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
                      id="contact-page-main-content-card-content-container-form-email"
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
                      id="contact-page-main-content-card-content-container-form-phone"
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
                      id="contact-page-main-content-card-content-container-form-subject"
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
                      id="contact-page-main-content-card-content-container-form-message"
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

                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={isFormDisabled}
                      startIcon={
                        isFormDisabled ? (
                          <CircularProgress size={24} />
                        ) : (
                          <SendIcon />
                        )
                      }
                      id="contact-page-main-content-card-content-container-form-button"
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        px: 6,
                        py: 2,
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 16px 50px rgba(102, 126, 234, 0.5)",
                        },
                        "&:disabled": {
                          background: "rgba(102, 126, 234, 0.3)",
                          transform: "none",
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)",
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {isFormDisabled ? t("form.sending") : t("form.submit")}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>

            {/* Enhanced Contact Information - Horizontal Layout */}
            <Box
              id="contact-information"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                minWidth: "400px",
                gap: 4,
                margin: "2vh 0",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background:
                    "linear-gradient(90deg, #5a6fd8 0%, #6a4190 100%)",
                },
              }}
            >
              {/* Enhanced Direct Contact */}
              <Card
                id="contact-page-main-content-card-direct-contact-container"
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(25px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: "280px",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #ff6b6b 0%, #ffa500 100%)",
                  },
                }}
              >
                <CardContent
                  id="contact-page-main-content-card-direct-contact-content-container"
                  sx={{ p: 4 }}
                >
                  <Box
                    id="contact-page-main-content-card-direct-contact-content-container-title"
                    sx={{ textAlign: "center", mb: 3 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Box
                        id="contact-page-main-content-card-direct-contact-content-container-title-icon"
                        sx={{
                          p: 1.5,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 24px rgba(255, 107, 107, 0.3)",
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 20, color: "white" }} />
                      </Box>
                      <Typography
                        variant="h5"
                        id="contact-page-main-content-card-direct-contact-content-container-title-text"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          fontSize: { xs: "1.2rem", md: "1.4rem" },
                        }}
                      >
                        Direct Contact
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack
                    id="contact-page-main-content-card-direct-contact-content-container-form"
                    spacing={3}
                  >
                    <Styled.ContactCard
                      clickable
                      type="email"
                      id="contact-page-main-content-card-direct-contact-content-container-form-email"
                      onClick={() => {
                        window.open(Constants.SOCIAL_LINKS.EMAIL, "_blank");
                      }}
                    >
                      <Styled.ContactCardIcon id="contact-page-main-content-card-direct-contact-content-container-form-email-icon">
                        {Constants.SOCIAL_ICONS.EMAIL}
                      </Styled.ContactCardIcon>
                      <Styled.ContactCardTitle
                        id="contact-page-main-content-card-direct-contact-content-container-form-email-title"
                        variant="h6"
                      >
                        {t("social.email.title")}
                      </Styled.ContactCardTitle>
                      <Styled.ContactCardSubtitle
                        id="contact-page-main-content-card-direct-contact-content-container-form-email-subtitle"
                        variant="body2"
                      ></Styled.ContactCardSubtitle>
                      <Styled.ContactCardButton
                        id="contact-card-email-button"
                        variant="outlined"
                        size="small"
                        gradientType="email"
                      >
                        {t("social.email.button")}
                      </Styled.ContactCardButton>
                    </Styled.ContactCard>

                    <Styled.ContactCard
                      clickable
                      type="phone"
                      id="contact-card-phone"
                      onClick={() => {
                        window.open(Constants.SOCIAL_LINKS.PHONE, "_blank");
                      }}
                    >
                      <Styled.ContactCardIcon id="contact-card-phone-icon">
                        {Constants.SOCIAL_ICONS.PHONE}
                      </Styled.ContactCardIcon>
                      <Styled.ContactCardTitle
                        id="contact-card-phone-title"
                        variant="h6"
                      >
                        {t("social.phone.title")}
                      </Styled.ContactCardTitle>
                      <Styled.ContactCardSubtitle
                        id="contact-card-phone-subtitle"
                        variant="body2"
                      ></Styled.ContactCardSubtitle>
                      <Styled.ContactCardButton
                        id="contact-card-phone-button"
                        variant="outlined"
                        size="small"
                      >
                        {t("social.phone.button")}
                      </Styled.ContactCardButton>
                    </Styled.ContactCard>
                  </Stack>
                </CardContent>
              </Card>

              {/* Enhanced Social Media */}
              <Card
                id="contact-card-social-media"
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(25px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: "280px",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                  },
                }}
              >
                <CardContent
                  id="contact-card-social-media-content"
                  sx={{ p: 4, gap: 4, margin: 4, borderRadius: 4 }}
                >
                  <Box
                    id="contact-card-social-media-content-title"
                    sx={{ textAlign: "center", mb: 3 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Box
                        id="contact-card-social-media-content-title-icon"
                        sx={{
                          p: 1.5,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 24px rgba(79, 172, 254, 0.3)",
                        }}
                      >
                        <GitHubIcon sx={{ fontSize: 20, color: "white" }} />
                      </Box>
                      <Typography
                        variant="h5"
                        id="contact-card-social-media-content-title-text"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          fontSize: { xs: "1.2rem", md: "1.4rem" },
                        }}
                      >
                        {t("social.title")}
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack
                    id="contact-card-social-media-content-form"
                    spacing={3}
                  >
                    <Styled.ContactCard
                      clickable
                      type="github"
                      id="contact-card-github"
                      onClick={() => {
                        window.open(Constants.SOCIAL_LINKS.GITHUB, "_blank");
                      }}
                    >
                      <Styled.ContactCardIcon id="contact-card-github-icon">
                        {Constants.SOCIAL_ICONS.GITHUB}
                      </Styled.ContactCardIcon>
                      <Styled.ContactCardTitle
                        id="contact-card-github-title"
                        variant="h6"
                      >
                        {t("social.github.title")}
                      </Styled.ContactCardTitle>
                      <Styled.ContactCardSubtitle
                        id="contact-card-github-subtitle"
                        variant="body2"
                      >
                        {t("social.github.username")}
                      </Styled.ContactCardSubtitle>
                      <Styled.ContactCardButton
                        id="contact-card-github-button"
                        variant="outlined"
                        size="small"
                      >
                        {t("social.github.button")}
                      </Styled.ContactCardButton>
                    </Styled.ContactCard>

                    <Styled.ContactCard
                      clickable
                      type="linkedin"
                      id="contact-card-linkedin"
                      onClick={() => {
                        window.open(Constants.SOCIAL_LINKS.LINKEDIN, "_blank");
                      }}
                    >
                      <Styled.ContactCardIcon id="contact-card-linkedin-icon">
                        {Constants.SOCIAL_ICONS.LINKEDIN}
                      </Styled.ContactCardIcon>
                      <Styled.ContactCardTitle
                        id="contact-card-linkedin-title"
                        variant="h6"
                      >
                        {t("social.linkedin.title")}
                      </Styled.ContactCardTitle>
                      <Styled.ContactCardSubtitle
                        id="contact-card-linkedin-subtitle"
                        variant="body2"
                      >
                        {t("social.linkedin.username")}
                      </Styled.ContactCardSubtitle>
                      <Styled.ContactCardButton
                        id="contact-card-linkedin-button"
                        variant="outlined"
                        size="small"
                      >
                        {t("social.linkedin.button")}
                      </Styled.ContactCardButton>
                    </Styled.ContactCard>

                    <Styled.ContactCard
                      clickable
                      type="whatsapp"
                      id="contact-card-whatsapp"
                      onClick={() => {
                        window.open(Constants.SOCIAL_LINKS.WHATSAPP, "_blank");
                      }}
                    >
                      <Styled.ContactCardIcon id="contact-card-whatsapp-icon">
                        {Constants.SOCIAL_ICONS.WHATSAPP}
                      </Styled.ContactCardIcon>
                      <Styled.ContactCardTitle
                        id="contact-card-whatsapp-title"
                        variant="h6"
                      >
                        {t("social.whatsapp.title")}
                      </Styled.ContactCardTitle>
                      <Styled.ContactCardSubtitle
                        id="contact-card-whatsapp-subtitle"
                        variant="body2"
                      >
                        {t("social.whatsapp.username")}
                      </Styled.ContactCardSubtitle>
                      <Styled.ContactCardButton
                        id="contact-card-whatsapp-button"
                        variant="outlined"
                        size="small"
                      >
                        {t("social.whatsapp.button")}
                      </Styled.ContactCardButton>
                    </Styled.ContactCard>

                    <Styled.ContactCard
                      clickable
                      type="telegram"
                      id="contact-card-telegram"
                      onClick={() => {
                        window.open(Constants.SOCIAL_LINKS.TELEGRAM, "_blank");
                      }}
                    >
                      <Styled.ContactCardIcon id="contact-card-telegram-icon">
                        {Constants.SOCIAL_ICONS.TELEGRAM}
                      </Styled.ContactCardIcon>
                      <Styled.ContactCardTitle
                        id="contact-card-telegram-title"
                        variant="h6"
                      >
                        {t("social.telegram.title")}
                      </Styled.ContactCardTitle>
                      <Styled.ContactCardSubtitle
                        id="contact-card-telegram-subtitle"
                        variant="body2"
                      >
                        {t("social.telegram.username")}
                      </Styled.ContactCardSubtitle>
                      <Styled.ContactCardButton
                        id="contact-card-telegram-button"
                        variant="outlined"
                        size="small"
                      >
                        {t("social.telegram.button")}
                      </Styled.ContactCardButton>
                    </Styled.ContactCard>
                  </Stack>
                </CardContent>
              </Card>

              {/* Enhanced Additional Information */}
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(25px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: "280px",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)",
                  },
                }}
              >
                <CardContent id="additional-info-content" sx={{ p: 4 }}>
                  <Box
                    id="additional-info-content-title"
                    sx={{ textAlign: "center", mb: 3 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Box
                        id="additional-info-content-title-icon"
                        sx={{
                          p: 1.5,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 24px rgba(168, 237, 234, 0.3)",
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 20, color: "white" }} />
                      </Box>
                      <Typography
                        variant="h5"
                        id="additional-info-content-title-text"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          fontSize: { xs: "1.2rem", md: "1.4rem" },
                        }}
                      >
                        {t("additional.title")}
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack id="additional-info-content-form" spacing={2}>
                    <Styled.AdditionalInfoItem id="additional-info-item-timezone">
                      <AccessTimeIcon
                        color="action"
                        id="additional-info-item-timezone-icon"
                      />
                      <Typography
                        variant="body1"
                        id="additional-info-item-timezone-text"
                        sx={{ fontSize: "1rem", fontWeight: 500 }}
                      >
                        {t("additional.timezone")}
                      </Typography>
                    </Styled.AdditionalInfoItem>
                    <Styled.AdditionalInfoItem id="additional-info-item-citizenship">
                      <FlagIcon
                        color="action"
                        id="additional-info-item-citizenship-icon"
                      />
                      <Typography
                        variant="body1"
                        id="additional-info-item-citizenship-text"
                        sx={{ fontSize: "1rem", fontWeight: 500 }}
                      >
                        {t("additional.citizenship")}
                      </Typography>
                    </Styled.AdditionalInfoItem>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </MotionWrapper>
    </ResponsiveBackground>
  );
}
