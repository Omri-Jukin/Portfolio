"use client";

import { api } from "$/trpc/client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "~/DataGrid/DataGrid";
import { ClientOnly } from "~/ClientOnly";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { AdminDashboardSection } from "#/lib/db/adminDashboard/adminDashboard";

// Serialized version of AdminDashboardSection (dates become strings when serialized via tRPC)
type SerializedAdminDashboardSection = Omit<
  AdminDashboardSection,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

// Section configuration
const SECTION_CONFIG = {
  pendingUsers: {
    title: "Pending Users",
    description: "Manage user registrations and approvals.",
    route: null,
    buttonText: null,
  },
  blog: {
    title: "Blog Posts",
    description: "Manage blog posts and content.",
    route: "/admin/blog",
    buttonText: "View Blog Posts",
  },
  workExperience: {
    title: "Work Experience",
    description:
      "Manage professional work experience, roles, and career history.",
    route: "/admin/work-experiences",
    buttonText: "Manage Work Experience",
  },
  projects: {
    title: "Projects",
    description:
      "Manage portfolio projects, technical details, and showcased work.",
    route: "/admin/projects",
    buttonText: "Manage Projects",
  },
  skills: {
    title: "Skills",
    description:
      "Manage technical skills, proficiency levels, and competencies.",
    route: "/admin/skills",
    buttonText: "Manage Skills",
  },
  emails: {
    title: "Email Templates",
    description:
      "Create, edit, and send styled emails to clients. Manage templates with HTML/CSS editing.",
    route: "/admin/emails",
    buttonText: "Manage Email Templates",
  },
  education: {
    title: "Education",
    description:
      "Manage academic background, degrees, and educational achievements displayed on the portfolio.",
    route: "/admin/education",
    buttonText: "Manage Education",
  },
  certifications: {
    title: "Certifications",
    description:
      "Manage professional certifications and credentials displayed on the portfolio.",
    route: "/admin/certifications",
    buttonText: "Manage Certifications",
  },
  intakes: {
    title: "Project Intakes",
    description:
      "View and manage project intake forms submitted after meeting scheduling.",
    route: "/admin/intakes",
    buttonText: "View Intakes",
  },
} as const;

type SectionKey = keyof typeof SECTION_CONFIG;

interface SortableSectionCardProps {
  id: string;
  children: React.ReactNode;
}

function SortableSectionCard({ id, children }: SortableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: "24px",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 3,
        position: "relative",
        boxShadow: isDragging ? 6 : 1,
        transform: isDragging ? "rotate(2deg)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <CardContent>
        <Box
          {...attributes}
          {...listeners}
          sx={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState<
    Array<{ sectionKey: string; displayOrder: number }>
  >([]);

  // Check authentication using tRPC
  const { data: userData, error: authError } = api.auth.me.useQuery(undefined, {
    retry: false,
  });

  // Get dashboard sections
  // Note: tRPC serializes Date objects to strings at runtime, but TypeScript types remain as Date
  // We need to cast to the serialized version
  const { data: dashboardSections, isLoading: sectionsLoading } =
    api.adminDashboard.getSections.useQuery();

  // Type dashboardSections as serialized version (dates become strings via tRPC)
  // At runtime, tRPC automatically serializes Date to string, but TypeScript doesn't know this
  const typedDashboardSections = dashboardSections
    ? (dashboardSections as unknown as SerializedAdminDashboardSection[])
    : undefined;
  const updateOrderMutation = api.adminDashboard.updateSectionOrder.useMutation(
    {
      onSuccess: () => {
        setIsEditing(false);
        // Refetch sections to get updated order
        window.location.reload(); // Simple refresh for now
      },
    }
  );

  // Initialize sections from API or use defaults
  useEffect(() => {
    if (typedDashboardSections && typedDashboardSections.length > 0) {
      setSections(
        typedDashboardSections.map((s) => ({
          sectionKey: s.sectionKey,
          displayOrder: s.displayOrder,
        }))
      );
    } else if (!sectionsLoading) {
      // Use default order if no sections found
      const defaultSections = Object.keys(SECTION_CONFIG).map((key, index) => ({
        sectionKey: key,
        displayOrder: index + 1,
      }));
      setSections(defaultSections);
    }
  }, [typedDashboardSections, sectionsLoading]);

  // Handle authentication error
  useEffect(() => {
    if (authError) {
      console.error("Authentication error:", authError);
      router.push("/login");
    }
  }, [authError, router]);

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSections((items) => {
      const oldIndex = items.findIndex((item) => item.sectionKey === active.id);
      const newIndex = items.findIndex((item) => item.sectionKey === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return items;
      }

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update display order
      return newItems.map((item, index) => ({
        ...item,
        displayOrder: index + 1,
      }));
    });
  };

  const handleSaveOrder = () => {
    updateOrderMutation.mutate({ sections });
  };

  // Show loading while checking authentication
  if (!userData && !authError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error if not authenticated
  if (authError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Authentication failed
        </Typography>
        <Button variant="contained" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  // Sort sections by display order
  const sortedSections = [...sections].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <ClientOnly skeleton>
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original order
                    if (typedDashboardSections) {
                      setSections(
                        typedDashboardSections.map((s) => ({
                          sectionKey: s.sectionKey,
                          displayOrder: s.displayOrder,
                        }))
                      );
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveOrder}
                  disabled={updateOrderMutation.isPending}
                >
                  {updateOrderMutation.isPending ? "Saving..." : "Save Order"}
                </Button>
              </>
            ) : (
              <>
                <Tooltip title="Drag and drop sections to reorder">
                  <Button variant="outlined" onClick={() => setIsEditing(true)}>
                    Reorder Sections
                  </Button>
                </Tooltip>
                <Button variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Welcome Message */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Welcome, {userData?.user?.name || "Admin"}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You are logged in as an administrator. Use the tools below to
              manage your portfolio.
            </Typography>
            {isEditing && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                💡 Drag sections by the grip icon to reorder them by importance
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Sections */}
        {sectionsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections.map((s) => s.sectionKey)}
              strategy={verticalListSortingStrategy}
            >
              <Box>
                {sortedSections.map((section) => {
                  const sectionKey = section.sectionKey as SectionKey;
                  const config = SECTION_CONFIG[sectionKey];
                  if (!config) return null;

                  const cardContent = (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        {isEditing && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "grab",
                              color: "text.secondary",
                              mt: 1,
                              "&:active": {
                                cursor: "grabbing",
                              },
                            }}
                          >
                            <DragIndicatorIcon />
                          </Box>
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {config.title}
                          </Typography>
                          {config.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {config.description}
                            </Typography>
                          )}
                          {config.route && config.buttonText && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                alignItems: "center",
                                mt: 2,
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={() => router.push(config.route!)}
                              >
                                {config.buttonText}
                              </Button>
                            </Box>
                          )}
                          {sectionKey === "pendingUsers" && (
                            <DataGrid rows={[]} columns={[]} />
                          )}
                        </Box>
                      </Box>
                    </>
                  );

                  if (isEditing) {
                    return (
                      <SortableSectionCard
                        key={section.sectionKey}
                        id={section.sectionKey}
                      >
                        {cardContent}
                      </SortableSectionCard>
                    );
                  }

                  return (
                    <Card key={section.sectionKey} sx={{ mb: 3 }}>
                      <CardContent>{cardContent}</CardContent>
                    </Card>
                  );
                })}
              </Box>
            </SortableContext>
          </DndContext>
        )}
      </Box>
    </ClientOnly>
  );
}
