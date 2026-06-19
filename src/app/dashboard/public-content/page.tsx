"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CursorPressLink,
  Dialog,
  DialogHeader,
  DialogTitle,
  Input,
  LoadingState,
  Textarea,
} from "@/components/ui";
import { api, type RouterOutputs } from "$/trpc/client";

type PublicContentBlock =
  RouterOutputs["publicContent"]["getAllAdmin"][number];

type PublicContentFormData = {
  title: string;
  subtitle: string;
  body: string;
  href: string;
  ctaLabel: string;
  items: string;
  metadata: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
};

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

type DragKind = "group" | "block";

function setTransparentDragImage(event: React.DragEvent<HTMLElement>) {
  const dragImage = document.createElement("span");
  dragImage.style.position = "fixed";
  dragImage.style.top = "-1000px";
  dragImage.style.left = "-1000px";
  dragImage.style.width = "1px";
  dragImage.style.height = "1px";
  document.body.appendChild(dragImage);
  event.dataTransfer.setDragImage(dragImage, 0, 0);
  window.setTimeout(() => dragImage.remove(), 0);
}

function formatJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}

function parseJsonField(value: string, fallback: unknown) {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return JSON.parse(trimmed) as unknown;
}

function blockToFormData(block: PublicContentBlock): PublicContentFormData {
  return {
    title: block.title ?? "",
    subtitle: block.subtitle ?? "",
    body: block.body ?? "",
    href: block.href ?? "",
    ctaLabel: block.ctaLabel ?? "",
    items: formatJson(block.items),
    metadata: formatJson(block.metadata),
    displayOrder: block.displayOrder,
    isVisible: block.isVisible,
    isFeatured: block.isFeatured,
  };
}

function getGroupKey(block: PublicContentBlock) {
  return `${block.page} / ${block.locale} / ${block.sectionKey}`;
}

function getSectionKeyFromGroupKey(groupKey: string | null) {
  return groupKey?.split(" / ")[2] ?? "";
}

function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sectionLabel(value: string) {
  const labels: Record<string, string> = {
    hero: "Hero",
    "what-i-can-own": "Metrics",
    "selected-work": "Selected Work",
    experience: "Experience",
    "technical-strengths": "Technical Strengths",
    "proof-links": "Proof Locker",
    "common-questions": "Common Questions",
    contact: "Contact",
    profile: "Resume Profile",
  };

  return labels[value] ?? titleCase(value);
}

function groupMeta(groupBlocks: PublicContentBlock[]) {
  const first = groupBlocks[0];

  if (!first) {
    return {
      title: "Section",
      subtitle: "Public content",
    };
  }

  return {
    title: sectionLabel(first.sectionKey),
    subtitle: `${groupBlocks.length} ${
      groupBlocks.length === 1 ? "content block" : "content blocks"
    }`,
  };
}

