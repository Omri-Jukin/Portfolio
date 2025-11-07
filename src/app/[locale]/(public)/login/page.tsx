"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Lock as LockIcon, Google as GoogleIcon } from "@mui/icons-material";
import * as Common from "~/Common/Common.style";

export default function LoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "en";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get redirectTo from query params (set by middleware) or default to dashboard
  const redirectTo = searchParams.get("redirectTo") || `/${locale}/dashboard`;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Sign in with Google and redirect to the specified URL or dashboard on success
      await signIn("google", {
        callbackUrl: redirectTo,
        redirect: true, // Explicitly enable redirect
      });
    } catch (error) {
      console.error("[AUTH] Google sign in error:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Common.PageContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card sx={{ maxWidth: 400, width: "100%", mx: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <LockIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Admin Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in with your Google account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <GoogleIcon />
              }
              sx={{
                mt: 2,
                mb: 2,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                Only authorized admin accounts can access this portal
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Common.PageContainer>
  );
}
