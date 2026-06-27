"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
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

type Inquiry = RouterOutputs["contact"]["getAll"][number];
type InquiryStatusFilter = "all" | "open" | "closed";

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

function formatDate(value: string | number | Date | null | undefined) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

function statusTone(status: Inquiry["status"]) {
  return status === "open" ? "accent" : "default";
}

function replyHref(inquiry: Inquiry) {
  const subject = encodeURIComponent(`Re: ${inquiry.subject}`);
  const body = encodeURIComponent(`Hi ${inquiry.name},\n\n`);
  return `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
}

export default function ContactInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState<InquiryStatusFilter>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const queryInput =
    statusFilter === "all" ? undefined : { status: statusFilter };

  const {
    data: inquiries = [],
    isLoading,
    error,
    refetch,
  } = api.contact.getAll.useQuery(queryInput);

  const updateStatusMutation = api.contact.updateStatus.useMutation({
    onSuccess: async (updatedInquiry) => {
      await refetch();
      setSelectedInquiry((current) =>
        current?.id === updatedInquiry.id ? updatedInquiry : current
      );
      setNotice({ tone: "success", message: "Inquiry status updated." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const deleteMutation = api.contact.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setSelectedInquiry(null);
      setNotice({ tone: "success", message: "Inquiry deleted." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const counts = useMemo(
    () => ({
      total: inquiries.length,
      open: inquiries.filter((inquiry) => inquiry.status === "open").length,
      closed: inquiries.filter((inquiry) => inquiry.status === "closed").length,
    }),
    [inquiries]
  );

  if (isLoading) {
    return <LoadingState>Loading contact inquiries</LoadingState>;
  }

  if (error) {
    return (
      <Alert tone="destructive">
        Contact inquiries could not load: {error.message}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Inquiries</CardTitle>
          <CardDescription>
            Review messages submitted through the public contact form.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Status</span>
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as InquiryStatusFilter)
              }
            >
              <option value="all">All inquiries</option>
              <option value="open">Open only</option>
              <option value="closed">Closed only</option>
            </Select>
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <Badge tone="accent">Total {counts.total}</Badge>
            <Badge tone="warning">Open {counts.open}</Badge>
            <Badge>Closed {counts.closed}</Badge>
          </div>
        </CardContent>
      </Card>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}

      {inquiries.length === 0 ? (
        <EmptyState>No contact inquiries found.</EmptyState>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>
                Newest inquiries appear first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="min-w-48">
                          <p className="font-medium">{inquiry.name}</p>
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-sm text-accent hover:underline"
                          >
                            {inquiry.email}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-72">
                        <p className="truncate font-medium">
                          {inquiry.subject}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge tone={statusTone(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="quiet"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: inquiry.id,
                                status:
                                  inquiry.status === "open"
                                    ? "closed"
                                    : "open",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            {inquiry.status === "open" ? "Close" : "Reopen"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedInquiry ? selectedInquiry.subject : "Inquiry detail"}
              </CardTitle>
              <CardDescription>
                {selectedInquiry
                  ? `${selectedInquiry.name} - ${formatDate(
                      selectedInquiry.createdAt
                    )}`
                  : "Select an inquiry to read the full message."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedInquiry ? (
                <div className="space-y-4">
                  <div className="grid gap-2 text-sm">
                    <div>
                      <span className="font-medium">From: </span>
                      {selectedInquiry.name}
                    </div>
                    <div>
                      <span className="font-medium">Email: </span>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-accent hover:underline"
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      <Badge tone={statusTone(selectedInquiry.status)}>
                        {selectedInquiry.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-4 text-sm leading-7">
                    {selectedInquiry.message}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        window.location.href = replyHref(selectedInquiry);
                      }}
                    >
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: selectedInquiry.id,
                          status:
                            selectedInquiry.status === "open"
                              ? "closed"
                              : "open",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                    >
                      {selectedInquiry.status === "open" ? "Close" : "Reopen"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this contact inquiry permanently?"
                          )
                        ) {
                          deleteMutation.mutate({ id: selectedInquiry.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState>Select an inquiry from the table.</EmptyState>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
