# Client Page Design Specification (`/clients`)

Complete design specifications for the client-focused page optimized for businesses looking to hire for freelance projects or development services.

---

## Page Purpose

**Goal:** Convince clients to hire you for project-based work or development services.

**Key Actions:**
1. Review services and pricing
2. Understand your process
3. View portfolio of successful projects
4. Request a quote or consultation

---

## Page Structure

```
┌─────────────────────────────────────────────────┐
│ Header (Sticky, "For Clients" highlighted)      │
├─────────────────────────────────────────────────┤
│ Client Hero Section                             │
│  - Badge (Accepting Projects)                   │
│  - Heading "Build Your Next Product"            │
│  - Subtext                                      │
│  - Primary: Request Quote                       │
│  - Secondary: View Pricing                      │
├─────────────────────────────────────────────────┤
│ Services Overview (3 cards grid)                │
├─────────────────────────────────────────────────┤
│ Pricing & Packages Card (3 tiers)               │
├─────────────────────────────────────────────────┤
│ How I Work / Process Card (4 steps)             │
├─────────────────────────────────────────────────┤
│ Featured Projects (Client variant)              │
├─────────────────────────────────────────────────┤
│ Client CTA Card (Purple gradient)               │
├─────────────────────────────────────────────────┤
│ Contact Section (Client variant)                │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

---

## Visual Theme

**Primary Color:** Purple (#9333EA)
**Gradient:** Purple (#9333EA) → Pink (#EC4899)
**Aesthetic:** Creative, service-oriented, value-focused
**Emphasis:** Pricing transparency, ROI, process, results

---

## Client Hero Section

### MUI Implementation

```jsx
<Box component="section" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
  <Container maxWidth="lg">
    <Box sx={{ maxWidth: 896, mx: 'auto', textAlign: 'center' }}>
      {/* Availability Badge */}
      <Chip
        icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />}
        label="Accepting New Projects"
        size="small"
        sx={{ mb: 2, backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 500 }}
      />

      {/* Heading */}
      <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.625rem' }, fontWeight: 700, mb: 2 }}>
        Build Your Next Product
      </Typography>

      {/* Subtext */}
      <Typography variant="body1" sx={{ fontSize: '1.125rem', color: 'text.secondary', lineHeight: 1.6, maxWidth: 672, mx: 'auto', mb: 4 }}>
        Professional web development services with transparent pricing and proven processes. 
        Let's turn your vision into a successful digital product.
      </Typography>

      {/* CTAs */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Mail size={16} />}
          href="#contact"
          sx={{
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #7E22CE 0%, #DB2777 100%)' },
          }}
        >
          Request Quote
        </Button>
        <Button variant="outlined" size="large" startIcon={<DollarSign size={16} />} href="#pricing">
          View Pricing
        </Button>
      </Box>
    </Box>
  </Container>
</Box>
```

---

## Services Overview

(Same as current design - 3 cards: Full Stack Development, Performance Optimization, Technical Consulting)

See COMPONENT_BREAKDOWN.md for full implementation.

---

## Pricing & Packages

(Same as current design - 3 tiers: Hourly, Project Based, Monthly Retainer)

See COMPONENT_BREAKDOWN.md for full implementation.

---

## How I Work / Process

(Same as current design - 4 steps: Discovery, Planning, Development, Launch)

See COMPONENT_BREAKDOWN.md for full implementation.

---

## Featured Projects (Client Variant)

### Specifications

**Show:** 6 projects

**Emphasis:**
- ROI and business impact
- Results and metrics
- Timeline and delivery
- Client satisfaction

**Project Card (Client Variant):**

**Additional Details:**
- Business impact: "↑ 150% Revenue Growth"
- Timeline: "Delivered in 8 weeks"
- Client result: "500+ new users in first month"

**Example Project:**

```
E-Commerce Platform
Full-stack marketplace application

Built a scalable e-commerce platform that increased client revenue by 150% 
in the first 6 months. Delivered on time and under budget with regular client 
updates throughout the development process.

[React] [Node.js] [PostgreSQL] [Stripe]

