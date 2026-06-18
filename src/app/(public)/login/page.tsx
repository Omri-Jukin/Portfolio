import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, LoadingState } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login - Omri Jukin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Container className="flex min-h-[calc(100vh-8rem)] min-w-0 items-center justify-center py-16">
      <Suspense fallback={<LoadingState>Loading login</LoadingState>}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
