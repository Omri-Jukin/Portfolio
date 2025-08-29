"use client";

import { Box, Container, Typography, Paper, Chip } from "@mui/material";
import { Email, LocationOn, AccessTime } from "@mui/icons-material";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            Get In Touch
          </Typography>
          <Typography variant="h6" color="text.secondary">
            I&apos;m always interested in hearing about new opportunities and
            exciting projects. Let&apos;s discuss how we can work together!
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" },
            gap: 4,
          }}
        >
          {/* Contact Form */}
          <Box>
            <ContactForm />
          </Box>

          {/* Contact Information */}
          <Box>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Contact Information
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Email sx={{ mr: 2, color: "primary.main" }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Email
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        hello@example.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <LocationOn sx={{ mr: 2, color: "primary.main" }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Location
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Remote / Worldwide
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <AccessTime sx={{ mr: 2, color: "primary.main" }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Response Time
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Within 24 hours
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Let&apos;s Work Together
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  I&apos;m available for:
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {[
                    "Full-stack development",
                    "Mobile apps",
                    "Technical consulting",
                    "Code reviews",
                    "Mentoring",
                  ].map((service) => (
                    <Chip
                      key={service}
                      label={service}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Quick Links
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {[
                    { href: "/pages/projects", label: "View My Projects" },
                    { href: "/pages/about", label: "Learn More About Me" },
                    { href: "/pages/resume", label: "View Resume" },
                  ].map((link) => (
                    <Typography
                      key={link.href}
                      component="a"
                      href={link.href}
                      variant="body2"
                      color="primary"
                      sx={{
                        display: "block",
                        mb: 1,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {link.label}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
