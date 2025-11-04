# Landing Page Design Specification

Complete design specifications for the unified landing page (`/`) that serves as the main entry point for both employers and clients.

---

## Page Purpose

**Goal:** Help visitors quickly identify their path (employer vs client) and navigate to the appropriate experience.

**Key Actions:**
1. Understand who you are and what you do
2. Choose their path (hiring or project)
3. Navigate to dedicated page

---

## Page Structure

```
┌─────────────────────────────────────────────────┐
│ Header (Sticky)                                 │
├─────────────────────────────────────────────────┤
│ Hero Section                                    │
│  - Badge                                        │
│  - Main Heading                                 │
│  - Subtext                                      │
│  - Dual CTAs (Primary + Secondary)             │
│  - Stats Grid (4 columns)                      │
├─────────────────────────────────────────────────┤
│ Path Selection Section                          │
│  - Section Heading                              │
│  - 2 Large Cards (Employer | Client)           │
├─────────────────────────────────────────────────┤
│ Featured Projects Preview                       │
│  - Section Heading                              │
│  - 3 Project Cards (Grid)                      │
│  - View All CTA                                 │
├─────────────────────────────────────────────────┤
│ Footer (Minimal)                                │
└─────────────────────────────────────────────────┘
```

---

## Section 1: Header

### Specifications

**Container:**
- Position: `sticky`, top: 0
- Z-index: 50
- Height: 64px
- Background: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(10px)`
- Border bottom: 1px solid #E2E8F0

**Layout:**
- Max-width: 1280px (xl)
- Padding: 0 16px
- Display: flex, justify-content: space-between

**Left Section:**
- Logo (40px circle) + Name + Title
- Gap: 12px

**Right Section:**
- Navigation links (hide on mobile/tablet)
- CTA button: "Let's Talk"

### MUI Implementation

```jsx
import { AppBar, Toolbar, Box, Container, Typography, Button } from '@mui/material';

<AppBar 
  position="sticky" 
  elevation={0}
  sx={{
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid',
    borderColor: 'divider',
    height: 64,
  }}
