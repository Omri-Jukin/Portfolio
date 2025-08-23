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
            my portfolio.
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
      {/* Blog Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Blog Posts
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => router.push("/admin/blog")}
            >
              View Blog Posts
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push("/admin/blog/new")}
            >
              Create Blog Post
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Work Experience Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Work Experience
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage professional work experience, roles, and career history.
          </Typography>
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
              onClick={() => router.push("/admin/work-experiences")}
            >
              Manage Work Experience
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Projects Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage portfolio projects, technical details, and showcased work.
          </Typography>
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
              onClick={() => router.push("/admin/projects")}
            >
              Manage Projects
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Skills Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage technical skills, proficiency levels, and competencies.
          </Typography>
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
              onClick={() => router.push("/admin/skills")}
            >
              Manage Skills
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Certifications Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage professional certifications and credentials displayed on the
            portfolio.
          </Typography>
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
              onClick={() => router.push("/admin/certifications")}
            >
              Manage Certifications
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
