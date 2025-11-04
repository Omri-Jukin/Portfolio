# Employer Page Design Specification (`/employers`)

Complete design specifications for the employer-focused page optimized for companies looking to hire a full-time or contract developer.

---

## Page Purpose

**Goal:** Convince employers to hire you for full-time or contract positions.

**Key Actions:**
1. Review professional experience and achievements
2. Assess technical skills and expertise
3. Download resume
4. Contact for interviews/opportunities

---

## Page Structure

```
┌─────────────────────────────────────────────────┐
│ Header (Sticky, "For Employers" highlighted)    │
├─────────────────────────────────────────────────┤
│ Employer Hero Section                           │
│  - Badge (Available)                            │
│  - Heading "Hire a Senior Full Stack Developer" │
│  - Subtext                                      │
│  - Primary: Download Resume                     │
│  - Secondary: Schedule Call                     │
├─────────────────────────────────────────────────┤
│ Professional Summary Card                       │
├─────────────────────────────────────────────────┤
│ Experience Timeline Card                        │
├─────────────────────────────────────────────────┤
│ Key Achievements Card                           │
├─────────────────────────────────────────────────┤
│ Skills & Technologies Card                      │
├─────────────────────────────────────────────────┤
│ Education & Certifications Card                 │
├─────────────────────────────────────────────────┤
│ Featured Projects (Employer variant)            │
├─────────────────────────────────────────────────┤
│ Employer CTA Card (Blue gradient)               │
├─────────────────────────────────────────────────┤
│ Contact Section (Employer variant)              │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

---

## Visual Theme

**Primary Color:** Blue (#2563EB)
**Gradient:** Blue (#2563EB) → Cyan (#06B6D4)
**Aesthetic:** Professional, corporate, metrics-focused
**Emphasis:** Experience, achievements, technical skills, credentials

---

## Section 1: Employer Hero

### Specifications

**Container:**
- Padding: 64px vertical (desktop), 48px (mobile)
- Max-width: 896px, centered
- Text align: center
- Background: transparent

**Badge:**
- Background: #D1FAE5 (green-100)
- Color: #065F46 (green-800)
- Icon: Circle (8px, #10B981)
- Text: "Available for Full-Time Positions"
- Padding: 6px 16px
- Border radius: 16px
- Margin bottom: 16px

**Heading:**
- Font size: 42px (desktop), 32px (mobile)
- Font weight: 700
- Color: #0F172A
- Line height: 1.2
- Margin bottom: 16px

**Subtext:**
- Font size: 18px
- Color: #475569
- Line height: 1.6
- Max-width: 672px, centered
- Margin bottom: 32px

**CTAs:**
- Display: flex (row on tablet+, column on mobile)
- Gap: 16px
- Justify content: center

**Primary CTA (Download Resume):**
- Variant: contained
- Size: large
- Background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)
- Icon: FileText (16px)

**Secondary CTA (Schedule Call):**
- Variant: outlined
- Size: large
- Icon: Calendar (16px)

### MUI Implementation

```jsx
<Box component="section" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
  <Container maxWidth="lg">
    <Box sx={{ maxWidth: 896, mx: 'auto', textAlign: 'center' }}>
      {/* Availability Badge */}
      <Chip
        icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />}
        label="Available for Full-Time Positions"
        size="small"
        sx={{
          mb: 2,
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          fontWeight: 500,
        }}
      />

      {/* Heading */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.625rem' },
          fontWeight: 700,
          mb: 2,
        }}
      >
        Hire a Senior Full Stack Developer
      </Typography>

      {/* Subtext */}
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.125rem',
          color: 'text.secondary',
          lineHeight: 1.6,
          maxWidth: 672,
          mx: 'auto',
          mb: 4,
        }}
      >
        5+ years building scalable web applications for startups and enterprises. 
        Experienced in leading teams, architecting systems, and delivering high-impact products.
      </Typography>

      {/* CTAs */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<FileText size={16} />}
          href="/resume.pdf"
          download
          sx={{
            background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
            },
          }}
        >
          Download Resume
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Calendar size={16} />}
          href="#contact"
        >
          Schedule Call
        </Button>
      </Box>
    </Box>
  </Container>
