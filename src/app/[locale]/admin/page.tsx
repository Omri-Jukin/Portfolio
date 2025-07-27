"use client";

import { api } from "$/trpc/client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "~/DataGrid/DataGrid";
import { EmailServiceStatus } from "@/app/server/routers/emails";

export default function AdminDashboard() {
  const router = useRouter();
  const [testEmail, setTestEmail] = useState("");
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    messageId?: string;
    quota?: {
      max24HourSend?: number;
      maxSendRate?: number;
      sentLast24Hours?: number;
    };
  } | null>(null);

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

  const emailStatus = api.emails.getEmailServiceStatus.useQuery();
  const testSESConnectivity = api.emails.testSESConnectivity.useMutation();
  const sendTestEmail = api.emails.sendTestEmail.useMutation();

  const handleTestSES = async () => {
    try {
      const result = await testSESConnectivity.mutateAsync();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      alert("Please enter an email address");
      return;
    }

    try {
      const result = await sendTestEmail.mutateAsync({ toEmail: testEmail });
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
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

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome, {userData?.user.name}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </Box>
      </Box>

      {/* Pending Users Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pending User Approvals
          </Typography>
          <DataGrid rows={[]} columns={[]} />
        </CardContent>
      </Card>

      {/* Email Service Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Email Service Status
          </Typography>

          {emailStatus.isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={20} />
              <Typography>Loading status...</Typography>
            </Box>
          ) : emailStatus.error ? (
            <Alert severity="error">
              Error loading status: {emailStatus.error.message}
            </Alert>
          ) : (
            <Box>
              <Alert
                severity={
                  emailStatus.data?.status === "ready" ? "success" : "error"
                }
              >
                {emailStatus.data?.message}
              </Alert>

              {(() => {
                if (
                  emailStatus.data &&
                  "config" in emailStatus.data &&
                  emailStatus.data.config
                ) {
                  const config = emailStatus.data
                    .config as EmailServiceStatus["config"];
                  return (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Region:</strong> {config?.region}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>From Email:</strong> {config?.fromEmail}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Admin Email:</strong> {config?.adminEmail}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              })()}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* SES Connectivity Test */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            SES Connectivity Test
          </Typography>

          <Button
            variant="contained"
            onClick={handleTestSES}
            disabled={testSESConnectivity.isPending}
            sx={{ mb: 2 }}
          >
            {testSESConnectivity.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Test SES Connectivity"
            )}
          </Button>

          {testResult && (
            <Box sx={{ mt: 2 }}>
              <Alert severity={testResult.success ? "success" : "error"}>
                {testResult.message || testResult.error}
              </Alert>

              {testResult.quota && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Max 24h Send:</strong>{" "}
                    {testResult.quota.max24HourSend}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Max Send Rate:</strong>{" "}
                    {testResult.quota.maxSendRate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Sent Last 24h:</strong>{" "}
                    {testResult.quota.sentLast24Hours}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Test Email Sending */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Email Sending
          </Typography>

          <TextField
            fullWidth
            label="Test Email Address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter email address to send test email"
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleSendTestEmail}
            disabled={sendTestEmail.isPending || !testEmail}
          >
            {sendTestEmail.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Send Test Email"
            )}
          </Button>

          {testResult && testResult.messageId && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                Test email sent successfully! Message ID: {testResult.messageId}
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
