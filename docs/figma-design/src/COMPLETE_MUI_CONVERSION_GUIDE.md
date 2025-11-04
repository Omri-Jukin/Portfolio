# Complete MUI Conversion Guide - Portfolio Redesign

This master document contains ALL the documentation needed to convert the Shadcn/Tailwind portfolio design to Material-UI (MUI). It combines all five documentation files into one comprehensive reference.

---

## Document Structure

1. **Design Specifications** - Colors, typography, spacing, component specs
2. **Component Breakdown** - Section-by-section implementation details
3. **Tailwind to MUI Mapping** - Quick reference conversion guide
4. **Dark Mode Specifications** - Complete dark mode implementation
5. **Responsive Behavior** - Breakpoint-by-breakpoint responsive design

---
---

# PART 1: DESIGN SPECIFICATIONS

## Complete Design System

This section contains the complete design system including all measurements, colors, typography, spacing, and component specifications.

---

## Color Palette

### Light Mode Colors

**Primary Colors:**
```
Primary Blue:     #2563EB (rgb(37, 99, 235))   - blue-600
Primary Hover:    #1E40AF (rgb(30, 64, 175))   - blue-700
Primary Light:    #3B82F6 (rgb(59, 130, 246))  - blue-500
```

**Background Colors:**
```
Page Background:  Linear gradient from #F8FAFC to #F1F5F9 (slate-50 to slate-100)
Card Background:  #FFFFFF (rgb(255, 255, 255))  - white
Header Background: #FFFFFF with 95% opacity, backdrop blur
Secondary Background: #F1F5F9 (rgb(241, 245, 249)) - slate-100
```

**Text Colors:**
```
Text Primary:     #0F172A (rgb(15, 23, 42))    - slate-900
Text Secondary:   #475569 (rgb(71, 85, 105))   - slate-600
Text Tertiary:    #64748B (rgb(100, 116, 139)) - slate-500
Text on Primary:  #FFFFFF (rgb(255, 255, 255)) - white
```

**Border Colors:**
```
Border Default:   #E2E8F0 (rgb(226, 232, 240)) - slate-200
Border Light:     #F1F5F9 (rgb(241, 245, 249)) - slate-100
Border Dark:      #CBD5E1 (rgb(203, 213, 225)) - slate-300
```

**Semantic Colors:**
```
Success:          #10B981 (rgb(16, 185, 129))  - green-600
Success Light:    #D1FAE5 (rgb(209, 250, 229)) - green-100
Warning:          #F59E0B (rgb(245, 158, 11))  - amber-500
Error:            #EF4444 (rgb(239, 68, 68))   - red-500
Info:             #3B82F6 (rgb(59, 130, 246))  - blue-500
```

**Gradient Colors:**
```
Blue Gradient (Employer CTA):
  from: #2563EB (blue-600)
  to:   #06B6D4 (cyan-600)
  
Purple Gradient (Client CTA):
  from: #9333EA (purple-600)
  to:   #EC4899 (pink-600)
  
Project Card Gradients:
  - Blue: from #3B82F6 to #06B6D4
  - Purple: from #A855F7 to #EC4899
  - Orange: from #F97316 to #EF4444
```

### Dark Mode Colors

**Primary Colors:**
```
Primary Blue:     #3B82F6 (rgb(59, 130, 246))  - blue-500
Primary Hover:    #60A5FA (rgb(96, 165, 250))  - blue-400
```

**Background Colors:**
```
Page Background:  #0F172A (rgb(15, 23, 42))    - slate-900
Card Background:  #1E293B (rgb(30, 41, 59))    - slate-800
Header Background: #1E293B with 95% opacity, backdrop blur
Secondary Background: #334155 (rgb(51, 65, 85)) - slate-700
```

**Text Colors:**
```
Text Primary:     #F1F5F9 (rgb(241, 245, 249)) - slate-100
Text Secondary:   #94A3B8 (rgb(148, 163, 184)) - slate-400
Text Tertiary:    #64748B (rgb(100, 116, 139)) - slate-500
```