</Box>
```

---

## Section 2: Professional Summary Card

(Same as current design - see COMPONENT_BREAKDOWN.md)

---

## Section 3: Experience Timeline Card

(Same as current design - see COMPONENT_BREAKDOWN.md)

---

## Section 4: Key Achievements Card

(Same as current design - see COMPONENT_BREAKDOWN.md)

---

## Section 5: Skills & Technologies Card

### Specifications

**Card Container:**
- Border radius: 12px
- Padding: 24px
- Background: #FFFFFF
- Margin bottom: 32px

**Title:**
- Font size: 24px
- Font weight: 600
- Icon: Code (20px)
- Margin bottom: 16px

**Categories:**
- Display: flex column
- Gap: 24px

**Category:**
- Margin bottom: 24px (last: 0)

**Category Title:**
- Font size: 16px
- Font weight: 600
- Color: #0F172A
- Margin bottom: 12px

**Skills Grid:**
- Display: flex wrap
- Gap: 8px

**Skill Badge:**
- Variant: default (filled background)
- Size: small
- Background: #F1F5F9
- Color: #475569

### Categories & Skills

1. **Frontend:**
   - React, Next.js, TypeScript, Tailwind CSS, Material-UI, Redux, React Query

2. **Backend:**
   - Node.js, Express, tRPC, PostgreSQL, MongoDB, REST APIs, GraphQL

3. **DevOps & Cloud:**
   - AWS, Docker, Kubernetes, CI/CD, GitHub Actions, Vercel, Netlify

4. **Tools & Methodologies:**
   - Git, Figma, Agile/Scrum, Test-Driven Development, Code Review

### MUI Implementation

```jsx
<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardHeader
    title={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Code size={20} />
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Skills & Technologies
        </Typography>
      </Box>
    }
  />
  <CardContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Frontend */}
      <Box>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1.5 }}>
          Frontend
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Material-UI', 'Redux', 'React Query'].map((skill) => (
            <Chip key={skill} label={skill} size="small" />
          ))}
        </Box>
      </Box>

      {/* Backend */}
      <Box>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1.5 }}>
          Backend
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['Node.js', 'Express', 'tRPC', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'].map((skill) => (
            <Chip key={skill} label={skill} size="small" />
          ))}
        </Box>
      </Box>

      {/* DevOps & Cloud */}
      <Box>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1.5 }}>
          DevOps & Cloud
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Vercel', 'Netlify'].map((skill) => (
            <Chip key={skill} label={skill} size="small" />
          ))}
        </Box>
      </Box>

      {/* Tools & Methodologies */}
      <Box>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1.5 }}>
          Tools & Methodologies
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['Git', 'Figma', 'Agile/Scrum', 'Test-Driven Development', 'Code Review'].map((skill) => (
            <Chip key={skill} label={skill} size="small" />
          ))}
        </Box>
      </Box>
    </Box>
  </CardContent>
</Card>
```

---

## Section 6: Education & Certifications Card

(Same as current design - see COMPONENT_BREAKDOWN.md)

---

## Section 7: Featured Projects (Employer Variant)

### Specifications

**Show:** 6 projects (vs 3 on landing page)

**Emphasis:**
- Team size
- Technologies used
- Scale/metrics (users, transactions, etc.)
- Architecture decisions

**Project Card (Employer Variant):**

**Additional Details (vs neutral variant):**
- Team size: "Led team of 5 developers"
- Scale metric: "Serving 100K+ users"
- Technical highlight: "Microservices architecture"

**Example Project:**

```
E-Commerce Platform
Full-stack marketplace application

Built a scalable e-commerce platform handling 10K+ daily transactions 
with real-time inventory management. Led a team of 3 developers and 
architected microservices architecture using Node.js and PostgreSQL.

[React] [Node.js] [PostgreSQL] [Docker] [AWS]