Result: ↑ 150% Revenue | Timeline: 8 weeks | Year: 2023
```

### MUI Implementation

```jsx
<Box component="section" id="projects" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
  <Container maxWidth="lg">
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, fontWeight: 600, mb: 1.5 }}>
        Featured Projects
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Successful projects delivering measurable business value
      </Typography>
    </Box>

    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} md={6} lg={4} key={project.id}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}>
            <Box sx={{ aspectRatio: '16/9', background: project.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={64} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
            </Box>

            <CardContent>
              <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}>{project.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{project.subtitle}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>{project.description}</Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {project.technologies.map((tech) => (
                  <Chip key={tech} label={tech} size="small" variant="outlined" />
                ))}
              </Box>

              {/* Client-focused metrics */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                  {project.impact}
                </Typography>
                <Typography variant="body2" color="text.secondary">•</Typography>
                <Typography variant="body2" color="text.secondary">{project.timeline}</Typography>
                <Typography variant="body2" color="text.secondary">•</Typography>
                <Typography variant="body2" color="text.secondary">{project.year}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>
```

---

## Client CTA Card

### MUI Implementation

```jsx
<Card
  sx={{
    mb: 4,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
    border: 'none',
    color: 'white',
  }}
>
  <CardContent sx={{ py: { xs: 4, md: 6 }, textAlign: 'center' }}>
    <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, fontWeight: 700, mb: 2, color: 'white' }}>
      Ready to Start Your Project?
    </Typography>
    <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, mb: 4, color: 'rgba(255, 255, 255, 0.9)' }}>
      Let's discuss your needs and find the right solution for your business
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<Mail size={16} />}
        href="#contact"
        sx={{ backgroundColor: 'white', color: '#9333EA', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}
      >
        Request Quote
      </Button>
      <Button
        variant="outlined"
        size="large"
        startIcon={<Calendar size={16} />}
        href="#contact"
        sx={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.2)' },
        }}
      >
        Schedule Consultation
      </Button>
    </Box>
  </CardContent>
</Card>
```

---

## Contact Section (Client Variant)

### Form Defaults

- "I'm interested in" default: "Freelance project"
- Additional field: "Project Type"
- Additional field: "Budget Range"
- CTA text: "Request Quote"

### Form Fields

1. Name (required)
2. Email (required)
3. Project Type (select): Web App, E-Commerce, Dashboard, Other
4. Budget Range (select): <$5K, $5K-$10K, $10K-$25K, $25K+, Not sure
5. I'm interested in (select):
   - Freelance project (default)
   - Monthly retainer
   - Hourly consulting
   - Other
6. Message (required)

### MUI Implementation

```jsx
<Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <TextField label="Name" required fullWidth />
  <TextField label="Email" type="email" required fullWidth />
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
  <TextField select label="I'm interested in" defaultValue="project" fullWidth>
    <MenuItem value="project">Freelance project</MenuItem>
    <MenuItem value="retainer">Monthly retainer</MenuItem>
    <MenuItem value="hourly">Hourly consulting</MenuItem>
    <MenuItem value="other">Other</MenuItem>
  </TextField>
  <TextField label="Message" multiline rows={4} required fullWidth placeholder="Tell me about your project..." />
  <Button variant="contained" size="large" startIcon={<Mail size={16} />} fullWidth type="submit">
    Request Quote
  </Button>
</Box>
```

---

## Complete Page Example

```jsx
function ClientsPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(to bottom right, #0F172A, #1E293B)'
            : 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
      }}
    >
      <Header activePath="clients" />
      <ClientHero />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <ServicesOverview />
        <PricingPackages />
        <ProcessSection />
      </Container>
      <FeaturedProjects variant="client" />
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <ClientCTA />
      </Container>
      <ContactSection variant="client" />
      <Footer />
    </Box>
  );
}
```

---

## SEO Metadata

```jsx
export const metadata = {
  title: "Web Development Services - Omri Jukin | Transparent Pricing & Quality Results",
  description: "Professional web development services for businesses. View pricing, process, and portfolio. Specialized in React, Node.js, and cloud architecture. Request a quote today.",
  keywords: [
    "web development services",
    "freelance web developer",
    "custom web application",
    "react development",
    "web app pricing",
    "professional developer",
  ],
};
```

---

This completes the client page design specification.
