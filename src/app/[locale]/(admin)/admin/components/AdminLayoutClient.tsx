"use client";

import React from "react";
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import ProjectCostCalculator from "~/ProjectCostCalculator";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const t = useTranslations("Admin");

  const getPageTitle = (path: string) => {
    if (path.includes("/blog")) return t("blogManagement");
    if (path.includes("/work-experiences"))
      return t("workExperienceManagement");
    if (path.includes("/projects")) return t("projectsManagement");
    if (path.includes("/skills")) return t("skillsManagement");
    if (path.includes("/certifications")) return t("certificationsManagement");
    if (path.includes("/intakes")) return t("intakesManagement");
    if (path.includes("/intake-templates")) return "Intake Templates";
    if (path.includes("/calculator-settings")) return "Calculator Settings";
    if (path.includes("/pricing")) return "Pricing Management";
    if (path.includes("/emails")) return "Email Templates";
    return t("dashboard");
  };

  const getBreadcrumbs = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const url = "/" + segments.slice(0, i + 1).join("/");

      if (segment === "admin") {
        breadcrumbs.push({ label: t("dashboard"), url });
      } else if (segment === "blog") {
        breadcrumbs.push({ label: t("blog"), url });
      } else if (segment === "work-experiences") {
        breadcrumbs.push({ label: t("workExperience"), url });
      } else if (segment === "projects") {
        breadcrumbs.push({ label: t("projects"), url });
      } else if (segment === "skills") {
        breadcrumbs.push({ label: t("skills"), url });
      } else if (segment === "certifications") {
        breadcrumbs.push({ label: t("certifications"), url });
      } else if (segment === "intakes") {
        breadcrumbs.push({ label: t("intakes"), url });
      } else if (segment === "intake-templates") {
        breadcrumbs.push({ label: "Intake Templates", url });
      } else if (segment === "calculator-settings") {
        breadcrumbs.push({ label: "Calculator Settings", url });
      } else if (segment === "pricing") {
        breadcrumbs.push({ label: "Pricing Management", url });
      } else if (segment === "emails") {
        breadcrumbs.push({ label: "Email Templates", url });
      } else if (segment === "new") {
        breadcrumbs.push({ label: t("new"), url });
      } else if (segment === "edit") {
        breadcrumbs.push({ label: t("edit"), url });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(pathname);
  const pageTitle = getPageTitle(pathname);

  return (
    <Box
      id="admin-page-layout"
      sx={{
        pt: { xs: 8, md: 10 },
        pb: 4,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        id="admin-page-container-content"
        sx={{
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "xl",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Page Header */}
        <Box id="admin-page-header" sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {pageTitle}
          </Typography>

          {/* Breadcrumbs */}
          <Breadcrumbs
            id="admin-page-breadcrumbs"
            aria-label="breadcrumb"
            sx={{
              mb: 2,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            {breadcrumbs.map((breadcrumb, index) => (
              <Link
                key={index}
                href={breadcrumb.url}
                color={
                  index === breadcrumbs.length - 1 ? "text.primary" : "inherit"
                }
                underline="hover"
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {breadcrumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        </Box>

        {/* Project Cost Calculator FAB */}
        <ProjectCostCalculator />

        {/* Page Content */}
        <Box
          id={`admin-page-content-${pageTitle}`}
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            maxWidth: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