**Border Colors:**
```
Border Default:   #334155 (rgb(51, 65, 85))    - slate-700
Border Light:     #475569 (rgb(71, 85, 105))   - slate-600
```

---

## Typography System

### Font Family
```
Primary Font: Inter
Fallback: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Typography Scale

**Headings:**
```
H1 (Main Hero):
  Font Size:    36px (2.25rem)
  Font Weight:  700 (Bold)
  Line Height:  1.2 (43.2px)
  Letter Spacing: -0.02em
  Mobile:       28px (1.75rem)

H2 (Section Titles):
  Font Size:    30px (1.875rem)
  Font Weight:  600 (Semi-bold)
  Line Height:  1.3 (39px)
  Letter Spacing: -0.01em
  Mobile:       24px (1.5rem)

H3 (Card Titles):
  Font Size:    24px (1.5rem)
  Font Weight:  600 (Semi-bold)
  Line Height:  1.4 (33.6px)
  Mobile:       20px (1.25rem)

H4 (Subsection Titles):
  Font Size:    20px (1.25rem)
  Font Weight:  600 (Semi-bold)
  Line Height:  1.4 (28px)
  Mobile:       18px (1.125rem)

H5 (Small Headings):
  Font Size:    18px (1.125rem)
  Font Weight:  500 (Medium)
  Line Height:  1.5 (27px)
  Mobile:       16px (1rem)
```

**Body Text:**
```
Body Large:
  Font Size:    18px (1.125rem)
  Font Weight:  400 (Regular)
  Line Height:  1.6 (28.8px)

Body Regular:
  Font Size:    16px (1rem)
  Font Weight:  400 (Regular)
  Line Height:  1.6 (25.6px)

Body Small:
  Font Size:    14px (0.875rem)
  Font Weight:  400 (Regular)
  Line Height:  1.5 (21px)

Caption:
  Font Size:    12px (0.75rem)
  Font Weight:  400 (Regular)
  Line Height:  1.5 (18px)
```

**Numeric/Stats:**
```
Stat Number:
  Font Size:    48px (3rem)
  Font Weight:  700 (Bold)
  Line Height:  1.1 (52.8px)

Stat Label:
  Font Size:    14px (0.875rem)
  Font Weight:  400 (Regular)
  Line Height:  1.5 (21px)
  Color:        Text Secondary
```

---

## Spacing System

### Base Unit
```
Base Spacing Unit: 8px

MUI Spacing Multipliers:
theme.spacing(1) = 8px
theme.spacing(2) = 16px
theme.spacing(3) = 24px
theme.spacing(4) = 32px
theme.spacing(6) = 48px
theme.spacing(8) = 64px
theme.spacing(12) = 96px
```

### Section Spacing

**Vertical Spacing Between Sections:**
```
Desktop (≥1200px):  48px (theme.spacing(6))
Tablet (900-1199px): 40px (theme.spacing(5))
Mobile (<900px):    32px (theme.spacing(4))
```

**Section Internal Padding:**
```
Desktop:  
  Vertical: 48px (theme.spacing(6))
  Horizontal: 16px (theme.spacing(2))

Tablet:   
  Vertical: 40px (theme.spacing(5))
  Horizontal: 16px (theme.spacing(2))

Mobile:   
  Vertical: 32px (theme.spacing(4))
  Horizontal: 16px (theme.spacing(2))
```

### Container Widths
```
Max Width (lg):  1280px
Max Width (md):  960px
Max Width (sm):  720px

