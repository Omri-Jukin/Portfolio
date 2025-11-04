# Responsive Behavior Specifications

This document details exactly how each component and section behaves across different screen sizes, with specific breakpoint adjustments for the portfolio design.

---

## MUI Breakpoints

### Default MUI Breakpoints

| Name | Min Width | Max Width | Device Type |
|------|-----------|-----------|-------------|
| `xs` | 0px | 599px | Mobile (portrait) |
| `sm` | 600px | 899px | Mobile (landscape) / Small tablet |
| `md` | 900px | 1199px | Tablet / Small desktop |
| `lg` | 1200px | 1535px | Desktop |
| `xl` | 1536px | ∞ | Large desktop |

**Note:** These differ from Tailwind breakpoints!

### Custom Breakpoints (if needed)

If you want to match Tailwind more closely:

```jsx
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,   // Tailwind sm
      md: 768,   // Tailwind md
      lg: 1024,  // Tailwind lg
      xl: 1280,  // Tailwind xl
    },
  },
});
```

**For this design, we'll use default MUI breakpoints.**

---

## Global Layout Behavior

### Container Max-Width

| Breakpoint | Container Max-Width | Padding |
|------------|-------------------|---------|
| xs (0-599px) | 100% | 16px horizontal |
| sm (600-899px) | 600px | 16px horizontal |
| md (900-1199px) | 960px | 16px horizontal |
| lg (1200-1535px) | 1280px | 16px horizontal |
| xl (1536px+) | 1280px | 16px horizontal |

```jsx
<Container 
  maxWidth="xl" 
  sx={{ px: 2 }} // 16px padding on all sizes
>
```

### Section Padding

| Breakpoint | Vertical Padding | Horizontal Padding |
|------------|-----------------|-------------------|
| xs (0-599px) | 32px (theme.spacing(4)) | 16px (theme.spacing(2)) |
| sm (600-899px) | 40px (theme.spacing(5)) | 16px (theme.spacing(2)) |
| md (900px+) | 48px (theme.spacing(6)) | 16px (theme.spacing(2)) |

```jsx
<Box 
  component="section"
  sx={{
    py: { xs: 4, sm: 5, md: 6 },
    px: 2,
  }}
>
```

---

## Header Responsive Behavior

### Desktop (≥900px)

**Layout:**
```
[Logo] Name           Navigation Links    [CTA Button]
       Title
```

**Specifications:**
- Height: 64px
- Logo: 40px circle
- Name: Visible, 16px
- Title: Visible, 14px
- Navigation: Visible (3-4 links)
- CTA Button: Visible

### Tablet (600-899px)

**Layout:**
```
[Logo] Name     [CTA Button]
       Title
```

**Changes:**
- Navigation links: Hidden
- Everything else: Same as desktop

### Mobile (0-599px)

**Layout:**
```
[Logo] Name     [CTA Button]
```

**Changes:**
- Title: Hidden
- Name: Full width available
- Navigation: Hidden
- CTA Button: Smaller or icon-only (optional)

### Implementation

```jsx
<AppBar position="sticky" sx={{ height: 64 }}>
  <Container maxWidth="xl">
    <Toolbar sx={{ height: 64, px: 0 }}>
      {/* Left section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '50%', /* ... */ }}>
          OJ
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>
            Omri Jukin
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem',
              display: { xs: 'none', sm: 'block' }, // Hide on mobile
            }}
          >
            Full Stack Developer
          </Typography>
        </Box>
      </Box>

      {/* Right section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Navigation - hide on mobile & tablet */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          <Button>For Employers</Button>
          <Button>For Clients</Button>
          <Button>Contact</Button>
        </Box>
        
        <Button variant="contained">Let's Talk</Button>
      </Box>
    </Toolbar>
  </Container>
</AppBar>
```

---

## Hero Section Responsive Behavior

### Desktop (≥900px)

**Layout:**
- Badge: Centered, 12px text
- Heading: 36px, centered, max-width 100%
- Subtext: 16px, centered, max-width 672px
- Buttons: Horizontal flex, gap 16px
- Stats: 4 columns, gap 32px

**Padding:** 48px vertical

### Tablet (600-899px)

**Layout:**
- Heading: 32px
- Buttons: Horizontal flex (same)
- Stats: 4 columns (might be tight, can switch to 2x2)

**Padding:** 40px vertical

### Mobile (0-599px)

**Layout:**
- Badge: Same
- Heading: 28px
- Subtext: Same (will wrap)
- Buttons: Vertical stack, full width
- Stats: 2x2 grid

**Padding:** 32px vertical

### Implementation

