"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  Input,
  Label,
  LoadingState,
  TabButton,
  TabsList,
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type EmailTemplate = RouterOutputs["emailTemplates"]["getAll"][number];
type EditorTab = "content" | "html" | "css";

type TemplateFormData = {
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  cssStyles: string;
};

type Notice = {
  tone: "success" | "destructive" | "warning";
  message: string;
} | null;

const defaultTemplateForm: TemplateFormData = {
  name: "",
  subject: "",
  htmlContent: "",
  textContent: "",
  cssStyles: "",
};

function toForm(template: EmailTemplate): TemplateFormData {
  return {
    name: template.name,
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent ?? "",
    cssStyles: template.cssStyles ?? "",
  };
}

function formatDate(value: string | number | Date | null | undefined) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

export default function EmailTemplatesAdminPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [editorTab, setEditorTab] = useState<EditorTab>("content");
  const [templateForm, setTemplateForm] =
    useState<TemplateFormData>(defaultTemplateForm);
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    data: templates = [],
    isLoading,
    error,
    refetch,
  } = api.emailTemplates.getAll.useQuery();

  const { data: recipients = [], isLoading: recipientsLoading } =
    api.emailTemplates.getRecipients.useQuery(undefined, {
      enabled: sendDialogOpen,
    });

  const createMutation = api.emailTemplates.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeEditor();
      setNotice({ tone: "success", message: "Email template created." });
    },
    onError: (mutationError) => setFormError(mutationError.message),
  });

  const updateMutation = api.emailTemplates.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeEditor();
      setNotice({ tone: "success", message: "Email template updated." });
    },
    onError: (mutationError) => setFormError(mutationError.message),
  });

  const deleteMutation = api.emailTemplates.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setDeleteTemplate(null);
      setNotice({ tone: "success", message: "Email template deleted." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const sendMutation = api.emailTemplates.sendEmails.useMutation({
    onSuccess: (result) => {
      setSendDialogOpen(false);
      setSelectedRecipients(new Set());
      setNotice({
        tone: result.failureCount > 0 ? "warning" : "success",
        message: `Emails sent: ${result.successCount} succeeded, ${result.failureCount} failed.`,
      });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const filteredRecipients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return recipients;
    return recipients.filter(
      (recipient) =>
        recipient.email.toLowerCase().includes(query) ||
        recipient.name.toLowerCase().includes(query)
    );
  }, [recipients, searchQuery]);

  const closeEditor = () => {
    setEditorOpen(false);
    setSelectedTemplate(null);
    setTemplateForm(defaultTemplateForm);
    setEditorTab("content");
    setFormError(null);
  };

  const openEditor = (template?: EmailTemplate) => {
    setNotice(null);
    setFormError(null);
    setSelectedTemplate(template ?? null);
    setTemplateForm(template ? toForm(template) : defaultTemplateForm);
    setEditorTab("content");
    setEditorOpen(true);
  };

  const openSendDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSelectedRecipients(new Set());
    setSearchQuery("");
    setSendDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    setFormError(null);
    if (
      !templateForm.name.trim() ||
      !templateForm.subject.trim() ||
      !templateForm.htmlContent.trim()
    ) {
      setFormError("Name, subject, and HTML content are required.");
      return;
    }

    const payload = {
      name: templateForm.name.trim(),
      subject: templateForm.subject.trim(),
      htmlContent: templateForm.htmlContent,
      textContent: templateForm.textContent || undefined,
      cssStyles: templateForm.cssStyles || undefined,
    };

    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleRecipient = (email: string) => {
    setSelectedRecipients((current) => {
      const next = new Set(current);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const toggleAllFilteredRecipients = () => {
    if (selectedRecipients.size === filteredRecipients.length) {
      setSelectedRecipients(new Set());
      return;
    }
    setSelectedRecipients(
      new Set(filteredRecipients.map((recipient) => recipient.email))
    );
  };

  const handleSendEmails = () => {
    if (!selectedTemplate || selectedRecipients.size === 0) return;
    sendMutation.mutate({
      templateId: selectedTemplate.id,
      recipientEmails: Array.from(selectedRecipients),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Freelance tooling
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Email Templates
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage reusable outreach templates and send them to selected intake,
            custom-link, or user recipients.
          </p>
        </div>
        <Button onClick={() => openEditor()}>New Template</Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      {isLoading ? <LoadingState>Loading email templates</LoadingState> : null}

      {!isLoading && templates.length === 0 ? (
        <EmptyState>No email templates yet. Create the first template.</EmptyState>
      ) : null}

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Subject: {template.subject}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>Updated {formatDate(template.updatedAt)}</Badge>
                    {template.textContent ? <Badge>Text</Badge> : null}
                    {template.cssStyles ? <Badge>CSS</Badge> : null}
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openSendDialog(template)}
                  >
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditor(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => setDeleteTemplate(template)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {template.textContent ||
                  template.htmlContent.replace(/<[^>]+>/g, " ").slice(0, 280)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
        className="max-w-5xl"
      >
        <DialogHeader>
          <DialogTitle>
            {selectedTemplate ? "Edit Template" : "New Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {formError ? <Alert tone="destructive">{formError}</Alert> : null}

          <TabsList>
            <TabButton
              active={editorTab === "content"}
              onClick={() => setEditorTab("content")}
            >
              Content
            </TabButton>
            <TabButton
              active={editorTab === "html"}
              onClick={() => setEditorTab("html")}
            >
              HTML
            </TabButton>
            <TabButton
              active={editorTab === "css"}
              onClick={() => setEditorTab("css")}
            >
              CSS
            </TabButton>
          </TabsList>

          {editorTab === "content" ? (
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={templateForm.name}
                  onChange={(event) =>
                    setTemplateForm({
                      ...templateForm,
                      name: event.target.value,
                    })
                  }
                />
              </FormField>
              <FormField hint="Use {{variableName}} placeholders for dynamic values.">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={templateForm.subject}
                  onChange={(event) =>
                    setTemplateForm({
                      ...templateForm,
                      subject: event.target.value,
                    })
                  }
                />
              </FormField>
              <FormField hint="Plain-text fallback for clients without HTML support.">
                <Label htmlFor="textContent">Text Content</Label>
                <Textarea
                  id="textContent"
                  className="min-h-40"
                  value={templateForm.textContent}
                  onChange={(event) =>
                    setTemplateForm({
                      ...templateForm,
                      textContent: event.target.value,
                    })
                  }
                />
              </FormField>
              <Alert>
                Dynamic placeholders use double braces, for example
                {" {{firstName}}"} or {" {{companyName}}"}.
              </Alert>
            </div>
          ) : null}

          {editorTab === "html" ? (
            <FormField hint="Full HTML email content. Use table-based layouts for broad email client compatibility.">
              <Label htmlFor="htmlContent">HTML Content</Label>
              <Textarea
                id="htmlContent"
                className="min-h-[420px] font-mono text-xs"
                value={templateForm.htmlContent}
                onChange={(event) =>
                  setTemplateForm({
                    ...templateForm,
                    htmlContent: event.target.value,
                  })
                }
              />
            </FormField>
          ) : null}

          {editorTab === "css" ? (
            <FormField hint="Many email clients ignore modern CSS. Prefer inline styles where possible.">
              <Label htmlFor="cssStyles">CSS Styles</Label>
              <Textarea
                id="cssStyles"
                className="min-h-80 font-mono text-xs"
                value={templateForm.cssStyles}
                onChange={(event) =>
                  setTemplateForm({
                    ...templateForm,
                    cssStyles: event.target.value,
                  })
                }
              />
            </FormField>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="quiet" onClick={closeEditor}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : "Save Template"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={sendDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSendDialogOpen(false);
            setSelectedRecipients(new Set());
          }
        }}
        className="max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>Send Emails</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {selectedTemplate ? (
            <Alert>
              Sending <strong>{selectedTemplate.name}</strong>
              <br />
              Subject: {selectedTemplate.subject}
            </Alert>
          ) : null}

          <Input
            placeholder="Search recipients"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase text-muted-foreground">
              {selectedRecipients.size} of {filteredRecipients.length} selected
            </p>
            <Button variant="outline" size="sm" onClick={toggleAllFilteredRecipients}>
              {selectedRecipients.size === filteredRecipients.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          <div className="max-h-96 overflow-auto rounded-lg border border-border">
            {recipientsLoading ? (
              <LoadingState className="border-0">Loading recipients</LoadingState>
            ) : filteredRecipients.length === 0 ? (
              <EmptyState className="border-0">No recipients found.</EmptyState>
            ) : (
              <div className="divide-y divide-border">
                {filteredRecipients.map((recipient) => (
                  <label
                    key={recipient.email}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedRecipients.has(recipient.email)}
                      onChange={() => toggleRecipient(recipient.email)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {recipient.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {recipient.email}
                      </span>
                    </span>
                    <Chip>{recipient.source}</Chip>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="quiet"
              onClick={() => {
                setSendDialogOpen(false);
                setSelectedRecipients(new Set());
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmails}
              disabled={selectedRecipients.size === 0 || sendMutation.isPending}
            >
              {sendMutation.isPending
                ? "Sending..."
                : `Send to ${selectedRecipients.size}`}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteTemplate !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTemplate(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Template</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete{" "}
          <span className="font-medium text-foreground">
            {deleteTemplate?.name}
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setDeleteTemplate(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (deleteTemplate) {
                deleteMutation.mutate({ id: deleteTemplate.id });
              }
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
