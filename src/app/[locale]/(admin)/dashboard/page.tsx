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
  ToggleButtonGroup,
  ToggleButton,
  CardHeader,
  CardActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DataGrid from "~/DataGrid/DataGrid";
import { ClientOnly } from "~/ClientOnly";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createContext, useContext } from "react";
import {
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
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
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  blog: {
    title: "Blog Posts",
    description: "Manage blog posts and content.",
    route: "/dashboard/blog",
    buttonText: "View Blog Posts",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  workExperience: {
    title: "Work Experience",
    description:
      "Manage professional work experience, roles, and career history.",
    route: "/dashboard/work-experiences",
    buttonText: "Manage Work Experience",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  projects: {
    title: "Projects",
    description:
      "Manage portfolio projects, technical details, and showcased work.",
    route: "/dashboard/projects",
    buttonText: "Manage Projects",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  skills: {
    title: "Skills",
    description:
      "Manage technical skills, proficiency levels, and competencies.",
    route: "/dashboard/skills",
    buttonText: "Manage Skills",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  emails: {
    title: "Email Templates",
    description:
      "Create, edit, and send styled emails to clients. Manage templates with HTML/CSS editing.",
    route: "/dashboard/emails",
    buttonText: "Manage Email Templates",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  education: {
    title: "Education",
    description:
      "Manage academic background, degrees, and educational achievements displayed on the portfolio.",
    route: "/dashboard/education",
    buttonText: "Manage Education",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  certifications: {
    title: "Certifications",
    description:
      "Manage professional certifications and credentials displayed on the portfolio.",
    route: "/dashboard/certifications",
    buttonText: "Manage Certifications",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  intakes: {
    title: "Project Intakes",
    description:
      "Review intake forms with advanced tools, or manage custom intake links.",
    route: "/dashboard/review",
    buttonText: "Review Intakes",
    secondaryRoute: "/dashboard/intakes",
    secondaryButtonText: "Manage Intake Links",
  },
  calculatorSettings: {
    title: "Calculator Settings",
    description:
      "Manage pricing calculator rates, multipliers, and feature costs. Configure base rates, complexity multipliers, timeline adjustments, and more.",
    route: "/dashboard/calculator-settings",
    buttonText: "Manage Calculator Settings",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  pricing: {
    title: "Pricing Management",
    description:
      "Manage dynamic pricing model: project types, base rates (including client-type-specific), features, multipliers, and meta settings.",
    route: "/dashboard/pricing",
    buttonText: "Manage Pricing",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  discounts: {
    title: "Discounts",
    description:
      "Create and manage promotional discount codes with usage limits, date ranges, and scope restrictions.",
    route: "/dashboard/discounts",
    buttonText: "Manage Discounts",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  roles: {
    title: "Roles & Permissions",
    description:
      "Manage user roles and their permissions. Configure what each role can access and edit.",
    route: "/dashboard/roles",
    buttonText: "Manage Roles",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  services: {
    title: "Services",
    description:
      "Manage professional service offerings, pricing, and availability displayed on the portfolio.",
    route: "/dashboard/services",
    buttonText: "Manage Services",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
  testimonials: {
    title: "Testimonials",
    description:
      "Manage client testimonials, reviews, and feedback displayed on the portfolio.",
    route: "/dashboard/testimonials",
    buttonText: "Manage Testimonials",
    secondaryRoute: null,
    secondaryButtonText: null,
  },
} as const;

type SectionKey = keyof typeof SECTION_CONFIG;

type SectionConfig = (typeof SECTION_CONFIG)[SectionKey];

// Context for passing drag handle props to children
const DragHandleContext = createContext<{
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
} | null>(null);

// Drag handle component that uses the context
function DragHandle({
  sectionKey,
  viewMode,
}: {
  sectionKey: string;
  viewMode: "list" | "cards";
}) {
  const dragHandleProps = useContext(DragHandleContext);

  if (!dragHandleProps) {
    // If not inside a SortableSectionCard, return a non-functional handle
    return (
      <Box
        key={`section-drag-handle-${sectionKey}`}
        id={`section-drag-handle-${sectionKey}`}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "grab",
          color: "text.secondary",
          mt: viewMode === "cards" ? 0 : 1,
          "&:active": {
            cursor: "grabbing",
          },
          mr: 1,
        }}
      >
        <DragIndicatorIcon />
      </Box>
    );
  }

  const { setActivatorNodeRef, attributes, listeners } = dragHandleProps;

  return (
    <Box
      key={`section-drag-handle-${sectionKey}`}
      id={`section-drag-handle-${sectionKey}`}
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "grab",
        color: "text.secondary",
        mt: viewMode === "cards" ? 0 : 1,
        "&:active": {
          cursor: "grabbing",
        },
        mr: 1,
        touchAction: "none", // Prevent scrolling on touch devices
      }}
    >
      <DragIndicatorIcon />
    </Box>
  );
}

interface SortableSectionCardProps {
  id: string;
  children: React.ReactNode;
  viewMode: "list" | "cards";
}

function SortableSectionCard({
  id,
  children,
  viewMode,
}: SortableSectionCardProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    attributes,
    listeners,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <DragHandleContext.Provider
      value={{ setActivatorNodeRef, attributes, listeners }}
    >
      <Card
        key={id}
        id={`admin-dashboard-section-${id}`}
        ref={setNodeRef}
        style={style}
        sx={{
          mb: viewMode === "list" ? 3 : 0,
          height: viewMode === "cards" ? "100%" : "auto",
          position: "relative",
          boxShadow: isDragging ? 6 : 1,
          transform: isDragging ? "rotate(2deg)" : "none",
          transition: "all 0.2s ease",
        }}
      >
        {children}
      </Card>
    </DragHandleContext.Provider>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState<
    Array<{ sectionKey: string; displayOrder: number }>
  >([]);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

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

  // Load view mode preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adminDashboardViewMode");
      if (stored === "list" || stored === "cards") {
        setViewMode(stored);
      }
    }
  }, []);

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

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: "list" | "cards" | null
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
      if (typeof window !== "undefined") {
        localStorage.setItem("adminDashboardViewMode", newViewMode);
      }
    }
  };

  // Handle authentication error
  useEffect(() => {
    if (authError) {
      console.error("Authentication error:", authError);
      router.push(`/${locale}/login`);
    }
  }, [authError, router, locale]);

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: () => {
      router.push(`/${locale}/login`);
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
        key="loading"
        id="loading"
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
        key="error"
        id="error"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error" key="error-title">
          Authentication failed
        </Typography>
        <Button
          key="error-button"
          variant="contained"
          onClick={() => router.push(`/${locale}/login`)}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  // Sort sections by display order
  const sortedSections = [...sections].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  // Determine sorting strategy based on view mode
  const sortingStrategy =
    viewMode === "list" ? verticalListSortingStrategy : rectSortingStrategy;

  // Render section content (reusable for both views)
  const renderSectionContent = (section: {
    sectionKey: string;
    displayOrder: number;
  }) => {
    const sectionKey = section.sectionKey as SectionKey;
    const config: SectionConfig = SECTION_CONFIG[sectionKey];
    if (!config) return null;

    return (
      <Box
        key={`section-content-${sectionKey}`}
        id={`section-content-${sectionKey}`}
      >
        <CardHeader
          key={`section-header-${sectionKey}`}
          title={
            <Typography
              variant="h6"
              component="div"
              key={`section-title-${sectionKey}`}
            >
              {config.title}
            </Typography>
          }
          subheader={
            config.description ? (
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
                key={`section-description-${sectionKey}`}
                id={`section-description-${sectionKey}`}
              >
                {config.description}
              </Typography>
            ) : null
          }
          sx={{
            pb: 1,
            pr: 2,
            pt: 2,
          }}
        />
        <CardContent
          key={`section-content-${sectionKey}`}
          id={`section-content-${sectionKey}`}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            flexDirection: viewMode === "cards" ? "column" : "row",
            pt: 0,
            pb: 2,
          }}
        >
          {/* If editing, drag handle */}
          {isEditing && (
            <DragHandle sectionKey={sectionKey} viewMode={viewMode} />
          )}
          <Box
            key={`section-content-pending-users-${sectionKey}`}
            id={`section-content-pending-users-${sectionKey}`}
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {/* (Redundant: config.title and description already shown in CardHeader) */}
            {sectionKey === "pendingUsers" && (
              <Box
                key={`section-content-pending-users-${sectionKey}`}
                id={`section-content-pending-users-${sectionKey}`}
                sx={{ mt: viewMode === "cards" ? 2 : 0 }}
              >
                <DataGrid rows={[]} columns={[]} />
              </Box>
            )}
          </Box>
        </CardContent>
        {(() => {
          const hasPrimaryButton = config.route && config.buttonText;
          const hasSecondaryButton =
            config.secondaryRoute && config.secondaryButtonText;
          const showActions = hasPrimaryButton || hasSecondaryButton;

          if (!showActions) return null;

          return (
            <CardActions
              key={`section-actions-${sectionKey}`}
              id={`section-actions-${sectionKey}`}
              sx={{
                display: "flex",
                justifyContent: viewMode === "cards" ? "flex-start" : "center",
                gap: 2,
                mb: 1,
                flexWrap: "wrap",
                pt: 0,
              }}
            >
              {hasPrimaryButton && (
                <Button
                  id={`section-button-${sectionKey}`}
                  key={`section-button-${sectionKey}`}
                  variant="contained"
                  size={viewMode === "cards" ? "small" : "medium"}
                  onClick={() => router.push(`/${locale}${config.route!}`)}
                >
                  {config.buttonText}
                </Button>
              )}
              {hasSecondaryButton && (
                <Button
                  id={`section-button-${sectionKey}`}
                  variant="outlined"
                  size={viewMode === "cards" ? "small" : "medium"}
                  onClick={() =>
                    router.push(`/${locale}${config.secondaryRoute!}`)
                  }
                >
                  {config.secondaryButtonText}
                </Button>
              )}
            </CardActions>
          );
        })()}
      </Box>
    );
  };

  return (
    <ClientOnly skeleton>
      <Box
        key="admin-dashboard"
        id="admin-dashboard"
        sx={{ p: 3, maxWidth: 1200, mx: "auto" }}
      >
        {/* Header */}
        <Box
          key="header"
          id="header"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" key="admin-dashboard-title">
            Admin Dashboard
          </Typography>
          <Box
            key="admin-dashboard-buttons"
            id="admin-dashboard-buttons"
            sx={{ display: "flex", gap: 2, alignItems: "center" }}
          >
            <Tooltip title="Switch between list and card view">
              <ToggleButtonGroup
                key="admin-dashboard-toggle-button-group"
                id="admin-dashboard-toggle-button-group"
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
              >
                <ToggleButton
                  value="list"
                  aria-label="list view"
                  key="admin-dashboard-toggle-button-list"
                >
                  <ViewListIcon />
                </ToggleButton>
                <ToggleButton
                  value="cards"
                  aria-label="card view"
                  key="admin-dashboard-toggle-button-cards"
                >
                  <ViewModuleIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>
            {isEditing ? (
              <>
                <Button
                  key="admin-dashboard-cancel-button"
                  id="admin-dashboard-cancel-button"
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
                  key="admin-dashboard-save-button"
                  id="admin-dashboard-save-button"
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
                  <Button
                    key="admin-dashboard-reorder-button"
                    id="admin-dashboard-reorder-button"
                    variant="outlined"
                    onClick={() => setIsEditing(true)}
                  >
                    Reorder Sections
                  </Button>
                </Tooltip>
                <Button
                  key="admin-dashboard-logout-button"
                  id="admin-dashboard-logout-button"
                  variant="outlined"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Welcome Message */}
        <Card
          key="admin-dashboard-welcome-card"
          id="admin-dashboard-welcome-card"
          sx={{ mb: 3 }}
        >
          <CardHeader
            title={
              <Typography variant="h6" key="admin-dashboard-welcome-title">
                {`Welcome, ${userData?.user?.name || "Admin"}!`}
              </Typography>
            }
          />
          <CardContent
            key="admin-dashboard-welcome-content"
            id="admin-dashboard-welcome-content"
          >
            <Typography
              variant="body1"
              color="text.secondary"
              key="admin-dashboard-welcome-content-text"
            >
              You are logged in as an administrator. Use the tools below to
              manage your portfolio.
            </Typography>
            {isEditing && (
              <Typography
                variant="body2"
                color="primary"
                sx={{ mt: 1 }}
                key="admin-dashboard-welcome-content-text-editing"
              >
                💡 Drag sections by the grip icon to reorder them by importance
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Sections */}
        {sectionsLoading ? (
          <Box
            key="admin-dashboard-sections-loading"
            id="admin-dashboard-sections-loading"
            sx={{ display: "flex", justifyContent: "center", py: 4 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DndContext
            key="admin-dashboard-dnd-context"
            id="admin-dashboard-dnd-context"
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              key="admin-dashboard-sortable-context"
              id="admin-dashboard-sortable-context"
              items={sortedSections.map((s) => s.sectionKey)}
              strategy={sortingStrategy}
            >
              {viewMode === "list" ? (
                <Box
                  key="admin-dashboard-sections-list"
                  id="admin-dashboard-sections-list"
                >
                  {sortedSections.map((section) => {
                    if (isEditing) {
                      return (
                        <SortableSectionCard
                          key={`admin-dashboard-section-${section.sectionKey}`}
                          id={section.sectionKey}
                          viewMode={viewMode}
                        >
                          {renderSectionContent(section)}
                        </SortableSectionCard>
                      );
                    }

                    return (
                      <Card
                        key={`admin-dashboard-section-${section.sectionKey}`}
                        id={`admin-dashboard-section-${section.sectionKey}`}
                        sx={{ mb: 3 }}
                      >
                        {renderSectionContent(section)}
                      </Card>
                    );
                  })}
                </Box>
              ) : (
                <Box
                  key="admin-dashboard-sections-cards"
                  id="admin-dashboard-sections-cards"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                      xl: "repeat(4, 1fr)",
                    },
                    gap: 3,
                  }}
                >
                  {sortedSections.map((section) => {
                    if (isEditing) {
                      return (
                        <Box
                          key={`admin-dashboard-section-${section.sectionKey}`}
                          id={`admin-dashboard-section-${section.sectionKey}`}
                        >
                          <SortableSectionCard
                            id={section.sectionKey}
                            key={`admin-dashboard-section-${section.sectionKey}`}
                            viewMode={viewMode}
                          >
                            {renderSectionContent(section)}
                          </SortableSectionCard>
                        </Box>
                      );
                    }

                    return (
                      <Box
                        key={`admin-dashboard-section-${section.sectionKey}`}
                        id={`admin-dashboard-section-${section.sectionKey}`}
                      >
                        <Card
                          key={`admin-dashboard-section-${section.sectionKey}`}
                          id={`admin-dashboard-section-${section.sectionKey}`}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {renderSectionContent(section)}
                        </Card>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </SortableContext>
          </DndContext>
        )}
      </Box>
    </ClientOnly>
  );
}