>
  <Container maxWidth="xl">
    <Toolbar sx={{ height: 64, px: 0 }}>
      {/* Left section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        {/* Logo */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          OJ
        </Box>
        
        {/* Name & Title */}
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.2 }}>
            Omri Jukin
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem',
              color: 'text.secondary',
              lineHeight: 1.2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Full Stack Developer
          </Typography>
        </Box>
      </Box>

      {/* Right section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Navigation - hide on mobile/tablet */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          <Button 
            href="/employers"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              fontSize: '0.875rem',
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
        
        {/* CTA Button */}
        <Button variant="contained" size="medium" href="#contact">
          Let's Talk
        </Button>
      </Box>
    </Toolbar>
  </Container>
</AppBar>
```

---

## Section 2: Hero Section

### Specifications

**Container:**
- Padding: 96px vertical (desktop), 64px (tablet), 48px (mobile)
- Max-width: 896px, centered
- Text align: center

**Badge:**
- Background: #F1F5F9
- Color: #475569
- Padding: 4px 12px
- Border radius: 16px
- Icon: MapPin (12px)
- Font size: 12px
- Margin bottom: 16px

**Heading:**
- Font size: 48px (desktop), 36px (tablet), 32px (mobile)
- Font weight: 700
- Color: #0F172A
- Line height: 1.2
- Letter spacing: -0.02em
- Margin bottom: 16px

**Subtext:**
- Font size: 18px (desktop), 16px (mobile)
- Color: #475569
- Line height: 1.6
- Max-width: 672px, centered
- Margin bottom: 32px

**Dual CTAs:**
- Display: flex (row on tablet+, column on mobile)
- Gap: 16px
- Justify content: center
- Margin bottom: 64px

**Primary CTA (I'm Hiring):**
- Size: large (44px height)
- Background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)
- Icon left: Briefcase (16px)
- Icon right: ArrowRight (16px)
- Hover: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)

**Secondary CTA (I Need Development):**
- Size: large (44px height)
- Variant: outlined
- Border: 1px solid #E2E8F0
- Icon left: Code (16px)
- Hover: background #F8FAFC

**Stats Grid:**
- Grid: 4 columns (desktop), 2x2 (mobile)
- Gap: 32px (desktop), 16px (mobile)
- Each stat: centered

**Stat Number:**
- Font size: 48px (desktop), 36px (mobile)
- Font weight: 700
- Color: #0F172A
- Margin bottom: 4px

**Stat Label:**
- Font size: 14px
- Color: #475569

### MUI Implementation

```jsx
import { Box, Container, Typography, Button, Chip, Grid } from '@mui/material';
import { Briefcase, Code, MapPin, ArrowRight } from 'lucide-react';

<Box 
  component="section" 
  sx={{ 
    py: { xs: 6, md: 8, lg: 12 },
    px: 2,
  }}
>
  <Container maxWidth="lg">
    <Box sx={{ maxWidth: 896, mx: 'auto', textAlign: 'center' }}>
      {/* Badge */}
      <Chip
        icon={<MapPin size={12} />}
        label="Available for Full-Time & Freelance"
        size="small"
        sx={{
          mb: 2,
          backgroundColor: 'grey.100',
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: '0.75rem',
        }}
      />

      {/* Heading */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.25rem', lg: '3rem' },
          fontWeight: 700,
          color: 'text.primary',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          mb: 2,
        }}
      >
        Full Stack Developer Building Scalable Web Applications
      </Typography>

      {/* Subtext */}
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1rem', md: '1.125rem' },
          color: 'text.secondary',
          lineHeight: 1.6,
          maxWidth: 672,
          mx: 'auto',
          mb: 4,
        }}
      >
        Specialized in React, Node.js, and cloud infrastructure. I help companies ship 
        robust products and provide technical consulting for businesses looking to scale.
      </Typography>

      {/* Dual CTAs */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
          mb: 8,
        }}
      >
        <Button
          variant="contained"
          size="large"
          href="/employers"
          startIcon={<Briefcase size={16} />}
          endIcon={<ArrowRight size={16} />}
          sx={{
            background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
            },
          }}
        >
          I'm Hiring
        </Button>
        <Button
          variant="outlined"
          size="large"
          href="/clients"
          startIcon={<Code size={16} />}
        >
          I Need Development
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {[
          { number: '5+', label: 'Years Experience' },
          { number: '50+', label: 'Projects Delivered' },
          { number: '20+', label: 'Technologies' },
          { number: '98%', label: 'Client Satisfaction' },
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {stat.number}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
            >
              {stat.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
</Box>
```

---

## Section 3: Path Selection Cards

### Specifications

**Container:**
- Padding: 64px vertical (desktop), 48px (mobile)
- Background: #FFFFFF (or transparent)
- Max-width: 1152px, centered

**Section Heading:**
- Font size: 30px (desktop), 24px (mobile)
- Font weight: 600
- Text align: center
- Color: #0F172A
- Margin bottom: 12px

**Section Subtext:**
- Font size: 16px
- Color: #475569
- Text align: center
- Margin bottom: 48px

**Cards Grid:**
- Display: grid
- Columns: 2 (desktop), 1 (mobile)
- Gap: 32px

### Path Selection Card (Common)

**Card Container:**
- Background: #FFFFFF
- Border: 2px solid #E2E8F0
- Border radius: 16px
- Padding: 40px
- Transition: all 200ms
- Hover: border-color #2563EB (employer) or #9333EA (client), transform translateY(-4px), shadow level 4

**Icon Container:**
- Width: 64px
- Height: 64px
- Border radius: 12px
- Background: gradient (varies)
- Display: flex, centered
- Margin bottom: 24px

**Title:**
- Font size: 24px
- Font weight: 600
- Color: #0F172A
- Margin bottom: 8px

**Description:**
- Font size: 16px
- Color: #475569
- Line height: 1.6
- Margin bottom: 24px

**Features List:**
- Gap: 12px
- Margin bottom: 32px

**Feature Item:**
- Display: flex
- Align items: start
- Gap: 12px
- Icon: CheckCircle2 (20px, color varies)
- Text: 14px, #475569

**CTA Button:**
- Full width
- Size: large
- Variant: varies

### Employer Card

**Icon Container Background:**
- Gradient: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)

**Icon:**
- Briefcase (32px, white)

**Title:**
- "For Employers"

**Description:**
- "Looking to hire a senior full-stack developer? I bring 5+ years of experience building scalable applications for startups and enterprises."

**Features:**
- ✓ Full-time or contract positions
- ✓ 5+ years of experience
- ✓ Led teams and architected systems
- ✓ Resume and portfolio available

**Feature Icon Color:**
- #2563EB (blue)

**CTA Button:**
- Variant: contained
- Background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)
- Text: "View Resume & Experience"

**Hover Border:**
- #2563EB

### Client Card

**Icon Container Background:**
- Gradient: linear-gradient(135deg, #9333EA 0%, #EC4899 100%)

**Icon:**
- Code (32px, white)

**Title:**
- "For Clients"

**Description:**
- "Need a web application built? I provide transparent pricing, proven processes, and quality results for businesses looking to scale."

**Features:**
- ✓ Transparent pricing & packages
- ✓ Proven development process
- ✓ Regular updates & communication
- ✓ Portfolio of successful projects

**Feature Icon Color:**
- #9333EA (purple)

**CTA Button:**
- Variant: contained
- Background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%)
- Text: "View Services & Pricing"

**Hover Border:**
- #9333EA

### MUI Implementation

```jsx
import { Box, Container, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { Briefcase, Code, CheckCircle2 } from 'lucide-react';

<Box component="section" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
  <Container maxWidth="lg">
    {/* Section Heading */}
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '1.875rem' },
          fontWeight: 600,
          mb: 1.5,
        }}
      >
        Choose Your Path
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Select the option that best describes your needs
      </Typography>
    </Box>

    {/* Path Cards Grid */}
    <Grid container spacing={4}>
      {/* Employer Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: 4,
            p: 5,
            height: '100%',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#2563EB',
              transform: 'translateY(-4px)',
              boxShadow: 4,
            },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Briefcase size={32} color="white" />
            </Box>

            {/* Title */}
            <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 1 }}>
              For Employers
            </Typography>

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              Looking to hire a senior full-stack developer? I bring 5+ years of experience 
              building scalable applications for startups and enterprises.
            </Typography>

            {/* Features */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              {[
                'Full-time or contract positions',
                '5+ years of experience',
                'Led teams and architected systems',
                'Resume and portfolio available',
              ].map((feature, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                  <CheckCircle2 size={20} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              href="/employers"
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
                },
              }}
            >
              View Resume & Experience
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Client Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: 4,
            p: 5,
            height: '100%',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#9333EA',
              transform: 'translateY(-4px)',
              boxShadow: 4,
            },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Code size={32} color="white" />
            </Box>

            {/* Title */}
            <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 1 }}>
              For Clients
            </Typography>

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              Need a web application built? I provide transparent pricing, proven processes, 
              and quality results for businesses looking to scale.
            </Typography>

            {/* Features */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              {[
                'Transparent pricing & packages',
                'Proven development process',
                'Regular updates & communication',
                'Portfolio of successful projects',
              ].map((feature, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                  <CheckCircle2 size={20} style={{ color: '#9333EA', flexShrink: 0, marginTop: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              href="/clients"
              sx={{
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7E22CE 0%, #DB2777 100%)',
                },
              }}
            >
              View Services & Pricing
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Container>
</Box>
```

---

## Section 4: Featured Projects Preview

### Specifications

**Container:**
- Padding: 64px vertical (desktop), 48px (mobile)
- Background: transparent
- Max-width: 1152px, centered

**Section Heading:**
- Font size: 30px (desktop), 24px (mobile)
- Font weight: 600
- Text align: center
- Margin bottom: 12px

**Section Subtext:**
- Font size: 16px
- Color: #475569
- Text align: center
- Margin bottom: 48px

**Projects Grid:**
- Display: grid
- Columns: 3 (desktop ≥1200px), 2 (tablet 600-1199px), 1 (mobile <600px)
- Gap: 24px

**Show Only:** 3 projects (hide 4th+ on landing page)

### Project Card

**Card Container:**
- Border radius: 12px
- Overflow: hidden
- Box shadow: level 2
- Transition: all 200ms
- Hover: shadow level 4, transform translateY(-4px)

**Image Area:**
- Aspect ratio: 16:9
- Background: gradient (varies by project)
- Display: flex, centered
- Icon: 64px, white with 30% opacity

**Content Area:**
- Padding: 24px

**Title:**
- Font size: 20px
- Font weight: 600
- Margin bottom: 4px

**Subtitle:**
- Font size: 14px
- Color: #475569
- Margin bottom: 16px

**Description:**
- Font size: 14px
- Color: #475569
- Margin bottom: 16px

**Tech Stack:**
- Display: flex wrap
- Gap: 8px
- Margin bottom: 16px
- Badges: small, outlined variant

**Metrics:**
- Display: flex
- Align items: center
- Gap: 16px
- Font size: 14px
- Impact metric: #10B981, font-weight 600
- Separator: #CBD5E1
- Year: #475569

### View All CTA

**Container:**
- Text align: center
- Margin top: 32px

**Button:**
- Variant: outlined
- Size: large
- Icon right: ArrowRight (16px)

### MUI Implementation

```jsx
import { Box, Container, Typography, Card, CardContent, Chip, Button, Grid } from '@mui/material';
import { Code, TrendingUp, ArrowRight } from 'lucide-react';

<Box component="section" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
  <Container maxWidth="lg">
    {/* Section Heading */}
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '1.875rem' },
          fontWeight: 600,
          mb: 1.5,
        }}
      >
        Featured Projects
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Recent work showcasing impact and technical expertise
      </Typography>
    </Box>

    {/* Projects Grid - Show only 3 */}
    <Grid container spacing={3}>
      {/* Project 1 */}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-4px)',
            },
          }}
        >
          {/* Image Area */}
          <Box
            sx={{
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
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
              E-Commerce Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Full-stack marketplace application
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
              Built a scalable e-commerce platform handling 10K+ daily transactions with 
              real-time inventory management.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip label="React" size="small" variant="outlined" />
              <Chip label="Node.js" size="small" variant="outlined" />
              <Chip label="PostgreSQL" size="small" variant="outlined" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.875rem' }}>
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                ↑ 150% Revenue
              </Typography>
              <Typography variant="body2" color="text.secondary">•</Typography>
              <Typography variant="body2" color="text.secondary">2023</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Project 2 */}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-4px)',
            },
          }}
        >
          <Box
            sx={{
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={64} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
          </Box>
          <CardContent>
            <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}>
              Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Real-time data visualization
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
              Developed interactive dashboard processing 1M+ data points with advanced filtering.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip label="React" size="small" variant="outlined" />
              <Chip label="D3.js" size="small" variant="outlined" />
              <Chip label="Python" size="small" variant="outlined" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.875rem' }}>
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                ↓ 40% Time Saved
              </Typography>
              <Typography variant="body2" color="text.secondary">•</Typography>
              <Typography variant="body2" color="text.secondary">2024</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Project 3 */}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-4px)',
            },
          }}
        >
          <Box
            sx={{
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Code size={64} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
          </Box>
          <CardContent>
            <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}>
              SaaS Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Multi-tenant application
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
              Built scalable SaaS platform with role-based access and payment integration.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip label="Next.js" size="small" variant="outlined" />
              <Chip label="Stripe" size="small" variant="outlined" />
              <Chip label="AWS" size="small" variant="outlined" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.875rem' }}>
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                500+ Users
              </Typography>
              <Typography variant="body2" color="text.secondary">•</Typography>
              <Typography variant="body2" color="text.secondary">2024</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* View All CTA - Optional */}
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
  </Container>
