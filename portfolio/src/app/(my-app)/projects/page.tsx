import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import Link from "next/link";

export default function ProjectsPage() {
  // This will be replaced with actual data from Payload CMS
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Built a scalable e-commerce solution with React and Node.js",
      image: "/api/placeholder/400/300",
      category: "Web Application",
      skills: ["React", "Node.js", "MongoDB"],
      impact: "Increased conversion by 35%",
    },
    {
      id: 2,
      title: "Real-time Dashboard",
      description: "Created a real-time analytics dashboard for business metrics",
      image: "/api/placeholder/400/300",
      category: "Dashboard",
      skills: ["Vue.js", "WebSocket", "Redis"],
      impact: "Reduced load time by 60%",
    },
    {
      id: 3,
      title: "Mobile App",
      description: "Developed a cross-platform mobile application",
      image: "/api/placeholder/400/300",
      category: "Mobile",
      skills: ["React Native", "Firebase", "TypeScript"],
      impact: "100K+ downloads",
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
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
            Projects
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
            A collection of projects that showcase my skills and impact
          </Typography>
        </Box>

        {/* Projects Grid */}
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card 
                sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={project.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1, mb: 1 }}
                    />
                    {project.skills.map((skill) => (
                      <Chip 
                        key={skill} 
                        label={skill} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" color="success.main" sx={{ mb: 2, fontWeight: 500 }}>
                    {project.impact}
                  </Typography>
                  
                  <Box sx={{ mt: "auto" }}>
                    <Button
                      component={Link}
                      href={`/projects/${project.id}`}
                      variant="outlined"
                      endIcon={<ArrowForward />}
                      fullWidth
                    >
                      View Case Study
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
