"use client";

import { api } from "$/trpc/client";
import {
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import {
  intakeFormSchema,
  type IntakeFormData,
  type IntakeFormState,
} from "./page.type";
import { INTAKE_FORM_DEFAULTS } from "./page.const";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import { ResponsiveBackground } from "~/ScrollingSections";
import { verifyIntakeSessionToken } from "#/lib/utils/sessionToken";

export default function IntakePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("intake");

  const submitIntake = api.intakes.submit.useMutation({
    onSuccess: () => {
      setState((prev) => ({ ...prev, isSubmitted: true, isSubmitting: false }));
      setFormData(INTAKE_FORM_DEFAULTS);
    },
    onError: (error) => {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message || "An unexpected error occurred",
      }));
    },
  });

  const [formData, setFormData] =
    useState<IntakeFormData>(INTAKE_FORM_DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [state, setState] = useState<IntakeFormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  // Extract Calendly parameters and pre-fill form
  useEffect(() => {
    const inviteeFirstName = searchParams.get("inviteeFirstName");
    const inviteeLastName = searchParams.get("inviteeLastName");
    const inviteeEmail = searchParams.get("inviteeEmail");

    // Verify session token and extract custom client data
    const verifySession = async () => {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) =>
        c.trim().startsWith("intake-session-token=")
      );

      // Check for token in URL (custom link)
      const urlToken = searchParams.get("token");
      const token = urlToken || tokenCookie?.split("=")[1];

      if (token) {
        const payload = await verifyIntakeSessionToken(token);
        if (!payload) {
          // Invalid token, redirect to calendly
          const locale = window.location.pathname.split("/")[1] || "en";
          router.push(`/${locale}/calendly`);
          return;
        }

        // If it's a custom link, pre-fill with custom client data
        if (payload.isCustomLink) {
          setFormData((prev) => ({
            ...prev,
            contact: {
              ...prev.contact,
              firstName: payload.firstName || prev.contact.firstName,
              lastName: payload.lastName || prev.contact.lastName,
              email: payload.email || prev.contact.email,
              fullName:
                payload.firstName && payload.lastName
                  ? `${payload.firstName} ${payload.lastName}`
                  : prev.contact.fullName,
            },
            org: payload.organizationName
              ? {
                  name: payload.organizationName,
                  website: payload.organizationWebsite || undefined,
                }
              : prev.org,
          }));
          return;
        }
      }

      // Fall back to Calendly parameters
      if (inviteeFirstName || inviteeLastName || inviteeEmail) {
        setFormData((prev) => ({
          ...prev,
          contact: {
            ...prev.contact,
            firstName: inviteeFirstName || prev.contact.firstName,
            lastName: inviteeLastName || prev.contact.lastName,
            email: inviteeEmail || prev.contact.email,
            fullName:
              inviteeFirstName && inviteeLastName
                ? `${inviteeFirstName} ${inviteeLastName}`
                : prev.contact.fullName,
          },
        }));
      } else if (!token) {
        // No token and no valid params, redirect
        const locale = window.location.pathname.split("/")[1] || "en";
        router.push(`/${locale}/calendly`);
      }
    };

    verifySession();
  }, [searchParams, router]);

  const handleInputChange = useCallback(
    (path: string[]) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setFormData((prev) => {
          const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData; // Deep clone
          let current: Record<string, unknown> = newData as Record<
            string,
            unknown
          >;

          // Ensure nested objects exist (e.g., org, additional)
          for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
              current[path[i]] = {};
            }
            current = current[path[i]] as Record<string, unknown>;
          }

          current[path[path.length - 1]] = value;

          // Remove empty optional objects
          if (path[0] === "org" && value === "") {
            const orgData = newData.org as Record<string, unknown> | undefined;
            if (orgData) {
              const hasOtherOrgFields = Object.values(orgData).some(
                (v) => v !== "" && v !== null && v !== undefined
              );
              if (!hasOtherOrgFields) {
                delete (newData as Record<string, unknown>).org;
              }
            }
          }

          return newData;
        });

        // Clear error
        if (errors[path.join(".")]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[path.join(".")];
            return newErrors;
          });
        }
      },
    [errors]
  );

  // Array handlers for future form fields (technologies, requirements, goals)
  // TODO: Uncomment when adding array input fields to the form
  // const handleArrayInputChange = useCallback(
  //   (path: string[], index: number) =>
  //     (event: React.ChangeEvent<HTMLInputElement>) => {
  //       const value = event.target.value;
  //       setFormData((prev) => {
  //         const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData;
  //         let current: Record<string, unknown> = newData as Record<string, unknown>;
  //         for (let i = 0; i < path.length - 1; i++) {
  //           current = current[path[i]] as Record<string, unknown>;
  //         }
  //         const array = [...((current[path[path.length - 1]] as string[]) || [])];
  //         array[index] = value;
  //         current[path[path.length - 1]] = array;
  //         return newData;
  //       });
  //     },
  //   []
  // );

  // const addArrayItem = useCallback((path: string[]) => {
  //   setFormData((prev) => {
  //     const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData;
  //     let current: Record<string, unknown> = newData as Record<string, unknown>;
  //     for (let i = 0; i < path.length - 1; i++) {
  //       current = current[path[i]] as Record<string, unknown>;
  //     }
  //     const array = [...((current[path[path.length - 1]] as string[]) || [])];
  //     array.push("");
  //     current[path[path.length - 1]] = array;
  //     return newData;
  //   });
  // }, []);

  // const removeArrayItem = useCallback((path: string[], index: number) => {
  //   setFormData((prev) => {
  //     const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData;
  //     let current: Record<string, unknown> = newData as Record<string, unknown>;
  //     for (let i = 0; i < path.length - 1; i++) {
  //       current = current[path[i]] as Record<string, unknown>;
  //     }
  //     const array = [...((current[path[path.length - 1]] as string[]) || [])];
  //     array.splice(index, 1);
  //     current[path[path.length - 1]] = array;
  //     return newData;
  //   });
  // }, []);

  const validateForm = (): boolean => {
    try {
      intakeFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as {
          issues: Array<{ path: string[]; message: string }>;
        };
        const newErrors: Record<string, string> = {};
        zodError.issues.forEach((issue) => {
          newErrors[issue.path.join(".")] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: null }));

    if (!validateForm()) {
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));
    submitIntake.mutate(formData);
  };

  const isFormDisabled = state.isSubmitting || state.isSubmitted;

  if (state.isSubmitted) {
    return (
      <ResponsiveBackground>
        <MotionWrapper>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
              px: 2,
            }}
          >
            <Card
              sx={{
                maxWidth: 600,
                width: "100%",
                textAlign: "center",
                p: 4,
              }}
            >
              <CheckCircleIcon
                sx={{ fontSize: 80, color: "success.main", mb: 2 }}
              />
              <Typography variant="h4" gutterBottom>
                {t("success.title")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("success.message")}
              </Typography>
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
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: "80vh",
            py: 6,
            px: 2,
          }}
        >
          <Card
            sx={{
              maxWidth: 900,
              width: "100%",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    {t("title")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t("description")}
                  </Typography>
                </Box>

                {state.error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {state.error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    {/* Contact Information */}
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <PersonIcon />
                        <Typography variant="h5">
                          {t("sections.contact")}
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <TextField
                          label={t("form.contact.firstName")}
                          value={formData.contact.firstName}
                          onChange={handleInputChange(["contact", "firstName"])}
                          error={!!errors["contact.firstName"]}
                          helperText={errors["contact.firstName"]}
                          disabled={isFormDisabled}
                          fullWidth
                          required
                        />
                        <TextField
                          label={t("form.contact.lastName")}
                          value={formData.contact.lastName}
                          onChange={handleInputChange(["contact", "lastName"])}
                          error={!!errors["contact.lastName"]}
                          helperText={errors["contact.lastName"]}
                          disabled={isFormDisabled}
                          fullWidth
                          required
                        />
                        <TextField
                          label={t("form.contact.email")}
                          type="email"
                          value={formData.contact.email}
                          onChange={handleInputChange(["contact", "email"])}
                          error={!!errors["contact.email"]}
                          helperText={errors["contact.email"]}
                          disabled={isFormDisabled}
                          fullWidth
                          required
                        />
                        <TextField
                          label={t("form.contact.phone")}
                          type="tel"
                          value={formData.contact.phone || ""}
                          onChange={handleInputChange(["contact", "phone"])}
                          error={!!errors["contact.phone"]}
                          helperText={errors["contact.phone"]}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Organization Information */}
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <BusinessIcon />
                        <Typography variant="h5">
                          {t("sections.organization")}
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <TextField
                          label={t("form.org.name")}
                          value={formData.org?.name || ""}
                          onChange={handleInputChange(["org", "name"])}
                          error={!!errors["org.name"]}
                          helperText={errors["org.name"]}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                        <TextField
                          label={t("form.org.website")}
                          type="url"
                          value={formData.org?.website || ""}
                          onChange={handleInputChange(["org", "website"])}
                          error={!!errors["org.website"]}
                          helperText={errors["org.website"]}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                        <TextField
                          label={t("form.org.industry")}
                          value={formData.org?.industry || ""}
                          onChange={handleInputChange(["org", "industry"])}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                        <TextField
                          label={t("form.org.size")}
                          value={formData.org?.size || ""}
                          onChange={handleInputChange(["org", "size"])}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Project Information */}
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <WorkIcon />
                        <Typography variant="h5">
                          {t("sections.project")}
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <TextField
                          label={t("form.project.title")}
                          value={formData.project.title}
                          onChange={handleInputChange(["project", "title"])}
                          error={!!errors["project.title"]}
                          helperText={errors["project.title"]}
                          disabled={isFormDisabled}
                          fullWidth
                          required
                        />
                        <TextField
                          label={t("form.project.description")}
                          multiline
                          rows={6}
                          value={formData.project.description}
                          onChange={handleInputChange([
                            "project",
                            "description",
                          ])}
                          error={!!errors["project.description"]}
                          helperText={errors["project.description"]}
                          disabled={isFormDisabled}
                          fullWidth
                          required
                        />
                        <TextField
                          label={t("form.project.timeline")}
                          value={formData.project.timeline || ""}
                          onChange={handleInputChange(["project", "timeline"])}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                        <TextField
                          label={t("form.project.budget")}
                          value={formData.project.budget || ""}
                          onChange={handleInputChange(["project", "budget"])}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                        <TextField
                          label={t("form.project.startDate")}
                          type="date"
                          value={formData.project.startDate || ""}
                          onChange={handleInputChange(["project", "startDate"])}
                          InputLabelProps={{ shrink: true }}
                          disabled={isFormDisabled}
                          fullWidth
                        />
                      </Stack>
                    </Box>

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
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        px: 6,
                        py: 2,
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        mt: 2,
                      }}
                    >
                      {isFormDisabled ? t("form.submitting") : t("form.submit")}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </MotionWrapper>
    </ResponsiveBackground>
  );
}