Horizontal Padding: 16px (theme.spacing(2)) on all breakpoints
```

### Component Spacing

**Card Padding:**
```
Large Cards:   24px (theme.spacing(3))
Medium Cards:  20px (theme.spacing(2.5))
Small Cards:   16px (theme.spacing(2))
```

**Button Padding:**
```
Large:    12px vertical, 32px horizontal (theme.spacing(1.5, 4))
Medium:   10px vertical, 24px horizontal (theme.spacing(1.25, 3))
Small:    8px vertical, 16px horizontal (theme.spacing(1, 2))
```

**Grid Gaps:**
```
Large Grid:   24px (theme.spacing(3))
Medium Grid:  16px (theme.spacing(2))
Small Grid:   12px (theme.spacing(1.5))
```

**Stack Spacing (Vertical):**
```
Large Stack:  32px (theme.spacing(4))
Medium Stack: 24px (theme.spacing(3))
Small Stack:  16px (theme.spacing(2))
Compact Stack: 8px (theme.spacing(1))
```

---

## Component Specifications

### Buttons

**Primary Button:**
```
Background: Linear gradient from #2563EB to #1E40AF
Text Color: #FFFFFF
Padding: 12px 32px (Large), 10px 24px (Medium)
Border Radius: 6px
Font Weight: 500
Font Size: 16px (Large), 14px (Medium)
Height: 44px (Large), 40px (Medium)
Box Shadow: 0 1px 2px rgba(0, 0, 0, 0.05)

Hover State:
  Background: Linear gradient from #1E40AF to #1E3A8A
  Box Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
  Transform: translateY(-1px)

Active State:
  Transform: translateY(0)
  Box Shadow: 0 1px 2px rgba(0, 0, 0, 0.05)
```

**Secondary/Outlined Button:**
```
Background: Transparent
Border: 1px solid #E2E8F0
Text Color: #0F172A
Padding: 12px 32px (Large), 10px 24px (Medium)
Border Radius: 6px
Font Weight: 500

Hover State:
  Background: #F8FAFC
  Border Color: #CBD5E1
```

### Cards

**Standard Card:**
```
Background: #FFFFFF
Border: 1px solid #E2E8F0 (optional, can be shadow-only)
Border Radius: 12px
Padding: 24px (theme.spacing(3))
Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)

Hover State:
  Box Shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
  Transform: translateY(-2px)
  Transition: all 0.2s ease-in-out
```

### Badges/Chips

**Badge (Technology Tags):**
```
Background: #F1F5F9 (slate-100)
Text Color: #475569 (slate-600)
Padding: 4px 12px (theme.spacing(0.5, 1.5))
Border Radius: 16px (fully rounded)
Font Size: 12px
Font Weight: 500
Height: 24px
```

### Input Fields

**Text Input:**
```
Height: 44px
Padding: 10px 12px
Border: 1px solid #E2E8F0
Border Radius: 6px
Font Size: 16px
Background: #FFFFFF

Focus State:
  Border: 2px solid #2563EB
  Outline: 4px solid rgba(37, 99, 235, 0.1)
```

---

## Shadows & Effects

**Elevation Levels:**
```
Level 1 (Subtle):
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)

Level 2 (Card Default):
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)

Level 3 (Card Hover):
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)

