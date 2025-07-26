"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import * as Common from "~/Common/Common.style";
import { api } from "$/trpc/client";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [visiblePassword, setVisiblePassword] = useState(false);

  const loginMutation = api.auth.login.useMutation({
    onSuccess: () => {
      // Redirect to admin dashboard on successful login
      router.push("/admin");
    },
    onError: (error) => {
      setError(error.message || "Login failed");
    },
  });

  const handleInputChange =
    (field: "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      if (error) setError(null);
    };

  const handlePasswordVisibility = () => setVisiblePassword((v) => !v);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    loginMutation.mutate({
      email: credentials.email,
      password: credentials.password,
    });
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
                {t("title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("subtitle")}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={credentials.email}
                onChange={handleInputChange("email")}
                margin="normal"
                required
                disabled={loginMutation.isPending}
                autoComplete="email"
              />
              <TextField
                fullWidth
                label={t("password")}
                type={visiblePassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleInputChange("password")}
                margin="normal"
                required
                disabled={loginMutation.isPending}
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordVisibility}
                          tabIndex={-1}
                          edge="end"
                        >
                          {visiblePassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loginMutation.isPending}
                startIcon={
                  loginMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : undefined
                }
                sx={{ mt: 3, mb: 2 }}
              >
                {loginMutation.isPending ? t("signingIn") : t("signIn")}
              </Button>
            </form>

            <Typography variant="body2" color="text.secondary" align="center">
              {t("demoCredentials")}
            </Typography>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{" "}
                <Link href="/register" sx={{ textDecoration: "none" }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Common.PageContainer>
  );
}