```jsx
<Box component="section" sx={{ py: { xs: 4, sm: 5, md: 6 }, px: 2 }}>
  <Container maxWidth="lg">
    <Box sx={{ maxWidth: 896, mx: 'auto', textAlign: 'center' }}>
      {/* Badge - same on all sizes */}
      <Chip label="Available..." size="small" sx={{ mb: 2 }} />

      {/* Heading - responsive font size */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '1.75rem', md: '2.25rem' },
          fontWeight: 700,
          mb: 2,
        }}
      >
        Full Stack Developer Building Scalable Web Applications
      </Typography>

      {/* Subtext - same size, wraps naturally */}
      <Typography variant="body1" sx={{ maxWidth: 672, mx: 'auto', mb: 4 }}>
        Specialized in React, Node.js...
      </Typography>

      {/* Buttons - stack on mobile, row on tablet+ */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
          mb: 6,
        }}
      >
        <Button size="large" variant="contained">I'm Hiring</Button>
        <Button size="large" variant="outlined">I Need Development</Button>
      </Box>

      {/* Stats - 2x2 on mobile, 4 columns on tablet+ */}
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={6} md={3}>
          <Typography variant="h3" sx={{ fontSize: { xs: '2.25rem', md: '3rem' } }}>
            5+
          </Typography>
          <Typography variant="body2">Years Experience</Typography>
        </Grid>
        {/* Repeat for other stats */}
      </Grid>
    </Box>
  </Container>
</Box>
```

---

## Tab Navigation Responsive Behavior

### All Screen Sizes

Tabs remain mostly the same, but adjust width:

**Desktop (≥900px):**
- Max width: 448px
- Padding per tab: 20px horizontal

**Tablet (600-899px):**
- Max width: 100% (up to 448px)
- Padding per tab: 16px horizontal

**Mobile (0-599px):**
- Full width
- Padding per tab: 12px horizontal
- Font size: Slightly smaller (13px)

### Implementation

```jsx
<Box sx={{ maxWidth: { xs: '100%', sm: 448 }, mx: 'auto', mb: 4 }}>
  <Tabs value={activeTab} onChange={handleChange}>
    <Tab
      label="For Employers"
      icon={<Briefcase size={16} />}
      iconPosition="start"
      sx={{
        flex: 1,
        px: { xs: 1.5, sm: 2.5 },
        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
      }}
    />
    <Tab
      label="For Clients"
      icon={<Users size={16} />}
      iconPosition="start"
      sx={{
        flex: 1,
        px: { xs: 1.5, sm: 2.5 },
        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
      }}
    />
  </Tabs>
</Box>
```

---

## Card Layouts Responsive Behavior

### Professional Summary Card

**All Sizes:**
- Full width
- Same padding: 24px
- Badges wrap naturally

**No changes needed** - card is inherently responsive.

---

## Experience Timeline Responsive Behavior

### Desktop (≥900px)

**Layout:**
- Title and date: Side by side (flexbox row)
- Date aligned to right

### Mobile (0-599px)

**Layout:**
- Title and date: Stacked (flexbox column)
- Both left-aligned

### Implementation

```jsx
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: { md: 'space-between' },
    mb: 1,
  }}
>
  <Box>
    <Typography variant="h4">Senior Full Stack Developer</Typography>
    <Typography variant="body2">Tech Company Inc.</Typography>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: { xs: 0.5, md: 0 } }}>
    <Calendar size={12} />
    <Typography variant="body2">2021 - Present</Typography>
  </Box>
</Box>
```

---

## Grid Layouts Responsive Behavior

### Services Grid (3-Column)

| Breakpoint | Columns | Gap | Notes |
|------------|---------|-----|-------|
| xs (0-599px) | 1 | 16px | Stack vertically |
| sm (600-899px) | 2 | 16px | 2 columns side by side |
| md (900-1199px) | 3 | 16px | Full 3-column layout |
| lg (1200px+) | 3 | 24px | Same layout, larger gap |

### Implementation

```jsx
<Grid container spacing={{ xs: 2, lg: 3 }}>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Service 1</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Service 2</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Service 3</Card>
  </Grid>
</Grid>
```

### Pricing Grid (3-Column)

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| xs (0-599px) | 1 column | Cards stack vertically |
| sm (600-899px) | 1 column | Still stacked (pricing cards need width) |
| md (900px+) | 3 columns | Side by side |

### Implementation

```jsx
<Grid container spacing={3}>
  <Grid item xs={12} md={4}>
    <PricingCard />
  </Grid>
  <Grid item xs={12} md={4}>
    <PricingCard featured />
  </Grid>
  <Grid item xs={12} md={4}>
    <PricingCard />
  </Grid>
</Grid>
```

