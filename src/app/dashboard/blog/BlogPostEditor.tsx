"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  LoadingState,
  Select,
  Textarea,
} from "@/components/ui";
import { api } from "$/trpc/client";

type BlogPostStatus = "draft" | "published" | "archived" | "scheduled" | "deleted";

type BlogPostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: BlogPostStatus;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
};

type BlogPostEditorProps =
  | {
      mode: "create";
      postId?: never;
    }
  | {
      mode: "edit";
      postId: string;
    };

const defaultFormData: BlogPostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  tags: [],
  imageUrl: "",
  imageAlt: "",
};

const statusOptions: Array<{ value: BlogPostStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
  { value: "scheduled", label: "Scheduled" },
  { value: "deleted", label: "Deleted" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

export function BlogPostEditor({ mode, postId }: BlogPostEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogPostFormData>(defaultFormData);
  const [tagInput, setTagInput] = useState("");
  const [notice, setNotice] = useState<{
    tone: "success" | "destructive";
    message: string;
  } | null>(null);

  const { data: post, isLoading: isLoadingPost } = api.blog.getById.useQuery(
    { id: postId ?? "" },
    { enabled: mode === "edit" && Boolean(postId) }
  );

  const createMutation = api.blog.create.useMutation({
    onSuccess: () => {
      setNotice({ tone: "success", message: "Blog post created." });
      router.push("/dashboard/blog");
    },
    onError: (error) => {
      setNotice({
        tone: "destructive",
        message: error.message || "Failed to create blog post.",
      });
    },
  });

  const updateMutation = api.blog.update.useMutation({
    onSuccess: () => {
      setNotice({ tone: "success", message: "Blog post updated." });
      router.push("/dashboard/blog");
    },
    onError: (error) => {
      setNotice({
        tone: "destructive",
        message: error.message || "Failed to update blog post.",
      });
    },
  });

  useEffect(() => {
    if (!post) return;

    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      status: post.status as BlogPostStatus,
      tags: post.tags ?? [],
      imageUrl: post.imageUrl ?? "",
      imageAlt: post.imageAlt ?? "",
    });
  }, [post]);

  const updateField = <K extends keyof BlogPostFormData>(
    key: K,
    value: BlogPostFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;

    updateField("tags", [...formData.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField(
      "tags",
      formData.tags.filter((item) => item !== tag)
    );
  };

  const handleSubmit = () => {
    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      status: formData.status,
      tags: formData.tags,
      imageUrl: formData.imageUrl || undefined,
      imageAlt: formData.imageAlt || undefined,
    };

    if (mode === "edit") {
      updateMutation.mutate({ id: postId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const canSubmit =
    formData.title.trim().length > 0 &&
    formData.slug.trim().length > 0 &&
    formData.content.trim().length > 0 &&
    !isSaving;

  if (mode === "edit" && isLoadingPost) {
    return <LoadingState>Loading blog post</LoadingState>;
  }

  if (mode === "edit" && !post && !isLoadingPost) {
    return <Alert tone="destructive">Blog post not found.</Alert>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Blog Post" : "Create Blog Post"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notice ? (
          <Alert tone={notice.tone} className="mb-4">
            {notice.message}
          </Alert>
        ) : null}

        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <Field label="Title">
              <Input
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(event) =>
                  updateField("status", event.target.value as BlogPostStatus)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <Field label="Slug">
              <Input
                value={formData.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                required
              />
            </Field>
            <Button
              variant="outline"
              onClick={() => updateField("slug", slugify(formData.title))}
              disabled={!formData.title.trim()}
            >
              Generate
            </Button>
          </div>

          <Field label="Excerpt">
            <Textarea
              value={formData.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              className="min-h-24"
            />
          </Field>

          <Field label="Content">
            <Textarea
              value={formData.content}
              onChange={(event) => updateField("content", event.target.value)}
              className="min-h-80 font-mono text-sm"
              required
            />
          </Field>

          <div>
            <span className="text-sm font-medium text-foreground">Tags</span>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
                Add
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                  onClick={() => removeTag(tag)}
                >
                  {tag} x
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Image URL">
              <Input
                value={formData.imageUrl}
                onChange={(event) => updateField("imageUrl", event.target.value)}
              />
            </Field>
            <Field label="Image alt text">
              <Input
                value={formData.imageAlt}
                onChange={(event) => updateField("imageAlt", event.target.value)}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="quiet" onClick={() => router.push("/dashboard/blog")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {isSaving ? "Saving" : mode === "edit" ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
