"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  Tooltip,
  Chip,
} from "@mui/material";
import { api } from "$/trpc/client";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import TokenOutlinedIcon from "@mui/icons-material/TokenOutlined";
import { ClientOnly } from "~/ClientOnly";

const AdminIntakesList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: intakes, isLoading, error } = api.intakes.getAll.useQuery();
  const {
    data: customLinks,
    isLoading: isLoadingCustomLinks,
    error: customLinksError,
    refetch: refetchCustomLinks,
  } = api.intakes.getAllCustomLinks.useQuery();
  const generateLinkMutation = api.intakes.generateCustomLink.useMutation();
  const deleteCustomLinkMutation = api.intakes.deleteCustomLink.useMutation();
  const deleteCustomLinksMutation = api.intakes.deleteCustomLinks.useMutation();

  // Get current locale from pathname
  const currentLocale =
    (pathname.split("/")[1] as "en" | "es" | "fr" | "he") || "en";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(
    "Link copied to clipboard!"
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [copyButtonClicked, setCopyButtonClicked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    organizationName: "",
    organizationWebsite: "",
    expiresInDays: 30,
    locale: currentLocale,
    hiddenSections: [] as string[],
  });
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Helper function to get section fields
  const getSectionFields = (sectionPrefix: string): string[] => {
    const fieldMap: Record<string, string[]> = {
      org: ["org.name", "org.website", "org.industry", "org.size"],
      budget: ["budget.currency", "budget.min", "budget.max"],
      project: [
        "project.timeline",
        "project.startDate",
        "project.technologies",
        "project.requirements",
        "project.goals",
        "project.resourceLinks",
      ],
      additional: [
        "additional.preferredContactMethod",
        "additional.timezone",
        "additional.urgency",
        "additional.notes",
      ],
    };
    return fieldMap[sectionPrefix] || [];
  };

  // Helper function to get section checkbox state
  const getSectionState = (sectionPrefix: string) => {
    const sectionFields = getSectionFields(sectionPrefix);
    const hiddenFields = formData.hiddenSections;
    const checkedCount = sectionFields.filter((field) =>
      hiddenFields.includes(field)
    ).length;

    if (checkedCount === 0) return { checked: false, indeterminate: false };
    if (checkedCount === sectionFields.length)
      return { checked: true, indeterminate: false };
    return { checked: false, indeterminate: true };
  };

  // Handle section checkbox toggle
  const handleSectionToggle = (sectionPrefix: string) => {
    const sectionFields = getSectionFields(sectionPrefix);
    const hiddenFields = formData.hiddenSections;
    const sectionState = getSectionState(sectionPrefix);

    let newSections: string[];
    if (sectionState.checked) {
      // If all checked, uncheck all
      newSections = hiddenFields.filter(
        (field) => !sectionFields.includes(field)
      );
    } else {
      // If none or some checked, check all
      const fieldsToAdd = sectionFields.filter(
        (field) => !hiddenFields.includes(field)
      );
      newSections = [...hiddenFields, ...fieldsToAdd];
    }

    setFormData({
      ...formData,
      hiddenSections: newSections,
    });
  };

  const handleGenerateLink = async () => {
    setFormError(null);

    // Validate email before submission
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      setFormError("Please enter a valid email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError("Please enter a valid email address");
      return;
    }

    try {
      const result = await generateLinkMutation.mutateAsync({
        email: trimmedEmail,
        firstName: formData.firstName?.trim() || undefined,
        lastName: formData.lastName?.trim() || undefined,
        organizationName: formData.organizationName?.trim() || undefined,
        organizationWebsite: formData.organizationWebsite?.trim() || undefined,
        expiresInDays: formData.expiresInDays,
        locale: formData.locale,
        hiddenSections:
          formData.hiddenSections.length > 0
            ? formData.hiddenSections
            : undefined,
      });
      setGeneratedLink(result.link);
      setEmailSent(result.emailSent ?? null);
      setEmailError((result as { emailError?: string }).emailError || null);
      setFormError(null);

      // Automatically copy link to clipboard
      try {
        await navigator.clipboard.writeText(result.link);
        setSnackbarMessage("Link copied to clipboard!");
        setSnackbarOpen(true);
      } catch (copyError) {
        console.error("Failed to copy link:", copyError);
        // Still show the link even if copy fails
      }
    } catch (error) {
      console.error("Failed to generate link:", error);
      let errorMessage = "Failed to generate link";

      if (error instanceof Error) {
        // Handle tRPC error format
        if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address";
        } else {
          errorMessage = error.message;
        }
      }

      setFormError(errorMessage);
    }
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        setSnackbarMessage("Link copied to clipboard!");
        setSnackbarOpen(true);
        setCopyButtonClicked(true);
        setTimeout(() => setCopyButtonClicked(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
        setSnackbarMessage("Failed to copy link. Please copy manually.");
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setGeneratedLink(null);
    setEmailSent(null);
    setEmailError(null);
    setFormError(null);
    setCopyButtonClicked(false);
    setSnackbarOpen(false);
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      organizationName: "",
      organizationWebsite: "",
      expiresInDays: 30,
      locale: currentLocale,
      hiddenSections: [],
    });
  };

  const handleSelectLink = (linkId: string) => {
    setSelectedLinks((prev) =>
      prev.includes(linkId)
        ? prev.filter((id) => id !== linkId)
        : [...prev, linkId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && customLinks) {
      setSelectedLinks(
        customLinks.map(
          (link: {
            id: string;
            slug: string;
            email: string;
            firstName?: string | null;
            lastName?: string | null;
            organizationName?: string | null;
            expiresAt: Date | string;
            createdAt: Date | string;
            isExpired: boolean;
          }) => link.id
        )
      );
    } else {
      setSelectedLinks([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLinks.length === 0) return;

    try {
      if (selectedLinks.length === 1) {
        await deleteCustomLinkMutation.mutateAsync({ id: selectedLinks[0] });
      } else {
        await deleteCustomLinksMutation.mutateAsync({ ids: selectedLinks });
      }
      setSelectedLinks([]);
      setDeleteDialogOpen(false);
      setSnackbarMessage(
        `Successfully deleted ${selectedLinks.length} custom link${
          selectedLinks.length > 1 ? "s" : ""
        }`
      );
      setSnackbarOpen(true);
      await refetchCustomLinks();
    } catch (error) {
      console.error("Failed to delete links:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to delete custom links"
      );
      setSnackbarOpen(true);
    }
  };

  if (isLoading || isLoadingCustomLinks) {
    return (
      <Container
        maxWidth="lg"
        sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || customLinksError) {
    return (
      <Container
        maxWidth="lg"
        sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}
      >
        <Alert severity="error">
          {error?.message || customLinksError?.message || "Failed to load data"}
        </Alert>
      </Container>
    );
  }

  return (
    <ClientOnly skeleton>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "center" },
            justifyContent: { xs: "center", sm: "space-between" },
            gap: 2,
            width: "100%",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin")}
            sx={{ alignSelf: { xs: "center", sm: "center" } }}
          >
            Back to Dashboard
          </Button>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Project Intakes
          </Typography>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              ml: { xs: 0, sm: "auto" },
              alignSelf: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Generate Custom Link
          </Button>
        </Box>

        {/* Generate Custom Link Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth={isMobile ? false : "md"}
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            Generate Custom Intake Link
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 3 },
              overflowY: "auto",
            }}
          >
            <Stack spacing={3} sx={{ mt: { xs: 0, sm: 1 } }}>
              {formError && (
                <Alert severity="error" onClose={() => setFormError(null)}>
                  {formError}
                </Alert>
              )}
              <TextField
                label="Email *"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setFormError(null); // Clear error when user types
                }}
                helperText={formError || "Client's email address"}
                error={!!formError}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="First Name"
                  required
                  fullWidth
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <TextField
                  label="Last Name"
                  required
                  fullWidth
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </Stack>
              <TextField
                label="Organization Name"
                fullWidth
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
              />
              <TextField
                label="Organization Website"
                fullWidth
                type="url"
                value={formData.organizationWebsite}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizationWebsite: e.target.value,
                  })
                }
                placeholder="https://example.com"
              />
              <TextField
                label="Expires In (Days)"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: 90 }}
                value={formData.expiresInDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiresInDays: parseInt(e.target.value) || 30,
                  })
                }
                helperText="Link will expire after this many days (1-90)"
              />
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={formData.locale}
                  label="Language"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locale: e.target.value as "en" | "es" | "fr" | "he",
                    })
                  }
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="he">עברית</MenuItem>
                </Select>
                <FormHelperText>
                  The language for the intake form
                </FormHelperText>
              </FormControl>

              {/* Hidden Fields */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Hide Fields (Optional)
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 2, display: "block" }}
                >
                  Select individual fields to hide from the client when they
                  fill out the form. Useful for pro bono projects or when
                  certain information isn&apos;t needed.
                </Typography>

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  {/* Organization Section */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleSectionToggle("org");
                      }}
                    >
                      <Checkbox
                        checked={getSectionState("org").checked}
                        indeterminate={getSectionState("org").indeterminate}
                        onChange={() => {
                          handleSectionToggle("org");
                        }}
                        size="small"
                        icon={<TokenOutlinedIcon />}
                        checkedIcon={<TokenOutlinedIcon />}
                        sx={{
                          "&.Mui-checked .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                          "&.MuiCheckbox-indeterminate .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Organization Information
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: "none" }}>
                      {[
                        { key: "org.name", label: "Organization Name" },
                        {
                          key: "org.website",
                          label: "Organization Website",
                        },
                        { key: "org.industry", label: "Industry" },
                        { key: "org.size", label: "Organization Size" },
                      ].map((field) => {
                        const isChecked = formData.hiddenSections.includes(
                          field.key
                        );
                        const handleToggle = () => {
                          const newSections = isChecked
                            ? formData.hiddenSections.filter(
                                (s) => s !== field.key
                              )
                            : [...formData.hiddenSections, field.key];
                          setFormData({
                            ...formData,
                            hiddenSections: newSections,
                          });
                        };
                        return (
                          <Box
                            key={field.key}
                            component="li"
                            onClick={handleToggle}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              borderRadius: 0.5,
                              cursor: "pointer",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <Checkbox
                              size="small"
                              checked={isChecked}
                              onChange={handleToggle}
                              icon={<TokenOutlinedIcon />}
                              checkedIcon={<TokenOutlinedIcon />}
                              sx={{
                                "&.Mui-checked .MuiSvgIcon-root": {
                                  fill: (theme) => theme.palette.error.main,
                                },
                              }}
                            />
                            <Typography variant="body2">
                              {field.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Budget Section */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleSectionToggle("budget");
                      }}
                    >
                      <Checkbox
                        checked={getSectionState("budget").checked}
                        indeterminate={getSectionState("budget").indeterminate}
                        onChange={() => {
                          handleSectionToggle("budget");
                        }}
                        size="small"
                        icon={<TokenOutlinedIcon />}
                        checkedIcon={<TokenOutlinedIcon />}
                        sx={{
                          "&.Mui-checked .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                          "&.MuiCheckbox-indeterminate .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Budget Information
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: "none" }}>
                      {[
                        { key: "budget.currency", label: "Currency" },
                        { key: "budget.min", label: "Minimum Budget" },
                        { key: "budget.max", label: "Maximum Budget" },
                      ].map((field) => {
                        const isChecked = formData.hiddenSections.includes(
                          field.key
                        );
                        const handleToggle = () => {
                          const newSections = isChecked
                            ? formData.hiddenSections.filter(
                                (s) => s !== field.key
                              )
                            : [...formData.hiddenSections, field.key];
                          setFormData({
                            ...formData,
                            hiddenSections: newSections,
                          });
                        };
                        return (
                          <Box
                            key={field.key}
                            component="li"
                            onClick={handleToggle}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              borderRadius: 0.5,
                              cursor: "pointer",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <Checkbox
                              size="small"
                              checked={isChecked}
                              onChange={handleToggle}
                              icon={<TokenOutlinedIcon />}
                              checkedIcon={<TokenOutlinedIcon />}
                              sx={{
                                "&.Mui-checked .MuiSvgIcon-root": {
                                  fill: (theme) => theme.palette.error.main,
                                },
                              }}
                            />
                            <Typography variant="body2">
                              {field.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Project Section */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleSectionToggle("project");
                      }}
                    >
                      <Checkbox
                        checked={getSectionState("project").checked}
                        indeterminate={getSectionState("project").indeterminate}
                        onChange={() => {
                          handleSectionToggle("project");
                        }}
                        size="small"
                        icon={<TokenOutlinedIcon />}
                        checkedIcon={<TokenOutlinedIcon />}
                        sx={{
                          "&.Mui-checked .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                          "&.MuiCheckbox-indeterminate .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Project Information
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: "none" }}>
                      {[
                        { key: "project.timeline", label: "Timeline" },
                        { key: "project.startDate", label: "Start Date" },
                        {
                          key: "project.technologies",
                          label: "Technologies",
                        },
                        {
                          key: "project.requirements",
                          label: "Requirements",
                        },
                        { key: "project.goals", label: "Goals" },
                        {
                          key: "project.resourceLinks",
                          label: "Resource Links",
                        },
                      ].map((field) => {
                        const isChecked = formData.hiddenSections.includes(
                          field.key
                        );
                        const handleToggle = () => {
                          const newSections = isChecked
                            ? formData.hiddenSections.filter(
                                (s) => s !== field.key
                              )
                            : [...formData.hiddenSections, field.key];
                          setFormData({
                            ...formData,
                            hiddenSections: newSections,
                          });
                        };
                        return (
                          <Box
                            key={field.key}
                            component="li"
                            onClick={handleToggle}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              borderRadius: 0.5,
                              cursor: "pointer",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <Checkbox
                              size="small"
                              checked={isChecked}
                              onChange={handleToggle}
                              icon={<TokenOutlinedIcon />}
                              checkedIcon={<TokenOutlinedIcon />}
                              sx={{
                                "&.Mui-checked .MuiSvgIcon-root": {
                                  fill: (theme) => theme.palette.error.main,
                                },
                              }}
                            />
                            <Typography variant="body2">
                              {field.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Additional Information Section */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleSectionToggle("additional");
                      }}
                    >
                      <Checkbox
                        checked={getSectionState("additional").checked}
                        indeterminate={
                          getSectionState("additional").indeterminate
                        }
                        onChange={() => {
                          handleSectionToggle("additional");
                        }}
                        size="small"
                        icon={<TokenOutlinedIcon />}
                        checkedIcon={<TokenOutlinedIcon />}
                        sx={{
                          "&.Mui-checked .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                          "&.MuiCheckbox-indeterminate .MuiSvgIcon-root": {
                            fill: (theme) => theme.palette.error.main,
                          },
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Additional Information
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: "none" }}>
                      {[
                        {
                          key: "additional.preferredContactMethod",
                          label: "Preferred Contact Method",
                        },
                        { key: "additional.timezone", label: "Timezone" },
                        { key: "additional.urgency", label: "Urgency" },
                        { key: "additional.notes", label: "Client Notes" },
                      ].map((field) => {
                        const isChecked = formData.hiddenSections.includes(
                          field.key
                        );
                        const handleToggle = () => {
                          const newSections = isChecked
                            ? formData.hiddenSections.filter(
                                (s) => s !== field.key
                              )
                            : [...formData.hiddenSections, field.key];
                          setFormData({
                            ...formData,
                            hiddenSections: newSections,
                          });
                        };
                        return (
                          <Box
                            key={field.key}
                            component="li"
                            onClick={handleToggle}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              borderRadius: 0.5,
                              cursor: "pointer",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <Checkbox
                              size="small"
                              checked={isChecked}
                              onChange={handleToggle}
                              icon={<TokenOutlinedIcon />}
                              checkedIcon={<TokenOutlinedIcon />}
                              sx={{
                                "&.Mui-checked .MuiSvgIcon-root": {
                                  fill: (theme) => theme.palette.error.main,
                                },
                              }}
                            />
                            <Typography variant="body2">
                              {field.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Stack>
              </Box>
              {generatedLink && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Generated Link:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                      }}
                    >
                      {generatedLink}
                    </Typography>
                    <IconButton
                      onClick={handleCopyLink}
                      color={copyButtonClicked ? "success" : "primary"}
                      sx={{
                        transition: "all 0.2s ease-in-out",
                        transform: copyButtonClicked
                          ? "scale(1.1)"
                          : "scale(1)",
                      }}
                    >
                      {copyButtonClicked ? (
                        <CheckCircleIcon />
                      ) : (
                        <ContentCopyIcon />
                      )}
                    </IconButton>
                  </Box>
                  {emailSent !== null && (
                    <Alert
                      severity={emailSent ? "success" : "warning"}
                      sx={{ mt: 2 }}
                    >
                      {emailSent ? (
                        "✅ Email sent successfully to client!"
                      ) : (
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            ⚠️ Link generated but email failed to send
                          </Typography>
                          {emailError && (
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 1,
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                              }}
                            >
                              Error: {emailError}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            You can copy and share the link manually.
                          </Typography>
                        </Box>
                      )}
                    </Alert>
                  )}
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              onClick={handleGenerateLink}
              variant="contained"
              disabled={!formData.email || generateLinkMutation.isPending}
            >
              {generateLinkMutation.isPending
                ? "Generating..."
                : "Generate Link"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {selectedLinks.length}{" "}
              {selectedLinks.length === 1 ? "custom link" : "custom links"}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteSelected}
              variant="contained"
              color="error"
              disabled={
                deleteCustomLinkMutation.isPending ||
                deleteCustomLinksMutation.isPending
              }
            >
              {deleteCustomLinkMutation.isPending ||
              deleteCustomLinksMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for copy confirmation */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />

        <Stack spacing={4} sx={{ width: "100%" }}>
          {/* Custom Links Section */}
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "center", sm: "space-between" },
                alignItems: { xs: "center", sm: "center" },
                gap: { xs: 2, sm: 0 },
                mb: 2,
                width: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Custom Links
              </Typography>
              {selectedLinks.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={
                    deleteCustomLinkMutation.isPending ||
                    deleteCustomLinksMutation.isPending
                  }
                >
                  Delete {selectedLinks.length}{" "}
                  {selectedLinks.length === 1 ? "Link" : "Links"}
                </Button>
              )}
            </Box>
            {!customLinks || customLinks.length === 0 ? (
              <Alert severity="info">No custom links found.</Alert>
            ) : (
              <TableContainer
                sx={{
                  maxWidth: "100%",
                  overflowX: "auto",
                  mx: "auto",
                  width: "100%",
                }}
              >
                <Table size="small" sx={{ minWidth: 1000 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" sx={{ width: 48 }}>
                        <Checkbox
                          indeterminate={
                            selectedLinks.length > 0 &&
                            selectedLinks.length < customLinks.length
                          }
                          checked={
                            customLinks.length > 0 &&
                            selectedLinks.length === customLinks.length
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>Slug</TableCell>
                      <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
                      <TableCell sx={{ minWidth: 130 }}>Client</TableCell>
                      <TableCell sx={{ minWidth: 140 }}>Organization</TableCell>
                      <TableCell sx={{ minWidth: 80 }}>Status</TableCell>
                      <TableCell sx={{ minWidth: 110 }}>Expires</TableCell>
                      <TableCell sx={{ minWidth: 130 }}>Created</TableCell>
                      <TableCell sx={{ width: 100 }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customLinks.map(
                      (link: {
                        id: string;
                        slug: string;
                        email: string;
                        firstName?: string | null;
                        lastName?: string | null;
                        organizationName?: string | null;
                        expiresAt: Date | string;
                        createdAt: Date | string;
                        isExpired: boolean;
                      }) => {
                        const baseUrl =
                          process.env.NEXT_PUBLIC_BASE_URL ||
                          (typeof window !== "undefined"
                            ? window.location.origin
                            : "http://localhost:3000");
                        const fullLink = `${baseUrl}/${currentLocale}/intake/${link.slug}`;
                        const isExpired = link.isExpired;
                        const clientName =
                          [link.firstName, link.lastName]
                            .filter(Boolean)
                            .join(" ") || "N/A";

                        return (
                          <TableRow key={link.id}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedLinks.includes(link.id)}
                                onChange={() => handleSelectLink(link.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={`Click to copy: ${fullLink}`}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <LinkIcon fontSize="small" color="action" />
                                  <MuiLink
                                    href={fullLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      fontFamily: "monospace",
                                      fontSize: "0.813rem",
                                      maxWidth: 100,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      display: "block",
                                      textDecoration: "none",
                                      "&:hover": {
                                        textDecoration: "underline",
                                      },
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigator.clipboard.writeText(fullLink);
                                      setSnackbarMessage(
                                        "Custom link copied to clipboard!"
                                      );
                                      setSnackbarOpen(true);
                                    }}
                                  >
                                    {link.slug}
                                  </MuiLink>
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={link.email}>
                                <Typography
                                  sx={{
                                    fontSize: "0.813rem",
                                    maxWidth: 170,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {link.email}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <PersonIcon
                                  fontSize="small"
                                  color="action"
                                  sx={{ flexShrink: 0 }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "0.813rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {clientName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {link.organizationName ? (
                                <Tooltip title={link.organizationName}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <BusinessIcon
                                      fontSize="small"
                                      color="action"
                                      sx={{ flexShrink: 0 }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: "0.813rem",
                                        maxWidth: 130,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {link.organizationName}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              ) : (
                                <Typography
                                  sx={{
                                    fontSize: "0.813rem",
                                    color: "text.secondary",
                                  }}
                                >
                                  —
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={isExpired ? "Expired" : "Active"}
                                size="small"
                                sx={{
                                  bgcolor: isExpired
                                    ? "error.light"
                                    : "success.light",
                                  color: isExpired
                                    ? "error.contrastText"
                                    : "success.contrastText",
                                  fontSize: "0.688rem",
                                  height: 22,
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={format(new Date(link.expiresAt), "PPp")}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    color: isExpired
                                      ? "error.main"
                                      : "text.primary",
                                  }}
                                >
                                  <AccessTimeIcon
                                    fontSize="small"
                                    sx={{ flexShrink: 0 }}
                                  />
                                  <Typography sx={{ fontSize: "0.813rem" }}>
                                    {format(new Date(link.expiresAt), "MMM dd")}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={format(new Date(link.createdAt), "PPp")}
                              >
                                <Typography sx={{ fontSize: "0.813rem" }}>
                                  {format(
                                    new Date(link.createdAt),
                                    "MMM dd, HH:mm"
                                  )}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="center"
                              >
                                <Tooltip title="Review in admin panel">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      // Find if there's a submitted intake with this email
                                      const matchingIntake = intakes?.find(
                                        (intake: {
                                          id: string;
                                          email: string;
                                          name: string;
                                        }) => intake.email === link.email
                                      );
                                      if (matchingIntake) {
                                        router.push(
                                          `/${currentLocale}/admin/review?id=${matchingIntake.id}`
                                        );
                                      } else {
                                        // Navigate to review page - will show all intakes
                                        router.push(
                                          `/${currentLocale}/admin/review`
                                        );
                                      }
                                    }}
                                    sx={{
                                      color: "primary.main",
                                      "&:hover": { bgcolor: "action.hover" },
                                    }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Open intake form">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      window.open(
                                        fullLink,
                                        "_blank",
                                        "noopener,noreferrer"
                                      );
                                    }}
                                    sx={{
                                      color: "primary.main",
                                      "&:hover": { bgcolor: "action.hover" },
                                    }}
                                  >
                                    <OpenInNewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Regular Intakes Section */}
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Regular Intakes (Submitted Forms)
            </Typography>
            {!intakes || intakes.length === 0 ? (
              <Alert severity="info">No intakes found.</Alert>
            ) : (
              <TableContainer
                sx={{
                  maxWidth: "100%",
                  overflowX: "auto",
                  mx: "auto",
                  width: "100%",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Name/Organization</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {intakes.map(
                      (intake: {
                        id: string;
                        email: string;
                        name: string;
                        createdAt: string | number | Date;
                      }) => (
                        <TableRow key={intake.id}>
                          <TableCell>{intake.email}</TableCell>
                          <TableCell>{intake.name || "Unknown"}</TableCell>
                          <TableCell>
                            {intake.createdAt
                              ? format(
                                  new Date(intake.createdAt),
                                  "MMM dd, yyyy HH:mm"
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <MuiLink
                              component="button"
                              onClick={() =>
                                router.push(`/admin/intakes/${intake.id}`)
                              }
                              sx={{ cursor: "pointer" }}
                            >
                              View
                            </MuiLink>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Stack>
      </Box>
    </ClientOnly>
  );
};

export default AdminIntakesList;
