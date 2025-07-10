import Link from "next/link";
import { Box, Container, Typography, Button, Card, CardContent, CardActions } from "@mui/material";
import { 
  Person as PersonIcon,
  Work as WorkIcon,
  Description as ResumeIcon,
  ContactPhone as ContactIcon,
  Article as BlogIcon,
  Launch as LaunchIcon 
} from "@mui/icons-material";

const portfolioSections = [
  {
    title: "About",
    description: "Learn about my background, skills, and professional journey",
    href: "/about",
    icon: PersonIcon,
    color: "primary" as const,
  },
  {
    title: "Career",
    description: "Explore my professional experience and career timeline",
    href: "/career", 
    icon: WorkIcon,
    color: "secondary" as const,
  },
  {
    title: "Resume",
    description: "View and download my complete resume and qualifications",
    href: "/resume",
    icon: ResumeIcon,
    color: "success" as const,
  },
  {
    title: "Blog",
    description: "Read my thoughts on technology, development, and industry insights",
    href: "/blog",
    icon: BlogIcon,
    color: "info" as const,
  },
  {
    title: "Contact",
    description: "Get in touch for opportunities, collaborations, or questions",
    href: "/contact",
    icon: ContactIcon,
    color: "warning" as const,
  },
];

export default function Home() {
  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Welcome to My Portfolio
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
          >
            I&apos;m a passionate developer dedicated to creating innovative solutions and sharing knowledge through code and writing
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              component={Link}
              href="/about"
              variant="contained" 
              size="large"
              startIcon={<PersonIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              About Me
            </Button>
            <Button 
              component={Link}
              href="/contact"
              variant="outlined" 
              size="large"
              startIcon={<ContactIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Get In Touch
            </Button>
          </Box>
        </Box>

        {/* Navigation Cards */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {portfolioSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card 
                key={section.title}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconComponent 
                      sx={{ 
                        fontSize: 32, 
                        color: `${section.color}.main`,
                        mr: 1.5 
                      }} 
                    />
                    <Typography variant="h6" component="h3" fontWeight={600}>
                      {section.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {section.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    component={Link}
                    href={section.href}
                    variant="contained"
                    color={section.color}
                    endIcon={<LaunchIcon />}
                    fullWidth
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Visit {section.title}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>

        {/* Quick Stats Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Portfolio Highlights
          </Typography>
          <Box className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Box>
              <Typography variant="h3" color="primary.main" fontWeight={700}>
                5+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Years Experience
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" color="secondary.main" fontWeight={700}>
                20+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Projects Completed
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" color="success.main" fontWeight={700}>
                10+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Technologies Mastered
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Call to Action */}
        <Box sx={{ mt: 8, textAlign: 'center', p: 4, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Ready to Work Together?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            I&apos;m always open to discussing new opportunities and interesting projects
          </Typography>
          <Button 
            component={Link}
            href="/contact"
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<ContactIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            Start a Conversation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
