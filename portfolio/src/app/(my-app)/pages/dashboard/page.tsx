"use client";

import { Box, Container, Typography, Paper } from "@mui/material";
import { Analytics } from "@/components/Analytics";

export default function DashboardPage() {
  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            Portfolio Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Monitor your portfolio performance and visitor analytics
          </Typography>
        </Box>

        <Analytics title="Portfolio Performance" showRefresh={true} />

        {/* Additional Dashboard Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            mt: 4,
          }}
        >
          <Box>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track recent portfolio updates, blog posts, and project
                additions.
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Performance Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get insights into what content performs best and optimize
                accordingly.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
