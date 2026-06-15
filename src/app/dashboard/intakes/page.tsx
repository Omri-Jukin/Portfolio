"use client";

import { useRouter } from "next/navigation";
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
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  Input,
  Label,
  LoadingState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type Intake = RouterOutputs["intakes"]["getAll"][number];
type CustomLink = RouterOutputs["intakes"]["getAllCustomLinks"][number];

type CustomLinkFormData = {
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  organizationWebsite: string;
  expiresInDays: number;
  hiddenSections: string[];
};

type Notice = {
  tone: "success" | "destructive" | "warning";
  message: string;
} | null;

const hiddenFieldGroups = [
  {
    key: "org",
    label: "Organization",
    fields: ["org.name", "org.website", "org.industry", "org.size"],
  },
  {
    key: "budget",
    label: "Budget",
    fields: ["budget.currency", "budget.min", "budget.max"],
  },
  {
    key: "project",
    label: "Project Details",
    fields: [
      "project.timeline",
      "project.startDate",
      "project.technologies",
      "project.requirements",
      "project.goals",
      "project.resourceLinks",
    ],
  },
  {
    key: "additional",
    label: "Additional",
    fields: [
      "additional.preferredContactMethod",
      "additional.timezone",
      "additional.urgency",
      "additional.notes",
    ],
  },
];

const defaultFormData: CustomLinkFormData = {
  email: "",
  firstName: "",
  lastName: "",
  organizationName: "",
  organizationWebsite: "",
  expiresInDays: 30,
  hiddenSections: [],
};

