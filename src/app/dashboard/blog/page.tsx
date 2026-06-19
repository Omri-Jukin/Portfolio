"use client";

import { format } from "date-fns";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  CursorPressLink,
  Dialog,
  DialogHeader,
  DialogTitle,
  EmptyState,
  LoadingState,
} from "@/components/ui";
import { api } from "$/trpc/client";
import { useState } from "react";

function statusTone(status: string): "default" | "success" | "warning" | "destructive" {
  if (status === "published") return "success";
  if (status === "scheduled") return "warning";
  if (status === "deleted" || status === "archived") return "destructive";
  return "default";
}

export default function BlogAdminPage() {
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { data: posts = [], isLoading, refetch } = api.blog.getAll.useQuery();

  const deleteMutation = api.blog.delete.useMutation({
    onSuccess: () => {
      setPostToDelete(null);
      void refetch();
    },
  });

  return (
    <div className="w-full min-w-0">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-ruby">
            CMS
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Blog</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Manage engineering notes, publication status, tags, and public
            metadata.
          </p>
        </div>
        <CursorPressLink href="/dashboard/blog/new" variant="solid">
          Create Post
        </CursorPressLink>
      </div>

      {isLoading ? (
        <LoadingState>Loading blog posts</LoadingState>
      ) : posts.length === 0 ? (
        <EmptyState>No blog posts found.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(post.status)}>{post.status}</Badge>
                  <Badge>{format(new Date(post.createdAt), "MMM d, yyyy")}</Badge>
                  {post.tags?.slice(0, 4).map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
                <CardTitle className="pt-3">{post.title}</CardTitle>
                <p className="font-mono text-xs text-muted-foreground">
                  /blog/{post.slug}
                </p>
              </CardHeader>
              <CardContent>
                {post.excerpt ? (
                  <p className="mb-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <CursorPressLink href={`/dashboard/blog/${post.id}/edit`}>
                    Edit
                  </CursorPressLink>
                  <Button
                    variant="destructive"
                    onClick={() => setPostToDelete(post.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                  {post.status === "published" ? (
                    <CursorPressLink href={`/blog/${post.slug}`} variant="ghost">
                      View public
                    </CursorPressLink>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(postToDelete)}
        onOpenChange={(open) => {
          if (!open) setPostToDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Blog Post</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setPostToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (postToDelete) {
                deleteMutation.mutate({ id: postToDelete });
              }
            }}
          >
            {deleteMutation.isPending ? "Deleting" : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
