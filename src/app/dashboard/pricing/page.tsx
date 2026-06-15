"use client";

import { useEffect, useMemo, useState } from "react";
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
import { calculateEstimate } from "$/pricing/calculate";

type ProjectType = RouterOutputs["pricing"]["projectTypes"]["getAll"][number];
type BaseRate = RouterOutputs["pricing"]["baseRates"]["getAll"][number];
type Feature = RouterOutputs["pricing"]["features"]["getAll"][number];
type MultiplierGroup =
  RouterOutputs["pricing"]["multipliers"]["groups"]["getAll"][number];
type MultiplierValue =
  RouterOutputs["pricing"]["multipliers"]["values"]["getByGroup"][number];
type MetaItem = RouterOutputs["pricing"]["meta"]["getAll"][number];
type PricingModel = RouterOutputs["pricing"]["getModel"];

type TabKey =
  | "preview"
  | "projectTypes"
  | "baseRates"
  | "features"
  | "multipliers"
  | "meta";

type Notice = {
  tone: "success" | "destructive";
  message: string;
} | null;

type ProjectTypeForm = {
  id?: string;
  key: string;
  displayName: string;
  baseRateIls: number;
  order: number;
  isActive: boolean;
};

type BaseRateForm = {
  id?: string;
  projectTypeKey: string;
  clientTypeKey: string;
  baseRateIls: number;
  order: number;
  isActive: boolean;
};

type FeatureForm = {
  id?: string;
  key: string;
  displayName: string;
  defaultCostIls: number;
  group: string;
  order: number;
  isActive: boolean;
};

type MultiplierGroupForm = {
  id?: string;
  key: string;
  displayName: string;
  order: number;
  isActive: boolean;
};

type MultiplierValueForm = {
  id?: string;
  groupKey: string;
  optionKey: string;
  displayName: string;
  value: number;
  order: number;
  isFixed: boolean;
  isActive: boolean;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "preview", label: "Preview" },
  { key: "projectTypes", label: "Project Types" },
  { key: "baseRates", label: "Base Rates" },
  { key: "features", label: "Features" },
  { key: "multipliers", label: "Multipliers" },
  { key: "meta", label: "Meta" },
];

const defaultProjectTypeForm: ProjectTypeForm = {
  key: "",
  displayName: "",
  baseRateIls: 5000,
  order: 0,
  isActive: true,
};

const defaultBaseRateForm: BaseRateForm = {
  projectTypeKey: "",
  clientTypeKey: "",
  baseRateIls: 5000,
  order: 0,
  isActive: true,
};

const defaultFeatureForm: FeatureForm = {
  key: "",
  displayName: "",
  defaultCostIls: 1000,
  group: "",
  order: 0,
  isActive: true,
};

const defaultMultiplierGroupForm: MultiplierGroupForm = {
  key: "",
  displayName: "",
  order: 0,
  isActive: true,
};

const defaultMultiplierValueForm: MultiplierValueForm = {
  groupKey: "",
  optionKey: "",
  displayName: "",
  value: 1,
  order: 0,
  isFixed: false,
  isActive: true,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusTone(isActive: boolean) {
  return isActive ? "success" : "warning";
}

function statusLabel(isActive: boolean) {
  return isActive ? "Active" : "Inactive";
}

function toPrettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function parseJsonValue(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed) as unknown;
}

function optionForGroup(model: PricingModel | undefined, groupKey: string) {
  return (
    model?.multiplierGroups.find((group) => group.key === groupKey)?.options[0]
      ?.optionKey ?? ""
  );
}

function usePricingRefetchers() {
  const utils = api.useUtils();

  return async () => {
    await Promise.all([
      utils.pricing.getModel.invalidate(),
      utils.pricing.projectTypes.getAll.invalidate(),
      utils.pricing.baseRates.getAll.invalidate(),
      utils.pricing.features.getAll.invalidate(),
      utils.pricing.multipliers.groups.getAll.invalidate(),
      utils.pricing.multipliers.values.getByGroup.invalidate(),
      utils.pricing.meta.getAll.invalidate(),
    ]);
  };
}

