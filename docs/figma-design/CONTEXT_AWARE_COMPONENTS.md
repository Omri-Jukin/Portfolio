# Context-Aware Components Guide

This document describes how shared components adapt their behavior and presentation based on the context (employer vs client vs neutral).

---

## Overview

Several components appear on multiple pages but need to adapt their content, emphasis, and CTAs based on the audience:

1. **FeaturedProjects** - Shown on all three pages
2. **ContactSection** - Shown on employer and client pages
3. **Header** - Shown on all pages
4. **Skills** - Employer-specific but could be reused

---

## Component 1: Featured Projects

### Props Interface

```tsx
interface FeaturedProjectsProps {
  variant: 'neutral' | 'employer' | 'client';
  limit?: number; // Number of projects to show
  showViewAll?: boolean; // Show "View All" CTA
}
```

### Variant Behaviors

#### Neutral Variant (Landing Page)

**Usage:**
```tsx
<FeaturedProjects variant="neutral" limit={3} showViewAll={true} />
```

**Characteristics:**
- Shows 3 projects
- Balanced presentation
- General metrics (e.g., "↑ 150% Revenue")
- Simple tech stack badges
- "View All Projects" CTA at bottom

**Project Data Structure:**
```tsx
{
  title: "E-Commerce Platform",
  subtitle: "Full-stack marketplace application",
  description: "Built a scalable e-commerce platform handling 10K+ daily transactions.",
  technologies: ["React", "Node.js", "PostgreSQL"],
  metrics: {
    impact: "↑ 150% Revenue",
    year: "2023"
  },
  gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)"
}
```

#### Employer Variant (Employer Page)

**Usage:**
```tsx
<FeaturedProjects variant="employer" limit={6} />
```

**Characteristics:**
- Shows 6 projects
- Emphasizes technical details
- Metrics: Team size, scale, architecture
- More technical badges
- No "View All" CTA

**Project Data Structure:**
```tsx
{
  title: "E-Commerce Platform",
  subtitle: "Full-stack marketplace application",
  description: "Built a scalable e-commerce platform handling 10K+ daily transactions with real-time inventory management. Led a team of 3 developers and architected microservices architecture using Node.js and PostgreSQL.",
  technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
  metrics: {
    teamSize: "3 developers",
    scale: "10K+ daily transactions",
    year: "2023"
  },
  gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)"
}
```

#### Client Variant (Client Page)

**Usage:**
```tsx
<FeaturedProjects variant="client" limit={6} />
```

**Characteristics:**
- Shows 6 projects
- Emphasizes business value
- Metrics: ROI, results, timeline
- Service-focused badges
- No "View All" CTA

**Project Data Structure:**
```tsx
{
  title: "E-Commerce Platform",
  subtitle: "Full-stack marketplace application",
  description: "Built a scalable e-commerce platform that increased client revenue by 150% in the first 6 months. Delivered on time and under budget with regular client updates.",
  technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
  metrics: {
    impact: "↑ 150% Revenue",
    timeline: "Delivered in 8 weeks",
    year: "2023"
  },
  gradient: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)"
}
```

### Implementation