Level 4 (Elevated):
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
```

**Border Radius:**
```
Small (Buttons, Inputs):  6px
Medium (Cards):           12px
Large (Modals):           16px
Full (Badges, Pills):     9999px
Circle (Avatars):         50%
```

**Transitions:**
```
Fast:     150ms ease-in-out
Normal:   200ms ease-in-out
Slow:     300ms ease-in-out
```

---
---

# PART 2: COMPONENT BREAKDOWN

This section provides detailed specifications for every section and component with exact MUI implementation code.

---

## Header Component

### Desktop Layout (≥900px)

```
[Logo 40px] Omri Jukin          For Employers  For Clients  Contact  [Let's Talk]
            Full Stack Developer
```

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
            {/* Logo Circle */}
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
              <Button color="inherit" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                For Employers
              </Button>
              <Button color="inherit" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                For Clients
              </Button>
              <Button color="inherit" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                Contact
              </Button>
            </Box>
            
            <Button variant="contained" size="medium">Let's Talk</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
```

---

## Hero Section

### MUI Implementation

```jsx
import { Box, Container, Typography, Button, Chip, Grid } from '@mui/material';
import { Briefcase, Code, MapPin, ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6, lg: 12 }, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 896, mx: 'auto', textAlign: 'center' }}>
          {/* Badge */}
          <Chip
            icon={<MapPin size={12} />}
            label="Available for Full-Time & Freelance"
            size="small"
            sx={{ mb: 2, backgroundColor: 'grey.100', color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}
          />

          {/* Heading */}
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
            sx={{ fontSize: '1rem', color: 'text.secondary', lineHeight: 1.6, maxWidth: 672, mx: 'auto', mb: 4 }}
          >
            Specialized in React, Node.js, and cloud infrastructure. I help companies ship 
            robust products and provide technical consulting for businesses looking to scale.
          </Typography>

          {/* CTA Buttons */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Briefcase size={16} />}
              endIcon={<ArrowRight size={16} />}
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)' },
              }}
            >
              I'm Hiring
            </Button>
            <Button variant="outlined" size="large" startIcon={<Code size={16} />}>
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
                <Typography variant="h3" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 700, mb: 0.5 }}>
                  {stat.number}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
```

---

## Tab Navigation

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
        <Box sx={{ maxWidth: 448, mx: 'auto', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              backgroundColor: 'grey.100',
              borderRadius: 2,
              p: 0.5,
              minHeight: 'auto',
              '& .MuiTabs-indicator': { display: 'none' },
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
          {/* Employer content */}
        </TabPanel>
        <TabPanel value="clients" activeTab={activeTab}>
          {/* Client content */}
        </TabPanel>
      </Container>
    </Box>
  );
}

function TabPanel({ children, value, activeTab }) {
  return (
    <Box hidden={value !== activeTab} sx={{ py: 3 }}>
      {value === activeTab && children}
    </Box>
  );
}
```

---

## Professional Summary Card

```jsx
import { Card, CardHeader, CardContent, Typography, Chip, Box } from '@mui/material';

<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardHeader
    title="Professional Summary"
    subheader="Full-stack developer with expertise in modern web technologies"
    titleTypographyProps={{ variant: 'h3', fontSize: '1.5rem', fontWeight: 600 }}
    subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
  />
  <CardContent>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
      I specialize in building scalable web applications using React, TypeScript, Node.js, 
      and cloud platforms. With 5+ years of experience...
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      <Chip label="React" size="small" />
      <Chip label="TypeScript" size="small" />
      <Chip label="Node.js" size="small" />
      <Chip label="Next.js" size="small" />
      <Chip label="PostgreSQL" size="small" />
      <Chip label="AWS" size="small" />
    </Box>
  </CardContent>
</Card>
```

---

## Experience Timeline Card

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
      {/* Experience Item */}
      <Box sx={{ borderLeft: '2px solid', borderColor: 'primary.main', pl: 2, position: 'relative', pb: 3 }}>
        {/* Timeline dot */}
        <Box sx={{ position: 'absolute', left: -9, top: 0, width: 16, height: 16, borderRadius: '50%', backgroundColor: 'primary.main' }} />

        {/* Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
              Senior Full Stack Developer
            </Typography>
            <Typography variant="body2" color="text.secondary">Tech Company Inc.</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={12} />
            <Typography variant="body2" color="text.secondary">2021 - Present</Typography>
          </Box>
        </Box>

        <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 } }}>
          <li>Led development of microservices architecture serving 100K+ users</li>
          <li>Reduced page load time by 60% through optimization strategies</li>
          <li>Mentored junior developers and conducted code reviews</li>
        </Box>
      </Box>
    </Box>
  </CardContent>
</Card>
```

---

## Pricing Section

```jsx
import { Card, CardHeader, CardContent, Grid, Box, Typography, Button, Divider, Chip } from '@mui/material';
import { DollarSign, CheckCircle2 } from 'lucide-react';

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
            <Typography variant="h3" sx={{ fontSize: '3rem', fontWeight: 700 }}>$100</Typography>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', color: 'text.secondary' }}>/hr</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
              <Typography variant="body2" color="text.secondary">Technical consulting</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
              <Typography variant="body2" color="text.secondary">Code review</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
              <Typography variant="body2" color="text.secondary">Architecture guidance</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
              <Typography variant="body2" color="text.secondary">Flexible scheduling</Typography>
            </Box>
          </Box>
          <Button variant="outlined" fullWidth sx={{ mt: 2 }}>Get Started</Button>
        </Box>
      </Grid>

      {/* Project Based - Most Popular */}
      <Grid item xs={12} md={4}>
        <Box sx={{ border: '2px solid', borderColor: 'primary.main', borderRadius: 2, p: 3, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Chip
            label="Most Popular"
            size="small"
            sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'primary.main', color: 'white', fontWeight: 600 }}
          />
          <Typography variant="h4" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
            Project Based
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="h3" sx={{ fontSize: '3rem', fontWeight: 700 }}>$5K+</Typography>
            <Typography variant="body1" sx={{ fontSize: '1.125rem', color: 'text.secondary' }}>/project</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Features */}
          </Box>
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>Get Started</Button>
        </Box>
      </Grid>

      {/* Monthly Retainer */}
      <Grid item xs={12} md={4}>
        {/* Similar structure */}
      </Grid>
    </Grid>
  </CardContent>
</Card>
```

---

## Project Card

```jsx
import { Grid, Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Code } from 'lucide-react';

<Grid container spacing={3}>
  <Grid item xs={12} md={6} lg={4}>
    <Card sx={{ borderRadius: 3, overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}>
      {/* Image Area */}
      <Box sx={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          Built a scalable e-commerce platform handling 10K+ daily transactions...
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label="React" size="small" variant="outlined" />
          <Chip label="Node.js" size="small" variant="outlined" />
          <Chip label="PostgreSQL" size="small" variant="outlined" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.875rem' }}>
          <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>↑ 150% Revenue</Typography>
          <Typography variant="body2" color="text.secondary">•</Typography>
          <Typography variant="body2" color="text.secondary">2023</Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>
```

---

## Contact Section

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
          {/* Form */}
          <Grid item xs={12} md={6}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Name</Typography>
                <TextField fullWidth placeholder="Your name" variant="outlined" />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Email</Typography>
                <TextField fullWidth type="email" placeholder="your.email@example.com" variant="outlined" />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>I'm interested in</Typography>
                <TextField fullWidth select defaultValue="fulltime" variant="outlined">
                  <MenuItem value="fulltime">Full-time position</MenuItem>
                  <MenuItem value="freelance">Freelance project</MenuItem>
                  <MenuItem value="consulting">Consulting</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Message</Typography>
                <TextField fullWidth multiline rows={4} placeholder="Tell me about your needs..." variant="outlined" />
              </Box>
              <Button variant="contained" size="large" startIcon={<Mail size={16} />} fullWidth>
                Send Message
              </Button>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Mail size={20} />
                    <Typography component="a" href="mailto:omri@example.com" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                      omri@example.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MapPin size={20} />
                    <Typography color="text.secondary">Israel • Remote Available</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2 }}>
                  Connect With Me
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <IconButton sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'grey.100' } }}>
                    <Github size={20} />
                  </IconButton>
                  <IconButton sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'grey.100' } }}>
                    <Linkedin size={20} />
                  </IconButton>
                  <IconButton sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'grey.100' } }}>
                    <ExternalLink size={20} />
                  </IconButton>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h5" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2 }}>
                  Availability
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <Typography variant="body2" color="text.secondary">Available for full-time roles</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <Typography variant="body2" color="text.secondary">Accepting freelance projects</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <Typography variant="body2" color="text.secondary">Limited consulting slots</Typography>
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

