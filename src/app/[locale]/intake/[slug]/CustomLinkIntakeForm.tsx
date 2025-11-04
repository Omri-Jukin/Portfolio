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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  intakeFormSchema,
  type IntakeFormData,
  type IntakeFormState,
} from "../page.type";
import { INTAKE_FORM_DEFAULTS } from "../page.const";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  RateReview as RateReviewIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import { ResponsiveBackground } from "~/ScrollingSections";
import {
  INTAKE_FORM_CURRENCY_MAPPING,
  type IntakeFormCurrencyCode,
  COMMON_TIMEZONES,
  getGMTOffset,
} from "$/constants";

interface CustomLinkIntakeFormProps {
  customLink: {
    id: string;
    slug: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    organizationName: string | null;
    organizationWebsite: string | null;
    hiddenSections: string[];
    expiresAt: Date;
    token: string;
    maxAge: number;
  };
}

/**
 * Dedicated, Secured Intake Form Component for Custom Links
 * This component provides a personalized, secure experience for clients
 * accessing the intake form via custom links
 */
export default function CustomLinkIntakeForm({
  customLink,
}: CustomLinkIntakeFormProps) {
  const router = useRouter();
  const t = useTranslations("intake");

  const clientName =
    [customLink.firstName, customLink.lastName].filter(Boolean).join(" ") ||
    customLink.email;

  // Set the session cookie via API route handler on mount
  useEffect(() => {
    const setCookie = async () => {
      try {
        await fetch("/api/intake/set-cookie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: customLink.token,
            maxAge: customLink.maxAge,
          }),
        });
      } catch (error) {
        // Silently fail - cookie setting is not critical
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to set session cookie:", error);
        }
      }
    };
    setCookie();
  }, [customLink.token, customLink.maxAge]);

  const submitIntake = api.intakes.submit.useMutation({
    onSuccess: (data) => {
      console.log("[Intake Form] Successfully submitted intake:", data.id);
      setState((prev) => ({ ...prev, isSubmitted: true, isSubmitting: false }));
      setFormData(INTAKE_FORM_DEFAULTS);
    },
    onError: (error) => {
      console.error("[Intake Form] Submission error:", error);
      console.error("[Intake Form] Error details:", {
        message: error.message,
        data: error.data,
      });
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message || "An unexpected error occurred",
      }));
    },
  });

  const [formData, setFormData] = useState<IntakeFormData>(() => {
    // Pre-fill form with custom link data
    // Use "UTC" as default to ensure server/client hydration match
    return {
      ...INTAKE_FORM_DEFAULTS,
      contact: {
        firstName: customLink.firstName || "",
        lastName: customLink.lastName || "",
        email: customLink.email,
        fullName: clientName,
      },
      org: customLink.organizationName
        ? {
            name: customLink.organizationName,
            website: customLink.organizationWebsite || undefined,
          }
        : undefined,
      project: {
        ...INTAKE_FORM_DEFAULTS.project,
        budget: {
          currency: (INTAKE_FORM_DEFAULTS.project.budget.currency ??
            "USD") as IntakeFormCurrencyCode,
          min: INTAKE_FORM_DEFAULTS.project.budget.min ?? "",
          max: INTAKE_FORM_DEFAULTS.project.budget.max ?? "",
        },
      },
      additional: {
        ...INTAKE_FORM_DEFAULTS.additional,
        timezone: "UTC", // Default to UTC for consistent hydration
      },
    };
  });

  // Get detected timezone for Select default value (client-side only)
  // Start with "UTC" to ensure server/client match, update after mount
  const [detectedTimezone, setDetectedTimezone] = useState<string>("UTC");

  // Detect timezone only after mount to prevent hydration mismatch
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setDetectedTimezone(timezone);

      // Update formData if it's still using the default UTC
      // Use functional update to avoid dependency on formData
      setFormData((prev) => {
        const currentTimezone = prev.additional?.timezone;
        if (!currentTimezone || currentTimezone === "UTC") {
          // Only update if timezone is valid in COMMON_TIMEZONES
          if (COMMON_TIMEZONES.some((tz) => tz.value === timezone)) {
            return {
              ...prev,
              additional: {
                ...prev.additional,
                timezone: timezone,
              },
            };
          }
        }
        return prev;
      });
    } catch (error) {
      // Silently fail if timezone detection fails
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to detect timezone:", error);
      }
    }
  }, []); // Only run once on mount

  // Check if sections should be hidden
  const hiddenSections = customLink.hiddenSections || [];
  const isSectionHidden = (section: string) => hiddenSections.includes(section);

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Get current currency symbol for reactive updates (computed from formData state)
  // This ensures the symbol updates immediately when currency changes
  const currentCurrencyCode =
    (
      formData.project.budget as {
        currency?: IntakeFormCurrencyCode;
        min?: string;
        max?: string;
      }
    )?.currency || ("USD" as IntakeFormCurrencyCode);

  const currentCurrency = INTAKE_FORM_CURRENCY_MAPPING[currentCurrencyCode];
  const [state, setState] = useState<IntakeFormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  const handleInputChange = useCallback(
    (path: string[]) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setFormData((prev) => {
          const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData;
          let current: Record<string, unknown> = newData as Record<
            string,
            unknown
          >;

          for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
              current[path[i]] = {};
            }
            current = current[path[i]] as Record<string, unknown>;
          }

          current[path[path.length - 1]] = value;

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

  const handleArrayInputChange = useCallback(
    (path: string[], index: number) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData((prev) => {
          const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData;
          let current: Record<string, unknown> = newData as Record<
            string,
            unknown
          >;
          for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
              current[path[i]] = {};
            }
            current = current[path[i]] as Record<string, unknown>;
          }
          const array = [
            ...((current[path[path.length - 1]] as string[]) || []),
          ];
          array[index] = value;
          current[path[path.length - 1]] = array;
          return newData;
        });

        const errorKey = path.join(".") + `.${index}`;
        if (errors[errorKey]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
          });
        }
      },
    [errors]
  );

  const addArrayItem = useCallback((path: string[]) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData;
      let current: Record<string, unknown> = newData as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]] as Record<string, unknown>;
      }
      const array = [...((current[path[path.length - 1]] as string[]) || [])];
      array.push("");
      current[path[path.length - 1]] = array;
      return newData;
    });
  }, []);

  const removeArrayItem = useCallback((path: string[], index: number) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)) as IntakeFormData;
      let current: Record<string, unknown> = newData as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]] as Record<string, unknown>;
      }
      const array = [...((current[path[path.length - 1]] as string[]) || [])];
      array.splice(index, 1);
      current[path[path.length - 1]] = array;
      return newData;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: null }));

    // Clean up form data: filter empty strings from arrays and resource links
    const cleanedFormData = {
      ...formData,
      project: {
        ...formData.project,
        technologies:
          formData.project.technologies?.filter((t) => t.trim() !== "") || [],
        requirements:
          formData.project.requirements?.filter((r) => r.trim() !== "") || [],
        goals: formData.project.goals?.filter((g) => g.trim() !== "") || [],
        resourceLinks:
          formData.project.resourceLinks?.filter(
            (r) => r.label.trim() !== "" && r.url.trim() !== ""
          ) || [],
        // Clean budget - if both min and max are empty, set to undefined
        budget:
          (
            formData.project.budget as {
              currency?: string;
              min?: string;
              max?: string;
            }
          )?.min ||
          (
            formData.project.budget as {
              currency?: string;
              min?: string;
              max?: string;
            }
          )?.max
            ? formData.project.budget
            : undefined,
      },
    };

    // Validate cleaned data
    try {
      intakeFormSchema.parse(cleanedFormData);
      setErrors({});
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
        return;
      }
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));
    submitIntake.mutate({
      ...cleanedFormData,
      customLinkId: customLink.id,
    });
  };

  const isFormDisabled = state.isSubmitting || state.isSubmitted;

  // Get the locale from the current path
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1] || "en"
      : "en";

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
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <CheckCircleIcon
                  sx={{ fontSize: 80, color: "success.main", mb: 2 }}
                />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  {t("success.title")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("success.message")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, fontStyle: "italic" }}
                >
                  {t("success.followUp") ||
                    "I'll review your information and get back to you shortly."}
                </Typography>
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
                <Box sx={{ textAlign: "center", position: "relative" }}>
                  <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RateReviewIcon />}
                      onClick={() => router.push(`/${locale}/admin/review`)}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.875rem",
                      }}
                    >
                      Review
                    </Button>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    {t("customLink.title") || `Welcome, ${clientName}!`}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("customLink.description") ||
                      "We've pre-filled some information for you. Please complete the form below to get started."}
                  </Typography>
                  <Alert
                    severity="info"
                    sx={{
                      borderRadius: 2,
                      textAlign: "left",
                      bgcolor: "rgba(78, 205, 196, 0.1)",
                      border: "1px solid rgba(78, 205, 196, 0.3)",
                    }}
                  >
                    <Typography variant="body2">
                      {t("customLink.info") ||
                        "Your information has been pre-filled. Please review and complete any missing fields."}
                    </Typography>
                  </Alert>
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

                    {!isSectionHidden("organization") && (
                      <>
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
                      </>
                    )}

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
                        {!isSectionHidden("budget") && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              {t("form.project.budget") || "Budget Range"}
                            </Typography>
                            <Stack spacing={2}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  {t("form.project.currency") || "Currency"}
                                </InputLabel>
                                <Select
                                  value={
                                    (
                                      formData.project.budget as {
                                        currency?: IntakeFormCurrencyCode;
                                        min?: string;
                                        max?: string;
                                      }
                                    )?.currency ||
                                    ("USD" as IntakeFormCurrencyCode)
                                  }
                                  onChange={(e) => {
                                    setFormData((prev) => {
                                      const newData = JSON.parse(
                                        JSON.stringify(prev)
                                      ) as IntakeFormData;
                                      if (!newData.project.budget) {
                                        newData.project.budget = {
                                          currency:
                                            "USD" as IntakeFormCurrencyCode,
                                          min: "",
                                          max: "",
                                        };
                                      }
                                      (
                                        newData.project.budget as {
                                          currency?: IntakeFormCurrencyCode;
                                          min?: string;
                                          max?: string;
                                        }
                                      ).currency = e.target
                                        .value as IntakeFormCurrencyCode;
                                      return newData;
                                    });
                                  }}
                                  label={
                                    t("form.project.currency") || "Currency"
                                  }
                                  disabled={isFormDisabled}
                                >
                                  {Object.entries(
                                    INTAKE_FORM_CURRENCY_MAPPING
                                  ).map(([code, currency]) => (
                                    <MenuItem key={code} value={code}>
                                      {currency.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <Stack direction="row" spacing={2}>
                                <TextField
                                  label={
                                    t("form.project.budgetMin") ||
                                    "Minimum Budget"
                                  }
                                  slotProps={{
                                    input: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          {currentCurrency?.symbol || ""}
                                        </InputAdornment>
                                      ),
                                    },
                                  }}
                                  value={
                                    (
                                      formData.project.budget as {
                                        currency?: IntakeFormCurrencyCode;
                                        min?: string;
                                        max?: string;
                                      }
                                    )?.min || ""
                                  }
                                  onChange={(e) => {
                                    setFormData((prev) => {
                                      const newData = JSON.parse(
                                        JSON.stringify(prev)
                                      ) as IntakeFormData;
                                      if (!newData.project.budget) {
                                        newData.project.budget = {
                                          currency:
                                            "USD" as IntakeFormCurrencyCode,
                                          min: "",
                                          max: "",
                                        };
                                      }
                                      (
                                        newData.project.budget as {
                                          currency?: IntakeFormCurrencyCode;
                                          min?: string;
                                          max?: string;
                                        }
                                      ).min = e.target.value;
                                      return newData;
                                    });
                                  }}
                                  disabled={isFormDisabled}
                                  fullWidth
                                  placeholder="e.g., 10,000"
                                />
                                <TextField
                                  label={
                                    t("form.project.budgetMax") ||
                                    "Maximum Budget"
                                  }
                                  slotProps={{
                                    input: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          {currentCurrency?.symbol || ""}
                                        </InputAdornment>
                                      ),
                                    },
                                  }}
                                  value={
                                    (
                                      formData.project.budget as {
                                        currency?: IntakeFormCurrencyCode;
                                        min?: string;
                                        max?: string;
                                      }
                                    )?.max || ""
                                  }
                                  onChange={(e) => {
                                    setFormData((prev) => {
                                      const newData = JSON.parse(
                                        JSON.stringify(prev)
                                      ) as IntakeFormData;
                                      if (!newData.project.budget) {
                                        newData.project.budget = {
                                          currency:
                                            "USD" as IntakeFormCurrencyCode,
                                          min: "",
                                          max: "",
                                        };
                                      }
                                      (
                                        newData.project.budget as {
                                          currency?: IntakeFormCurrencyCode;
                                          min?: string;
                                          max?: string;
                                        }
                                      ).max = e.target.value;
                                      return newData;
                                    });
                                  }}
                                  disabled={isFormDisabled}
                                  fullWidth
                                  placeholder="e.g., 50,000"
                                />
                              </Stack>
                            </Stack>
                          </Box>
                        )}
                        <TextField
                          label={t("form.project.startDate")}
                          type="date"
                          value={formData.project.startDate || ""}
                          onChange={handleInputChange(["project", "startDate"])}
                          InputLabelProps={{ shrink: true }}
                          disabled={isFormDisabled}
                          fullWidth
                        />

                        {/* Technologies Array */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {t("form.project.technologies")}
                          </Typography>
                          <Stack spacing={1}>
                            {(formData.project.technologies || []).map(
                              (tech, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <TextField
                                    value={tech}
                                    onChange={handleArrayInputChange(
                                      ["project", "technologies"],
                                      index
                                    )}
                                    placeholder={t("form.project.technologies")}
                                    disabled={isFormDisabled}
                                    fullWidth
                                    size="small"
                                  />
                                  <IconButton
                                    onClick={() =>
                                      removeArrayItem(
                                        ["project", "technologies"],
                                        index
                                      )
                                    }
                                    disabled={isFormDisabled}
                                    color="error"
                                    size="small"
                                    aria-label={`Remove technology ${
                                      index + 1
                                    }`}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              )
                            )}
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() =>
                                addArrayItem(["project", "technologies"])
                              }
                              disabled={isFormDisabled}
                              variant="outlined"
                              size="small"
                              sx={{ alignSelf: "flex-start" }}
                            >
                              {t("form.addTechnology")}
                            </Button>
                          </Stack>
                        </Box>

                        {/* Requirements Array */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {t("form.project.requirements")}
                          </Typography>
                          <Stack spacing={1}>
                            {(formData.project.requirements || []).map(
                              (req, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <TextField
                                    value={req}
                                    onChange={handleArrayInputChange(
                                      ["project", "requirements"],
                                      index
                                    )}
                                    placeholder={t("form.project.requirements")}
                                    disabled={isFormDisabled}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    size="small"
                                  />
                                  <IconButton
                                    onClick={() =>
                                      removeArrayItem(
                                        ["project", "requirements"],
                                        index
                                      )
                                    }
                                    disabled={isFormDisabled}
                                    color="error"
                                    size="small"
                                    aria-label={`Remove requirement ${
                                      index + 1
                                    }`}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              )
                            )}
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() =>
                                addArrayItem(["project", "requirements"])
                              }
                              disabled={isFormDisabled}
                              variant="outlined"
                              size="small"
                              sx={{ alignSelf: "flex-start" }}
                            >
                              {t("form.addRequirement")}
                            </Button>
                          </Stack>
                        </Box>

                        {/* Goals Array */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {t("form.project.goals")}
                          </Typography>
                          <Stack spacing={1}>
                            {(formData.project.goals || []).map(
                              (goal, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <TextField
                                    value={goal}
                                    onChange={handleArrayInputChange(
                                      ["project", "goals"],
                                      index
                                    )}
                                    placeholder={t("form.project.goals")}
                                    disabled={isFormDisabled}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    size="small"
                                  />
                                  <IconButton
                                    onClick={() =>
                                      removeArrayItem(
                                        ["project", "goals"],
                                        index
                                      )
                                    }
                                    disabled={isFormDisabled}
                                    color="error"
                                    size="small"
                                    aria-label={`Remove goal ${index + 1}`}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              )
                            )}
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => addArrayItem(["project", "goals"])}
                              disabled={isFormDisabled}
                              variant="outlined"
                              size="small"
                              sx={{ alignSelf: "flex-start" }}
                            >
                              {t("form.addGoal")}
                            </Button>
                          </Stack>
                        </Box>

                        {/* Resource Links */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {t("form.project.resourceLinks") ||
                              "Resource Links (Figma, Designs, etc.)"}
                          </Typography>
                          <Stack spacing={1}>
                            {(formData.project.resourceLinks || []).map(
                              (resource, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <TextField
                                    label={
                                      t("form.project.resourceLabel") || "Label"
                                    }
                                    value={resource.label}
                                    onChange={(e) => {
                                      setFormData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev)
                                        ) as IntakeFormData;
                                        if (!newData.project.resourceLinks) {
                                          newData.project.resourceLinks = [];
                                        }
                                        newData.project.resourceLinks![index] =
                                          {
                                            ...resource,
                                            label: e.target.value,
                                          };
                                        return newData;
                                      });
                                    }}
                                    disabled={isFormDisabled}
                                    size="small"
                                    sx={{ flex: 1 }}
                                    placeholder="e.g., Figma Design"
                                  />
                                  <TextField
                                    label={
                                      t("form.project.resourceUrl") || "URL"
                                    }
                                    type="url"
                                    value={resource.url}
                                    onChange={(e) => {
                                      setFormData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev)
                                        ) as IntakeFormData;
                                        if (!newData.project.resourceLinks) {
                                          newData.project.resourceLinks = [];
                                        }
                                        newData.project.resourceLinks![index] =
                                          {
                                            ...resource,
                                            url: e.target.value,
                                          };
                                        return newData;
                                      });
                                    }}
                                    disabled={isFormDisabled}
                                    size="small"
                                    sx={{ flex: 2 }}
                                    placeholder="https://..."
                                  />
                                  <IconButton
                                    onClick={() => {
                                      setFormData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev)
                                        ) as IntakeFormData;
                                        if (!newData.project.resourceLinks) {
                                          return newData;
                                        }
                                        newData.project.resourceLinks =
                                          newData.project.resourceLinks!.filter(
                                            (_, i) => i !== index
                                          );
                                        return newData;
                                      });
                                    }}
                                    disabled={isFormDisabled}
                                    color="error"
                                    size="small"
                                    aria-label={`Remove resource ${index + 1}`}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              )
                            )}
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => {
                                setFormData((prev) => {
                                  const newData = JSON.parse(
                                    JSON.stringify(prev)
                                  ) as IntakeFormData;
                                  if (!newData.project.resourceLinks) {
                                    newData.project.resourceLinks = [];
                                  }
                                  newData.project.resourceLinks = [
                                    ...newData.project.resourceLinks,
                                    { label: "", url: "" },
                                  ];
                                  return newData;
                                });
                              }}
                              disabled={isFormDisabled}
                              variant="outlined"
                              size="small"
                              sx={{ alignSelf: "flex-start" }}
                            >
                              {t("form.addResourceLink") || "Add Resource Link"}
                            </Button>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Additional Information */}
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <InfoIcon />
                        <Typography variant="h5">
                          {t("sections.additional")}
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <InputLabel>
                            {t("form.additional.preferredContactMethod")}
                          </InputLabel>
                          <Select
                            value={
                              formData.additional?.preferredContactMethod || ""
                            }
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                additional: {
                                  ...prev.additional,
                                  preferredContactMethod: e.target.value,
                                },
                              }));
                            }}
                            label={t("form.additional.preferredContactMethod")}
                            disabled={isFormDisabled}
                          >
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone">Phone</MenuItem>
                            <MenuItem value="video">Video Call</MenuItem>
                            <MenuItem value="in-person">In Person</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl fullWidth>
                          <InputLabel>
                            {t("form.additional.timezone")}
                          </InputLabel>
                          <Select
                            value={formData.additional?.timezone || "UTC"}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                additional: {
                                  ...prev.additional,
                                  timezone: e.target.value,
                                },
                              }));
                            }}
                            label={t("form.additional.timezone")}
                            disabled={isFormDisabled}
                          >
                            {/* Show detected timezone first if not in common list */}
                            {!COMMON_TIMEZONES.some(
                              (tz) => tz.value === detectedTimezone
                            ) && (
                              <MenuItem value={detectedTimezone}>
                                {detectedTimezone}{" "}
                                {getGMTOffset(detectedTimezone) &&
                                  `(${getGMTOffset(detectedTimezone)})`}{" "}
                                (Detected)
                              </MenuItem>
                            )}
                            {COMMON_TIMEZONES.map((tz) => {
                              const offset = getGMTOffset(tz.value);
                              return (
                                <MenuItem key={tz.value} value={tz.value}>
                                  {tz.label} {offset && `(${offset})`}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth>
                          <InputLabel>
                            {t("form.additional.urgency")}
                          </InputLabel>
                          <Select
                            value={formData.additional?.urgency || ""}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                additional: {
                                  ...prev.additional,
                                  urgency: e.target.value,
                                },
                              }));
                            }}
                            label={t("form.additional.urgency")}
                            disabled={isFormDisabled}
                          >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="urgent">Urgent</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          label={t("form.additional.notes")}
                          value={formData.additional?.notes || ""}
                          onChange={handleInputChange(["additional", "notes"])}
                          multiline
                          rows={4}
                          disabled={isFormDisabled}
                          fullWidth
                          helperText={t("form.additional.notesHelper")}
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
                        bgcolor: "primary.main",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
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
