"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ fontSize: "8rem", fontWeight: "bold", color: "primary.main" }}
        >
          404
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: "500px" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track to exploring my portfolio.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