### Process Grid (4-Column)

| Breakpoint | Columns | Layout |
|------------|---------|--------|
| xs (0-599px) | 1 | Stack vertically |
| sm (600-899px) | 2 | 2x2 grid |
| md (900px+) | 4 | Full 4-column |

### Implementation

```jsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={3}>
    <ProcessStep number={1} />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <ProcessStep number={2} />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <ProcessStep number={3} />
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <ProcessStep number={4} />
  </Grid>
</Grid>
```

---

## Projects Grid Responsive Behavior

### Layout Changes

| Breakpoint | Columns | Card Aspect |
|------------|---------|-------------|
| xs (0-599px) | 1 | 16:9 (full width) |
| sm (600-899px) | 2 | 16:9 |
| md (900-1199px) | 2 | 16:9 |
| lg (1200px+) | 3 | 16:9 |

### Implementation

```jsx
<Grid container spacing={{ xs: 2, md: 3 }}>
  <Grid item xs={12} sm={6} lg={4}>
    <ProjectCard />
  </Grid>
  <Grid item xs={12} sm={6} lg={4}>
    <ProjectCard />
  </Grid>
  <Grid item xs={12} sm={6} lg={4}>
    <ProjectCard />
  </Grid>
</Grid>
```

---

## Contact Section Responsive Behavior

### Desktop (≥900px)

**Layout:**
- 2 columns (50/50 split)
- Form on left, info on right
- Horizontal layout

### Mobile (0-599px)

**Layout:**
- 1 column
- Form first, then info
- Vertical stack

### Implementation

```jsx
<Grid container spacing={4}>
  {/* Form - full width on mobile, half on desktop */}
  <Grid item xs={12} md={6}>
    <Box component="form">
      {/* Form fields */}
    </Box>
  </Grid>

  {/* Contact info - full width on mobile, half on desktop */}
  <Grid item xs={12} md={6}>
    <Box>
      {/* Contact info */}
    </Box>
  </Grid>
</Grid>
```

---

## Footer Responsive Behavior

### Desktop (≥900px)

**Layout:**
```
© 2024 Omri Jukin. All rights reserved.    [Privacy] [Terms]
```
- Horizontal flex
- Justify-content: space-between

### Mobile (0-599px)

**Layout:**
```
© 2024 Omri Jukin. All rights reserved.
              [Privacy] [Terms]
```
- Vertical stack
- Both centered

### Implementation

```jsx
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    justifyContent: { md: 'space-between' },
    gap: 2,
  }}
>
  <Typography variant="body2">© 2024 Omri Jukin...</Typography>
  <Box sx={{ display: 'flex', gap: 3 }}>
    <Link>Privacy Policy</Link>
    <Link>Terms</Link>
  </Box>
</Box>
```

---

## Typography Responsive Scaling

### Headings

| Element | Mobile (xs) | Tablet (sm) | Desktop (md+) |
|---------|------------|-------------|---------------|
| H1 | 28px (1.75rem) | 32px (2rem) | 36px (2.25rem) |
| H2 | 24px (1.5rem) | 28px (1.75rem) | 30px (1.875rem) |
| H3 | 20px (1.25rem) | 22px (1.375rem) | 24px (1.5rem) |
| H4 | 18px (1.125rem) | 18px (1.125rem) | 20px (1.25rem) |
| Stat Number | 36px (2.25rem) | 42px (2.625rem) | 48px (3rem) |

### Implementation Pattern

```jsx
<Typography
  variant="h1"
  sx={{
    fontSize: {
      xs: '1.75rem',   // 28px
      sm: '2rem',      // 32px (optional middle step)
      md: '2.25rem',   // 36px
    },
  }}
>
```

---

## Spacing Responsive Scaling

### Section Padding

```jsx
sx={{
  py: { xs: 4, sm: 5, md: 6 },  // 32px → 40px → 48px
  px: 2,                          // 16px all sizes
}}
```

### Card Padding

Cards maintain same padding on all sizes:
```jsx
sx={{ p: 3 }}  // 24px on all sizes
```

### Grid Gaps

```jsx
<Grid container spacing={{ xs: 2, md: 3 }}>
  // 16px on mobile, 24px on desktop
</Grid>
```

---

## Button Responsive Behavior

### Size Adjustments

**Desktop:**
- Large buttons: height 44px, padding 12px 32px
- Medium buttons: height 40px, padding 10px 24px

**Mobile:**
- Large buttons: Can stay same or reduce to medium
- Full-width buttons on mobile recommended for CTAs

### Implementation

