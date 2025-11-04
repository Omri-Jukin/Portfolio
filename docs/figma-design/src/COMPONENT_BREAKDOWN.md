# Component Breakdown - Section-by-Section Details

This document provides detailed specifications for every section and component in the portfolio design, including exact layouts, spacing, and MUI implementation examples.

---

## Table of Contents

1. [Header](#header)
2. [Hero Section](#hero-section)
3. [Tab Navigation](#tab-navigation)
4. [Employer Tab Content](#employer-tab-content)
5. [Client Tab Content](#client-tab-content)
6. [Featured Projects](#featured-projects)
7. [Contact Section](#contact-section)
8. [Footer](#footer)

---

## Header

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [●] Omri Jukin          For Employers  For Clients  Contact  [Button] │
│     Full Stack Developer                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Specifications

**Container:**
- Height: 64px
- Position: sticky, top: 0
- Z-index: 50
- Background: rgba(255, 255, 255, 0.95) with backdrop-filter: blur(10px)
- Border bottom: 1px solid #E2E8F0
- Padding: 0 16px

**Left Section (Logo + Name):**
- Display: flex
- Align items: center
- Gap: 12px

**Logo Circle:**
- Width: 40px
- Height: 40px
- Border radius: 50%
- Background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)
- Display: flex
- Justify content: center
- Align items: center
- Text: "OJ"
- Font size: 16px
- Font weight: 700
- Color: #FFFFFF

**Name & Title:**
- Display: flex column
- Gap: 2px

Name:
- Font size: 16px
- Font weight: 600
- Color: #0F172A
- Line height: 1.2

Title:
- Font size: 14px
- Font weight: 400
- Color: #475569
- Line height: 1.2

**Right Section (Navigation):**
- Display: flex
- Align items: center
- Gap: 24px

Navigation Links (Desktop only, hide on mobile):
- Font size: 14px
- Font weight: 400
- Color: #475569
- Hover color: #0F172A
- Transition: color 200ms

CTA Button:
- Variant: contained (primary)
- Size: medium
- Text: "Let's Talk"

### MUI Implementation

```jsx
import { AppBar, Toolbar, Box, Container, Typography, Button } from '@mui/material';

function Header() {
  return (
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
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                Omri Jukin
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.2,
                }}
              >
                Full Stack Developer
              </Typography>
            </Box>
          </Box>

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Navigation - hide on mobile */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              <Button 
                color="inherit" 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  fontSize: '0.875rem',
                }}
              >
                For Employers
              </Button>
              <Button 
                color="inherit"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  fontSize: '0.875rem',
                }}
              >
                For Clients
              </Button>
              <Button 
                color="inherit"
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
            <Button variant="contained" size="medium">
              Let's Talk
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
```

---

## Hero Section

### Layout Structure

```
┌──────────────────────────────────────────────────┐
│                  [Badge Icon] Badge Text          │
│                                                   │
│        Full Stack Developer Building             │
│        Scalable Web Applications                 │
│                                                   │
│        Specialized in React, Node.js, and        │
│        cloud infrastructure. I help companies... │
│                                                   │
│     [I'm Hiring Button]  [I Need Development]    │
│                                                   │
│   [5+ Years]  [50+ Projects]  [20+ Tech]  [98%]  │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Specifications

**Container:**
- Max width: 896px
- Margin: 0 auto (centered)
- Padding: 48px vertical (desktop), 32px (mobile)
- Text align: center

**Badge:**
- Background: #F1F5F9
- Color: #475569
- Padding: 4px 12px
- Border radius: 16px
- Font size: 12px
- Font weight: 500
- Display: inline-flex
- Align items: center
- Gap: 6px
- Margin bottom: 16px

Badge Icon (MapPin):
- Size: 12px
- Color: inherit

**Main Heading:**
- Font size: 36px (desktop), 28px (mobile)
- Font weight: 700
- Color: #0F172A
- Line height: 1.2
- Margin bottom: 16px
- Max width: 100%

**Subtext:**
- Font size: 16px
- Color: #475569
- Line height: 1.6
- Max width: 672px
- Margin: 0 auto 32px

**CTA Buttons Container:**
- Display: flex
- Gap: 16px
- Justify content: center
- Margin bottom: 48px
- Flex direction: column on mobile, row on tablet+

Primary CTA (I'm Hiring):
- Variant: contained
- Size: large
- Background: linear-gradient(135deg, #2563EB, #1E40AF)
- Start icon: Briefcase (16px)
- End icon: ArrowRight (16px)

Secondary CTA (I Need Development):
- Variant: outlined
- Size: large
- Start icon: Code (16px)

**Stats Grid:**
- Display: grid
- Columns: 4 on desktop, 2 on mobile
- Gap: 32px (desktop), 16px (mobile)
- Each stat centered

Stat Number:
- Font size: 48px (desktop), 36px (mobile)
- Font weight: 700
- Color: #0F172A
- Margin bottom: 4px

Stat Label:
- Font size: 14px
- Color: #475569
- Line height: 1.5

### MUI Implementation

```jsx
import { Box, Container, Typography, Button, Chip, Grid } from '@mui/material';
import { Briefcase, Code, MapPin, ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 4, md: 6, lg: 12 },
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

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Full Stack Developer Building Scalable Web Applications
          </Typography>

          {/* Subtext */}
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
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

          {/* CTA Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              mb: 6,
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Briefcase size={16} />}
              endIcon={<ArrowRight size={16} />}
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
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
              startIcon={<Code size={16} />}
            >
              I Need Development
            </Button>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 0.5 }}>
                5+
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Years Experience
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 0.5 }}>
                50+
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Projects Delivered
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 0.5 }}>
                20+
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Technologies
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 0.5 }}>
                98%
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Client Satisfaction
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
```

---

## Tab Navigation

### Layout Structure

```
┌────────────────────────────────────┐
│  [📊 For Employers] [👥 For Clients] │
└────────────────────────────────────┘
```

### Specifications

**Tab Container:**
- Max width: 448px
- Margin: 0 auto 32px
- Background: #F1F5F9
- Border radius: 8px
- Padding: 4px

**Individual Tabs:**
- Display: flex
- Align items: center
- Gap: 8px (between icon and text)
- Padding: 10px 20px
- Border radius: 6px
- Font size: 14px
- Font weight: 500
- Transition: all 200ms

Inactive Tab:
- Background: transparent
- Color: #475569

Active Tab:
- Background: #FFFFFF
- Color: #0F172A
- Box shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

Hover (Inactive):
- Background: rgba(255, 255, 255, 0.5)

**Tab Icons:**
- Size: 16px
- Color: inherit from tab

### MUI Implementation

```jsx
import { Box, Container, Tabs, Tab } from '@mui/material';
import { Briefcase, Users } from 'lucide-react';
import { useState } from 'react';

function TabNavigation() {
  const [activeTab, setActiveTab] = useState('employers');

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Tabs */}
        <Box sx={{ maxWidth: 448, mx: 'auto', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              backgroundColor: 'grey.100',
              borderRadius: 2,
              p: 0.5,
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                display: 'none', // Hide default indicator
              },
            }}
          >
            <Tab
              value="employers"
              label="For Employers"
              icon={<Briefcase size={16} />}
              iconPosition="start"
              sx={{
                flex: 1,
                minHeight: 'auto',
                py: 1.25,
                px: 2.5,
                borderRadius: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'text.secondary',
                '&.Mui-selected': {
                  backgroundColor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
                '&:not(.Mui-selected):hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                },
                transition: 'all 0.2s',
              }}
            />
            <Tab
              value="clients"
              label="For Clients"
              icon={<Users size={16} />}
              iconPosition="start"
              sx={{
                flex: 1,
                minHeight: 'auto',
                py: 1.25,
                px: 2.5,
                borderRadius: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                color: 'text.secondary',
                '&.Mui-selected': {
                  backgroundColor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
                '&:not(.Mui-selected):hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                },
                transition: 'all 0.2s',
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value="employers" activeTab={activeTab}>
          {/* Employer content here */}
        </TabPanel>

        <TabPanel value="clients" activeTab={activeTab}>
          {/* Client content here */}
        </TabPanel>
      </Container>
    </Box>
  );
}

// TabPanel helper component
function TabPanel({ children, value, activeTab }) {
  return (
    <Box hidden={value !== activeTab} sx={{ py: 3 }}>
      {value === activeTab && children}
    </Box>
  );
}
```

---

## Employer Tab Content

### Card 1: Professional Summary

**Specifications:**
- Background: #FFFFFF
- Border: 1px solid #E2E8F0 (optional)
- Border radius: 12px
- Padding: 24px
- Box shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Margin bottom: 32px

**Layout:**
- Title: H3, margin bottom 8px
- Description: Body2, color secondary, margin bottom 16px
- Paragraph: Body1, margin bottom 16px
- Badge container: flex wrap, gap 8px

### MUI Implementation

```jsx
import { Card, CardHeader, CardContent, Typography, Chip, Box } from '@mui/material';

<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardHeader
    title="Professional Summary"
    subheader="Full-stack developer with expertise in modern web technologies and cloud infrastructure"
    titleTypographyProps={{
      variant: 'h3',
      fontSize: '1.5rem',
      fontWeight: 600,
    }}
    subheaderTypographyProps={{
      variant: 'body2',
      color: 'text.secondary',
    }}
  />
  <CardContent>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
      I specialize in building scalable web applications using React, TypeScript, Node.js, 
      and cloud platforms. With 5+ years of experience, I've led development teams, 
      architected complex systems, and delivered high-impact products for startups and enterprises.
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      <Chip label="React" size="small" />
      <Chip label="TypeScript" size="small" />
      <Chip label="Node.js" size="small" />
      <Chip label="Next.js" size="small" />
      <Chip label="PostgreSQL" size="small" />
      <Chip label="AWS" size="small" />
      <Chip label="Docker" size="small" />
      <Chip label="CI/CD" size="small" />
    </Box>
  </CardContent>
</Card>
```

### Card 2: Experience Timeline

**Specifications:**
- Card container: same as above
- Timeline structure with left border

**Timeline Item:**
- Border left: 2px solid (blue for active, gray for past)
- Padding left: 16px
- Position: relative
- Margin bottom: 24px (last item: 0)

**Timeline Dot:**
- Position: absolute
- Left: -9px (to center on border)
- Top: 0
- Width: 16px
- Height: 16px
- Border radius: 50%
- Background: #2563EB (active) or #CBD5E1 (past)

**Content:**
- Title row: flex, justify-content space-between
- Job title: H4, margin bottom 4px
- Company: Body2, color secondary, margin bottom 8px
- Date: Body2, color tertiary, with calendar icon
- Bullets: list, 14px font size, color secondary, gap 4px

### MUI Implementation

```jsx
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { Briefcase, Calendar } from 'lucide-react';

<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardHeader
    title={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Briefcase size={20} />
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Experience
        </Typography>
      </Box>
    }
  />
  <CardContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Experience Item 1 - Active */}
      <Box
        sx={{
          borderLeft: '2px solid',
          borderColor: 'primary.main',
          pl: 2,
          position: 'relative',
          pb: 3,
        }}
      >
        {/* Timeline dot */}
        <Box
          sx={{
            position: 'absolute',
            left: -9,
            top: 0,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
          }}
        />

        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { md: 'start' },
            mb: 1,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
              Senior Full Stack Developer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tech Company Inc.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: { xs: 0.5, md: 0 } }}>
            <Calendar size={12} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              2021 - Present
            </Typography>
          </Box>
        </Box>

        {/* Bullets */}
        <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 } }}>
          <li>Led development of microservices architecture serving 100K+ users</li>
          <li>Reduced page load time by 60% through optimization strategies</li>
          <li>Mentored junior developers and conducted code reviews</li>
        </Box>
      </Box>

      {/* Experience Item 2 - Past */}
      <Box
        sx={{
          borderLeft: '2px solid',
          borderColor: 'grey.300',
          pl: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: -9,
            top: 0,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'grey.300',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
              Full Stack Developer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Startup Solutions Ltd.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={12} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              2019 - 2021
            </Typography>
          </Box>
        </Box>

        <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 } }}>
          <li>Built responsive web applications using React and Node.js</li>
          <li>Implemented CI/CD pipelines reducing deployment time by 50%</li>
          <li>Collaborated with design team to improve user experience</li>
        </Box>
      </Box>
    </Box>
  </CardContent>
</Card>
```

### Card 3: Key Achievements

**Layout:**
- 3 rows
- Each row: icon + content
- Icon: 20px, colored (green, blue, purple)
- Content: title (semibold) + description (secondary color)
- Gap between rows: 16px

### MUI Implementation

```jsx
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { Award, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardHeader
    title={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Award size={20} />
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Key Achievements
        </Typography>
      </Box>
    }
  />
  <CardContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <TrendingUp size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: 4 }} />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            Performance Optimization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Improved application performance by 60%, reducing load times from 5s to 2s
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Users size={20} style={{ color: '#2563EB', flexShrink: 0, marginTop: 4 }} />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            Team Leadership
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Led a team of 5 developers, improving sprint velocity by 40%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <CheckCircle2 size={20} style={{ color: '#9333EA', flexShrink: 0, marginTop: 4 }} />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            Quality & Testing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Implemented comprehensive testing strategy, reducing production bugs by 75%
          </Typography>
        </Box>
      </Box>
    </Box>
  </CardContent>
