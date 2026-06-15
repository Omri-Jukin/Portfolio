"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "$/trpc/client";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  LoadingState,
} from "@/components/ui";

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

const SECTION_COPY: Record<
  string,
  { title: string; description: string; href?: string }
> = {
  pendingUsers: {
    title: "Pending Users",
    description: "Manage user registrations and approvals.",
  },
  roles: {
    title: "Roles & Permissions",
    description: "Manage roles and admin permissions.",
    href: "/dashboard/roles",
  },
  blog: {
    title: "Blog Posts",
    description: "Manage blog posts and content.",
    href: "/dashboard/blog",
  },
  publicContent: {
    title: "Content Workspace",
    description: "Edit page copy and jump into structured content tables.",
    href: "/dashboard/content",
  },
  projects: {
    title: "Projects",
    description: "Manage portfolio projects and case-study proof.",
    href: "/dashboard/projects",
  },
  skills: {
    title: "Skills",
    description: "Manage technical skills and competencies.",
    href: "/dashboard/skills",
  },
  workExperience: {
    title: "Work Experience",
    description: "Manage roles, achievements, and career history.",
    href: "/dashboard/work-experiences",
  },
  education: {
    title: "Education",
    description: "Manage academic background and education entries.",
    href: "/dashboard/education",
  },
  certifications: {
    title: "Certifications",
    description: "Manage credentials and certification metadata.",
    href: "/dashboard/certifications",
  },
  intakes: {
    title: "Project Intakes",
    description: "Review intake forms and custom intake links.",
    href: "/dashboard/intakes",
  },
  calculatorSettings: {
    title: "Calculator Settings",
    description: "Manage pricing calculator settings.",
    href: "/dashboard/calculator-settings",
  },
  pricing: {
    title: "Pricing Management",
    description: "Manage project types, base rates, features, and multipliers.",
    href: "/dashboard/pricing",
  },
  discounts: {
    title: "Discounts",
    description: "Manage discount codes and scope restrictions.",
    href: "/dashboard/discounts",
  },
  emails: {
    title: "Email Templates",
    description: "Manage styled email templates and outreach copy.",
    href: "/dashboard/emails",
  },
  proposals: {
    title: "Proposals",
    description: "Create and manage client proposals.",
    href: "/dashboard/proposals",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const [draggedSectionKey, setDraggedSectionKey] = useState<string | null>(
    null
  );
  const [dragCursor, setDragCursor] = useState<{ x: number; y: number } | null>(
    null
  );
  const [orderedSectionKeys, setOrderedSectionKeys] = useState<string[]>([]);
  const [orderNotice, setOrderNotice] = useState<string | null>(null);
  const { data: userData } = api.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const { data: sections, isLoading, error } =
    api.adminDashboard.getSections.useQuery(undefined, {
      retry: false,
      refetchOnWindowFocus: false,
    });
  const logoutMutation = api.auth.logout.useMutation();
  const reorderMutation = api.adminDashboard.updateSectionOrder.useMutation({
    onSuccess: () => {
      utils.adminDashboard.getSections.invalidate();
      setOrderNotice("Dashboard order updated.");
    },
    onError: (error) => {
      setOrderNotice(`Dashboard order could not be saved: ${error.message}`);
    },
  });

  const enabledSections = useMemo(
    () =>
      (sections ?? [])
        .filter((section) => section.enabled && SECTION_COPY[section.sectionKey]?.href)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [sections]
  );
  const orderedSections = useMemo(() => {
    if (orderedSectionKeys.length === 0) {
      return enabledSections;
    }

    const sectionByKey = new Map(
      enabledSections.map((section) => [section.sectionKey, section])
    );
    const ordered = orderedSectionKeys
      .map((sectionKey) => sectionByKey.get(sectionKey))
      .filter((section): section is (typeof enabledSections)[number] =>
        Boolean(section)
      );
    const orderedKeys = new Set(ordered.map((section) => section.sectionKey));
    const missing = enabledSections.filter(
      (section) => !orderedKeys.has(section.sectionKey)
    );

    return [...ordered, ...missing];
  }, [enabledSections, orderedSectionKeys]);

  useEffect(() => {
    setOrderedSectionKeys(
      enabledSections.map((section) => section.sectionKey)
    );
  }, [enabledSections]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      await signOut({ redirect: false, callbackUrl: "/login" });
    } finally {
      await utils.auth.me.invalidate();
      router.replace("/login");
      router.refresh();
    }
  };

  if (isLoading) {
    return <LoadingState>Loading dashboard sections</LoadingState>;
  }

  if (error) {
    return (
      <Alert tone="destructive">
        Dashboard sections could not load. The protected shell is available,
        but the content API returned an error.
      </Alert>
    );
  }

  const moveDraggedSection = (targetSectionKey: string) => {
    if (!draggedSectionKey || draggedSectionKey === targetSectionKey) {
      return;
    }

    setOrderedSectionKeys((current) => {
      const fromIndex = current.indexOf(draggedSectionKey);
      const toIndex = current.indexOf(targetSectionKey);

      if (fromIndex < 0 || toIndex < 0) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleSectionDrop = () => {
    if (!draggedSectionKey) {
      setDraggedSectionKey(null);
      return;
    }

    setDraggedSectionKey(null);
    setDragCursor(null);

    reorderMutation.mutate({
      sections: orderedSections.map((section, index) => ({
        sectionKey: section.sectionKey,
        displayOrder: index + 1,
      })),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome{userData?.user?.name ? `, ${userData.user.name}` : ""}
          </CardTitle>
          <CardDescription>
            Use these sections to manage the public portfolio and hidden service
            workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            View site
          </Link>
        </CardContent>
      </Card>

      {orderNotice ? (
        <Alert
          tone={
            orderNotice.includes("could not be saved")
              ? "destructive"
              : "success"
          }
        >
          {orderNotice}
        </Alert>
      ) : null}

      {orderedSections.length === 0 ? (
        <EmptyState>No dashboard sections are enabled.</EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orderedSections.map((section) => {
            const copy = SECTION_COPY[section.sectionKey] ?? {
              title: section.sectionKey,
              description: "Dashboard section.",
              href: undefined,
            };

            return (
              <Card
                key={section.sectionKey}
                className={`flex cursor-grab flex-col transition-[opacity,transform,border-color] ${
                  draggedSectionKey === section.sectionKey
                    ? "border-accent/70 opacity-40"
                    : draggedSectionKey
                      ? "border-dashed"
                      : ""
                }`}
                draggable
                onDragStart={(event) => {
                  setTransparentDragImage(event);
                  setDraggedSectionKey(section.sectionKey);
                  setDragCursor({ x: event.clientX, y: event.clientY });
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragCursor({ x: event.clientX, y: event.clientY });
                  moveDraggedSection(section.sectionKey);
                }}
                onDrop={handleSectionDrop}
                onDragEnd={() => {
                  setDraggedSectionKey(null);
                  setDragCursor(null);
                }}
              >
                {draggedSectionKey && draggedSectionKey !== section.sectionKey ? (
                  <div className="mx-4 mt-3 rounded-md border border-dashed border-accent/60 bg-accent/10 px-3 py-2 text-xs font-medium text-accent">
                    Drop here
                  </div>
                ) : null}
                <CardHeader>
                  <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">
                    Drag to reorder
                  </p>
                  <CardTitle>{copy.title}</CardTitle>
                  <CardDescription>{copy.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  {copy.href ? (
                    <Link
                      href={copy.href}
                      className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Open section
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No direct page yet
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {draggedSectionKey && dragCursor ? (
        <div
          className="pointer-events-none fixed z-50 w-72 rounded-md border border-accent/60 bg-background/95 p-4 shadow-lg"
          style={{
            left: dragCursor.x + 14,
            top: dragCursor.y + 14,
          }}
        >
          <p className="font-mono text-xs uppercase text-accent">
            Moving dashboard card
          </p>
          <p className="mt-1 font-display text-lg font-semibold">
            {SECTION_COPY[draggedSectionKey]?.title ?? draggedSectionKey}
          </p>
        </div>
      ) : null}
    </div>
  );
}
