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
} from "@mui/material";
import { api } from "$/trpc/client";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ClientOnly } from "~/ClientOnly";

const AdminIntakesList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: intakes, isLoading, error } = api.intakes.getAll.useQuery();
  const generateLinkMutation = api.intakes.generateCustomLink.useMutation();

  // Get current locale from pathname
  const currentLocale =
    (pathname.split("/")[1] as "en" | "es" | "fr" | "he") || "en";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    organizationName: "",
    organizationWebsite: "",
    expiresInDays: 30,
    locale: currentLocale,
  });

  const handleGenerateLink = async () => {
    try {
      const result = await generateLinkMutation.mutateAsync({
        email: formData.email,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        organizationName: formData.organizationName || undefined,
        organizationWebsite: formData.organizationWebsite || undefined,
        expiresInDays: formData.expiresInDays,
        locale: formData.locale,
      });
      setGeneratedLink(result.link);
    } catch (error) {
      console.error("Failed to generate link:", error);
    }
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setGeneratedLink(null);
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error.message || "Failed to load intakes"}
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
              <TextField
                label="Email *"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                helperText="Client's email address"
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <TextField
                  label="Last Name"
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
                    <IconButton onClick={handleCopyLink} color="primary">
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
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

        {/* Snackbar for copy confirmation */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Link copied to clipboard!"
        />

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
      </Container>
    </ClientOnly>
  );
};

export default AdminIntakesList;