</Card>
```

### Card 4: Education & Certifications

Similar structure to Card 1, with Divider component between education and certifications.

### Card 5: CTA Card (Gradient)

**Specifications:**
- Background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)
- Border: none
- Border radius: 12px
- Padding: 32px
- Text color: #FFFFFF
- Text align: center

**Layout:**
- Title: H3, white, margin bottom 12px
- Description: Body1, white with 90% opacity, margin bottom 24px
- Buttons container: flex, gap 12px, justify-content center, direction column on mobile

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
  <CardContent sx={{ py: 4, textAlign: 'center' }}>
    <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 1.5, color: 'white' }}>
      Ready to Hire?
    </Typography>
    <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
      Download my resume or get in touch to discuss opportunities
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'center' }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<FileText size={16} />}
        sx={{
          backgroundColor: 'white',
          color: 'primary.main',
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

## Client Tab Content

### Services Grid (3 columns)

**Specifications:**
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Gap: 16px
- Each card height: auto

**Service Card:**
- Same styling as standard card
- Icon at top: 40px, colored
- Title: H4, margin 8px
- Description: Body2, secondary color

### MUI Implementation

```jsx
import { Grid, Card, CardHeader, CardContent, Typography } from '@mui/material';
import { Code, TrendingUp, Users } from 'lucide-react';

