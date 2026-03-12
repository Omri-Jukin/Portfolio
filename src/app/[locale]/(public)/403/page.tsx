"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Lock as LockIcon } from "@mui/icons-material";

export default function ForbiddenPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <LockIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        403 – Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
        You don&apos;t have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push(`/${locale}`)}
      >
        Back to home
      </Button>
    </Box>
  );
}
