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
  Paper,
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
} from "@mui/material";
import { api } from "$/trpc/client";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
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
  RateReview as RateReviewIcon,
} from "@mui/icons-material";
import { ClientOnly } from "~/ClientOnly";

const AdminIntakesList = () => {
  const router = useRouter();
  const pathname = usePathname();
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
  });
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || customLinksError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error?.message || customLinksError?.message || "Failed to load data"}
        </Alert>
      </Container>
    );
  }

  return (
    <ClientOnly skeleton>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin")}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" component="h1">
            Project Intakes
          </Typography>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ ml: "auto" }}
          >
            Generate Custom Link
          </Button>
        </Box>

        {/* New Review Page Banner */}
        <Alert
          severity="info"
          sx={{
            mb: 3,
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
          action={
            <Button
              variant="contained"
              size="small"
              startIcon={<RateReviewIcon />}
              onClick={() => router.push("/admin/review")}
              sx={{ whiteSpace: "nowrap" }}
            >
              Open Review Page
            </Button>
          }
        >
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              🎉 New Intake Review Page Available!
            </Typography>
            <Typography variant="body2">
              Try the new advanced review interface with status management,
              notes, reminders, and dual design variants.
            </Typography>
          </Box>
        </Alert>

        {/* Generate Custom Link Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
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
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
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
              <Stack direction="row" spacing={2}>
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

        <Stack spacing={4}>
          {/* Custom Links Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
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
                      <TableCell>Slug/Link</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Expires</TableCell>
                      <TableCell>Created</TableCell>
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
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LinkIcon fontSize="small" color="action" />
                                <MuiLink
                                  href={fullLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    fontFamily: "monospace",
                                    fontSize: "0.875rem",
                                    maxWidth: 200,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "block",
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
                            </TableCell>
                            <TableCell>{link.email}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <PersonIcon fontSize="small" color="action" />
                                {clientName}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {link.organizationName ? (
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
                                  />
                                  {link.organizationName}
                                </Box>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  bgcolor: isExpired
                                    ? "error.light"
                                    : "success.light",
                                  color: isExpired
                                    ? "error.contrastText"
                                    : "success.contrastText",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              >
                                {isExpired ? "Expired" : "Active"}
                              </Box>
                            </TableCell>
                            <TableCell>
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
                                <AccessTimeIcon fontSize="small" />
                                {format(
                                  new Date(link.expiresAt),
                                  "MMM dd, yyyy"
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(link.createdAt),
                                "MMM dd, yyyy HH:mm"
                              )}
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
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Regular Intakes (Submitted Forms)
            </Typography>
            {!intakes || intakes.length === 0 ? (
              <Alert severity="info">No intakes found.</Alert>
            ) : (
              <TableContainer component={Paper}>
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
      </Container>
    </ClientOnly>
  );
};

export default AdminIntakesList;
