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
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  Input,
  Label,
  LoadingState,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type Discount = RouterOutputs["discounts"]["getAll"][number];
type DiscountType = "percent" | "fixed";

type DiscountFormData = {
  code: string;
  description: string;
  discountType: DiscountType;
  amount: number;
  currency: string;
  projectTypes: string;
  features: string;
  clientTypes: string;
  excludeClientTypes: string;
  startsAt: string;
  endsAt: string;
  maxUses: string;
  perUserLimit: number;
  isActive: boolean;
};

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

const defaultFormData: DiscountFormData = {
  code: "",
  description: "",
  discountType: "percent",
  amount: 0,
  currency: "ILS",
  projectTypes: "",
  features: "",
  clientTypes: "",
  excludeClientTypes: "",
  startsAt: "",
  endsAt: "",
  maxUses: "",
  perUserLimit: 1,
  isActive: true,
};

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinCsv(value?: string[]) {
  return value?.join(", ") ?? "";
}

function formatScope(appliesTo: Discount["appliesTo"]) {
  const parts: string[] = [];
  if (appliesTo.projectTypes?.length) {
    parts.push(`Projects: ${appliesTo.projectTypes.join(", ")}`);
  }
  if (appliesTo.features?.length) {
    parts.push(`Features: ${appliesTo.features.join(", ")}`);
  }
  if (appliesTo.clientTypes?.length) {
    parts.push(`Clients: ${appliesTo.clientTypes.join(", ")}`);
  }
  if (appliesTo.excludeClientTypes?.length) {
    parts.push(`Exclude: ${appliesTo.excludeClientTypes.join(", ")}`);
  }
  return parts.length > 0 ? parts.join(" | ") : "All";
}

function formatDateRange(startsAt: string | null, endsAt: string | null) {
  if (!startsAt && !endsAt) return "No limit";
  if (startsAt && endsAt) {
    return `${new Date(startsAt).toLocaleDateString()} - ${new Date(
      endsAt
    ).toLocaleDateString()}`;
  }
  if (startsAt) return `From ${new Date(startsAt).toLocaleDateString()}`;
  return `Until ${new Date(endsAt as string).toLocaleDateString()}`;
}