</Box>
```

---

## Section 5: Footer (Minimal)

### Specifications

**Container:**
- Border top: 1px solid #E2E8F0
- Background: #FFFFFF
- Padding: 32px vertical

**Content:**
- Display: flex
- Justify content: space-between
- Align items: center
- Flex direction: column (mobile), row (desktop)
- Gap: 16px

**Copyright:**
- Font size: 14px
- Color: #475569

**Links:**
- Display: flex
- Gap: 24px
- Font size: 14px
- Color: #475569
- Hover: #0F172A

### MUI Implementation

```jsx
import { Box, Container, Typography } from '@mui/material';

<Box
  component="footer"
  sx={{
    borderTop: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    py: 4,
  }}
>
  <Container maxWidth="xl">
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2024 Omri Jukin. All rights reserved.
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Typography
          component="a"
          href="/privacy"
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'text.primary' },
            transition: 'color 0.2s',
          }}
        >
          Privacy Policy
        </Typography>
        <Typography
          component="a"
          href="/terms"
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'text.primary' },
            transition: 'color 0.2s',
          }}
        >
          Terms of Service
        </Typography>
      </Box>
    </Box>
  </Container>
</Box>
```

---

## Responsive Behavior

### Mobile (<600px)

- Header: Logo + Name only (hide title), hide navigation links
- Hero: 32px heading, column CTAs, 2x2 stats
- Path cards: Stack vertically (1 column)
- Projects: 1 column
- Footer: Stack vertically

### Tablet (600-899px)

- Header: Logo + Name + Title, hide navigation links
- Hero: 36px heading, row CTAs, 4 column stats
- Path cards: Stack vertically (1 column) or side-by-side depending on content
- Projects: 2 columns
- Footer: Horizontal layout

### Desktop (≥900px)

- Header: Full layout with navigation
- Hero: 48px heading, row CTAs, 4 column stats
- Path cards: 2 columns side-by-side
- Projects: 3 columns
- Footer: Horizontal layout

---

## Color Palette

### Light Mode

- Background: Linear gradient from #F8FAFC to #F1F5F9
- Cards: #FFFFFF
- Text primary: #0F172A
- Text secondary: #475569
- Border: #E2E8F0
- Employer accent: #2563EB
- Client accent: #9333EA

### Dark Mode

- Background: Linear gradient from #0F172A to #1E293B
- Cards: #1E293B
- Text primary: #F1F5F9
- Text secondary: #94A3B8
- Border: #334155
- Employer accent: #3B82F6
- Client accent: #A855F7

---

## Complete Page Example

```jsx
import { ThemeProvider, CssBaseline } from '@mui/material';

function LandingPage() {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(to bottom right, #0F172A, #1E293B)'
              : 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
        }}
      >
        <Header />
        <HeroSection />
        <PathSelectionSection />
        <FeaturedProjectsPreview />
        <Footer />
      </Box>
    </>
  );
}

export default LandingPage;
```

---

This completes the landing page design specification. All measurements, colors, and implementations are exact and ready for MUI conversion.
