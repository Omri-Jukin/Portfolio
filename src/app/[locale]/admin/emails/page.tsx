"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Chip,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import { useRouter } from "next/navigation";
import { ClientOnly } from "~/ClientOnly";
import { EmailTemplate } from "$/db/emailTemplates/emailTemplates";

// Serialized version of EmailTemplate (dates become strings when serialized via tRPC)
type SerializedEmailTemplate = Omit<
  EmailTemplate,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`email-tabpanel-${index}`}
      aria-labelledby={`email-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const EmailTemplatesAdmin = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(
    new Set()
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Queries
  const {
    data: templates,
    isLoading,
    refetch,
  } = api.emailTemplates.getAll.useQuery();

  // Type templates as serialized version (dates become strings via tRPC)
  const typedTemplates = templates as SerializedEmailTemplate[] | undefined;
  const { data: recipients, isLoading: recipientsLoading } =
    api.emailTemplates.getRecipients.useQuery();
  const createMutation = api.emailTemplates.create.useMutation({
    onSuccess: () => {
      refetch();
      setDialogOpen(false);
      setSelectedTemplate(null);
      setSnackbarMessage("Template created successfully!");
      setSnackbarOpen(true);
    },
  });
  const updateMutation = api.emailTemplates.update.useMutation({
    onSuccess: () => {
      refetch();
      setDialogOpen(false);
      setSelectedTemplate(null);
      setSnackbarMessage("Template updated successfully!");
      setSnackbarOpen(true);
    },
  });
  const deleteMutation = api.emailTemplates.delete.useMutation({
    onSuccess: () => {
      refetch();
      setSnackbarMessage("Template deleted successfully!");
      setSnackbarOpen(true);
    },
  });
  const sendMutation = api.emailTemplates.sendEmails.useMutation({
    onSuccess: (result) => {
      setSendDialogOpen(false);
      setSelectedRecipients(new Set());
      setSnackbarMessage(
        `Emails sent! ${result.successCount} succeeded, ${result.failureCount} failed.`
      );
      setSnackbarOpen(true);
    },
  });

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    htmlContent: "",
    textContent: "",
    cssStyles: "",
  });

  // Get template for editing
  const editingTemplate = useMemo(() => {
    if (!selectedTemplate || !typedTemplates) return null;
    return typedTemplates.find((t) => t.id === selectedTemplate);
  }, [selectedTemplate, typedTemplates]);

  // Filtered recipients
  const filteredRecipients = useMemo(() => {
    if (!recipients) return [];
    if (!searchQuery.trim()) return recipients;

    const query = searchQuery.toLowerCase();
    return recipients.filter(
      (r) =>
        r.email.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query)
    );
  }, [recipients, searchQuery]);

  // Handle template actions
  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setTemplateForm({
      name: "",
      subject: "",
      htmlContent: "",
      textContent: "",
      cssStyles: "",
    });
    setDialogOpen(true);
  };

  const handleEditTemplate = (id: string) => {
    const template = typedTemplates?.find((t) => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setTemplateForm({
        name: template.name,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent || "",
        cssStyles: template.cssStyles || "",
      });
      setDialogOpen(true);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleSaveTemplate = () => {
    if (
      !templateForm.name ||
      !templateForm.subject ||
      !templateForm.htmlContent
    ) {
      setSnackbarMessage("Please fill in all required fields!");
      setSnackbarOpen(true);
      return;
    }

    if (selectedTemplate) {
      updateMutation.mutate({
        id: selectedTemplate,
        ...templateForm,
      });
    } else {
      createMutation.mutate(templateForm);
    }
  };

  const handleSendEmails = (templateId: string) => {
    if (selectedRecipients.size === 0) {
      setSnackbarMessage("Please select at least one recipient!");
      setSnackbarOpen(true);
      return;
    }
    setSelectedTemplate(templateId);
    setSendDialogOpen(true);
  };

  const handleConfirmSend = () => {
    if (!selectedTemplate) return;

    sendMutation.mutate({
      templateId: selectedTemplate,
      recipientEmails: Array.from(selectedRecipients),
    });
  };

  const handleSelectAll = () => {
    if (selectedRecipients.size === filteredRecipients.length) {
      setSelectedRecipients(new Set());
    } else {
      setSelectedRecipients(new Set(filteredRecipients.map((r) => r.email)));
    }
  };

  const handleToggleRecipient = (email: string) => {
    const newSet = new Set(selectedRecipients);
    if (newSet.has(email)) {
      newSet.delete(email);
    } else {
      newSet.add(email);
    }
    setSelectedRecipients(newSet);
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

  return (
    <ClientOnly skeleton>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin")}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" component="h1">
            Email Templates
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewTemplate}
            sx={{ ml: "auto" }}
          >
            New Template
          </Button>
        </Box>

        {/* Templates List */}
        <Box sx={{ mb: 3 }}>
          {typedTemplates && typedTemplates.length > 0 ? (
            <Stack spacing={2}>
              {typedTemplates.map((template) => (
                <Card key={template.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Subject: {template.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Updated:{" "}
                          {new Date(template.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          startIcon={<SendIcon />}
                          onClick={() => handleSendEmails(template.id)}
                        >
                          Send
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleEditTemplate(template.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No email templates yet. Create your first template to get
                started!
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Template Editor Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedTemplate(null);
          }}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            {selectedTemplate ? "Edit Template" : "New Template"}
            <IconButton
              aria-label="close"
              onClick={() => {
                setDialogOpen(false);
                setSelectedTemplate(null);
              }}
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
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
              >
                <Tab
                  icon={<DescriptionIcon />}
                  iconPosition="start"
                  label="Content"
                />
                <Tab icon={<CodeIcon />} iconPosition="start" label="HTML" />
                <Tab icon={<PaletteIcon />} iconPosition="start" label="CSS" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Stack spacing={2}>
                <TextField
                  label="Template Name *"
                  fullWidth
                  value={templateForm.name}
                  onChange={(e) =>
                    setTemplateForm({ ...templateForm, name: e.target.value })
                  }
                />
                <TextField
                  label="Email Subject *"
                  fullWidth
                  value={templateForm.subject}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      subject: e.target.value,
                    })
                  }
                  helperText="You can use {{variableName}} for dynamic content"
                />
                <TextField
                  label="Text Content (Plain Text Version)"
                  fullWidth
                  multiline
                  rows={6}
                  value={templateForm.textContent}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      textContent: e.target.value,
                    })
                  }
                  helperText="Plain text version of the email for clients without HTML support"
                />
                <Alert severity="info">
                  Use <code>{`{{variableName}}`}</code> in your content to
                  insert dynamic values when sending emails (e.g.,{" "}
                  {`{{firstName}}`}, {`{{companyName}}`})
                </Alert>
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TextField
                label="HTML Content *"
                fullWidth
                multiline
                rows={20}
                value={templateForm.htmlContent}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    htmlContent: e.target.value,
                  })
                }
                sx={{ fontFamily: "monospace" }}
                helperText="Full HTML email content. Use {{variableName}} for dynamic values."
              />
              <Alert severity="warning" sx={{ mt: 2 }}>
                Make sure your HTML includes a proper DOCTYPE and table-based
                layout for best email client compatibility.
              </Alert>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <TextField
                label="CSS Styles"
                fullWidth
                multiline
                rows={15}
                value={templateForm.cssStyles}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    cssStyles: e.target.value,
                  })
                }
                sx={{ fontFamily: "monospace" }}
                helperText="Additional CSS styles. Note: Many email clients don't support all CSS features. Use inline styles in HTML when possible."
              />
            </TabPanel>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDialogOpen(false);
                setSelectedTemplate(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Send Emails Dialog */}
        <Dialog
          open={sendDialogOpen}
          onClose={() => {
            setSendDialogOpen(false);
            setSelectedRecipients(new Set());
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Send Emails
            <IconButton
              aria-label="close"
              onClick={() => {
                setSendDialogOpen(false);
                setSelectedRecipients(new Set());
              }}
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
            <Stack spacing={2} sx={{ mt: 1 }}>
              {editingTemplate && (
                <Alert severity="info">
                  Sending: <strong>{editingTemplate.name}</strong>
                  <br />
                  Subject: {editingTemplate.subject}
                </Alert>
              )}

              <TextField
                placeholder="Search recipients..."
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {selectedRecipients.size} of {filteredRecipients.length}{" "}
                  selected
                </Typography>
                <Button size="small" onClick={handleSelectAll}>
                  {selectedRecipients.size === filteredRecipients.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </Box>

              <Paper
                variant="outlined"
                sx={{ maxHeight: 400, overflow: "auto" }}
              >
                <List dense>
                  {recipientsLoading ? (
                    <ListItem>
                      <CircularProgress size={24} />
                    </ListItem>
                  ) : filteredRecipients.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No recipients found"
                        secondary={
                          searchQuery
                            ? "Try a different search query"
                            : "No recipients available"
                        }
                      />
                    </ListItem>
                  ) : (
                    filteredRecipients.map((recipient) => (
                      <ListItem key={recipient.email} disablePadding>
                        <ListItemButton
                          onClick={() => handleToggleRecipient(recipient.email)}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={selectedRecipients.has(recipient.email)}
                              tabIndex={-1}
                              disableRipple
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={recipient.name}
                            secondary={recipient.email}
                          />
                          <Chip
                            label={recipient.source}
                            size="small"
                            color={
                              recipient.source === "intake"
                                ? "primary"
                                : recipient.source === "customLink"
                                ? "secondary"
                                : "default"
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setSendDialogOpen(false);
                setSelectedRecipients(new Set());
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleConfirmSend}
              disabled={selectedRecipients.size === 0 || sendMutation.isPending}
            >
              {sendMutation.isPending
                ? "Sending..."
                : `Send to ${selectedRecipients.size} recipient${
                    selectedRecipients.size !== 1 ? "s" : ""
                  }`}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </ClientOnly>
  );
};

export default EmailTemplatesAdmin;