Team: 3 developers | Scale: 10K+ daily transactions | Year: 2023
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
        Recent work demonstrating technical expertise and leadership
      </Typography>
    </Box>

    <Grid container spacing={3}>
      {/* Show 6 projects with employer-focused details */}
      {projects.map((project) => (
        <Grid item xs={12} md={6} lg={4} key={project.id}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.2s ease-in-out',
              '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' },
            }}
          >
            {/* Image area */}
            <Box sx={{ aspectRatio: '16/9', background: project.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

              {/* Employer-focused metrics */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Team:</strong> {project.teamSize}
                </Typography>
                <Typography variant="body2" color="text.secondary">•</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Scale:</strong> {project.scale}
                </Typography>
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

## Section 8: Employer CTA Card

### Specifications

**Card Container:**
- Background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)
- Border: none
- Border radius: 12px
- Padding: 48px (desktop), 32px (mobile)
- Text align: center
- Color: #FFFFFF
- Margin bottom: 32px

**Title:**
- Font size: 30px (desktop), 24px (mobile)
- Font weight: 700
- Color: #FFFFFF
- Margin bottom: 16px

**Description:**
- Font size: 18px (desktop), 16px (mobile)
- Color: rgba(255, 255, 255, 0.9)
- Margin bottom: 32px

**CTAs:**
- Display: flex (row on tablet+, column on mobile)
- Gap: 16px
- Justify content: center

**Primary CTA:**
- Variant: contained
- Background: #FFFFFF
- Color: #2563EB
- Size: large
- Icon: FileText

**Secondary CTA:**
- Variant: outlined
- Border: 1px solid rgba(255, 255, 255, 0.3)
- Background: rgba(255, 255, 255, 0.1)
- Color: #FFFFFF
- Size: large
- Icon: Mail
- Hover: background rgba(255, 255, 255, 0.2)

### MUI Implementation

```jsx
<Card
  sx={{
    mb: 4,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    border: 'none',
    color: 'white',
  }}
>
  <CardContent sx={{ py: { xs: 4, md: 6 }, textAlign: 'center' }}>
    <Typography
      variant="h3"
      sx={{
        fontSize: { xs: '1.5rem', md: '1.875rem' },
        fontWeight: 700,
        mb: 2,
        color: 'white',
      }}
    >
      Ready to Hire?
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontSize: { xs: '1rem', md: '1.125rem' },
        mb: 4,
        color: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      Download my resume or get in touch to discuss opportunities
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        justifyContent: 'center',
      }}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={<FileText size={16} />}
        href="/resume.pdf"
        download
        sx={{
          backgroundColor: 'white',
          color: '#2563EB',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        Download Resume
      </Button>
      <Button
        variant="outlined"
        size="large"
        startIcon={<Mail size={16} />}
        href="#contact"
        sx={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        Contact Me
      </Button>
    </Box>
  </CardContent>
</Card>
```

---

## Section 9: Contact Section (Employer Variant)

### Specifications

**Form Defaults:**
- "I'm interested in" default: "Full-time position"
- Additional field: "Company Name"
- Additional field: "Role/Position"
- CTA text: "Send Message"

**Form Fields:**
1. Name (required)
2. Email (required)
3. Company Name (required)
4. Role/Position (optional)
5. I'm interested in (select):
   - Full-time position (default)
   - Contract position
   - Consulting
   - Other
6. Message (required)

### MUI Implementation

```jsx
<Box component="section" id="contact" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
  <Container maxWidth="md">
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Get In Touch"
        subheader="Interested in hiring me? Let's discuss how I can help your team"
        sx={{ textAlign: 'center' }}
      />
      <CardContent>
        <Grid container spacing={4}>
          {/* Form */}
          <Grid item xs={12} md={6}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Name" required fullWidth />
              <TextField label="Email" type="email" required fullWidth />
              <TextField label="Company Name" required fullWidth />
              <TextField label="Role/Position" fullWidth />
              <TextField
                select
                label="I'm interested in"
                defaultValue="fulltime"
                fullWidth
              >
                <MenuItem value="fulltime">Full-time position</MenuItem>
                <MenuItem value="contract">Contract position</MenuItem>
                <MenuItem value="consulting">Consulting</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              <TextField
                label="Message"
                multiline
                rows={4}
                required
                fullWidth
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<Mail size={16} />}
                fullWidth
                type="submit"
              >
                Send Message
              </Button>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            {/* Same as landing page contact info */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Container>
</Box>
```

---

## Complete Page Example

```jsx
function EmployersPage() {
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
      <Header activePath="employers" />
      <EmployerHero />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <ProfessionalSummary />
        <ExperienceTimeline />
        <KeyAchievements />
        <SkillsTechnologies />
        <EducationCertifications />
      </Container>
      <FeaturedProjects variant="employer" />
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <EmployerCTA />
      </Container>
      <ContactSection variant="employer" />
      <Footer />
    </Box>
  );
}
```

---

## SEO Metadata

```jsx
export const metadata = {
  title: "Hire Omri Jukin - Senior Full Stack Developer | React, Node.js Expert",
  description: "Experienced full-stack developer with 5+ years building scalable web applications. View resume, portfolio, and technical achievements. Available for full-time and contract positions.",
  keywords: [
    "hire full stack developer",
    "senior react developer",
    "node.js expert",
    "full-time developer",
    "contract developer",
    "web application developer",
  ],
};
```

---

This completes the employer page design specification. All measurements, colors, and implementations are exact and ready for MUI conversion.
