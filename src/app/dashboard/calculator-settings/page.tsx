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
  TabButton,
  TabsList,
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

const SETTING_TYPES = ["base_rate", "feature_cost", "multiplier"] as const;

type SettingType = (typeof SETTING_TYPES)[number];
type SettingFilter = "all" | SettingType;
type CalculatorSetting =
  RouterOutputs["intakes"]["calculatorSettings"]["getAll"][number];
type SettingValue = number | Record<string, number>;

type SettingFormData = {
  settingType: SettingType;
  settingKey: string;
  settingValue: SettingValue;
  displayName: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
};

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

const defaultFormData: SettingFormData = {
  settingType: "base_rate",
  settingKey: "",
  settingValue: 0,
  displayName: "",
  description: "",
  isActive: true,
  displayOrder: 0,
};

const typeLabels: Record<SettingType, string> = {
  base_rate: "Base Rates",
  feature_cost: "Feature Costs",
  multiplier: "Multipliers",
};

function formatValue(value: unknown) {
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function parseSettingValue(valueInput: string): SettingValue {
  const trimmed = valueInput.trim();
  if (!trimmed) return 0;
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed) as SettingValue;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getInitialValueInput(value: unknown) {
  if (typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return "";
}

export default function CalculatorSettingsAdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [settingToDelete, setSettingToDelete] =
    useState<CalculatorSetting | null>(null);
  const [formData, setFormData] = useState<SettingFormData>(defaultFormData);
  const [valueInput, setValueInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [activeFilter, setActiveFilter] = useState<SettingFilter>("all");

  const {
    data: settings = [],
    isLoading,
    error,
    refetch,
  } = api.intakes.calculatorSettings.getAll.useQuery({
    includeInactive: true,
  });

  const createMutation = api.intakes.calculatorSettings.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Calculator setting created." });
    },
    onError: (mutationError) => {
      setFormError(mutationError.message);
    },
  });

  const updateMutation = api.intakes.calculatorSettings.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
      setNotice({ tone: "success", message: "Calculator setting updated." });
    },
    onError: (mutationError) => {
      setFormError(mutationError.message);
    },
  });

  const deleteMutation = api.intakes.calculatorSettings.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setSettingToDelete(null);
      setNotice({ tone: "success", message: "Calculator setting deleted." });
    },
    onError: (mutationError) => {
      setNotice({ tone: "destructive", message: mutationError.message });
    },
  });

  const filteredSettings = useMemo(() => {
    if (activeFilter === "all") return settings;
    return settings.filter((setting) => setting.settingType === activeFilter);
  }, [activeFilter, settings]);

  const groupedSettings = useMemo(() => {
    return SETTING_TYPES.map((type) => ({
      type,
      settings: filteredSettings.filter((setting) => setting.settingType === type),
    })).filter(({ settings: groupSettings }) => groupSettings.length > 0);
  }, [filteredSettings]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openDialog = (setting?: CalculatorSetting) => {
    setFormError(null);
    setNotice(null);

    if (setting) {
      const settingValue = setting.settingValue as SettingValue;
      setEditingSettingId(setting.id);
      setFormData({
        settingType: setting.settingType as SettingType,
        settingKey: setting.settingKey,
        settingValue,
        displayName: setting.displayName,
        description: setting.description ?? "",
        isActive: setting.isActive,
        displayOrder: setting.displayOrder,
      });
      setValueInput(getInitialValueInput(settingValue));
    } else {
      setEditingSettingId(null);
      setFormData(defaultFormData);
      setValueInput("");
    }

    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingSettingId(null);
    setFormData(defaultFormData);
    setValueInput("");
    setFormError(null);
  };

  const handleSubmit = () => {
    setFormError(null);

    if (!formData.settingKey.trim() || !formData.displayName.trim()) {
      setFormError("Setting key and display name are required.");
      return;
    }

    let parsedValue: SettingValue;
    try {
      parsedValue = parseSettingValue(valueInput);
    } catch {
      setFormError("Value must be a number or valid JSON.");
      return;
    }

    const submitData = {
      ...formData,
      settingKey: formData.settingKey.trim(),
      displayName: formData.displayName.trim(),
      description: formData.description.trim(),
      settingValue: parsedValue,
    };

    if (editingSettingId) {
      updateMutation.mutate({ id: editingSettingId, ...submitData });
    } else {
      createMutation.mutate(submitData);
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
            Calculator Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage the rates, feature costs, and multipliers used by the intake
            pricing calculator.
          </p>
        </div>
        <Button onClick={() => openDialog()}>Create Setting</Button>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {error ? <Alert tone="destructive">{error.message}</Alert> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabButton
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </TabButton>
          {SETTING_TYPES.map((type) => (
            <TabButton
              key={type}
              active={activeFilter === type}
              onClick={() => setActiveFilter(type)}
            >
              {typeLabels[type]}
            </TabButton>
          ))}
        </TabsList>
        <p className="font-mono text-xs uppercase text-muted-foreground">
          {filteredSettings.length} setting
          {filteredSettings.length === 1 ? "" : "s"}
        </p>
      </div>

      {isLoading ? <LoadingState>Loading calculator settings</LoadingState> : null}

      {!isLoading && settings.length === 0 ? (
        <EmptyState>
          No calculator settings found. Create settings to configure the cost
          calculator.
        </EmptyState>
      ) : null}

      {!isLoading && settings.length > 0 && groupedSettings.length === 0 ? (
        <EmptyState>No settings match the current filter.</EmptyState>
      ) : null}

      <div className="space-y-5">
        {groupedSettings.map(({ type, settings: groupSettings }) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle>{typeLabels[type]}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupSettings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-mono text-xs">
                        {setting.settingKey}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {setting.displayName}
                        </div>
                        {setting.description ? (
                          <div className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                            {setting.description}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <code className="block max-w-xs whitespace-pre-wrap rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                          {formatValue(setting.settingValue)}
                        </code>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {setting.displayOrder}
                      </TableCell>
                      <TableCell>
                        <Badge tone={setting.isActive ? "success" : "default"}>
                          {setting.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(setting)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="quiet"
                            size="sm"
                            onClick={() => setSettingToDelete(setting)}
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
        ))}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>
            {editingSettingId ? "Edit Setting" : "Create Setting"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {formError ? <Alert tone="destructive">{formError}</Alert> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="settingType">Setting Type</Label>
              <Select
                id="settingType"
                value={formData.settingType}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    settingType: event.target.value as SettingType,
                  })
                }
              >
                {SETTING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField hint="Lower numbers appear first.">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    displayOrder: Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
            </FormField>
          </div>

          <FormField hint="Unique identifier, for example website, cms, or simple.">
            <Label htmlFor="settingKey">Setting Key</Label>
            <Input
              id="settingKey"
              value={formData.settingKey}
              onChange={(event) =>
                setFormData({ ...formData, settingKey: event.target.value })
              }
            />
          </FormField>

          <FormField>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(event) =>
                setFormData({ ...formData, displayName: event.target.value })
              }
            />
          </FormField>

          <FormField
            hint={
              formData.settingType === "multiplier"
                ? 'Use a number or JSON object, for example {"simple": 1, "moderate": 1.5}.'
                : "Use a number, or JSON if this setting needs structured values."
            }
          >
            <Label htmlFor="settingValue">Value</Label>
            <Textarea
              id="settingValue"
              className="min-h-24 font-mono text-xs"
              value={valueInput}
              onChange={(event) => setValueInput(event.target.value)}
            />
          </FormField>

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
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.settingKey.trim() ||
                !formData.displayName.trim() ||
                !valueInput.trim() ||
                isSaving
              }
            >
              {isSaving
                ? "Saving..."
                : editingSettingId
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={settingToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setSettingToDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Setting</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Delete{" "}
          <span className="font-medium text-foreground">
            {settingToDelete?.displayName}
          </span>
          ? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setSettingToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (settingToDelete) {
                deleteMutation.mutate({ id: settingToDelete.id });
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
