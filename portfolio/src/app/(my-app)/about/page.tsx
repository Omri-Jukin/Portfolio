import { Box, Container, Typography, Paper, Grid, Card, CardContent, CardHeader } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import { Code, Lightbulb, TrendingUp, Psychology } from "@mui/icons-material";

export default function AboutPage() {
  const processSteps = [
    {
      title: "Research & Discovery",
      description: "Deep dive into requirements, constraints, and user needs",
      icon: <Psychology color="primary" />,
    },
    {
      title: "Architecture Design",
      description: "Create scalable, maintainable system architecture",
      icon: <Code color="primary" />,
    },
    {
      title: "Implementation",
      description: "Build with clean code principles and best practices",
      icon: <TrendingUp color="primary" />,
    },
    {
      title: "Iteration",
      description: "Continuous improvement based on feedback and metrics",
      icon: <Lightbulb color="primary" />,
    },
  ];

  const values = [
    {
      title: "Quality First",
      description: "Writing clean, maintainable code that stands the test of time",
    },
    {
      title: "User-Centric",
      description: "Every decision made with the end user in mind",
    },
    {
      title: "Continuous Learning",
      description: "Staying current with the latest technologies and best practices",
    },
    {
      title: "Collaboration",
      description: "Working closely with teams to deliver exceptional results",
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
            About Me
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 300,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6
            }}
          >
            I&apos;m a full-stack developer who believes in creating software that not only works well today, 
            but is built to evolve and scale for tomorrow&apos;s challenges.
          </Typography>
        </Box>

        {/* Philosophy Section */}
        <Paper elevation={1} sx={{ p: 4, mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            My Philosophy
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            I believe that great software is built through a combination of technical excellence, 
            user empathy, and iterative improvement. Every project is an opportunity to learn, 
            grow, and create something meaningful that solves real problems.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            My approach focuses on understanding the core problem before writing any code, 
            designing solutions that are both elegant and practical, and continuously refining 
            based on user feedback and performance metrics.
          </Typography>
        </Paper>

        {/* Process Section */}
        <Box mb={8}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            My Process
          </Typography>
          <Timeline position="alternate">
            {processSteps.map((step, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot sx={{ bgcolor: "primary.main" }}>
                    {step.icon}
                  </TimelineDot>
                  {index < processSteps.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} sx={{ p: 3, maxWidth: 300 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>

        {/* Values Section */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            Core Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: "100%" }}>
                  <CardHeader
                    title={value.title}
                    titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