function getProjectHref(project: { caseStudySlug?: string | null; id: string }) {
  return `/projects/${project.caseStudySlug || project.id}`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

export default function PublicContentAdminPage() {
  const [editingBlock, setEditingBlock] = useState<PublicContentBlock | null>(
    null
  );
  const [formData, setFormData] = useState<PublicContentFormData | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [draggedGroupKey, setDraggedGroupKey] = useState<string | null>(null);
  const [dragKind, setDragKind] = useState<DragKind | null>(null);
  const [dragCursor, setDragCursor] = useState<{ x: number; y: number } | null>(
    null
  );
  const [orderedBlocks, setOrderedBlocks] = useState<PublicContentBlock[]>([]);

  const {
    data: blocksData,
    isLoading,
    refetch,
  } = api.publicContent.getAllAdmin.useQuery();
  const { data: featuredProjects = [] } = api.projects.getFeatured.useQuery({
    visibleOnly: false,
  });

  const groupedBlocks = useMemo(() => {
    return orderedBlocks.reduce<Record<string, PublicContentBlock[]>>((acc, block) => {
      const groupKey = getGroupKey(block);
      acc[groupKey] = acc[groupKey] ?? [];
      acc[groupKey].push(block);
      return acc;
    }, {});
  }, [orderedBlocks]);

  const groupEntries = useMemo(() => Object.entries(groupedBlocks), [groupedBlocks]);

  useEffect(() => {
    if (!blocksData || dragKind) return;
    setOrderedBlocks(
      [...blocksData].sort((a, b) => a.displayOrder - b.displayOrder)
    );
  }, [blocksData, dragKind]);

  const updateMutation = api.publicContent.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingBlock(null);
      setFormData(null);
      setNotice({ tone: "success", message: "Public content updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update content: ${error.message}`,
      });
    },
  });

  const reorderMutation = api.publicContent.reorder.useMutation({
    onSuccess: () => {
      refetch();
      setNotice({ tone: "success", message: "Content order updated." });
    },
    onError: (error) => {
      setNotice({
        tone: "error",
        message: `Failed to update order: ${error.message}`,
      });
    },
  });

  const handleEdit = (block: PublicContentBlock) => {
    setNotice(null);
    setEditingBlock(block);
    setFormData(blockToFormData(block));
  };

  const moveDraggedBlock = (
    targetBlock: PublicContentBlock,
    groupBlocks: PublicContentBlock[]
  ) => {
    if (dragKind !== "block" || !draggedBlockId || draggedBlockId === targetBlock.id) {
      return;
    }

    const fromIndex = groupBlocks.findIndex((block) => block.id === draggedBlockId);
    const toIndex = groupBlocks.findIndex((block) => block.id === targetBlock.id);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const groupKey = getGroupKey(targetBlock);
    setOrderedBlocks((current) => {
      const currentGroup = current.filter((block) => getGroupKey(block) === groupKey);
      const currentFromIndex = currentGroup.findIndex(
        (block) => block.id === draggedBlockId
      );
      const currentToIndex = currentGroup.findIndex(
        (block) => block.id === targetBlock.id
      );

      if (currentFromIndex < 0 || currentToIndex < 0) {
        return current;
      }

      const reorderedGroup = [...currentGroup];
      const [moved] = reorderedGroup.splice(currentFromIndex, 1);
      reorderedGroup.splice(currentToIndex, 0, moved);
      const queue = [...reorderedGroup];

      return current.map((block) =>
        getGroupKey(block) === groupKey ? queue.shift() ?? block : block
      );
    });
  };

  const moveDraggedGroup = (targetGroupKey: string) => {
    if (dragKind !== "group" || !draggedGroupKey || draggedGroupKey === targetGroupKey) {
      return;
    }

    setOrderedBlocks((current) => {
      const currentGroups = Array.from(
        new Map(current.map((block) => [getGroupKey(block), null])).keys()
      );
      const fromIndex = currentGroups.indexOf(draggedGroupKey);
      const toIndex = currentGroups.indexOf(targetGroupKey);

      if (fromIndex < 0 || toIndex < 0) {
        return current;
      }

      const nextGroups = [...currentGroups];
      const [moved] = nextGroups.splice(fromIndex, 1);
      nextGroups.splice(toIndex, 0, moved);

      return nextGroups.flatMap((groupKey) =>
        current.filter((block) => getGroupKey(block) === groupKey)
      );
    });
  };

  const handleDrop = (targetBlock: PublicContentBlock) => {
    if (!draggedBlockId) {
      setDraggedBlockId(null);
      setDragKind(null);
      setDragCursor(null);
      return;
    }

    const groupKey = getGroupKey(targetBlock);
    const groupBlocks = orderedBlocks.filter(
      (block) => getGroupKey(block) === groupKey
    );
    const displayOrders = groupBlocks
      .map((block) => block.displayOrder)
      .sort((a, b) => a - b);

    setDraggedBlockId(null);
    setDragKind(null);
    setDragCursor(null);
    reorderMutation.mutate({
      updates: groupBlocks.map((block, index) => ({
        id: block.id,
        displayOrder: displayOrders[index] ?? index + 1,
      })),
    });
  };

  const handleGroupDrop = () => {
    if (!draggedGroupKey) {
      setDraggedGroupKey(null);
      setDragKind(null);
      setDragCursor(null);
      return;
    }

    const displayOrders = orderedBlocks
      .map((block) => block.displayOrder)
      .sort((a, b) => a - b);

    setDraggedGroupKey(null);
    setDragKind(null);
    setDragCursor(null);
    reorderMutation.mutate({
      updates: orderedBlocks.map((block, index) => ({
        id: block.id,
        displayOrder: displayOrders[index] ?? index + 1,
      })),
    });
  };

  const handleClose = () => {
    setEditingBlock(null);
    setFormData(null);
  };

  const handleSave = () => {
    if (!editingBlock || !formData) return;

    try {
      const parsedItems = parseJsonField(formData.items, []);
      const parsedMetadata = parseJsonField(formData.metadata, {});

      if (!Array.isArray(parsedItems)) {
        setNotice({ tone: "error", message: "Items must be a JSON array." });
        return;
      }

      if (
        !parsedMetadata ||
        typeof parsedMetadata !== "object" ||
        Array.isArray(parsedMetadata)
      ) {
        setNotice({
          tone: "error",
          message: "Metadata must be a JSON object.",
        });
        return;
      }

      updateMutation.mutate({
        id: editingBlock.id,
        data: {
          title: formData.title || null,
          subtitle: formData.subtitle || null,
          body: formData.body || null,
          href: formData.href || null,
          ctaLabel: formData.ctaLabel || null,
          items: parsedItems,
          metadata: parsedMetadata as Record<string, unknown>,
          displayOrder: formData.displayOrder,
          isVisible: formData.isVisible,
          isFeatured: formData.isFeatured,
        },
      });
    } catch {
      setNotice({
        tone: "error",
        message: "Items or metadata contains invalid JSON.",
      });
    }
  };

  const updateField = <K extends keyof PublicContentFormData>(
    key: K,
    value: PublicContentFormData[K]
  ) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="w-full min-w-0">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-ruby">
            CMS
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Public Content
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Edit homepage copy, proof links, common questions, CTAs, and other
            seeded public-page blocks.
          </p>
        </div>
      </div>

      {notice ? (
        <div
          role="status"
          className={
            notice.tone === "success"
              ? "mb-5 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
              : "mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          }
        >
          {notice.message}
        </div>
      ) : null}

      {isLoading ? (
        <Card className="p-10">
          <LoadingState>Loading public content</LoadingState>
        </Card>
      ) : Object.keys(groupedBlocks).length === 0 ? (
        <Card className="p-8 text-sm text-muted-foreground">
          No public content blocks found.
        </Card>
      ) : (
        <div className="grid gap-8">
          {groupEntries.map(([group, groupBlocks]) => (
            <section
              key={group}
              className={`rounded-md border border-transparent p-2 transition-colors ${
                draggedGroupKey && draggedGroupKey !== group
                  ? "border-dashed border-accent/40"
                  : ""
              }`}
              onDragOver={(event) => {
                if (dragKind !== "group") return;
                event.preventDefault();
                setDragCursor({ x: event.clientX, y: event.clientY });
                moveDraggedGroup(group);
              }}
              onDrop={handleGroupDrop}
            >
              {(() => {
                const meta = groupMeta(groupBlocks);
                return (
                  <div
                    className={`mb-3 cursor-grab rounded-md border border-border bg-muted/30 px-3 py-2 transition-opacity ${
                      draggedGroupKey === group ? "opacity-40" : ""
                    }`}
                    draggable
                    onDragStart={(event) => {
                      setTransparentDragImage(event);
                      setDraggedGroupKey(group);
                      setDragKind("group");
                      setDragCursor({ x: event.clientX, y: event.clientY });
                    }}
                    onDragEnd={() => {
                      setDraggedGroupKey(null);
                      setDragKind(null);
                      setDragCursor(null);
                    }}
                  >
                    <p className="font-mono text-xs uppercase text-muted-foreground">
                      Drag section
                    </p>
                    <h2 className="mt-1 break-words font-display text-xl font-semibold">
                      {meta.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {meta.subtitle}
                    </p>
                  </div>
                );
              })()}
              {draggedGroupKey && draggedGroupKey !== group ? (
                <div className="mb-3 rounded-md border border-dashed border-accent/60 bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
                  Drop section here
                </div>
              ) : null}
              <div className="grid gap-3">
                {groupBlocks.map((block) => (
                  <Card
                    key={block.id}
                    className={`cursor-grab transition-[opacity,border-color] ${
                      draggedBlockId === block.id
                        ? "border-accent/70 opacity-40"
                        : draggedBlockId
                          ? "border-dashed"
                          : ""
                    }`}
                    draggable
                    onDragStart={(event) => {
                      setTransparentDragImage(event);
                      setDraggedBlockId(block.id);
                      setDragKind("block");
                      setDragCursor({ x: event.clientX, y: event.clientY });
                    }}
                    onDragOver={(event) => {
                      if (dragKind !== "block") return;
                      event.preventDefault();
                      setDragCursor({ x: event.clientX, y: event.clientY });
                      moveDraggedBlock(block, groupBlocks);
                    }}
                    onDrop={() => handleDrop(block)}
                    onDragEnd={() => {
                      setDraggedBlockId(null);
                      setDragKind(null);
                      setDragCursor(null);
                    }}
                  >
                    {draggedBlockId && draggedBlockId !== block.id ? (
                      <div className="mx-4 mt-3 rounded-md border border-dashed border-accent/60 bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
                        Drop block here
                      </div>
                    ) : null}
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{block.blockType}</Badge>
                        <Badge>{block.blockKey}</Badge>
                        <Badge>Order {block.displayOrder}</Badge>
                        {!block.isVisible ? (
                          <Badge tone="warning">Hidden</Badge>
                        ) : null}
                        {block.isFeatured ? (
                          <Badge tone="success">Featured</Badge>
                        ) : null}
                      </div>
                      <p className="pt-2 font-mono text-xs uppercase text-muted-foreground">
                        Drag to reorder within this section
                      </p>
                      <CardTitle className="pt-2">
                        {block.title || block.blockKey}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {block.subtitle ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {block.subtitle}
                        </p>
                      ) : null}
                      {block.body ? (
                        <p className="mt-3 leading-7 text-foreground">
                          {block.body}
                        </p>
                      ) : null}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => handleEdit(block)}>
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {groupBlocks[0]?.sectionKey === "selected-work" ? (
                  <div className="mt-4 min-w-0 rounded-md border border-border bg-muted/20 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">
                        Homepage cards
                      </p>
                      <h3 className="mt-1 font-display text-lg font-semibold">
                        Featured projects shown on the homepage
                      </h3>
                    </div>
                    <CursorPressLink
                      href="/dashboard/projects"
                      className="w-full sm:w-auto"
                    >
                      Edit projects
                    </CursorPressLink>
                  </div>
                  {featuredProjects.length > 0 ? (
                    <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
                      {featuredProjects.map((project) => (
                        <Card key={project.id} className="p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge>{project.status}</Badge>
                            <Badge>Order {project.displayOrder}</Badge>
                            {project.isVisible ? null : (
                              <Badge tone="warning">Hidden</Badge>
                            )}
                            {project.isFeatured ? (
                              <Badge tone="success">Featured</Badge>
                            ) : null}
                          </div>
                          <h4 className="mt-3 break-words font-display text-lg font-semibold">
                            {project.title}
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {project.hiringSignal ||
                              project.subtitle ||
                              project.description}
                          </p>
                          <div className="mt-4 grid gap-3 text-sm sm:flex sm:flex-wrap">
                            <CursorPressLink
                              href={getProjectHref(project)}
                              size="sm"
                            >
                              View case study
                            </CursorPressLink>
                            <CursorPressLink
                              href="/dashboard/projects"
                              size="sm"
                              variant="quiet"
                            >
                              Edit project
                            </CursorPressLink>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">
                      No featured projects found. Mark projects as featured in
                      the Projects dashboard to populate the homepage cards.
                    </p>
                  )}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}

      {dragKind && dragCursor ? (
        <div
          className="pointer-events-none fixed z-50 w-[min(20rem,calc(100vw-2rem))] rounded-md border border-accent/60 bg-background/95 p-4 shadow-lg"
          style={{
            left: dragCursor.x + 14,
            top: dragCursor.y + 14,
          }}
        >
          <p className="font-mono text-xs uppercase text-ruby">
            Moving {dragKind === "group" ? "section" : "block"}
          </p>
          <p className="mt-1 break-words font-display text-lg font-semibold">
            {dragKind === "group"
              ? sectionLabel(getSectionKeyFromGroupKey(draggedGroupKey))
              : orderedBlocks.find((block) => block.id === draggedBlockId)
                  ?.title ||
                orderedBlocks.find((block) => block.id === draggedBlockId)
                  ?.blockKey ||
                draggedBlockId}
          </p>
        </div>
      ) : null}

      <Dialog
        open={!!editingBlock && !!formData}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        className="max-w-4xl p-0"
      >
        <DialogHeader className="mb-0 border-b border-border p-4 sm:p-6">
          <DialogTitle>Edit Public Content</DialogTitle>
        </DialogHeader>
        {formData ? (
          <div className="grid max-h-[calc(100dvh-8rem)] min-w-0 gap-4 overflow-y-auto overflow-x-hidden px-4 py-5 sm:max-h-[75vh] sm:px-6">
            <Field label="Title">
              <Input
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </Field>
            <Field label="Subtitle">
              <Textarea
                value={formData.subtitle}
                onChange={(event) =>
                  updateField("subtitle", event.target.value)
                }
                className="min-h-20"
              />
            </Field>
            <Field label="Body">
              <Textarea
                value={formData.body}
                onChange={(event) => updateField("body", event.target.value)}
              />
            </Field>
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <Field label="Href">
                <Input
                  value={formData.href}
                  onChange={(event) => updateField("href", event.target.value)}
                />
              </Field>
              <Field label="CTA label">
                <Input
                  value={formData.ctaLabel}
                  onChange={(event) =>
                    updateField("ctaLabel", event.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Display order">
              <Input
                type="number"
                value={formData.displayOrder}
                onChange={(event) =>
                  updateField("displayOrder", Number(event.target.value))
                }
              />
            </Field>
            <div className="flex min-w-0 flex-wrap gap-5">
              <label className="inline-flex min-w-0 items-center gap-2 text-sm">
                <Checkbox
                  checked={formData.isVisible}
                  onChange={(event) =>
                    updateField("isVisible", event.target.checked)
                  }
                />
                Visible
              </label>
              <label className="inline-flex min-w-0 items-center gap-2 text-sm">
                <Checkbox
                  checked={formData.isFeatured}
                  onChange={(event) =>
                    updateField("isFeatured", event.target.checked)
                  }
                />
                Featured
              </label>
            </div>
            <Field label="Items JSON">
              <Textarea
                value={formData.items}
                onChange={(event) => updateField("items", event.target.value)}
                spellCheck={false}
                className="min-h-40 font-mono text-xs"
              />
            </Field>
            <Field label="Metadata JSON">
              <Textarea
                value={formData.metadata}
                onChange={(event) =>
                  updateField("metadata", event.target.value)
                }
                spellCheck={false}
                className="min-h-32 font-mono text-xs"
              />
            </Field>
            <div className="sticky bottom-0 -mx-4 -mb-5 grid gap-2 border-t border-border bg-popover p-4 sm:-mx-6 sm:-mb-5 sm:flex sm:justify-end">
              <Button className="w-full sm:w-auto" variant="quiet" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving" : "Save"}
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
