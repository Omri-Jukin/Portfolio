import type { Metadata } from "next";
import Link from "next/link";
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, Button, Stack } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Portfolio`,
    description: `Dynamic page for ${slug}`,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // For now, return a placeholder page
  return (
    <Box sx={{ minHeight: "100vh", py: 8, px: { xs: 2, sm: 3, lg: 4 } }}>
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: "bold", 
            mb: 3,
            color: "text.primary"
          }}
        >
          {slug.charAt(0).toUpperCase() + slug.slice(1)} Page
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          This is a dynamic page for &quot;{slug}&quot;. Content management
          integration coming soon!
        </Typography>

        <Paper 
          elevation={1}
          sx={{ 
            bgcolor: "primary.50", 
            border: 1, 
            borderColor: "primary.200", 
            borderRadius: 2, 
            p: 3, 
            mb: 4,
            textAlign: "left"
          }}
        >
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              color: "primary.900"
            }}
          >
            What&apos;s Coming Next
          </Typography>
          <List sx={{ color: "primary.800" }}>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              Payload CMS integration for content management
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              Dynamic content rendering from database
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              Admin interface for content editors
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <FiberManualRecord sx={{ fontSize: 8 }} />
              </ListItemIcon>
              SEO optimization and metadata management
            </ListItem>
          </List>
        </Paper>

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={2} 
          justifyContent="center"
        >
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            sx={{ 
              fontWeight: 600, 
              py: 1.5, 
              px: 3 
            }}
          >
            Back to Home
          </Button>
          <Button
            component={Link}
            href="/pages/about"
            variant="outlined"
            size="large"
            sx={{ 
              fontWeight: 600, 
              py: 1.5, 
              px: 3 
            }}
          >
            About Me
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
