"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { About } from "@/components/About";

export default function AboutPage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            About Me
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Get to know me better and understand my journey in software
            development
          </Typography>
        </Box>

        <About
          title="My Story"
          subtitle="Passionate developer with a love for clean code and innovative solutions"
        />

        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            size="large"
            href="/pages/projects"
            sx={{ mr: 2, mb: 2 }}
          >
            View My Work
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/pages/contact"
            sx={{ mb: 2 }}
          >
            Get In Touch
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
