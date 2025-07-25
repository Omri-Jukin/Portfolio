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
import { useState } from "react";

export default function AdminDashboard() {
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

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

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

              {emailStatus.data &&
                "config" in emailStatus.data &&
                emailStatus.data.config && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Region:</strong> {emailStatus.data.config.region}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>From Email:</strong>{" "}
                      {emailStatus.data.config.fromEmail}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Admin Email:</strong>{" "}
                      {emailStatus.data.config.adminEmail}
                    </Typography>
                  </Box>
                )}
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