<Grid container spacing={2} sx={{ mb: 4 }}>
  <Grid item xs={12} md={4}>
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader
        avatar={<Code size={40} style={{ color: '#2563EB' }} />}
        title="Full Stack Development"
        titleTypographyProps={{
          variant: 'h4',
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
        sx={{ alignItems: 'start' }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          End-to-end web application development using modern frameworks and best practices.
        </Typography>
      </CardContent>
    </Card>
  </Grid>
  {/* Repeat for other services */}
</Grid>
```

### Pricing Section

**Card Container:**
- Same as standard card
- Grid inside: 3 columns desktop, 1 mobile

**Pricing Card:**
- Border: 1px solid #E2E8F0
- Border radius: 8px
- Padding: 24px
- Middle card: border 2px solid #2563EB, with "Most Popular" badge

**Badge (Most Popular):**
- Position: absolute, top -12px, centered
- Background: #2563EB
- Color: white
- Padding: 4px 16px
- Border radius: 12px
- Font size: 12px
- Font weight: 600

**Structure per card:**
- Title: H4, margin bottom 4px
- Price: Large text (48px), bold, with "/hr" or "/project" small text
- Divider: margin 16px vertical
- Feature list: gap 8px
- Each feature: icon (checkmark, green) + text (14px)
- Button: full width, at bottom

### MUI Implementation

```jsx
<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardHeader
    title={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DollarSign size={20} />
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Pricing & Packages
        </Typography>
      </Box>
    }
    subheader="Transparent pricing for different engagement models"
  />
  <CardContent>
    <Grid container spacing={3}>
      {/* Hourly Package */}
      <Grid item xs={12} md={4}>
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
            Hourly Consulting
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="h3" sx={{ fontSize: '3rem', fontWeight: 700 }}>
              $100
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', color: 'text.secondary' }}>
              /hr
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Technical consulting
              </Typography>
            </Box>
            {/* Repeat for other features */}
          </Box>

          <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
            Get Started
          </Button>
        </Box>
      </Grid>

      {/* Project Based - Most Popular */}
      <Grid item xs={12} md={4}>
        <Box sx={{ border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 3, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Chip
            label="Most Popular"
            size="small"
            sx={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600,
            }}
          />
          {/* Same structure as above */}
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            Get Started
          </Button>
        </Box>
      </Grid>

      {/* Monthly Retainer */}
      <Grid item xs={12} md={4}>
        {/* Same structure as Hourly */}
      </Grid>
    </Grid>
  </CardContent>
</Card>
```

### Process Section (4 columns)

**Specifications:**
- Grid: 4 columns desktop, 2 tablet, 1 mobile
- Each step: centered text

**Step:**
- Number circle: 48px diameter, background #DBEAFE (blue-100), color #2563EB, centered, margin bottom 12px
- Title: H5, semibold, margin bottom 8px
- Description: Body2, secondary color

### MUI Implementation

```jsx
<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardHeader
    title="How I Work"
    subheader="My proven process for successful project delivery"
  />
  <CardContent>
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((step) => (
        <Grid item xs={12} sm={6} md={3} key={step}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#DBEAFE',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
                mx: 'auto',
                mb: 1.5,
              }}
            >
              {step}
            </Box>
            <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 1 }}>
              {['Discovery', 'Planning', 'Development', 'Launch'][step - 1]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {[
                'Understanding your needs and project goals',
                'Creating detailed specifications and timeline',
                'Building with regular updates and feedback',
                'Deployment and ongoing support',
              ][step - 1]}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </CardContent>
</Card>
```

### Client CTA Card (Purple-Pink Gradient)

Same structure as Employer CTA card, but with purple-pink gradient:
```
background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)'
```

---

## Featured Projects

### Layout Structure

**Grid:**
- 3 columns desktop (≥900px)
- 2 columns tablet (600-899px)
- 1 column mobile (<600px)
- Gap: 24px

### Project Card Specifications

**Card Container:**
- Border radius: 12px
- Overflow: hidden
- Box shadow: level 2
- Hover: shadow level 4, transform translateY(-4px)
- Transition: all 200ms

**Image Area:**
- Aspect ratio: 16:9
- Background: gradient (varies)
- Display: flex, centered
- Icon: 64px, white with 30% opacity

**Content Area:**
- Padding: 24px

**Title:**
- H4, margin bottom 4px

**Description:**
- Body2, secondary color, margin bottom 16px

**Tech Stack:**
- Flex wrap, gap 8px
- Margin bottom 16px

**Metrics Row:**
- Flex, align center, gap 16px
- Font size: 14px

Impact Metric:
- Color: #10B981 (green)
- Font weight: 600

Separator:
- Color: #CBD5E1

Year:
- Color: secondary

### MUI Implementation

```jsx
import { Grid, Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Code } from 'lucide-react';

<Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
  <Container maxWidth="lg">
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h2" sx={{ fontSize: '1.875rem', fontWeight: 600, mb: 1 }}>
        Featured Projects
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Recent work showcasing impact and technical expertise
      </Typography>
    </Box>

    <Grid container spacing={3}>
      {/* Project Card */}
      <Grid item xs={12} md={6} lg={4}>
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
              position: 'relative',
              overflow: 'hidden',
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

      {/* Repeat for other projects with different gradients */}
    </Grid>
  </Container>
</Box>
```

**Project Gradients:**
```
Project 1 (Blue):   linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)
Project 2 (Purple): linear-gradient(135deg, #A855F7 0%, #EC4899 100%)
Project 3 (Orange): linear-gradient(135deg, #F97316 0%, #EF4444 100%)
```

---

## Contact Section

### Layout Structure

**Grid:**
- 2 columns desktop (≥900px), equal width
- 1 column mobile (<900px), form first then info
- Gap: 32px

### Left Column: Contact Form

**Form Fields:**
- Spacing between fields: 16px
- Label: margin bottom 8px, font size 14px, font weight 500

**Input Fields:**
- TextField variant: outlined
- Size: medium (44px height)
- Full width

**Select Dropdown:**
- Same styling as TextField
- Options: Full-time position, Freelance project, Consulting, Other

**Textarea:**
- multiline
- rows: 4
- Full width

**Submit Button:**
- Variant: contained
- Size: large
- Full width
- Start icon: Mail (16px)

### Right Column: Contact Info

**Sections:**
1. Contact Information
2. Divider
3. Connect With Me (social icons)
4. Divider
5. Availability

**Section Title:**
- H5, margin bottom 16px

**Contact Item:**
- Display: flex
- Align items: center
- Gap: 12px
- Margin bottom: 12px

Icon:
- Size: 20px
- Color: inherit
- Flex shrink: 0

**Social Buttons:**
- Variant: outlined
- Size: medium (icon button)
- Display: flex, gap 12px

**Availability Items:**
- Display: flex, align center, gap 8px
- Margin bottom: 8px

Status Dot:
- Width: 8px, height: 8px
- Border radius: 50%
- Background: varies (green, yellow)

### MUI Implementation

```jsx
import { Box, Container, Card, CardHeader, CardContent, Grid, Typography, TextField, MenuItem, Button, Divider, IconButton } from '@mui/material';
import { Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

<Box component="section" id="contact" sx={{ py: { xs: 4, md: 6 } }}>
  <Container maxWidth="md">
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Get In Touch"
        subheader="Whether you're looking to hire or need development services, I'd love to hear from you"
        sx={{ textAlign: 'center' }}
      />
      <CardContent>
        <Grid container spacing={4}>
          {/* Left: Form */}
          <Grid item xs={12} md={6}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Your name"
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="your.email@example.com"
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  I'm interested in
                </Typography>
                <TextField
                  fullWidth
                  select
                  defaultValue="fulltime"
                  variant="outlined"
                >
                  <MenuItem value="fulltime">Full-time position</MenuItem>
                  <MenuItem value="freelance">Freelance project</MenuItem>
                  <MenuItem value="consulting">Consulting</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Message
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Tell me about your needs..."
                  variant="outlined"
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<Mail size={16} />}
                fullWidth
              >
                Send Message
              </Button>
            </Box>
          </Grid>

          {/* Right: Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Contact Information */}
              <Box>
                <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Mail size={20} />
                    <Typography
                      component="a"
                      href="mailto:omri@example.com"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' },
                        transition: 'color 0.2s',
                      }}
                    >
                      omri@example.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MapPin size={20} />
                    <Typography color="text.secondary">
                      Israel • Remote Available
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Social Links */}
              <Box>
                <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2 }}>
                  Connect With Me
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <IconButton
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { backgroundColor: 'grey.100' },
                    }}
                  >
                    <Github size={20} />
                  </IconButton>
                  <IconButton
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { backgroundColor: 'grey.100' },
                    }}
                  >
                    <Linkedin size={20} />
                  </IconButton>
                  <IconButton
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { backgroundColor: 'grey.100' },
                    }}
                  >
                    <ExternalLink size={20} />
                  </IconButton>
                </Box>
              </Box>

              <Divider />

              {/* Availability */}
              <Box>
                <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2 }}>
                  Availability
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.875rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <Typography variant="body2" color="text.secondary">
                      Available for full-time roles
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <Typography variant="body2" color="text.secondary">
                      Accepting freelance projects
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <Typography variant="body2" color="text.secondary">
                      Limited consulting slots
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Container>
</Box>
```

---

## Footer

### Specifications

**Container:**
- Border top: 1px solid #E2E8F0
- Background: #FFFFFF
- Padding: 32px vertical

**Content:**
- Display: flex
- Justify content: space-between
- Align items: center
- Flex direction: column on mobile, row on desktop
- Gap: 16px

**Copyright:**
- Font size: 14px
- Color: #475569

**Links:**
- Display: flex
- Gap: 24px
- Font size: 14px
- Color: #475569
- Hover: color #0F172A
- Transition: color 200ms

### MUI Implementation

```jsx
import { Box, Container, Typography } from '@mui/material';

<Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', py: 4 }}>
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
          href="#"
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
          href="#"
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

This completes the component breakdown with exact specifications and MUI implementation code for every section of the portfolio design.
