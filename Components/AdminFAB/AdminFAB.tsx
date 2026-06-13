"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Article as ProposalsIcon,
  FileCopy as TemplatesIcon,
  Receipt as TaxProfilesIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { getSession, signOut } from "next-auth/react";
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
  const utils = api.useUtils();
  const [hovered, setHovered] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const calculatorButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let isCurrent = true;

    getSession()
      .then((session) => {
        if (!isCurrent) return;
        setSessionStatus(session ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!isCurrent) return;
        setSessionStatus("unauthenticated");
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Check if user is authenticated
  // Use enabled: false initially to prevent automatic query, then check session first
  const {
    data: userData,
    isLoading: authLoading,
    error: authError,
    isError: isAuthError,
  } = api.auth.me.useQuery(undefined, {
    enabled: sessionStatus === "authenticated" && !hasLoggedOut,
    retry: false,
    refetchOnWindowFocus: false,
    // Don't retry on error - if auth fails, user is not logged in
    retryOnMount: false,
  });

  const logoutMutation = api.auth.logout.useMutation();

  const handleLogout = async () => {
    setHasLoggedOut(true);
    setSessionStatus("unauthenticated");
    setHovered(false);
    setCalculatorOpen(false);

    try {
      await logoutMutation.mutateAsync();
      await signOut({ redirect: false, callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await utils.auth.me.invalidate();
      router.replace("/login");
      router.refresh();
    }
  };

  // Don't show FAB on login page
  if (hasLoggedOut || pathname.includes("/login")) {
    return null;
  }

  // Extract intake ID from pathname if on intake detail page
  const intakeIdMatch = pathname.match(/\/dashboard\/intakes\/([^/]+)/);
  const intakeId = intakeIdMatch ? intakeIdMatch[1] : undefined;

  const navigateTo = (path: string) => {
    router.push(path);
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
      onClick: () => navigateTo("/dashboard"),
      color: "secondary",
    },
    {
      icon: <IntakesIcon />,
      label: "Intakes",
      onClick: () => navigateTo("/dashboard/intakes"),
      color: "secondary",
    },
    {
      icon: <ReviewIcon />,
      label: "Review",
      onClick: () => navigateTo("/dashboard/review"),
      color: "secondary",
    },
    {
      icon: <CalculatorSettingsIcon />,
      label: "Calculator Settings",
      onClick: () => navigateTo("/dashboard/calculator-settings"),
      color: "default",
    },
    {
      icon: <SettingsIcon />,
      label: "Intake Templates",
      onClick: () => navigateTo("/dashboard/intake-templates"),
      color: "default",
    },
    {
      icon: <ProposalsIcon />,
      label: "Proposals",
      onClick: () => navigateTo("/dashboard/proposals"),
      color: "secondary",
    },
    {
      icon: <TemplatesIcon />,
      label: "Proposal Templates",
      onClick: () => navigateTo("/dashboard/proposals/templates"),
      color: "default",
    },
    {
      icon: <TaxProfilesIcon />,
      label: "Tax Profiles",
      onClick: () => navigateTo("/dashboard/proposals/tax-profiles"),
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
  const isSessionLoading = sessionStatus === "loading";
  const isAdminUser =
    hasUserData &&
    (userData.user.role === "admin" ||
      userData.user.email === "omrijukin@gmail.com");

  const isAuthenticated =
    !isSessionLoading &&
    !authLoading &&
    !hasAuthError &&
    hasUserData &&
    isAdminUser;

  // Don't render FAB if:
  // - Auth is still loading (wait for result)
  // - There's an authentication error (user is not logged in)
  // - No user data (user is not authenticated)
  // - User is not an admin
  if (
    isSessionLoading ||
    sessionStatus !== "authenticated" ||
    authLoading ||
    hasAuthError ||
    !hasUserData ||
    !isAdminUser
  ) {
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
