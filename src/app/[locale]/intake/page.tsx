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
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import { ResponsiveBackground } from "~/ScrollingSections";

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

      // Check for token in URL (custom link) - decode it without verification
      // since middleware already validated it server-side
      const urlToken = searchParams.get("token");
      const token = urlToken || tokenCookie?.split("=")[1];

      if (token) {
        try {
          // Decode JWT payload without verification (middleware already validated it)
          // JWT format: header.payload.signature
          const parts = token.split(".");
          if (parts.length === 3) {
            // Decode base64url payload (second part)
            const payload = JSON.parse(
              atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
            ) as {
              email?: string;
              isCustomLink?: boolean;
              firstName?: string;
              lastName?: string;
              organizationName?: string;
              organizationWebsite?: string;
            };

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
        } catch (error) {
          console.error("Failed to decode token payload:", error);
          // If decoding fails, continue to Calendly parameters fallback
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

  // Array handlers for technologies, requirements, and goals
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

        // Clear error
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

    // Clean up form data: filter empty strings from arrays
    const cleanedFormData = {
      ...formData,
      project: {
        ...formData.project,
        technologies:
          formData.project.technologies?.filter((t) => t.trim() !== "") || [],
        requirements:
          formData.project.requirements?.filter((r) => r.trim() !== "") || [],
        goals: formData.project.goals?.filter((g) => g.trim() !== "") || [],
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
    submitIntake.mutate(cleanedFormData);
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

                        <TextField
                          label={t("form.additional.timezone")}
                          value={formData.additional?.timezone || ""}
                          onChange={handleInputChange([
                            "additional",
                            "timezone",
                          ])}
                          placeholder="e.g., UTC-5, EST, PST"
                          disabled={isFormDisabled}
                          fullWidth
                        />

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