function formatDate(value: string | number | Date | null | undefined) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function getServicesLink(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${baseUrl}/services/intake/${slug}`;
}

function getClientName(link: CustomLink) {
  return [link.firstName, link.lastName].filter(Boolean).join(" ") || "N/A";
}

export default function AdminIntakesPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomLinkFormData>(defaultFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [confirmDeleteLinks, setConfirmDeleteLinks] = useState(false);
  const [intakeToDelete, setIntakeToDelete] = useState<Intake | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: intakes = [],
    isLoading: intakesLoading,
    error: intakesError,
    refetch: refetchIntakes,
  } = api.intakes.getAll.useQuery();

  const {
    data: customLinks = [],
    isLoading: customLinksLoading,
    error: customLinksError,
    refetch: refetchCustomLinks,
  } = api.intakes.getAllCustomLinks.useQuery();

  const generateLinkMutation = api.intakes.generateCustomLink.useMutation({
    onError: (error) => setFormError(error.message),
  });

  const deleteCustomLinkMutation = api.intakes.deleteCustomLink.useMutation();
  const deleteCustomLinksMutation = api.intakes.deleteCustomLinks.useMutation();

  const deleteIntakeMutation = api.intakes.delete.useMutation({
    onSuccess: async () => {
      await refetchIntakes();
      setIntakeToDelete(null);
      setNotice({ tone: "success", message: "Intake deleted." });
    },
    onError: (error) =>
      setNotice({ tone: "destructive", message: error.message }),
  });

  const isLoading = intakesLoading || customLinksLoading;
  const error = intakesError || customLinksError;
  const activeCustomLinks = useMemo(
    () => customLinks.filter((link) => !link.isExpired).length,
    [customLinks]
  );

  const resetDialog = () => {
    setDialogOpen(false);
    setGeneratedLink(null);
    setFormData(defaultFormData);
    setFormError(null);
  };

  const toggleHiddenGroup = (fields: string[]) => {
    const allSelected = fields.every((field) =>
      formData.hiddenSections.includes(field)
    );
    setFormData({
      ...formData,
      hiddenSections: allSelected
        ? formData.hiddenSections.filter((field) => !fields.includes(field))
        : Array.from(new Set([...formData.hiddenSections, ...fields])),
    });
  };

  const handleGenerateLink = async () => {
    setFormError(null);
    const email = formData.email.trim();
    if (!email) {
      setFormError("Client email is required.");
      return;
    }

    const result = await generateLinkMutation.mutateAsync({
      email,
      firstName: formData.firstName.trim() || undefined,
      lastName: formData.lastName.trim() || undefined,
      organizationName: formData.organizationName.trim() || undefined,
      organizationWebsite: formData.organizationWebsite.trim() || undefined,
      expiresInDays: formData.expiresInDays,
      locale: "en",
      hiddenSections:
        formData.hiddenSections.length > 0
          ? formData.hiddenSections
          : undefined,
    });

    setGeneratedLink(result.link);
    setNotice({
      tone: result.emailSent ? "success" : "warning",
      message: result.emailSent
        ? "Custom link generated and email sent."
        : `Custom link generated, but email delivery failed${
            result.emailError ? `: ${result.emailError}` : "."
          }`,
    });
    await refetchCustomLinks();

    try {
      await navigator.clipboard.writeText(result.link);
    } catch {
      // The generated link remains visible when clipboard access is blocked.
    }
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice({ tone: "success", message: `${label} copied.` });
    } catch {
      setNotice({ tone: "destructive", message: `Could not copy ${label}.` });
    }
  };

  const handleSelectAllLinks = (checked: boolean) => {
    setSelectedLinks(checked ? customLinks.map((link) => link.id) : []);
  };

  const handleDeleteSelectedLinks = async () => {
    if (selectedLinks.length === 0) return;

    try {
      if (selectedLinks.length === 1) {
        await deleteCustomLinkMutation.mutateAsync({ id: selectedLinks[0] });
      } else {
        await deleteCustomLinksMutation.mutateAsync({ ids: selectedLinks });
      }
      await refetchCustomLinks();
      setNotice({
        tone: "success",
        message: `${selectedLinks.length} custom link${
          selectedLinks.length === 1 ? "" : "s"
        } deleted.`,
      });
      setSelectedLinks([]);
      setConfirmDeleteLinks(false);
    } catch (deleteError) {
      setNotice({
        tone: "destructive",
        message:
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete custom links.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Freelance tooling
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Project Intakes
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Generate private intake links and review submitted client intake
            forms.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Generate Custom Link</Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Submitted
            </p>
            <CardTitle>{intakes.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Custom Links
            </p>
            <CardTitle>{customLinks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Active Links
            </p>
            <CardTitle>{activeCustomLinks}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {isLoading ? <LoadingState>Loading intakes</LoadingState> : null}

      {!isLoading ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Custom Links</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Direct client links now use the hidden `/services/intake`
                  path.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                disabled={selectedLinks.length === 0}
                onClick={() => setConfirmDeleteLinks(true)}
              >
                Delete Selected
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {customLinks.length === 0 ? (
              <EmptyState>No custom links found.</EmptyState>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={
                          selectedLinks.length === customLinks.length &&
                          customLinks.length > 0
                        }
                        onChange={(event) =>
                          handleSelectAllLinks(event.target.checked)
                        }
                        aria-label="Select all custom links"
                      />
                    </TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customLinks.map((link) => {
                    const fullLink = getServicesLink(link.slug);
                    return (
                      <TableRow key={link.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLinks.includes(link.id)}
                            onChange={() =>
                              setSelectedLinks((current) =>
                                current.includes(link.id)
                                  ? current.filter((id) => id !== link.id)
                                  : [...current, link.id]
                              )
                            }
                            aria-label={`Select ${link.slug}`}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <button
                            type="button"
                            className="underline-offset-4 hover:underline"
                            onClick={() => copyText(fullLink, "Custom link")}
                          >
                            {link.slug}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">
                            {getClientName(link)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {link.email}
                          </div>
                        </TableCell>
                        <TableCell>{link.organizationName ?? "N/A"}</TableCell>
                        <TableCell>
                          <Badge tone={link.isExpired ? "destructive" : "success"}>
                            {link.isExpired ? "Expired" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDate(link.expiresAt)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDate(link.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  fullLink,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                            >
                              Open
                            </Button>
                            <Button
                              variant="quiet"
                              size="sm"
                              onClick={() => copyText(fullLink, "Custom link")}
                            >
                              Copy
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : null}

      {!isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Submitted Forms</CardTitle>
          </CardHeader>
          <CardContent>
            {intakes.length === 0 ? (
              <EmptyState>No submitted intakes found.</EmptyState>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name / Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {intakes.map((intake) => (
                    <TableRow key={intake.id}>
                      <TableCell>{intake.email}</TableCell>
                      <TableCell>{intake.name}</TableCell>
                      <TableCell>
                        <Badge>{intake.status}</Badge>
                      </TableCell>
                      <TableCell>{intake.urgency ?? "N/A"}</TableCell>
                      <TableCell className="text-xs">
                        {formatDate(intake.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/intakes/${intake.id}`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            variant="quiet"
                            size="sm"
                            onClick={() => setIntakeToDelete(intake)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) resetDialog();
        }}
        className="max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>Generate Custom Intake Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {formError ? <Alert tone="destructive">{formError}</Alert> : null}
          {generatedLink ? (
            <Alert tone="success">
              <div className="space-y-2">
                <p>Generated link:</p>
                <button
                  type="button"
                  className="break-all font-mono text-xs underline-offset-4 hover:underline"
                  onClick={() => copyText(generatedLink, "Generated link")}
                >
                  {generatedLink}
                </button>
              </div>
            </Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
            </FormField>
            <FormField hint="1 to 90 days.">
              <Label htmlFor="expiresInDays">Expires In Days</Label>
              <Input
                id="expiresInDays"
                type="number"
                min={1}
                max={90}
                value={formData.expiresInDays}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    expiresInDays: Number.parseInt(event.target.value, 10) || 30,
                  })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(event) =>
                  setFormData({ ...formData, firstName: event.target.value })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(event) =>
                  setFormData({ ...formData, lastName: event.target.value })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    organizationName: event.target.value,
                  })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="organizationWebsite">Organization Website</Label>
              <Input
                id="organizationWebsite"
                type="url"
                value={formData.organizationWebsite}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    organizationWebsite: event.target.value,
                  })
                }
              />
            </FormField>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="font-medium text-foreground">Hidden sections</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {hiddenFieldGroups.map((group) => {
                const checked = group.fields.every((field) =>
                  formData.hiddenSections.includes(field)
                );
                return (
                  <label
                    key={group.key}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleHiddenGroup(group.fields)}
                    />
                    {group.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="quiet" onClick={resetDialog}>
              Close
            </Button>
            <Button
              onClick={handleGenerateLink}
              disabled={generateLinkMutation.isPending}
            >
              {generateLinkMutation.isPending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={confirmDeleteLinks}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteLinks(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Custom Links</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete {selectedLinks.length} selected custom link
          {selectedLinks.length === 1 ? "" : "s"}? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setConfirmDeleteLinks(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={
              deleteCustomLinkMutation.isPending ||
              deleteCustomLinksMutation.isPending
            }
            onClick={handleDeleteSelectedLinks}
          >
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={intakeToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setIntakeToDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Intake</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete the intake from{" "}
          <span className="font-medium text-foreground">
            {intakeToDelete?.email}
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setIntakeToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteIntakeMutation.isPending}
            onClick={() => {
              if (intakeToDelete) {
                deleteIntakeMutation.mutate({ id: intakeToDelete.id });
              }
            }}
          >
            {deleteIntakeMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