```tsx
import { Box, Container, Typography, Card, CardContent, Chip, Button, Grid } from '@mui/material';
import { Code, ArrowRight } from 'lucide-react';

interface FeaturedProjectsProps {
  variant: 'neutral' | 'employer' | 'client';
  limit?: number;
  showViewAll?: boolean;
}

interface ProjectMetrics {
  // Neutral variant
  impact?: string;
  year: string;
  
  // Employer variant
  teamSize?: string;
  scale?: string;
  
  // Client variant
  timeline?: string;
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  metrics: ProjectMetrics;
  gradient: string;
}

function FeaturedProjects({ variant = 'neutral', limit, showViewAll = false }: FeaturedProjectsProps) {
  // Get projects from data source
  const projects: Project[] = getProjects();
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  // Variant-specific headings
  const headings = {
    neutral: {
      title: 'Featured Projects',
      subtitle: 'Recent work showcasing impact and technical expertise'
    },
    employer: {
      title: 'Featured Projects',
      subtitle: 'Recent work demonstrating technical expertise and leadership'
    },
    client: {
      title: 'Featured Projects',
      subtitle: 'Successful projects delivering measurable business value'
    }
  };

  return (
    <Box component="section" id="projects" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
      <Container maxWidth="lg">
        {/* Section Heading */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, fontWeight: 600, mb: 1.5 }}>
            {headings[variant].title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {headings[variant].subtitle}
          </Typography>
        </Box>

        {/* Projects Grid */}
        <Grid container spacing={3}>
          {displayProjects.map((project) => (
            <Grid item xs={12} sm={6} lg={4} key={project.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' },
                }}
              >
                {/* Image Area */}
                <Box
                  sx={{
                    aspectRatio: '16/9',
                    background: project.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Code size={64} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                </Box>

                {/* Content */}
                <CardContent>
                  <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                    {project.description}
                  </Typography>

                  {/* Tech Stack */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {project.technologies.map((tech) => (
                      <Chip key={tech} label={tech} size="small" variant="outlined" />
                    ))}
                  </Box>

                  {/* Metrics - Variant specific */}
                  <ProjectMetrics variant={variant} metrics={project.metrics} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* View All CTA */}
        {showViewAll && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowRight size={16} />}
              href="/employers#projects"
            >
              View All Projects
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// Helper component for metrics display
function ProjectMetrics({ variant, metrics }: { variant: string; metrics: ProjectMetrics }) {
  if (variant === 'neutral') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.875rem' }}>
        {metrics.impact && (
          <>
            <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
              {metrics.impact}
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
          </>
        )}
        <Typography variant="body2" color="text.secondary">{metrics.year}</Typography>
      </Box>
    );
  }

  if (variant === 'employer') {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
        {metrics.teamSize && (
          <>
            <Typography variant="body2" color="text.secondary">
              <strong>Team:</strong> {metrics.teamSize}
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
          </>
        )}
        {metrics.scale && (
          <>
            <Typography variant="body2" color="text.secondary">
              <strong>Scale:</strong> {metrics.scale}
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
          </>
        )}
        <Typography variant="body2" color="text.secondary">{metrics.year}</Typography>
      </Box>
    );
  }

  if (variant === 'client') {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
        {metrics.impact && (
          <>
            <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
              {metrics.impact}
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
          </>
        )}
        {metrics.timeline && (
          <>
            <Typography variant="body2" color="text.secondary">{metrics.timeline}</Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
          </>
        )}
        <Typography variant="body2" color="text.secondary">{metrics.year}</Typography>
      </Box>
    );
  }

  return null;
}

export default FeaturedProjects;
```

---

## Component 2: Contact Section

### Props Interface

```tsx
interface ContactSectionProps {
  variant: 'employer' | 'client';
}
```

### Variant Behaviors

#### Employer Variant

**Usage:**
```tsx
<ContactSection variant="employer" />
```

**Characteristics:**
- Default "I'm interested in": "Full-time position"
- Additional fields: Company Name, Role/Position
- Options: Full-time, Contract, Consulting, Other
- CTA: "Send Message"
- Heading: "Get In Touch"
- Subheading: "Interested in hiring me? Let's discuss how I can help your team"

#### Client Variant

**Usage:**
```tsx
<ContactSection variant="client" />
```

**Characteristics:**
- Default "I'm interested in": "Freelance project"
- Additional fields: Project Type, Budget Range
- Options: Freelance project, Monthly retainer, Hourly consulting, Other
- CTA: "Request Quote"
- Heading: "Get In Touch"
- Subheading: "Ready to start your project? Let's discuss your needs"

### Implementation