```jsx
import { Box, Container, Typography } from '@mui/material';

<Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', py: 4 }}>
  <Container maxWidth="xl">
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        © 2024 Omri Jukin. All rights reserved.
      </Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Typography component="a" href="#" variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' }, transition: 'color 0.2s' }}>
          Privacy Policy
        </Typography>
        <Typography component="a" href="#" variant="body2" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' }, transition: 'color 0.2s' }}>
          Terms of Service
        </Typography>
      </Box>
    </Box>
  </Container>
</Box>
```

---
---

# PART 3: TAILWIND TO MUI MAPPING

Quick reference guide for converting Tailwind classes to MUI equivalents.

---

## Spacing Mappings

| Tailwind | MUI sx Prop | Pixels |
|----------|-------------|--------|
| `p-2` | `sx={{ p: 1 }}` | 8px |
| `p-4` | `sx={{ p: 2 }}` | 16px |
| `p-6` | `sx={{ p: 3 }}` | 24px |
| `py-8` | `sx={{ py: 4 }}` | 32px vertical |
| `px-4` | `sx={{ px: 2 }}` | 16px horizontal |
| `mb-4` | `sx={{ mb: 2 }}` | 16px bottom |
| `gap-4` | `sx={{ gap: 2 }}` | 16px |
| `space-y-4` | `<Stack spacing={2}>` or `sx={{ '& > * + *': { mt: 2 } }}` | 16px vertical |

