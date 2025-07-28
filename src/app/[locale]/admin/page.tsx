"use client";

import { api } from "$/trpc/client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "~/DataGrid/DataGrid";

export default function AdminDashboard() {
  const router = useRouter();

  // Check authentication using tRPC
  const { data: userData, error: authError } = api.auth.me.useQuery(undefined, {
    retry: false,
  });

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

  return (
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
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Welcome Message */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Welcome, {userData?.user?.name || "Admin"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You are logged in as an administrator. Use the tools below to manage
            your portfolio.
          </Typography>
        </CardContent>
      </Card>

      {/* Pending Users Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pending Users
          </Typography>
          <DataGrid rows={[]} columns={[]} />
        </CardContent>
      </Card>
    </Box>
  );
}
