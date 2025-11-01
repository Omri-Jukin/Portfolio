"use client";

import React from "react";
import { Box, Container, Typography, Breadcrumbs, Link } from "@mui/material";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        pt: { xs: 8, md: 10 },
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
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

        {/* Page Content */}
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}