## Layout Mappings

| Tailwind | MUI Equivalent |
|----------|----------------|
| `container` | `<Container maxWidth="xl">` |
| `max-w-4xl` | `sx={{ maxWidth: 896 }}` or `<Container maxWidth="md">` |
| `flex` | `sx={{ display: 'flex' }}` |
| `flex-col` | `sx={{ flexDirection: 'column' }}` |
| `items-center` | `sx={{ alignItems: 'center' }}` |
| `justify-between` | `sx={{ justifyContent: 'space-between' }}` |
| `grid grid-cols-3` | `<Grid container><Grid item xs={4}>` or `sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}` |

## Typography Mappings

| Tailwind | MUI Equivalent |
|----------|----------------|
| `text-sm` | `sx={{ fontSize: '0.875rem' }}` or `<Typography variant="body2">` |
| `text-lg` | `sx={{ fontSize: '1.125rem' }}` |
| `text-2xl` | `sx={{ fontSize: '1.5rem' }}` or `<Typography variant="h3">` |
| `font-bold` | `sx={{ fontWeight: 700 }}` |
| `font-semibold` | `sx={{ fontWeight: 600 }}` |
| `text-center` | `sx={{ textAlign: 'center' }}` |

## Color Mappings

| Tailwind | MUI Equivalent |
|----------|----------------|
| `bg-white` | `sx={{ backgroundColor: 'background.paper' }}` |
| `bg-slate-100` | `sx={{ backgroundColor: 'grey.100' }}` |
| `text-slate-900` | `sx={{ color: 'text.primary' }}` or `color="text.primary"` |
| `text-slate-600` | `sx={{ color: 'text.secondary' }}` or `color="text.secondary"` |
| `border-slate-200` | `sx={{ borderColor: 'divider' }}` |

## Component Mappings

| Shadcn/Tailwind | MUI Equivalent |
|-----------------|----------------|
| `<Button>` | `<Button variant="contained">` |
| `<Button variant="outline">` | `<Button variant="outlined">` |
| `<Button size="lg">` | `<Button size="large">` |
| `<Card>` | `<Card>` |
| `<CardHeader>` | `<CardHeader>` |
| `<CardTitle>` | `<CardHeader title="...">` |
| `<CardContent>` | `<CardContent>` |
| `<Badge>` | `<Chip size="small">` |
| `<Input>` | `<TextField variant="outlined">` |
| `<Textarea>` | `<TextField multiline rows={4}>` |
| `<Separator />` | `<Divider />` |
| `<Select>` | `<TextField select>` |

## Responsive Mappings

**Tailwind Breakpoints:**
- `sm:` = 640px
- `md:` = 768px
- `lg:` = 1024px

**MUI Breakpoints:**
- `sm` = 600px
- `md` = 900px
- `lg` = 1200px

**Syntax:**
```jsx
// Tailwind
<div className="text-sm md:text-lg">

// MUI
<Typography sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}>
```

## Common Patterns

### Hide on Mobile
```jsx
// Tailwind: className="hidden md:block"
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
```

