"use client";

import {
  Box,
  Container,
  Typography,
  useTheme,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import Link from "next/link";

export default function HomePage() {
  const theme = useTheme();

  // Sample data - will be replaced with Payload CMS data
  const featuredProjects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "Built a scalable e-commerce solution with React and Node.js",
      image: "/api/placeholder/400/300",
      category: "Web Application",
      skills: ["React", "Node.js", "MongoDB"],
      impact: "Increased conversion by 35%",
    },
    {
      id: 2,
      title: "Real-time Dashboard",
      description:
        "Created a real-time analytics dashboard for business metrics",
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

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      text: "Working with Omri was exceptional. He delivered our project on time and exceeded our expectations.",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "CTO",
      company: "StartupXYZ",
      text: "Omri's technical expertise and problem-solving skills helped us overcome significant challenges.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="xl">
          <Box textAlign="center" color="white">
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 300,
                fontSize: { xs: "2.5rem", md: "4rem" },
                mb: 3,
              }}
            >
              Full Stack Developer
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                mb: 4,
                opacity: 0.9,
              }}
            >
              Building scalable, performant applications that drive business
              growth
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
                component={Link}
                href="/projects"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                View Projects
              </Button>
              <Button
                component={Link}
                href="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Get In Touch
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Positioning Bar */}
      <Box sx={{ py: 6, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              textAlign: "center",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h2"
                color="primary.main"
                gutterBottom
              >
                47%
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom>
                Performance Improvement
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Average reduction in page load times across projects
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h2"
                color="primary.main"
                gutterBottom
              >
                99.9%
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom>
                Uptime Reliability
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Production systems maintain exceptional availability
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h2"
                color="primary.main"
                gutterBottom
              >
                3x
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom>
                Development Speed
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Faster delivery through efficient architecture and tooling
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Projects */}
      <Box sx={{ py: 12, backgroundColor: "background.default" }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 300,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              Featured Projects
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                fontWeight: 300,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Recent work that demonstrates my approach to solving complex
              problems
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 4,
            }}
          >
            {featuredProjects.map((project) => (
              <Box key={project.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" component="h3" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
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

                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ mb: 2, fontWeight: 500 }}
                    >
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
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 12, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 300,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              What People Say
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                fontWeight: 300,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Testimonials from clients and colleagues I&apos;ve worked with
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 4,
            }}
          >
            {testimonials.map((testimonial) => (
              <Box key={testimonial.id}>
                <Card sx={{ height: "100%", p: 3 }}>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontStyle: "italic" }}
                  >
                    &quot;{testimonial.text}&quot;
                  </Typography>
                  <Box>
                    <Typography variant="h6" component="h3">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role} at {testimonial.company}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12, backgroundColor: "background.default" }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 300,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              Ready to Work Together?
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                fontWeight: 300,
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Let&apos;s discuss your project and how I can help bring your
              vision to life
            </Typography>
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              size="large"
              sx={{
                py: 2,
                px: 4,
                fontSize: "1.1rem",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
