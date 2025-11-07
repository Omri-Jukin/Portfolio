"use client";

import React, { useState, useRef } from "react";
import { Fab, Tooltip, Box } from "@mui/material";
import {
  Calculate as CalculateIcon,
  Dashboard as DashboardIcon,
  Description as IntakesIcon,
  Reviews as ReviewIcon,
  Settings as SettingsIcon,
  TableChart as CalculatorSettingsIcon,
  Apps as MoreIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import ProjectCostCalculator from "~/ProjectCostCalculator";
import { api } from "$/trpc/client";

interface QuickAccessButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "default" | "inherit" | "error";
}

export default function AdminFAB() {
  const router = useRouter();
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const calculatorButtonRef = useRef<HTMLButtonElement>(null);

  // Check if user is authenticated
  // Use enabled: false initially to prevent automatic query, then check session first
  const {
    data: userData,
    isLoading: authLoading,
    error: authError,
    isError: isAuthError,
  } = api.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    // Don't retry on error - if auth fails, user is not logged in
    retryOnMount: false,
  });

  // Extract locale from pathname
  const locale = pathname.split("/")[1] || "en";

  // Extract intake ID from pathname if on intake detail page
  const intakeIdMatch = pathname.match(/\/admin\/intakes\/([^/]+)/);
  const intakeId = intakeIdMatch ? intakeIdMatch[1] : undefined;

  const navigateTo = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: () => {
      // Redirect to login after successful logout
      router.push(`/${locale}/login`);
    },
    onError: () => {
      // Still redirect even if there's an error
      router.push(`/${locale}/login`);
    },
  });

  const handleLogout = async () => {
    try {
      // Call NextAuth signout endpoint to clear all cookies
      // NextAuth v5 uses GET request to /api/auth/signout
      // This will automatically clear:
      // - next-auth.session-token (main auth cookie with JWT)
      // - next-auth.csrf-token (CSRF protection)
      // - next-auth.callback-url (OAuth redirect URL)
      const response = await fetch("/api/auth/signout", {
        method: "GET",
        credentials: "include", // Important: include cookies in the request
      });

      if (!response.ok) {
        console.warn(
          "NextAuth signout returned non-OK status:",
          response.status
        );
      }

      // Wait for the signout to complete, then redirect
      // The redirect will happen via the mutation's onSuccess callback
      logoutMutation.mutate();
    } catch (error) {
      console.error("Logout error:", error);
      // Still try to logout via tRPC and redirect
      // Even if NextAuth signout fails, try to redirect to login
      logoutMutation.mutate();
    }
  };

  const quickAccessButtons: QuickAccessButton[] = [
    {
      icon: <CalculateIcon />,
      label: "Cost Calculator",
      onClick: () => {
        setCalculatorOpen(true);
      },
      color: "primary",
    },
    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      onClick: () => navigateTo("/admin"),
      color: "secondary",
    },
    {
      icon: <IntakesIcon />,
      label: "Intakes",
      onClick: () => navigateTo("/admin/intakes"),
      color: "secondary",
    },
    {
      icon: <ReviewIcon />,
      label: "Review",
      onClick: () => navigateTo("/admin/review"),
      color: "secondary",
    },
    {
      icon: <CalculatorSettingsIcon />,
      label: "Calculator Settings",
      onClick: () => navigateTo("/admin/calculator-settings"),
      color: "default",
    },
    {
      icon: <SettingsIcon />,
      label: "Intake Templates",
      onClick: () => navigateTo("/admin/intake-templates"),
      color: "default",
    },
    {
      icon: <LogoutIcon />,
      label: "Logout",
      onClick: handleLogout,
      color: "error",
    },
  ];

  // Determine if user is authenticated AND is an admin
  // User must be authenticated AND have admin role (or specific email)
  // Conditions:
  // - Not currently loading (wait for auth check to complete)
  // - No authentication error (query must not have failed)
  // - User data exists and contains a user object
  // - User has admin role OR is the specific admin email
  const hasAuthError = !!authError || isAuthError;
  const hasUserData = !!userData?.user;
  const isAdminUser =
    hasUserData &&
    (userData.user.role === "admin" ||
      userData.user.email === "omrijukin@gmail.com");

  const isAuthenticated =
    !authLoading && !hasAuthError && hasUserData && isAdminUser;

  // Don't render FAB if:
  // - Auth is still loading (wait for result)
  // - There's an authentication error (user is not logged in)
  // - No user data (user is not authenticated)
  // - User is not an admin
  if (authLoading || hasAuthError || !hasUserData || !isAdminUser) {
    return null;
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 1,
          "@media (max-width: 600px)": {
            bottom: 16,
            right: 16,
            gap: 0.5,
          },
        }}
      >
        {/* Main FAB */}
        <Tooltip title="Admin Quick Access" placement="top">
          <Fab
            color="primary"
            aria-label="admin quick access"
            sx={{
              transition: "transform 0.2s",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            <MoreIcon />
          </Fab>
        </Tooltip>

        {/* Quick Access FABs */}
        {hovered &&
          isAuthenticated &&
          quickAccessButtons.map((button, index) => (
            <Tooltip key={index} title={button.label} placement="top" arrow>
              <Fab
                color={
                  button.color === "error"
                    ? "default"
                    : button.color || "default"
                }
                size="small"
                onClick={button.onClick}
                aria-label={button.label}
                ref={index === 0 ? calculatorButtonRef : undefined}
                sx={{
                  animation: `slideIn 0.2s ease-out ${index * 0.05}s both`,
                  ...(button.color === "error" && {
                    backgroundColor: "error.main",
                    color: "error.contrastText",
                    "&:hover": {
                      backgroundColor: "error.dark",
                    },
                  }),
                  "@keyframes slideIn": {
                    from: {
                      opacity: 0,
                      transform: "translateX(20px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  },
                }}
              >
                {button.icon}
              </Fab>
            </Tooltip>
          ))}
      </Box>

      <ProjectCostCalculator
        intakeId={intakeId}
        open={calculatorOpen}
        onClose={() => {
          setCalculatorOpen(false);
        }}
      />
    </Box>
  );
}
