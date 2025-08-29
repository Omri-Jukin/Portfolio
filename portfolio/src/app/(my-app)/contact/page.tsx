import { Box, Container, Typography, Paper, Grid } from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 300,
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3
            }}
          >
            Get In Touch
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 300,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6
            }}
          >
            Ready to work together? Let&apos;s discuss your project and how I can help bring your vision to life.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
                Send a Message
              </Typography>
              <ContactForm />
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
                Contact Information
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Email color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6" component="h3">
                      Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      hello@example.com
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Phone color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6" component="h3">
                      Phone
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationOn color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6" component="h3">
                      Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Remote / Worldwide
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Paper elevation={1} sx={{ p: 3, bgcolor: "primary.50" }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Response Time
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  I typically respond to messages within 24 hours during business days.
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
