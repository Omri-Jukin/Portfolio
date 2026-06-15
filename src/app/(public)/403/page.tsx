import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Access denied - Omri Jukin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-16">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>403 - Access denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Back to home
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}
