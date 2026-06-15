"use client";

import { useState } from "react";
import { format } from "date-fns";
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
  LoadingState,
  Textarea,
} from "@/components/ui";
import { api } from "$/trpc/client";

type ProposalSharedViewProps = {
  token: string;
};

function statusTone(status: string): "default" | "success" | "warning" | "destructive" {
  if (status === "accepted") return "success";
  if (status === "declined" || status === "expired") return "destructive";
  if (status === "sent") return "warning";
  return "default";
}

export function ProposalSharedView({ token }: ProposalSharedViewProps) {
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [notice, setNotice] = useState<{
    tone: "success" | "destructive";
    message: string;
  } | null>(null);

  const {
    data: proposal,
    isLoading,
    error,
    refetch,
  } = api.proposals.getByShareToken.useQuery(
    { token },
    { enabled: Boolean(token), retry: false }
  );

  const acceptMutation = api.proposals.acceptProposal.useMutation({
    onSuccess: async () => {
      setAcceptOpen(false);
      setNotice({ tone: "success", message: "Proposal accepted." });
      await refetch();
    },
    onError: (mutationError) => {
      setNotice({
        tone: "destructive",
        message: mutationError.message || "Failed to accept proposal.",
      });
    },
  });

  const declineMutation = api.proposals.declineProposal.useMutation({
    onSuccess: async () => {
      setDeclineOpen(false);
      setDeclineReason("");
      setNotice({ tone: "success", message: "Proposal declined." });
      await refetch();
    },
    onError: (mutationError) => {
      setNotice({
        tone: "destructive",
        message: mutationError.message || "Failed to decline proposal.",
      });
    },
  });

  if (isLoading) {
    return <LoadingState>Loading proposal</LoadingState>;
  }

  if (error || !proposal) {
    return (
      <EmptyState>
        {error?.message || "Proposal not found or link is invalid."}
      </EmptyState>
    );
  }

  const canInteract = proposal.status === "sent";

  return (
    <div className="mx-auto grid max-w-4xl gap-5">
      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>{proposal.title}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Client: {proposal.clientName}
              </p>
            </div>
            <Badge tone={statusTone(proposal.status)}>{proposal.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <p>Currency: {proposal.currency}</p>
            <p>Price display: {proposal.priceDisplayMode}</p>
            {proposal.validUntil ? (
              <p>Valid until: {format(new Date(proposal.validUntil), "PPpp")}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proposal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Proposal content sections are available in the original shared
            proposal payload. Pricing totals are shown when they are included in
            the shared proposal.
          </p>
        </CardContent>
      </Card>

      {proposal.status === "accepted" ? (
        <Alert tone="success">This proposal has been accepted.</Alert>
      ) : null}
      {proposal.status === "declined" ? (
        <Alert>This proposal has been declined.</Alert>
      ) : null}
      {proposal.status === "expired" ? (
        <Alert tone="warning">This proposal has expired.</Alert>
      ) : null}

      <div className="flex flex-wrap justify-center gap-3">
        <Button disabled={!canInteract} onClick={() => setAcceptOpen(true)}>
          Accept Proposal
        </Button>
        <Button
          variant="destructive"
          disabled={!canInteract}
          onClick={() => setDeclineOpen(true)}
        >
          Decline Proposal
        </Button>
      </div>

      <Dialog open={acceptOpen} onOpenChange={setAcceptOpen}>
        <DialogHeader>
          <DialogTitle>Accept Proposal</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Accepting creates a proposal snapshot and marks the proposal as
          accepted.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setAcceptOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={acceptMutation.isPending}
            onClick={() => acceptMutation.mutate({ token })}
          >
            {acceptMutation.isPending ? "Accepting" : "Accept"}
          </Button>
        </div>
      </Dialog>

      <Dialog open={declineOpen} onOpenChange={setDeclineOpen}>
        <DialogHeader>
          <DialogTitle>Decline Proposal</DialogTitle>
        </DialogHeader>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-foreground">
            Reason for declining
          </span>
          <Textarea
            value={declineReason}
            onChange={(event) => setDeclineReason(event.target.value)}
            className="min-h-28"
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setDeclineOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={declineMutation.isPending}
            onClick={() =>
              declineMutation.mutate({
                token,
                reason: declineReason || undefined,
              })
            }
          >
            {declineMutation.isPending ? "Declining" : "Decline"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
