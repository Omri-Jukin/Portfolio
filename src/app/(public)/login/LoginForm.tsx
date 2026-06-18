"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn("google", {
        callbackUrl: redirectTo,
        redirect: true,
      });
    } catch (signInError) {
      console.error("[AUTH] Google sign in error:", signInError);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xs sm:max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 text-accent"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <CardTitle>Admin login</CardTitle>
        <CardDescription>
          Sign in with the authorized Google account to manage the portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert tone="destructive" className="mb-4">
            {error}
          </Alert>
        ) : null}
        <Button
          className="w-full min-w-0 whitespace-normal"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Only authorized admin accounts can access this portal.
        </p>
      </CardContent>
    </Card>
  );
}
