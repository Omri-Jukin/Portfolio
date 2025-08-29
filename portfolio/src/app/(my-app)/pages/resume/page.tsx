"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { Download, Email } from "@mui/icons-material";
import { Resume } from "@/components/Resume";

export default function ResumePage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            Professional Resume
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Experienced full-stack developer with a passion for building
            scalable web applications
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<Download />}
              size="large"
              sx={{ py: 1.5, px: 4 }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              size="large"
              href="/pages/contact"
              sx={{ py: 1.5, px: 4 }}
            >
              Get In Touch
            </Button>
          </Box>
        </Box>

        <Resume />
      </Box>
    </Container>
  );
}