### Full Width on Mobile
```jsx
// Tailwind: className="w-full md:w-auto"
<Box sx={{ width: { xs: '100%', md: 'auto' } }}>
```

### Flex to Column on Mobile
```jsx
// Tailwind: className="flex flex-col md:flex-row"
<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
```

---
---

# PART 4: DARK MODE SPECIFICATIONS

Complete dark mode implementation guide for MUI.

---

## MUI Theme Configuration

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo, useState } from 'react';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#3B82F6' : '#2563EB',
            dark: mode === 'dark' ? '#2563EB' : '#1E40AF',
            light: mode === 'dark' ? '#60A5FA' : '#3B82F6',
          },
          background: {
            default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
            paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#F1F5F9' : '#0F172A',
            secondary: mode === 'dark' ? '#94A3B8' : '#475569',
          },
          divider: mode === 'dark' ? '#334155' : '#E2E8F0',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

## Color Palette Comparison

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page Background | `#F8FAFC` (slate-50) | `#0F172A` (slate-900) |
| Card Background | `#FFFFFF` (white) | `#1E293B` (slate-800) |
| Primary Text | `#0F172A` (slate-900) | `#F1F5F9` (slate-100) |
| Secondary Text | `#475569` (slate-600) | `#94A3B8` (slate-400) |
| Border | `#E2E8F0` (slate-200) | `#334155` (slate-700) |
| Primary Blue | `#2563EB` (blue-600) | `#3B82F6` (blue-500) |

## Dark Mode Toggle Component

```jsx
import { IconButton } from '@mui/material';
import { Sun, Moon } from 'lucide-react';

function DarkModeToggle({ mode, setMode }) {
  return (
    <IconButton
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      sx={{ color: 'text.primary' }}
    >
      {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </IconButton>
  );
}
```

## Component Adjustments

### Page Background
```jsx
<Box
  sx={{
    minHeight: '100vh',
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(to bottom right, #0F172A, #1E293B)'
        : 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
  }}
>
```

### Gradient CTA Cards
```jsx
<Card
  sx={{
    background: (theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 100%)'
        : 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    color: 'white',
  }}
>
```

---
---

# PART 5: RESPONSIVE BEHAVIOR

Detailed responsive specifications for all breakpoints.

---

## MUI Breakpoints

| Name | Min Width | Device Type |
|------|-----------|-------------|
| `xs` | 0px | Mobile (portrait) |
| `sm` | 600px | Mobile (landscape) |
| `md` | 900px | Tablet |
| `lg` | 1200px | Desktop |
| `xl` | 1536px | Large desktop |

## Section Padding

| Breakpoint | Vertical Padding |
|------------|-----------------|
| xs (0-599px) | 32px (`theme.spacing(4)`) |
| sm (600-899px) | 40px (`theme.spacing(5)`) |
| md (900px+) | 48px (`theme.spacing(6)`) |

```jsx
<Box sx={{ py: { xs: 4, sm: 5, md: 6 }, px: 2 }}>
```

## Header Responsive Behavior

### Desktop (≥900px)
- Logo + Name + Title visible
- Navigation links visible
- CTA button visible

### Tablet (600-899px)
- Logo + Name + Title visible
- Navigation links: **Hidden**
- CTA button visible

### Mobile (0-599px)
- Logo + Name visible
- Title: **Hidden**
- Navigation: **Hidden**
- CTA button visible

```jsx
<Typography 
  variant="body2" 
  sx={{ display: { xs: 'none', sm: 'block' } }}
>
  Full Stack Developer
</Typography>

<Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
  {/* Navigation links */}
</Box>
```

## Grid Responsive Layouts

### 3-Column Grid (Services, Projects)

| Breakpoint | Columns |
|------------|---------|
| xs (0-599px) | 1 column |
| sm (600-899px) | 2 columns |
| md (900px+) | 3 columns |

```jsx
<Grid container spacing={{ xs: 2, lg: 3 }}>
  <Grid item xs={12} sm={6} md={4}>
    {/* Item */}
  </Grid>
</Grid>
```

