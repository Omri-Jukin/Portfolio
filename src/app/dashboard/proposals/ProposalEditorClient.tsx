"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  Input,
  Label,
  LoadingState,
  Select,
  TabButton,
  TabsList,
} from "@/components/ui";
import { api } from "$/trpc/client";

type ProposalStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
type PriceDisplayMode = "fixed" | "hourly" | "both";
type EditorTab = "details" | "content" | "charges" | "totals";

type ProposalFormData = {
  title: string;
  clientName: string;
  clientEmail: string;
  status: ProposalStatus;
  currency: string;
  priceDisplayMode: PriceDisplayMode;
  validUntil: string;
};

type Notice = {
  tone: "success" | "destructive" | "warning";
  message: string;
} | null;

const defaultFormData: ProposalFormData = {
  title: "",
  clientName: "",
  clientEmail: "",
  status: "draft",
  currency: "USD",
  priceDisplayMode: "fixed",
  validUntil: "",
};

function toDateInput(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function statusTone(status: string) {
  if (status === "accepted") return "success";
  if (status === "declined") return "destructive";
  if (status === "expired") return "warning";
  if (status === "sent") return "accent";
  return "default";
}

export function ProposalEditorClient({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const isNew = proposalId === "new";
  const [formData, setFormData] = useState<ProposalFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState<EditorTab>("details");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: proposal,
    isLoading,
    error,
    refetch,
  } = api.proposals.getById.useQuery(
    { id: proposalId },
    { enabled: !isNew && Boolean(proposalId) }
  );

  useEffect(() => {
    if (!proposal) return;
    setFormData({
      title: proposal.title,
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      status: proposal.status,
      currency: proposal.currency,
      priceDisplayMode: proposal.priceDisplayMode,
      validUntil: toDateInput(proposal.validUntil),
    });
  }, [proposal]);

  const createMutation = api.proposals.create.useMutation({
    onSuccess: (created) => {
      setNotice({ tone: "success", message: "Proposal created." });
      router.push(`/dashboard/proposals/${created.id}`);
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const updateMutation = api.proposals.update.useMutation({
    onSuccess: async () => {
      await refetch();
      setNotice({ tone: "success", message: "Proposal saved." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const deleteMutation = api.proposals.delete.useMutation({
    onSuccess: () => {
      router.push("/dashboard/proposals");
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const sendMutation = api.proposals.sendProposal.useMutation({
    onSuccess: async () => {
      await refetch();
      setNotice({ tone: "success", message: "Proposal marked as sent." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const generateShareTokenMutation =
    api.proposals.generateShareToken.useMutation({
      onSuccess: (data) => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        setShareUrl(`${origin}/services/p/${data.token}`);
      },
      onError: (mutationError) =>
        setNotice({ tone: "destructive", message: mutationError.message }),
    });

  const handleSave = () => {
    if (
      !formData.title.trim() ||
      !formData.clientName.trim() ||
      !formData.clientEmail.trim()
    ) {
      setNotice({
        tone: "destructive",
        message: "Title, client name, and client email are required.",
      });
      return;
    }

    const payload = {
      title: formData.title.trim(),
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      status: formData.status,
      currency: formData.currency.trim() || "USD",
      priceDisplayMode: formData.priceDisplayMode,
      validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
    };

    if (isNew) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ id: proposalId, ...payload });
    }
  };

  const handleExportPDF = async () => {
    if (!proposal?.intake) {
      setNotice({ tone: "warning", message: "No intake data available." });
      return;
    }

    try {
      const { generateIntakePDF } = await import(
        "#/lib/utils/intakePdfGenerator"
      );
      const pdf = await generateIntakePDF({
        id: proposal.intake.id,
        email: proposal.intake.email,
        data: proposal.intake.data as Record<string, unknown>,
        proposalMd: proposal.intake.proposalMd,
        status: proposal.intake.status,
        flagged: proposal.intake.flagged,
        estimatedValue: proposal.intake.estimatedValue,
        riskLevel: proposal.intake.riskLevel,
        createdAt: proposal.intake.createdAt,
        updatedAt: proposal.intake.updatedAt,
      });
      const clientName = proposal.clientName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      pdf.save(`intake_${clientName}_${new Date().toISOString().slice(0, 10)}.pdf`);
      setNotice({ tone: "success", message: "PDF exported." });
    } catch (pdfError) {
      setNotice({
        tone: "destructive",
        message:
          pdfError instanceof Error ? pdfError.message : "Failed to export PDF.",
      });
    }
  };

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setNotice({ tone: "success", message: "Share link copied." });
    } catch {
      setNotice({ tone: "destructive", message: "Could not copy share link." });
    }
  };

  if (!isNew && isLoading) {
    return <LoadingState>Loading proposal</LoadingState>;
  }

  if (error) return <Alert tone="destructive">{error.message}</Alert>;

  if (!isNew && !proposal) return <EmptyState>Proposal not found.</EmptyState>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Proposal editor
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            {isNew ? "Create Proposal" : "Edit Proposal"}
          </h1>
          {proposal ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={statusTone(proposal.status)}>{proposal.status}</Badge>
              <Badge>{proposal.currency}</Badge>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/proposals")}>
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => !isNew && generateShareTokenMutation.mutate({ id: proposalId })}
            disabled={isNew}
          >
            Share
          </Button>
          <Button
            variant="outline"
            onClick={() => !isNew && sendMutation.mutate({ id: proposalId })}
            disabled={isNew || sendMutation.isPending}
          >
            Send
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={isNew}>
            Export Intake PDF
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={isNew}
          >
            Delete
          </Button>
        </div>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}

      {proposal?.intake ? (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = `mailto:${proposal.clientEmail}?subject=Re: ${encodeURIComponent(
                    proposal.title
                  )}`;
                }}
              >
                Reply to Client
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = `mailto:${proposal.clientEmail}?subject=Let's Schedule a Call&body=Hi ${proposal.clientName},`;
                }}
              >
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <TabsList>
            <TabButton
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            >
              Details
            </TabButton>
            <TabButton
              active={activeTab === "content"}
              onClick={() => setActiveTab("content")}
            >
              Content
            </TabButton>
            <TabButton
              active={activeTab === "charges"}
              onClick={() => setActiveTab("charges")}
            >
              Charges
            </TabButton>
            <TabButton
              active={activeTab === "totals"}
              onClick={() => setActiveTab("totals")}
            >
              Totals
            </TabButton>
          </TabsList>
        </CardHeader>
        <CardContent>
          {activeTab === "details" ? (
            <div className="space-y-4">
              <FormField>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({ ...formData, title: event.target.value })
                  }
                />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        clientName: event.target.value,
                      })
                    }
                  />
                </FormField>
                <FormField>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        clientEmail: event.target.value,
                      })
                    }
                  />
                </FormField>
                <FormField>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        status: event.target.value as ProposalStatus,
                      })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                    <option value="expired">Expired</option>
                  </Select>
                </FormField>
                <FormField>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(event) =>
                      setFormData({ ...formData, currency: event.target.value })
                    }
                  />
                </FormField>
                <FormField>
                  <Label htmlFor="priceDisplayMode">Price Display Mode</Label>
                  <Select
                    id="priceDisplayMode"
                    value={formData.priceDisplayMode}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        priceDisplayMode: event.target.value as PriceDisplayMode,
                      })
                    }
                  >
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                    <option value="both">Both</option>
                  </Select>
                </FormField>
                <FormField>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        validUntil: event.target.value,
                      })
                    }
                  />
                </FormField>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : isNew
                    ? "Create Proposal"
                    : "Save Draft"}
                </Button>
              </div>
            </div>
          ) : null}

          {activeTab !== "details" ? (
            <Alert>
              {activeTab === "content"
                ? "Structured proposal section editing is not connected in this admin view."
                : activeTab === "charges"
                ? "Dedicated charge-line editing is not connected in this admin view."
                : "Dedicated totals breakdown editing is not connected in this admin view."}
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Dialog
        open={shareUrl !== null}
        onOpenChange={(open) => {
          if (!open) setShareUrl(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Share Proposal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={shareUrl ?? ""} readOnly />
          <div className="flex justify-end gap-2">
            <Button variant="quiet" onClick={() => setShareUrl(null)}>
              Close
            </Button>
            <Button onClick={copyShareUrl}>Copy Link</Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteOpen(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Proposal</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete this proposal? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate({ id: proposalId })}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