function toDateTimeInput(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

function toFormData(discount: Discount): DiscountFormData {
  return {
    code: discount.code,
    description: discount.description ?? "",
    discountType: discount.discountType as DiscountType,
    amount: discount.amount,
    currency: discount.currency,
    projectTypes: joinCsv(discount.appliesTo.projectTypes),
    features: joinCsv(discount.appliesTo.features),
    clientTypes: joinCsv(discount.appliesTo.clientTypes),
    excludeClientTypes: joinCsv(discount.appliesTo.excludeClientTypes),
    startsAt: toDateTimeInput(discount.startsAt),
    endsAt: toDateTimeInput(discount.endsAt),
    maxUses: discount.maxUses?.toString() ?? "",
    perUserLimit: discount.perUserLimit,
    isActive: discount.isActive,
  };
}

export default function DiscountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(
    null
  );
  const [formData, setFormData] =
    useState<DiscountFormData>(defaultFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice>(null);

  const {
    data: discounts = [],
    isLoading,
    error,
    refetch,
  } = api.discounts.getAll.useQuery({ includeInactive: true });

  const createMutation = api.discounts.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Discount created." });
    },
    onError: (mutationError) => {
      setFormErrors({ submit: mutationError.message });
    },
  });

  const updateMutation = api.discounts.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Discount updated." });
    },
    onError: (mutationError) => {
      setFormErrors({ submit: mutationError.message });
    },
  });

  const toggleActiveMutation = api.discounts.toggleActive.useMutation({
    onSuccess: async () => {
      await refetch();
      setNotice({ tone: "success", message: "Discount status updated." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const deleteMutation = api.discounts.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setDiscountToDelete(null);
      setNotice({ tone: "success", message: "Discount deleted." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const activeCount = useMemo(
    () => discounts.filter((discount) => discount.isActive).length,
    [discounts]
  );
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openDialog = (discount?: Discount) => {
    setNotice(null);
    setFormErrors({});
    setEditingDiscount(discount ?? null);
    setFormData(discount ? toFormData(discount) : defaultFormData);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingDiscount(null);
    setFormData(defaultFormData);
    setFormErrors({});
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = "Code is required.";
    if (formData.amount <= 0) errors.amount = "Amount must be positive.";
    if (formData.discountType === "percent" && formData.amount > 100) {
      errors.amount = "Percent discount cannot exceed 100.";
    }
    if (formData.startsAt && formData.endsAt) {
      const start = new Date(formData.startsAt);
      const end = new Date(formData.endsAt);
      if (start >= end) errors.endsAt = "End date must be after start date.";
    }
    if (formData.maxUses && Number(formData.maxUses) <= 0) {
      errors.maxUses = "Max uses must be positive.";
    }
    if (formData.perUserLimit <= 0) {
      errors.perUserLimit = "Per-user limit must be positive.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      code: formData.code.toUpperCase().trim(),
      description: formData.description.trim() || undefined,
      discountType: formData.discountType,
      amount: formData.amount,
      currency: formData.currency,
      appliesTo: {
        projectTypes: splitCsv(formData.projectTypes),
        features: splitCsv(formData.features),
        clientTypes: splitCsv(formData.clientTypes),
        excludeClientTypes: splitCsv(formData.excludeClientTypes),
      },
      startsAt: formData.startsAt ? new Date(formData.startsAt) : undefined,
      endsAt: formData.endsAt ? new Date(formData.endsAt) : undefined,
      maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
      perUserLimit: formData.perUserLimit,
      isActive: formData.isActive,
    };

    if (editingDiscount) {
      updateMutation.mutate({ id: editingDiscount.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleExport = () => {
    const dataBlob = new Blob([JSON.stringify(discounts, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `discounts-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Freelance tooling
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Discount Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create and manage promotional discount codes with usage limits,
            date ranges, and scope restrictions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            Export
          </Button>
          <Button onClick={() => openDialog()}>New Discount</Button>
        </div>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Total
            </p>
            <CardTitle>{discounts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Active
            </p>
            <CardTitle>{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Used
            </p>
            <CardTitle>
              {discounts.reduce(
                (total, discount) => total + discount.usedCount,
                0
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {isLoading ? <LoadingState>Loading discounts</LoadingState> : null}

      {!isLoading && discounts.length === 0 ? (
        <EmptyState>No discounts found. Create the first discount code.</EmptyState>
      ) : null}

      {!isLoading && discounts.length > 0 ? (
        <Card>
          <CardContent className="pt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      {discount.code}
                    </TableCell>
                    <TableCell>
                      <Badge tone="accent">
                        {discount.discountType === "percent"
                          ? "Percent"
                          : "Fixed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {discount.discountType === "percent"
                        ? `${discount.amount}%`
                        : `${discount.amount} ${discount.currency}`}
                    </TableCell>
                    <TableCell className="max-w-xs text-xs leading-5 text-muted-foreground">
                      {formatScope(discount.appliesTo)}
                    </TableCell>
                    <TableCell>
                      {discount.maxUses === null
                        ? `${discount.usedCount} uses`
                        : `${discount.usedCount} / ${discount.maxUses}`}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDateRange(discount.startsAt, discount.endsAt)}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="text-left"
                        disabled={toggleActiveMutation.isPending}
                        onClick={() =>
                          toggleActiveMutation.mutate({ id: discount.id })
                        }
                      >
                        <Badge tone={discount.isActive ? "success" : "default"}>
                          {discount.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(discount)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() => setDiscountToDelete(discount)}
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
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        className="max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editingDiscount ? "Edit Discount" : "Create Discount"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {formErrors.submit ? (
            <Alert tone="destructive">{formErrors.submit}</Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField error={formErrors.code}>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    code: event.target.value.toUpperCase(),
                  })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                id="discountType"
                value={formData.discountType}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    discountType: event.target.value as DiscountType,
                  })
                }
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed Amount</option>
              </Select>
            </FormField>
          </div>

          <FormField>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField error={formErrors.amount}>
              <Label htmlFor="amount">
                {formData.discountType === "percent" ? "Amount (%)" : "Amount"}
              </Label>
              <Input
                id="amount"
                type="number"
                min={0}
                max={formData.discountType === "percent" ? 100 : undefined}
                step={formData.discountType === "percent" ? 0.1 : 1}
                value={formData.amount}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    amount: Number(event.target.value),
                  })
                }
              />
            </FormField>

            {formData.discountType === "fixed" ? (
              <FormField>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  id="currency"
                  value={formData.currency}
                  onChange={(event) =>
                    setFormData({ ...formData, currency: event.target.value })
                  }
                >
                  <option value="ILS">ILS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Select>
              </FormField>
            ) : null}

            <FormField error={formErrors.perUserLimit}>
              <Label htmlFor="perUserLimit">Per User Limit</Label>
              <Input
                id="perUserLimit"
                type="number"
                min={1}
                value={formData.perUserLimit}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    perUserLimit: Number(event.target.value),
                  })
                }
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField hint="Comma-separated project type keys.">
              <Label htmlFor="projectTypes">Project Types</Label>
              <Input
                id="projectTypes"
                value={formData.projectTypes}
                onChange={(event) =>
                  setFormData({ ...formData, projectTypes: event.target.value })
                }
              />
            </FormField>
            <FormField hint="Comma-separated feature keys.">
              <Label htmlFor="features">Features</Label>
              <Input
                id="features"
                value={formData.features}
                onChange={(event) =>
                  setFormData({ ...formData, features: event.target.value })
                }
              />
            </FormField>
            <FormField hint="Comma-separated client type keys.">
              <Label htmlFor="clientTypes">Client Types</Label>
              <Input
                id="clientTypes"
                value={formData.clientTypes}
                onChange={(event) =>
                  setFormData({ ...formData, clientTypes: event.target.value })
                }
              />
            </FormField>
            <FormField hint="Comma-separated client type keys to exclude.">
              <Label htmlFor="excludeClientTypes">Exclude Client Types</Label>
              <Input
                id="excludeClientTypes"
                value={formData.excludeClientTypes}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    excludeClientTypes: event.target.value,
                  })
                }
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField>
              <Label htmlFor="startsAt">Start Date</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(event) =>
                  setFormData({ ...formData, startsAt: event.target.value })
                }
              />
            </FormField>
            <FormField error={formErrors.endsAt}>
              <Label htmlFor="endsAt">End Date</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={formData.endsAt}
                onChange={(event) =>
                  setFormData({ ...formData, endsAt: event.target.value })
                }
              />
            </FormField>
            <FormField hint="Leave empty for unlimited." error={formErrors.maxUses}>
              <Label htmlFor="maxUses">Max Uses</Label>
              <Input
                id="maxUses"
                type="number"
                min={1}
                value={formData.maxUses}
                onChange={(event) =>
                  setFormData({ ...formData, maxUses: event.target.value })
                }
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
            <Checkbox
              checked={formData.isActive}
              onChange={(event) =>
                setFormData({ ...formData, isActive: event.target.checked })
              }
            />
            Active
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="quiet" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : editingDiscount ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={discountToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setDiscountToDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Discount</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete{" "}
          <span className="font-medium text-foreground">
            {discountToDelete?.code}
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setDiscountToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (discountToDelete) {
                deleteMutation.mutate({ id: discountToDelete.id });
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