### 4-Column Grid (Stats, Process)

| Breakpoint | Layout |
|------------|--------|
| xs (0-599px) | 2x2 grid |
| md (900px+) | 4 columns |

```jsx
<Grid container spacing={{ xs: 2, md: 4 }}>
  <Grid item xs={6} md={3}>
    {/* Stat */}
  </Grid>
</Grid>
```

### Pricing Grid

| Breakpoint | Layout |
|------------|--------|
| xs (0-599px) | 1 column (stacked) |
| md (900px+) | 3 columns |

```jsx
<Grid container spacing={3}>
  <Grid item xs={12} md={4}>
    {/* Pricing card */}
  </Grid>
</Grid>
```

## Typography Responsive Scaling

| Element | Mobile (xs) | Desktop (md+) |
|---------|------------|---------------|
| H1 | 28px (1.75rem) | 36px (2.25rem) |
| H2 | 24px (1.5rem) | 30px (1.875rem) |
| H3 | 20px (1.25rem) | 24px (1.5rem) |
| Stat Number | 36px (2.25rem) | 48px (3rem) |

```jsx
<Typography
  variant="h1"
  sx={{
    fontSize: { xs: '1.75rem', md: '2.25rem' },
  }}
>
```

## Contact Section

### Desktop (≥900px)
- 2 columns (50/50 split)
- Form left, Info right

### Mobile (0-599px)
- 1 column (stacked)
- Form first, then Info

```jsx
<Grid container spacing={4}>
  <Grid item xs={12} md={6}>
    {/* Form */}
  </Grid>
  <Grid item xs={12} md={6}>
    {/* Info */}
  </Grid>
</Grid>
```

## Common Responsive Patterns

### Hide on Mobile
```jsx
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
  Desktop only
</Box>
```

### Stack Vertically on Mobile
```jsx
<Box sx={{ 
  display: 'flex', 
  flexDirection: { xs: 'column', sm: 'row' } 
}}>
```

### Full Width on Mobile
```jsx
<Button fullWidth={{ xs: true, sm: false }}>
```

---
---

# QUICK START GUIDE

## Steps to Convert the Design

1. **Set up MUI Theme**
   - Create theme with light/dark mode support
   - Use color palette from Part 1
   - Add custom breakpoints if needed

2. **Create Layout Components**
   - Start with Header (Part 2)
   - Add Hero Section (Part 2)
   - Build Tab Navigation (Part 2)

3. **Build Content Cards**
   - Professional Summary (Part 2)
   - Experience Timeline (Part 2)
   - Pricing Section (Part 2)
   - Projects (Part 2)
   - Contact Section (Part 2)

4. **Add Responsive Behavior**
   - Use responsive spacing (Part 5)
   - Implement grid layouts (Part 5)
   - Add mobile adaptations (Part 5)

5. **Implement Dark Mode**
   - Use theme configuration (Part 4)
   - Add toggle component (Part 4)
   - Test all components in both modes

6. **Reference Mappings**
   - Use Part 3 for quick Tailwind → MUI conversions
   - Follow spacing conventions
   - Use theme colors throughout

---

## Additional Resources

- **MUI Documentation**: https://mui.com/material-ui/
- **Lucide Icons**: https://lucide.dev/ (for icons)
- **Color Tool**: Use browser DevTools to inspect hex values
- **Responsive Testing**: Use Chrome DevTools device mode

---

## Support & Questions

If you encounter any issues or need clarification on specific components:

1. Check the relevant part in this document
2. Refer to Part 3 (Tailwind to MUI Mapping) for syntax
3. Look at the complete code examples in Part 2
4. Verify colors and spacing in Part 1
5. Check responsive behavior in Part 5
6. Ensure dark mode compatibility in Part 4

---

**End of Complete MUI Conversion Guide**

This comprehensive guide contains everything needed to convert the Shadcn/Tailwind portfolio design to Material-UI. All specifications, code examples, and mappings are included for a successful conversion.
