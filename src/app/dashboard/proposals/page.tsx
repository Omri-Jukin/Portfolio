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
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Input,
  LoadingState,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type Proposal = RouterOutputs["proposals"]["list"][number];
type ProposalStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
type StatusFilter = "all" | ProposalStatus;

type Notice = {
  tone: "success" | "destructive" | "warning";
  message: string;
} | null;

const statuses: StatusFilter[] = [
  "all",
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
];

function statusTone(status: string) {
  if (status === "accepted") return "success";
  if (status === "declined") return "destructive";
  if (status === "expired") return "warning";
  if (status === "sent") return "accent";
  return "default";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

export default function ProposalsListPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(
    null
  );
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: proposals = [],
    isLoading,
    error,
    refetch,
  } = api.proposals.list.useQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery.trim() || undefined,
  });

  const deleteMutation = api.proposals.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setProposalToDelete(null);
      setNotice({ tone: "success", message: "Proposal deleted." });
    },
    onError: (mutationError) =>
      setNotice({ tone: "destructive", message: mutationError.message }),
  });

  const duplicateMutation = api.proposals.duplicate.useMutation({
    onSuccess: async (proposal) => {
      await refetch();
      setNotice({ tone: "success", message: "Proposal duplicated." });
      router.push(`/dashboard/proposals/${proposal.id}`);
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

  const acceptedCount = useMemo(
    () => proposals.filter((proposal) => proposal.status === "accepted").length,
    [proposals]
  );

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setNotice({ tone: "success", message: "Share link copied." });
    } catch {
      setNotice({ tone: "destructive", message: "Could not copy share link." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Proposal management
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Proposals
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create, share, and manage private client proposals.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/proposals/new")}>
          Create Proposal
        </Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Total
            </p>
            <CardTitle>{proposals.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Accepted
            </p>
            <CardTitle>{acceptedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Filter
            </p>
            <CardTitle className="capitalize">{statusFilter}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <Input
          placeholder="Search proposals"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "all" ? "All statuses" : status}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? <LoadingState>Loading proposals</LoadingState> : null}

      {!isLoading && proposals.length === 0 ? (
        <EmptyState>No proposals found.</EmptyState>
      ) : null}

      {!isLoading && proposals.length > 0 ? (
        <Card>
          <CardContent className="pt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">
                      {proposal.title}
                    </TableCell>
                    <TableCell>{proposal.clientName}</TableCell>
                    <TableCell>
                      <Badge tone={statusTone(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{proposal.currency}</TableCell>
                    <TableCell>{formatDate(proposal.createdAt)}</TableCell>
                    <TableCell>{formatDate(proposal.validUntil)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/proposals/${proposal.id}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() =>
                            generateShareTokenMutation.mutate({
                              id: proposal.id,
                            })
                          }
                        >
                          Share
                        </Button>
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() =>
                            sendMutation.mutate({ id: proposal.id })
                          }
                        >
                          Send
                        </Button>
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() =>
                            duplicateMutation.mutate({ id: proposal.id })
                          }
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() => setProposalToDelete(proposal)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

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
        open={proposalToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setProposalToDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Proposal</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete{" "}
          <span className="font-medium text-foreground">
            {proposalToDelete?.title}
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setProposalToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (proposalToDelete) {
                deleteMutation.mutate({ id: proposalToDelete.id });
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
