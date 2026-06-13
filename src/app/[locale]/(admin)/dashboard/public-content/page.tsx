"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import { api, type RouterOutputs } from "$/trpc/client";
import { ClientOnly } from "~/ClientOnly";
import { useSnackbar } from "~/SnackbarProvider";

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

export default function PublicContentAdminPage() {
  const { showSnackbar } = useSnackbar();
  const [editingBlock, setEditingBlock] = useState<PublicContentBlock | null>(
    null
  );
  const [formData, setFormData] = useState<PublicContentFormData | null>(null);

  const {
    data: blocks = [],
    isLoading,
    refetch,
  } = api.publicContent.getAllAdmin.useQuery();

  const groupedBlocks = useMemo(() => {
    return blocks.reduce<Record<string, PublicContentBlock[]>>((acc, block) => {
      const groupKey = `${block.page} / ${block.locale} / ${block.sectionKey}`;
      acc[groupKey] = acc[groupKey] ?? [];
      acc[groupKey].push(block);
      return acc;
    }, {});
  }, [blocks]);

  const updateMutation = api.publicContent.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingBlock(null);
      setFormData(null);
      showSnackbar("Public content updated.", "success");
    },
    onError: (error) => {
      showSnackbar(`Failed to update content: ${error.message}`, "error");
    },
  });

  const handleEdit = (block: PublicContentBlock) => {
    setEditingBlock(block);
    setFormData(blockToFormData(block));
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
        showSnackbar("Items must be a JSON array.", "error");
        return;
      }

      if (
        !parsedMetadata ||
        typeof parsedMetadata !== "object" ||
        Array.isArray(parsedMetadata)
      ) {
        showSnackbar("Metadata must be a JSON object.", "error");
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
      showSnackbar("Items or metadata contains invalid JSON.", "error");
    }
  };

  const updateField = <K extends keyof PublicContentFormData>(
    key: K,
    value: PublicContentFormData[K]
  ) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <ClientOnly>
      <Box sx={{ p: 3 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Public Content
          </Typography>
          <Typography color="text.secondary">
            Edit homepage copy, proof links, common questions, CTAs, and other
            seeded public-page blocks.
          </Typography>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            {Object.entries(groupedBlocks).map(([group, groupBlocks]) => (
              <Box key={group}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  {group}
                </Typography>
                <Stack spacing={1.5}>
                  {groupBlocks.map((block) => (
                    <Card key={block.id} variant="outlined">
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mb: 1, flexWrap: "wrap" }}
                        >
                          <Chip size="small" label={block.blockType} />
                          <Chip size="small" label={block.blockKey} />
                          {!block.isVisible ? (
                            <Chip size="small" color="warning" label="Hidden" />
                          ) : null}
                          {block.isFeatured ? (
                            <Chip size="small" color="success" label="Featured" />
                          ) : null}
                        </Stack>
                        <Typography variant="h6">
                          {block.title || block.blockKey}
                        </Typography>
                        {block.subtitle ? (
                          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {block.subtitle}
                          </Typography>
                        ) : null}
                        {block.body ? (
                          <Typography sx={{ mt: 1 }}>{block.body}</Typography>
                        ) : null}
                      </CardContent>
                      <CardActions>
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(block)}
                        >
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        <Dialog open={!!editingBlock && !!formData} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>Edit Public Content</DialogTitle>
          {formData ? (
            <DialogContent>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Subtitle"
                  value={formData.subtitle}
                  onChange={(event) =>
                    updateField("subtitle", event.target.value)
                  }
                  fullWidth
                  multiline
                  minRows={2}
                />
                <TextField
                  label="Body"
                  value={formData.body}
                  onChange={(event) => updateField("body", event.target.value)}
                  fullWidth
                  multiline
                  minRows={4}
                />
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    label="Href"
                    value={formData.href}
                    onChange={(event) => updateField("href", event.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="CTA label"
                    value={formData.ctaLabel}
                    onChange={(event) =>
                      updateField("ctaLabel", event.target.value)
                    }
                    fullWidth
                  />
                </Stack>
                <TextField
                  label="Display order"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(event) =>
                    updateField("displayOrder", Number(event.target.value))
                  }
                  fullWidth
                />
                <Stack direction="row" spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isVisible}
                        onChange={(event) =>
                          updateField("isVisible", event.target.checked)
                        }
                      />
                    }
                    label="Visible"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(event) =>
                          updateField("isFeatured", event.target.checked)
                        }
                      />
                    }
                    label="Featured"
                  />
                </Stack>
                <TextField
                  label="Items JSON"
                  value={formData.items}
                  onChange={(event) => updateField("items", event.target.value)}
                  fullWidth
                  multiline
                  minRows={6}
                  spellCheck={false}
                />
                <TextField
                  label="Metadata JSON"
                  value={formData.metadata}
                  onChange={(event) =>
                    updateField("metadata", event.target.value)
                  }
                  fullWidth
                  multiline
                  minRows={5}
                  spellCheck={false}
                />
              </Stack>
            </DialogContent>
          ) : null}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
}