export default function PricingAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("preview");
  const [notice, setNotice] = useState<Notice>(null);
  const refetchPricing = usePricingRefetchers();

  const {
    data: model,
    isLoading: modelLoading,
    error: modelError,
  } = api.pricing.getModel.useQuery();
  const { data: projectTypes = [], isLoading: projectTypesLoading } =
    api.pricing.projectTypes.getAll.useQuery({ includeInactive: true });
  const { data: baseRates = [], isLoading: baseRatesLoading } =
    api.pricing.baseRates.getAll.useQuery({ includeInactive: true });
  const { data: features = [], isLoading: featuresLoading } =
    api.pricing.features.getAll.useQuery({ includeInactive: true });
  const { data: multiplierGroups = [], isLoading: multiplierGroupsLoading } =
    api.pricing.multipliers.groups.getAll.useQuery({ includeInactive: true });
  const { data: metaItems = [], isLoading: metaLoading } =
    api.pricing.meta.getAll.useQuery({ includeInactive: true });

  const isLoading =
    modelLoading ||
    projectTypesLoading ||
    baseRatesLoading ||
    featuresLoading ||
    multiplierGroupsLoading ||
    metaLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Pricing model
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Pricing
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage the public estimator model across project types, client rates,
            selectable features, multipliers, and shared metadata.
          </p>
        </div>
      </div>

      {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}
      {modelError ? (
        <Alert tone="destructive">{modelError.message}</Alert>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard label="Project types" value={projectTypes.length} />
        <MetricCard label="Base rates" value={baseRates.length} />
        <MetricCard label="Features" value={features.length} />
        <MetricCard label="Multiplier groups" value={multiplierGroups.length} />
      </div>

      <TabsList className="w-full overflow-x-auto">
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabsList>

      {isLoading ? <LoadingState>Loading pricing model</LoadingState> : null}

      {!isLoading && activeTab === "preview" ? (
        <PreviewTab model={model} />
      ) : null}
      {!isLoading && activeTab === "projectTypes" ? (
        <ProjectTypesTab
          projectTypes={projectTypes}
          onChange={refetchPricing}
          setNotice={setNotice}
        />
      ) : null}
      {!isLoading && activeTab === "baseRates" ? (
        <BaseRatesTab
          baseRates={baseRates}
          projectTypes={projectTypes}
          multiplierGroups={model?.multiplierGroups ?? []}
          onChange={refetchPricing}
          setNotice={setNotice}
        />
      ) : null}
      {!isLoading && activeTab === "features" ? (
        <FeaturesTab
          features={features}
          onChange={refetchPricing}
          setNotice={setNotice}
        />
      ) : null}
      {!isLoading && activeTab === "multipliers" ? (
        <MultipliersTab
          groups={multiplierGroups}
          onChange={refetchPricing}
          setNotice={setNotice}
        />
      ) : null}
      {!isLoading && activeTab === "meta" ? (
        <MetaTab
          metaItems={metaItems}
          onChange={refetchPricing}
          setNotice={setNotice}
        />
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <p className="font-mono text-xs uppercase text-muted-foreground">
          {label}
        </p>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function PreviewTab({ model }: { model: PricingModel | undefined }) {
  const [projectTypeKey, setProjectTypeKey] = useState("");
  const [numPages, setNumPages] = useState(5);
  const [selectedFeatureKeys, setSelectedFeatureKeys] = useState<string[]>([]);
  const [complexityKey, setComplexityKey] = useState("");
  const [timelineKey, setTimelineKey] = useState("");
  const [techKey, setTechKey] = useState("");
  const [clientTypeKey, setClientTypeKey] = useState("");

  useEffect(() => {
    if (!model) return;
    setProjectTypeKey((current) => current || model.projectTypes[0]?.key || "");
    setComplexityKey((current) => current || optionForGroup(model, "complexity"));
    setTimelineKey((current) => current || optionForGroup(model, "timeline"));
    setTechKey((current) => current || optionForGroup(model, "tech"));
    setClientTypeKey((current) => current || optionForGroup(model, "clientType"));
  }, [model]);

  const estimate = useMemo(() => {
    if (!model || !projectTypeKey) return null;
    return calculateEstimate(model, {
      projectTypeKey,
      numPages,
      selectedFeatureKeys,
      complexityKey,
      timelineKey,
      techKey,
      clientTypeKey,
      currency: model.meta.defaultCurrency,
    });
  }, [
    clientTypeKey,
    complexityKey,
    model,
    numPages,
    projectTypeKey,
    selectedFeatureKeys,
    techKey,
    timelineKey,
  ]);

  if (!model) return <EmptyState>No pricing model found.</EmptyState>;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Estimate Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="preview-project-type">Project type</Label>
              <Select
                id="preview-project-type"
                value={projectTypeKey}
                onChange={(event) => setProjectTypeKey(event.target.value)}
              >
                {model.projectTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.displayName}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="preview-pages">Pages</Label>
              <Input
                id="preview-pages"
                type="number"
                min={1}
                value={numPages}
                onChange={(event) =>
                  setNumPages(Number.parseInt(event.target.value, 10) || 1)
                }
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MultiplierSelect
              model={model}
              groupKey="complexity"
              label="Complexity"
              value={complexityKey}
              onChange={setComplexityKey}
            />
            <MultiplierSelect
              model={model}
              groupKey="timeline"
              label="Timeline"
              value={timelineKey}
              onChange={setTimelineKey}
            />
            <MultiplierSelect
              model={model}
              groupKey="tech"
              label="Tech stack"
              value={techKey}
              onChange={setTechKey}
            />
            <MultiplierSelect
              model={model}
              groupKey="clientType"
              label="Client type"
              value={clientTypeKey}
              onChange={setClientTypeKey}
            />
          </div>

          <div className="space-y-3">
            <Label>Features</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {model.features.map((feature) => (
                <label
                  key={feature.key}
                  className="flex items-center gap-2 rounded-md border border-border p-3 text-sm"
                >
                  <Checkbox
                    checked={selectedFeatureKeys.includes(feature.key)}
                    onChange={(event) => {
                      setSelectedFeatureKeys((current) =>
                        event.target.checked
                          ? [...current, feature.key]
                          : current.filter((key) => key !== feature.key)
                      );
                    }}
                  />
                  <span className="flex-1">{feature.displayName}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(feature.costIls)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {estimate ? (
            <>
              <BreakdownRow label="Base" value={estimate.baseCost} />
              <BreakdownRow label="Pages" value={estimate.pageCost} />
              <BreakdownRow label="Features" value={estimate.totalFeatureCost} />
              <BreakdownRow label="Subtotal" value={estimate.subtotal} />
              <div className="rounded-md bg-muted p-3">
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  Estimate range
                </p>
                <p className="mt-2 font-display text-2xl font-semibold">
                  {formatCurrency(estimate.range.min)} -{" "}
                  {formatCurrency(estimate.range.max)}
                </p>
              </div>
              <dl className="grid gap-2 text-xs text-muted-foreground">
                <MultiplierRow
                  label="Complexity"
                  value={estimate.complexityMultiplier}
                />
                <MultiplierRow
                  label="Timeline"
                  value={estimate.timelineMultiplier}
                />
                <MultiplierRow label="Tech" value={estimate.techStackMultiplier} />
                <MultiplierRow
                  label="Client"
                  value={estimate.clientTypeMultiplier}
                />
              </dl>
            </>
          ) : (
            <EmptyState>Select a project type to preview pricing.</EmptyState>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MultiplierSelect({
  model,
  groupKey,
  label,
  value,
  onChange,
}: {
  model: PricingModel;
  groupKey: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const group = model.multiplierGroups.find((item) => item.key === groupKey);

  return (
    <FormField>
      <Label>{label}</Label>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        {group?.options.map((option) => (
          <option key={option.optionKey} value={option.optionKey}>
            {option.displayName} ({option.value}x)
          </option>
        ))}
      </Select>
    </FormField>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{formatCurrency(Math.round(value))}</span>
    </div>
  );
}

function MultiplierRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt>{label}</dt>
      <dd>{value.toFixed(3)}x</dd>
    </div>
  );
}

function ProjectTypesTab({
  projectTypes,
  onChange,
  setNotice,
}: {
  projectTypes: ProjectType[];
  onChange: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProjectTypeForm>(defaultProjectTypeForm);
  const [deleteTarget, setDeleteTarget] = useState<ProjectType | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = api.pricing.projectTypes.create.useMutation({
    onSuccess: async () => {
      await onChange();
      closeForm();
      setNotice({ tone: "success", message: "Project type created." });
    },
    onError: (error) => setFormError(error.message),
  });
  const updateMutation = api.pricing.projectTypes.update.useMutation({
    onSuccess: async () => {
      await onChange();
      closeForm();
      setNotice({ tone: "success", message: "Project type updated." });
    },
    onError: (error) => setFormError(error.message),
  });
  const deleteMutation = api.pricing.projectTypes.delete.useMutation({
    onSuccess: async () => {
      await onChange();
      setDeleteTarget(null);
      setNotice({ tone: "success", message: "Project type deleted." });
    },
    onError: (error) =>
      setNotice({ tone: "destructive", message: error.message }),
  });

  const openForm = (projectType?: ProjectType) => {
    setFormError(null);
    setForm(
      projectType
        ? {
            id: projectType.id,
            key: projectType.key,
            displayName: projectType.displayName,
            baseRateIls: projectType.baseRateIls,
            order: projectType.order,
            isActive: projectType.isActive,
          }
        : defaultProjectTypeForm
    );
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(defaultProjectTypeForm);
    setFormError(null);
  };

  const save = () => {
    if (!form.key.trim() || !form.displayName.trim()) {
      setFormError("Key and display name are required.");
      return;
    }

    const payload = {
      key: form.key.trim(),
      displayName: form.displayName.trim(),
      baseRateIls: form.baseRateIls,
      order: form.order,
      isActive: form.isActive,
    };

    if (form.id) updateMutation.mutate({ id: form.id, ...payload });
    else createMutation.mutate(payload);
  };

  return (
    <CrudSection
      title="Project Types"
      description="Default project categories and fallback base rates."
      actionLabel="Create Project Type"
      onCreate={() => openForm()}
    >
      {projectTypes.length === 0 ? (
        <EmptyState>No project types found.</EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Base rate</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectTypes.map((projectType) => (
              <TableRow key={projectType.id}>
                <TableCell className="font-medium">
                  {projectType.displayName}
                </TableCell>
                <TableCell>{projectType.key}</TableCell>
                <TableCell>{formatCurrency(projectType.baseRateIls)}</TableCell>
                <TableCell>{projectType.order}</TableCell>
                <TableCell>
                  <Badge tone={statusTone(projectType.isActive)}>
                    {statusLabel(projectType.isActive)}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm(projectType)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(projectType)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogHeader>
          <DialogTitle>
            {form.id ? "Edit Project Type" : "Create Project Type"}
          </DialogTitle>
        </DialogHeader>
        <ProjectTypeFields form={form} setForm={setForm} />
        {formError ? <Alert tone="destructive">{formError}</Alert> : null}
        <DialogActions
          isSaving={createMutation.isPending || updateMutation.isPending}
          onCancel={closeForm}
          onSave={save}
        />
      </Dialog>

      <DeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete Project Type"
        message={`Delete ${deleteTarget?.displayName ?? "this project type"}?`}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })
        }
      />
    </CrudSection>
  );
}

function ProjectTypeFields({
  form,
  setForm,
}: {
  form: ProjectTypeForm;
  setForm: (form: ProjectTypeForm) => void;
}) {
  return (
    <div className="grid gap-4">
      <FormField>
        <Label htmlFor="project-type-name">Display name</Label>
        <Input
          id="project-type-name"
          value={form.displayName}
          onChange={(event) =>
            setForm({ ...form, displayName: event.target.value })
          }
        />
      </FormField>
      <FormField>
        <Label htmlFor="project-type-key">Key</Label>
        <Input
          id="project-type-key"
          value={form.key}
          onChange={(event) => setForm({ ...form, key: event.target.value })}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <Label htmlFor="project-type-rate">Base rate</Label>
          <Input
            id="project-type-rate"
            type="number"
            min={1}
            value={form.baseRateIls}
            onChange={(event) =>
              setForm({
                ...form,
                baseRateIls: Number.parseInt(event.target.value, 10) || 1,
              })
            }
          />
        </FormField>
        <FormField>
          <Label htmlFor="project-type-order">Order</Label>
          <Input
            id="project-type-order"
            type="number"
            value={form.order}
            onChange={(event) =>
              setForm({
                ...form,
                order: Number.parseInt(event.target.value, 10) || 0,
              })
            }
          />
        </FormField>
      </div>
      <CheckboxField
        label="Active"
        checked={form.isActive}
        onChange={(isActive) => setForm({ ...form, isActive })}
      />
    </div>
  );
}

function BaseRatesTab({
  baseRates,
  projectTypes,
  multiplierGroups,
  onChange,
  setNotice,
}: {
  baseRates: BaseRate[];
  projectTypes: ProjectType[];
  multiplierGroups: PricingModel["multiplierGroups"];
  onChange: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const clientTypeOptions =
    multiplierGroups.find((group) => group.key === "clientType")?.options ?? [];
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<BaseRateForm>({
    ...defaultBaseRateForm,
    projectTypeKey: projectTypes[0]?.key ?? "",
  });
  const [deleteTarget, setDeleteTarget] = useState<BaseRate | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = api.pricing.baseRates.create.useMutation({
    onSuccess: async () => {
      await onChange();
      closeForm();
      setNotice({ tone: "success", message: "Base rate created." });
    },
    onError: (error) => setFormError(error.message),
  });
  const updateMutation = api.pricing.baseRates.update.useMutation({
    onSuccess: async () => {
      await onChange();
      closeForm();
      setNotice({ tone: "success", message: "Base rate updated." });
    },
    onError: (error) => setFormError(error.message),
  });
  const deleteMutation = api.pricing.baseRates.delete.useMutation({
    onSuccess: async () => {
      await onChange();
      setDeleteTarget(null);
      setNotice({ tone: "success", message: "Base rate deleted." });
    },
    onError: (error) =>
      setNotice({ tone: "destructive", message: error.message }),
  });

  const openForm = (baseRate?: BaseRate) => {
    setFormError(null);
    setForm(
      baseRate
        ? {
            id: baseRate.id,
            projectTypeKey: baseRate.projectTypeKey,
            clientTypeKey: baseRate.clientTypeKey ?? "",
            baseRateIls: baseRate.baseRateIls,
            order: baseRate.order,
            isActive: baseRate.isActive,
          }
        : {
            ...defaultBaseRateForm,
            projectTypeKey: projectTypes[0]?.key ?? "",
          }
    );
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm({ ...defaultBaseRateForm, projectTypeKey: projectTypes[0]?.key ?? "" });
    setFormError(null);
  };

  const save = () => {
    if (!form.projectTypeKey) {
      setFormError("Project type is required.");
      return;
    }

    const payload = {
      projectTypeKey: form.projectTypeKey,
      clientTypeKey: form.clientTypeKey.trim() || null,
      baseRateIls: form.baseRateIls,
      order: form.order,
      isActive: form.isActive,
    };

    if (form.id) updateMutation.mutate({ id: form.id, ...payload });
    else createMutation.mutate(payload);
  };

  return (
    <CrudSection
      title="Base Rates"
      description="Optional client-type-specific overrides for project base rates."
      actionLabel="Create Base Rate"
      onCreate={() => openForm()}
    >
      {baseRates.length === 0 ? (
        <EmptyState>No base rates found.</EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project type</TableHead>
              <TableHead>Client type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {baseRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>{rate.projectTypeKey}</TableCell>
                <TableCell>{rate.clientTypeKey ?? "Default"}</TableCell>
                <TableCell>{formatCurrency(rate.baseRateIls)}</TableCell>
                <TableCell>{rate.order}</TableCell>
                <TableCell>
                  <Badge tone={statusTone(rate.isActive)}>
                    {statusLabel(rate.isActive)}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button variant="outline" size="sm" onClick={() => openForm(rate)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(rate)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Base Rate" : "Create Base Rate"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField>
            <Label htmlFor="base-rate-project">Project type</Label>
            <Select
              id="base-rate-project"
              value={form.projectTypeKey}
              onChange={(event) =>
                setForm({ ...form, projectTypeKey: event.target.value })
              }
            >
              {projectTypes.map((type) => (
                <option key={type.key} value={type.key}>
                  {type.displayName}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField hint="Leave blank for the default project-type rate.">
            <Label htmlFor="base-rate-client">Client type</Label>
            <Select
              id="base-rate-client"
              value={form.clientTypeKey}
              onChange={(event) =>
                setForm({ ...form, clientTypeKey: event.target.value })
              }
            >
              <option value="">Default</option>
              {clientTypeOptions.map((option) => (
                <option key={option.optionKey} value={option.optionKey}>
                  {option.displayName}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="base-rate-value">Rate</Label>
              <Input
                id="base-rate-value"
                type="number"
                min={1}
                value={form.baseRateIls}
                onChange={(event) =>
                  setForm({
                    ...form,
                    baseRateIls: Number.parseInt(event.target.value, 10) || 1,
                  })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="base-rate-order">Order</Label>
              <Input
                id="base-rate-order"
                type="number"
                value={form.order}
                onChange={(event) =>
                  setForm({
                    ...form,
                    order: Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
            </FormField>
          </div>
          <CheckboxField
            label="Active"
            checked={form.isActive}
            onChange={(isActive) => setForm({ ...form, isActive })}
          />
        </div>
        {formError ? <Alert tone="destructive">{formError}</Alert> : null}
        <DialogActions
          isSaving={createMutation.isPending || updateMutation.isPending}
          onCancel={closeForm}
          onSave={save}
        />
      </Dialog>

      <DeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete Base Rate"
        message={`Delete rate for ${deleteTarget?.projectTypeKey ?? "this project type"}?`}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })
        }
      />
    </CrudSection>
  );
}

function FeaturesTab({
  features,
  onChange,
  setNotice,
}: {
  features: Feature[];
  onChange: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FeatureForm>(defaultFeatureForm);
  const [deleteTarget, setDeleteTarget] = useState<Feature | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = api.pricing.features.create.useMutation({
    onSuccess: async () => {
      await onChange();
      closeForm();
      setNotice({ tone: "success", message: "Feature created." });
    },
    onError: (error) => setFormError(error.message),
  });
  const updateMutation = api.pricing.features.update.useMutation({
    onSuccess: async () => {
      await onChange();
      closeForm();
      setNotice({ tone: "success", message: "Feature updated." });
    },
    onError: (error) => setFormError(error.message),
  });
  const deleteMutation = api.pricing.features.delete.useMutation({
    onSuccess: async () => {
      await onChange();
      setDeleteTarget(null);
      setNotice({ tone: "success", message: "Feature deleted." });
    },
    onError: (error) =>
      setNotice({ tone: "destructive", message: error.message }),
  });

  const openForm = (feature?: Feature) => {
    setFormError(null);
    setForm(
      feature
        ? {
            id: feature.id,
            key: feature.key,
            displayName: feature.displayName,
            defaultCostIls: feature.defaultCostIls,
            group: feature.group ?? "",
            order: feature.order,
            isActive: feature.isActive,
          }
        : defaultFeatureForm
    );
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(defaultFeatureForm);
    setFormError(null);
  };

  const save = () => {
    if (!form.key.trim() || !form.displayName.trim()) {
      setFormError("Key and display name are required.");
      return;
    }

    const payload = {
      key: form.key.trim(),
      displayName: form.displayName.trim(),
      defaultCostIls: form.defaultCostIls,
      group: form.group.trim() || null,
      order: form.order,
      isActive: form.isActive,
    };

    if (form.id) updateMutation.mutate({ id: form.id, ...payload });
    else createMutation.mutate(payload);
  };

  return (
    <CrudSection
      title="Features"
      description="Selectable add-ons used by the public estimator."
      actionLabel="Create Feature"
      onCreate={() => openForm()}
    >
      {features.length === 0 ? (
        <EmptyState>No features found.</EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell className="font-medium">{feature.displayName}</TableCell>
                <TableCell>{feature.key}</TableCell>
                <TableCell>{feature.group ?? "General"}</TableCell>
                <TableCell>{formatCurrency(feature.defaultCostIls)}</TableCell>
                <TableCell>{feature.order}</TableCell>
                <TableCell>
                  <Badge tone={statusTone(feature.isActive)}>
                    {statusLabel(feature.isActive)}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm(feature)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(feature)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Feature" : "Create Feature"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField>
            <Label htmlFor="feature-name">Display name</Label>
            <Input
              id="feature-name"
              value={form.displayName}
              onChange={(event) =>
                setForm({ ...form, displayName: event.target.value })
              }
            />
          </FormField>
          <FormField>
            <Label htmlFor="feature-key">Key</Label>
            <Input
              id="feature-key"
              value={form.key}
              onChange={(event) => setForm({ ...form, key: event.target.value })}
            />
          </FormField>
          <FormField>
            <Label htmlFor="feature-group">Group</Label>
            <Input
              id="feature-group"
              value={form.group}
              onChange={(event) =>
                setForm({ ...form, group: event.target.value })
              }
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField>
              <Label htmlFor="feature-cost">Default cost</Label>
              <Input
                id="feature-cost"
                type="number"
                min={1}
                value={form.defaultCostIls}
                onChange={(event) =>
                  setForm({
                    ...form,
                    defaultCostIls: Number.parseInt(event.target.value, 10) || 1,
                  })
                }
              />
            </FormField>
            <FormField>
              <Label htmlFor="feature-order">Order</Label>
              <Input
                id="feature-order"
                type="number"
                value={form.order}
                onChange={(event) =>
                  setForm({
                    ...form,
                    order: Number.parseInt(event.target.value, 10) || 0,
                  })
                }
              />
            </FormField>
          </div>
          <CheckboxField
            label="Active"
            checked={form.isActive}
            onChange={(isActive) => setForm({ ...form, isActive })}
          />
        </div>
        {formError ? <Alert tone="destructive">{formError}</Alert> : null}
        <DialogActions
          isSaving={createMutation.isPending || updateMutation.isPending}
          onCancel={closeForm}
          onSave={save}
        />
      </Dialog>

      <DeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete Feature"
        message={`Delete ${deleteTarget?.displayName ?? "this feature"}?`}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })
        }
      />
    </CrudSection>
  );
}

function MultipliersTab({
  groups,
  onChange,
  setNotice,
}: {
  groups: MultiplierGroup[];
  onChange: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const [selectedGroupKey, setSelectedGroupKey] = useState(groups[0]?.key ?? "");
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [valueFormOpen, setValueFormOpen] = useState(false);
  const [groupForm, setGroupForm] =
    useState<MultiplierGroupForm>(defaultMultiplierGroupForm);
  const [valueForm, setValueForm] = useState<MultiplierValueForm>({
    ...defaultMultiplierValueForm,
    groupKey: groups[0]?.key ?? "",
  });
  const [deleteGroupTarget, setDeleteGroupTarget] =
    useState<MultiplierGroup | null>(null);
  const [deleteValueTarget, setDeleteValueTarget] =
    useState<MultiplierValue | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGroupKey && groups[0]?.key) {
      setSelectedGroupKey(groups[0].key);
    }
  }, [groups, selectedGroupKey]);

  const { data: values = [], isLoading: valuesLoading } =
    api.pricing.multipliers.values.getByGroup.useQuery(
      {
        groupKey: selectedGroupKey || "__none__",
        includeInactive: true,
      },
      { enabled: Boolean(selectedGroupKey) }
    );

  const createGroupMutation = api.pricing.multipliers.groups.create.useMutation({
    onSuccess: async () => {
      await onChange();
      closeGroupForm();
      setNotice({ tone: "success", message: "Multiplier group created." });
    },
    onError: (error) => setFormError(error.message),
  });
  const updateGroupMutation = api.pricing.multipliers.groups.update.useMutation({
    onSuccess: async () => {
      await onChange();
      closeGroupForm();
      setNotice({ tone: "success", message: "Multiplier group updated." });
    },
    onError: (error) => setFormError(error.message),
  });
  const deleteGroupMutation = api.pricing.multipliers.groups.delete.useMutation({
    onSuccess: async () => {
      await onChange();
      setDeleteGroupTarget(null);
      setNotice({ tone: "success", message: "Multiplier group deleted." });
    },
    onError: (error) =>
      setNotice({ tone: "destructive", message: error.message }),
  });
  const createValueMutation = api.pricing.multipliers.values.create.useMutation({
    onSuccess: async () => {
      await onChange();
      closeValueForm();
      setNotice({ tone: "success", message: "Multiplier value created." });
    },
    onError: (error) => setFormError(error.message),
  });
  const updateValueMutation = api.pricing.multipliers.values.update.useMutation({
    onSuccess: async () => {
      await onChange();
      closeValueForm();
      setNotice({ tone: "success", message: "Multiplier value updated." });
    },
    onError: (error) => setFormError(error.message),
  });
  const deleteValueMutation = api.pricing.multipliers.values.delete.useMutation({
    onSuccess: async () => {
      await onChange();
      setDeleteValueTarget(null);
      setNotice({ tone: "success", message: "Multiplier value deleted." });
    },
    onError: (error) =>
      setNotice({ tone: "destructive", message: error.message }),
  });

  const openGroupForm = (group?: MultiplierGroup) => {
    setFormError(null);
    setGroupForm(
      group
        ? {
            id: group.id,
            key: group.key,
            displayName: group.displayName,
            order: group.order,
            isActive: group.isActive,
          }
        : defaultMultiplierGroupForm
    );
    setGroupFormOpen(true);
  };

  const closeGroupForm = () => {
    setGroupFormOpen(false);
    setGroupForm(defaultMultiplierGroupForm);
    setFormError(null);
  };

  const openValueForm = (value?: MultiplierValue) => {
    setFormError(null);
    setValueForm(
      value
        ? {
            id: value.id,
            groupKey: value.groupKey,
            optionKey: value.optionKey,
            displayName: value.displayName,
            value: Number(value.value),
            order: value.order,
            isFixed: value.isFixed,
            isActive: value.isActive,
          }
        : {
            ...defaultMultiplierValueForm,
            groupKey: selectedGroupKey,
          }
    );
    setValueFormOpen(true);
  };

  const closeValueForm = () => {
    setValueFormOpen(false);
    setValueForm({ ...defaultMultiplierValueForm, groupKey: selectedGroupKey });
    setFormError(null);
  };

  const saveGroup = () => {
    if (!groupForm.key.trim() || !groupForm.displayName.trim()) {
      setFormError("Key and display name are required.");
      return;
    }

    const payload = {
      key: groupForm.key.trim(),
      displayName: groupForm.displayName.trim(),
      order: groupForm.order,
      isActive: groupForm.isActive,
    };

    if (groupForm.id) {
      updateGroupMutation.mutate({ id: groupForm.id, ...payload });
    } else {
      createGroupMutation.mutate(payload);
    }
  };

  const saveValue = () => {
    if (
      !valueForm.groupKey.trim() ||
      !valueForm.optionKey.trim() ||
      !valueForm.displayName.trim()
    ) {
      setFormError("Group, option key, and display name are required.");
      return;
    }

    const payload = {
      groupKey: valueForm.groupKey,
      optionKey: valueForm.optionKey.trim(),
      displayName: valueForm.displayName.trim(),
      value: valueForm.value,
      order: valueForm.order,
      isFixed: valueForm.isFixed,
      isActive: valueForm.isActive,
    };

    if (valueForm.id) {
      updateValueMutation.mutate({
        id: valueForm.id,
        optionKey: payload.optionKey,
        displayName: payload.displayName,
        value: payload.value,
        order: payload.order,
        isFixed: payload.isFixed,
        isActive: payload.isActive,
      });
    } else {
      createValueMutation.mutate(payload);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <CrudSection
        title="Multiplier Groups"
        description="Groups map to calculator dimensions such as complexity and timeline."
        actionLabel="Create Group"
        onCreate={() => openGroupForm()}
      >
        <div className="space-y-2">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`w-full rounded-md border p-3 text-left transition-colors ${
                selectedGroupKey === group.key
                  ? "border-accent bg-accent/10"
                  : "border-border hover:bg-muted"
              }`}
              onClick={() => setSelectedGroupKey(group.key)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{group.displayName}</p>
                  <p className="text-xs text-muted-foreground">{group.key}</p>
                </div>
                <Badge tone={statusTone(group.isActive)}>
                  {statusLabel(group.isActive)}
                </Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    openGroupForm(group);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    setDeleteGroupTarget(group);
                  }}
                >
                  Delete
                </Button>
              </div>
            </button>
          ))}
        </div>
      </CrudSection>

      <CrudSection
        title="Multiplier Values"
        description="Options inside the selected multiplier group."
        actionLabel="Create Value"
        onCreate={() => openValueForm()}
      >
        {!selectedGroupKey ? <EmptyState>Select a group first.</EmptyState> : null}
        {valuesLoading ? <LoadingState>Loading multiplier values</LoadingState> : null}
        {!valuesLoading && selectedGroupKey && values.length === 0 ? (
          <EmptyState>No values found for this group.</EmptyState>
        ) : null}
        {!valuesLoading && values.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Option key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Fixed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.map((value) => (
                <TableRow key={value.id}>
                  <TableCell className="font-medium">{value.displayName}</TableCell>
                  <TableCell>{value.optionKey}</TableCell>
                  <TableCell>{Number(value.value).toFixed(3)}x</TableCell>
                  <TableCell>{value.isFixed ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge tone={statusTone(value.isActive)}>
                      {statusLabel(value.isActive)}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openValueForm(value)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteValueTarget(value)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CrudSection>

      <Dialog open={groupFormOpen} onOpenChange={setGroupFormOpen}>
        <DialogHeader>
          <DialogTitle>
            {groupForm.id ? "Edit Multiplier Group" : "Create Multiplier Group"}
          </DialogTitle>
        </DialogHeader>
        <MultiplierGroupFields form={groupForm} setForm={setGroupForm} />
        {formError ? <Alert tone="destructive">{formError}</Alert> : null}
        <DialogActions
          isSaving={createGroupMutation.isPending || updateGroupMutation.isPending}
          onCancel={closeGroupForm}
          onSave={saveGroup}
        />
      </Dialog>

      <Dialog open={valueFormOpen} onOpenChange={setValueFormOpen}>
        <DialogHeader>
          <DialogTitle>
            {valueForm.id ? "Edit Multiplier Value" : "Create Multiplier Value"}
          </DialogTitle>
        </DialogHeader>
        <MultiplierValueFields
          form={valueForm}
          groups={groups}
          setForm={setValueForm}
        />
        {formError ? <Alert tone="destructive">{formError}</Alert> : null}
        <DialogActions
          isSaving={createValueMutation.isPending || updateValueMutation.isPending}
          onCancel={closeValueForm}
          onSave={saveValue}
        />
      </Dialog>

      <DeleteDialog
        open={Boolean(deleteGroupTarget)}
        title="Delete Multiplier Group"
        message={`Delete ${deleteGroupTarget?.displayName ?? "this group"}?`}
        isDeleting={deleteGroupMutation.isPending}
        onOpenChange={(open) => !open && setDeleteGroupTarget(null)}
        onConfirm={() =>
          deleteGroupTarget &&
          deleteGroupMutation.mutate({ id: deleteGroupTarget.id })
        }
      />

      <DeleteDialog
        open={Boolean(deleteValueTarget)}
        title="Delete Multiplier Value"
        message={`Delete ${deleteValueTarget?.displayName ?? "this value"}?`}
        isDeleting={deleteValueMutation.isPending}
        onOpenChange={(open) => !open && setDeleteValueTarget(null)}
        onConfirm={() =>
          deleteValueTarget &&
          deleteValueMutation.mutate({ id: deleteValueTarget.id })
        }
      />
    </div>
  );
}

function MultiplierGroupFields({
  form,
  setForm,
}: {
  form: MultiplierGroupForm;
  setForm: (form: MultiplierGroupForm) => void;
}) {
  return (
    <div className="grid gap-4">
      <FormField>
        <Label htmlFor="multiplier-group-name">Display name</Label>
        <Input
          id="multiplier-group-name"
          value={form.displayName}
          onChange={(event) =>
            setForm({ ...form, displayName: event.target.value })
          }
        />
      </FormField>
      <FormField>
        <Label htmlFor="multiplier-group-key">Key</Label>
        <Input
          id="multiplier-group-key"
          value={form.key}
          onChange={(event) => setForm({ ...form, key: event.target.value })}
        />
      </FormField>
      <FormField>
        <Label htmlFor="multiplier-group-order">Order</Label>
        <Input
          id="multiplier-group-order"
          type="number"
          value={form.order}
          onChange={(event) =>
            setForm({
              ...form,
              order: Number.parseInt(event.target.value, 10) || 0,
            })
          }
        />
      </FormField>
      <CheckboxField
        label="Active"
        checked={form.isActive}
        onChange={(isActive) => setForm({ ...form, isActive })}
      />
    </div>
  );
}

function MultiplierValueFields({
  form,
  groups,
  setForm,
}: {
  form: MultiplierValueForm;
  groups: MultiplierGroup[];
  setForm: (form: MultiplierValueForm) => void;
}) {
  return (
    <div className="grid gap-4">
      <FormField>
        <Label htmlFor="multiplier-value-group">Group</Label>
        <Select
          id="multiplier-value-group"
          value={form.groupKey}
          disabled={Boolean(form.id)}
          onChange={(event) => setForm({ ...form, groupKey: event.target.value })}
        >
          {groups.map((group) => (
            <option key={group.key} value={group.key}>
              {group.displayName}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField>
        <Label htmlFor="multiplier-value-name">Display name</Label>
        <Input
          id="multiplier-value-name"
          value={form.displayName}
          onChange={(event) =>
            setForm({ ...form, displayName: event.target.value })
          }
        />
      </FormField>
      <FormField>
        <Label htmlFor="multiplier-value-key">Option key</Label>
        <Input
          id="multiplier-value-key"
          value={form.optionKey}
          onChange={(event) =>
            setForm({ ...form, optionKey: event.target.value })
          }
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <Label htmlFor="multiplier-value-number">Value</Label>
          <Input
            id="multiplier-value-number"
            type="number"
            min={0.001}
            step={0.001}
            value={form.value}
            onChange={(event) =>
              setForm({
                ...form,
                value: Number.parseFloat(event.target.value) || 1,
              })
            }
          />
        </FormField>
        <FormField>
          <Label htmlFor="multiplier-value-order">Order</Label>
          <Input
            id="multiplier-value-order"
            type="number"
            value={form.order}
            onChange={(event) =>
              setForm({
                ...form,
                order: Number.parseInt(event.target.value, 10) || 0,
              })
            }
          />
        </FormField>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField
          label="Fixed value"
          checked={form.isFixed}
          onChange={(isFixed) => setForm({ ...form, isFixed })}
        />
        <CheckboxField
          label="Active"
          checked={form.isActive}
          onChange={(isActive) => setForm({ ...form, isActive })}
        />
      </div>
    </div>
  );
}

function MetaTab({
  metaItems,
  onChange,
  setNotice,
}: {
  metaItems: MetaItem[];
  onChange: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const [editingItem, setEditingItem] = useState<MetaItem | null>(null);
  const [valueInput, setValueInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const updateMutation = api.pricing.meta.update.useMutation({
    onSuccess: async () => {
      await onChange();
      setEditingItem(null);
      setValueInput("");
      setNotice({ tone: "success", message: "Meta setting updated." });
    },
    onError: (error) => setFormError(error.message),
  });

  const openEdit = (item: MetaItem) => {
    setEditingItem(item);
    setValueInput(toPrettyJson(item.value));
    setFormError(null);
  };

  const save = () => {
    if (!editingItem) return;
    try {
      updateMutation.mutate({
        key: editingItem.key,
        value: parseJsonValue(valueInput),
      });
    } catch {
      setFormError("Value must be valid JSON.");
    }
  };

  return (
    <CrudSection
      title="Meta Settings"
      description="Shared JSON settings consumed by the estimator resolver."
    >
      {metaItems.length === 0 ? (
        <EmptyState>No meta settings found.</EmptyState>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metaItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.key}</TableCell>
                <TableCell>
                  <code className="line-clamp-2 text-xs text-muted-foreground">
                    {toPrettyJson(item.value)}
                  </code>
                </TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell>
                  <Badge tone={statusTone(item.isActive)}>
                    {statusLabel(item.isActive)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                    Edit JSON
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={Boolean(editingItem)} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogHeader>
          <DialogTitle>Edit {editingItem?.key}</DialogTitle>
        </DialogHeader>
        <FormField>
          <Label htmlFor="meta-value">JSON value</Label>
          <Textarea
            id="meta-value"
            className="min-h-52 font-mono text-xs"
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
          />
        </FormField>
        {formError ? <Alert tone="destructive">{formError}</Alert> : null}
        <DialogActions
          isSaving={updateMutation.isPending}
          onCancel={() => setEditingItem(null)}
          onSave={save}
        />
      </Dialog>
    </CrudSection>
  );
}

function CrudSection({
  title,
  description,
  actionLabel,
  onCreate,
  children,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onCreate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {actionLabel && onCreate ? (
          <Button onClick={onCreate}>{actionLabel}</Button>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function DialogActions({
  isSaving,
  onCancel,
  onSave,
}: {
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} disabled={isSaving}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

function DeleteDialog({
  open,
  title,
  message,
  isDeleting,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Dialog>
  );
}