```jsx
<Button
  size="large"
  fullWidth={{ xs: true, sm: false }}  // Full width on mobile only
  sx={{
    fontSize: { xs: '0.875rem', md: '1rem' },
  }}
>
  Click Me
</Button>
```

---

## Common Responsive Patterns

### Hide Element on Mobile

```jsx
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
  Desktop only content
</Box>
```

### Hide Element on Desktop

```jsx
<Box sx={{ display: { xs: 'block', md: 'none' } }}>
  Mobile only content
</Box>
```

### Change Flex Direction

```jsx
<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
  <Item1 />
  <Item2 />
</Box>
```

### Full Width on Mobile, Auto on Desktop

```jsx
<Box sx={{ width: { xs: '100%', md: 'auto' } }}>
```

### Center on Mobile, Left-Align on Desktop

```jsx
<Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
```

---

## Testing Checklist

### Mobile (375px - 599px)
- [ ] All text is readable (not too small)
- [ ] Buttons are tappable (min 44px height)
- [ ] No horizontal overflow
- [ ] Content stacks vertically
- [ ] Images scale properly
- [ ] Navigation is accessible
- [ ] Forms are easy to fill

### Tablet (600px - 899px)
- [ ] Layout uses available space efficiently
- [ ] 2-column grids work well
- [ ] Text is appropriately sized
- [ ] Buttons are properly spaced

### Desktop (900px+)
- [ ] Full layout visible
- [ ] Content doesn't stretch too wide (max-width respected)
- [ ] Multi-column grids display correctly
- [ ] Hover states work
- [ ] Spacing feels comfortable

---

## Breakpoint Testing Strategy

### Manual Testing Breakpoints

Test at these specific widths:
- **320px** - Small mobile (iPhone SE)
- **375px** - Standard mobile (iPhone X)
- **414px** - Large mobile (iPhone Plus)
- **600px** - MUI sm breakpoint
- **768px** - Tablet portrait
- **900px** - MUI md breakpoint
- **1024px** - Tablet landscape
- **1200px** - MUI lg breakpoint
- **1440px** - Desktop
- **1920px** - Large desktop

### Chrome DevTools

Use Chrome's device toolbar:
1. Open DevTools (F12)
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Select responsive mode
4. Test each breakpoint

### Real Device Testing

Test on:
- Real mobile phone (iOS/Android)
- Real tablet (iPad/Android tablet)
- Actual desktop/laptop

---

## Responsive Images

### Project Cards

Images should maintain 16:9 aspect ratio at all sizes:

```jsx
<Box
  sx={{
    aspectRatio: '16/9',
    width: '100%',
    overflow: 'hidden',
  }}
>
  <img src={imageSrc} alt="Project" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</Box>
```

### Profile Images

Circular images scale down on mobile:

```jsx
<Box
  sx={{
    width: { xs: 48, md: 64 },
    height: { xs: 48, md: 64 },
    borderRadius: '50%',
  }}
>
```

---

## Performance Considerations

### Mobile Optimization

1. **Lazy load images** below the fold
2. **Reduce animation complexity** on mobile
3. **Minimize re-renders** during resize
4. **Use smaller image sizes** for mobile viewports

### Implementation

```jsx
import { useMediaQuery, useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {isMobile ? <MobileOptimizedComponent /> : <DesktopComponent />}
    </Box>
  );
}
```

---

## Complete Responsive Example

### Hero Section (Full Implementation)

```jsx
import { Box, Container, Typography, Button, Chip, Grid } from '@mui/material';

function Hero() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, sm: 5, md: 6 },
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 896, mx: 'auto', textAlign: 'center' }}>
          {/* Badge */}
          <Chip
            label="Available for Full-Time & Freelance"
            size="small"
            sx={{ mb: 2 }}
          />

          {/* Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Full Stack Developer Building Scalable Web Applications
          </Typography>

          {/* Subtext */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.9375rem', md: '1rem' },
              lineHeight: 1.6,
              maxWidth: 672,
              mx: 'auto',
              mb: 4,
            }}
          >
            Specialized in React, Node.js, and cloud infrastructure. I help
            companies ship robust products and provide technical consulting for
            businesses looking to scale.
          </Typography>

          {/* Buttons */}
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
              fullWidth={{ xs: true, sm: false }}
            >
              I'm Hiring
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth={{ xs: true, sm: false }}
            >
              I Need Development
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {[
              { number: '5+', label: 'Years Experience' },
              { number: '50+', label: 'Projects Delivered' },
              { number: '20+', label: 'Technologies' },
              { number: '98%', label: 'Client Satisfaction' },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
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
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
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

This completes the responsive behavior specifications. Every component should adapt smoothly across all screen sizes using the patterns documented here.