```tsx
import { Box, Container, Card, CardHeader, CardContent, Grid, Typography, TextField, MenuItem, Button } from '@mui/material';
import { Mail } from 'lucide-react';

interface ContactSectionProps {
  variant: 'employer' | 'client';
}

function ContactSection({ variant }: ContactSectionProps) {
  const config = {
    employer: {
      heading: "Get In Touch",
      subheading: "Interested in hiring me? Let's discuss how I can help your team",
      defaultInterest: "fulltime",
      ctaText: "Send Message",
      interests: [
        { value: "fulltime", label: "Full-time position" },
        { value: "contract", label: "Contract position" },
        { value: "consulting", label: "Consulting" },
        { value: "other", label: "Other" },
      ]
    },
    client: {
      heading: "Get In Touch",
      subheading: "Ready to start your project? Let's discuss your needs",
      defaultInterest: "project",
      ctaText: "Request Quote",
      interests: [
        { value: "project", label: "Freelance project" },
        { value: "retainer", label: "Monthly retainer" },
        { value: "hourly", label: "Hourly consulting" },
        { value: "other", label: "Other" },
      ]
    }
  };

  const current = config[variant];

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader
            title={current.heading}
            subheader={current.subheading}
            sx={{ textAlign: 'center' }}
          />
          <CardContent>
            <Grid container spacing={4}>
              {/* Form */}
              <Grid item xs={12} md={6}>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Common Fields */}
                  <TextField label="Name" required fullWidth />
                  <TextField label="Email" type="email" required fullWidth />

                  {/* Variant-specific fields */}
                  {variant === 'employer' && (
                    <>
                      <TextField label="Company Name" required fullWidth />
                      <TextField label="Role/Position" fullWidth />
                    </>
                  )}

                  {variant === 'client' && (
                    <>
                      <TextField select label="Project Type" defaultValue="webapp" fullWidth>
                        <MenuItem value="webapp">Web Application</MenuItem>
                        <MenuItem value="ecommerce">E-Commerce</MenuItem>
                        <MenuItem value="dashboard">Dashboard/Analytics</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                      <TextField select label="Budget Range" defaultValue="unsure" fullWidth>
                        <MenuItem value="small">{"<$5,000"}</MenuItem>
                        <MenuItem value="medium">$5,000 - $10,000</MenuItem>
                        <MenuItem value="large">$10,000 - $25,000</MenuItem>
                        <MenuItem value="xlarge">$25,000+</MenuItem>
                        <MenuItem value="unsure">Not sure yet</MenuItem>
                      </TextField>
                    </>
                  )}

                  {/* Interest Select */}
                  <TextField
                    select
                    label="I'm interested in"
                    defaultValue={current.defaultInterest}
                    fullWidth
                  >
                    {current.interests.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Message */}
                  <TextField
                    label="Message"
                    multiline
                    rows={4}
                    required
                    fullWidth
                    placeholder={variant === 'client' ? "Tell me about your project..." : "Tell me about the opportunity..."}
                  />

                  {/* Submit */}
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Mail size={16} />}
                    fullWidth
                    type="submit"
                  >
                    {current.ctaText}
                  </Button>
                </Box>
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} md={6}>
                <ContactInfo />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ContactSection;
```

---

## Component 3: Header

### Props Interface

```tsx
interface HeaderProps {
  activePath?: 'home' | 'employers' | 'clients';
}
```

### Variant Behaviors

**Landing Page:**
```tsx
<Header activePath="home" />
```
- CTA: "Let's Talk"
- No active state on navigation

**Employer Page:**
```tsx
<Header activePath="employers" />
```
- CTA: "Download Resume" or "Contact Me"
- "For Employers" link is bold/highlighted

**Client Page:**
```tsx
<Header activePath="clients" />
```
- CTA: "Request Quote"
- "For Clients" link is bold/highlighted

### Implementation

```tsx
import { AppBar, Toolbar, Box, Container, Typography, Button } from '@mui/material';

interface HeaderProps {
  activePath?: 'home' | 'employers' | 'clients';
}

function Header({ activePath = 'home' }: HeaderProps) {
  const ctaConfig = {
    home: { text: "Let's Talk", href: "#contact" },
    employers: { text: "Download Resume", href: "/resume.pdf" },
    clients: { text: "Request Quote", href: "#contact" },
  };

  const cta = ctaConfig[activePath];

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid', borderColor: 'divider', height: 64 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ height: 64, px: 0 }}>
          {/* Left section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
              OJ
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.2 }}>
                Omri Jukin
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}>
                Full Stack Developer
              </Typography>
            </Box>
          </Box>

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              <Button
                href="/employers"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  fontSize: '0.875rem',
                  fontWeight: activePath === 'employers' ? 600 : 400,
                }}
              >
                For Employers
              </Button>
              <Button
                href="/clients"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  fontSize: '0.875rem',
                  fontWeight: activePath === 'clients' ? 600 : 400,
                }}
              >
                For Clients
              </Button>
              <Button
                href="#contact"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  fontSize: '0.875rem',
                }}
              >
                Contact
              </Button>
            </Box>

            <Button variant="contained" size="medium" href={cta.href}>
              {cta.text}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
```

---

## Summary

### Component Usage

**Landing Page:**
```tsx
<Header activePath="home" />
<FeaturedProjects variant="neutral" limit={3} showViewAll={true} />
```

**Employer Page:**
```tsx
<Header activePath="employers" />
<FeaturedProjects variant="employer" limit={6} />
<ContactSection variant="employer" />
```

**Client Page:**
```tsx
<Header activePath="clients" />
<FeaturedProjects variant="client" limit={6} />
<ContactSection variant="client" />
```

### Benefits

1. **Code Reuse**: Single component serves multiple use cases
2. **Consistency**: Same base structure across all pages
3. **Maintainability**: Update once, applies everywhere
4. **Type Safety**: TypeScript ensures correct variant usage
5. **Flexibility**: Easy to add new variants or behaviors

---

This completes the context-aware components documentation.
