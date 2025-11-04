# Tailwind to MUI Mapping Guide

This document provides quick reference mappings from Tailwind CSS classes and Shadcn components to their MUI equivalents.

---

## Table of Contents

1. [Layout & Spacing](#layout--spacing)
2. [Typography](#typography)
3. [Colors](#colors)
4. [Borders & Shadows](#borders--shadows)
5. [Component Mappings](#component-mappings)
6. [Responsive Design](#responsive-design)
7. [States & Interactions](#states--interactions)

---

## Layout & Spacing

### Container & Max-Width

| Tailwind | MUI Equivalent |
|----------|----------------|
| `container` | `<Container maxWidth="xl">` |
| `max-w-4xl` | `<Container maxWidth="md">` or `sx={{ maxWidth: 896 }}` |
| `max-w-6xl` | `<Container maxWidth="lg">` or `sx={{ maxWidth: 1152 }}` |
| `max-w-7xl` | `<Container maxWidth="xl">` or `sx={{ maxWidth: 1280 }}` |
| `mx-auto` | `sx={{ mx: 'auto' }}` or Container component |

### Padding

| Tailwind | MUI sx Prop | Pixels |
|----------|-------------|--------|
| `p-2` | `sx={{ p: 1 }}` | 8px |
| `p-4` | `sx={{ p: 2 }}` | 16px |
| `p-6` | `sx={{ p: 3 }}` | 24px |
| `p-8` | `sx={{ p: 4 }}` | 32px |
| `py-4` | `sx={{ py: 2 }}` | 16px vertical |
| `py-8` | `sx={{ py: 4 }}` | 32px vertical |
| `py-12` | `sx={{ py: 6 }}` | 48px vertical |
| `px-4` | `sx={{ px: 2 }}` | 16px horizontal |
| `pt-6` | `sx={{ pt: 3 }}` | 24px top |
| `pb-6` | `sx={{ pb: 3 }}` | 24px bottom |
| `pl-4` | `sx={{ pl: 2 }}` | 16px left |
| `pr-4` | `sx={{ pr: 2 }}` | 16px right |

### Margin

| Tailwind | MUI sx Prop | Pixels |
|----------|-------------|--------|
| `m-2` | `sx={{ m: 1 }}` | 8px |
| `m-4` | `sx={{ m: 2 }}` | 16px |
| `mb-2` | `sx={{ mb: 1 }}` | 8px bottom |
| `mb-4` | `sx={{ mb: 2 }}` | 16px bottom |
| `mb-6` | `sx={{ mb: 3 }}` | 24px bottom |
| `mb-8` | `sx={{ mb: 4 }}` | 32px bottom |
| `mt-4` | `sx={{ mt: 2 }}` | 16px top |
| `mx-auto` | `sx={{ mx: 'auto' }}` | auto horizontal |
| `my-8` | `sx={{ my: 4 }}` | 32px vertical |

### Gap (Flexbox/Grid)

| Tailwind | MUI sx Prop | Pixels |
|----------|-------------|--------|
| `gap-2` | `sx={{ gap: 1 }}` | 8px |
| `gap-3` | `sx={{ gap: 1.5 }}` | 12px |
| `gap-4` | `sx={{ gap: 2 }}` | 16px |
| `gap-6` | `sx={{ gap: 3 }}` | 24px |
| `gap-8` | `sx={{ gap: 4 }}` | 32px |

### Space Between (Tailwind) → Gap (MUI)

| Tailwind | MUI sx Prop |
|----------|-------------|
| `space-y-2` | `sx={{ '& > * + *': { mt: 1 } }}` or use Stack with `spacing={1}` |
| `space-y-4` | `sx={{ '& > * + *': { mt: 2 } }}` or use Stack with `spacing={2}` |
| `space-y-8` | `sx={{ '& > * + *': { mt: 4 } }}` or use Stack with `spacing={4}` |
| `space-x-4` | `sx={{ '& > * + *': { ml: 2 } }}` or use Stack with `direction="row" spacing={2}` |

**Better approach with Stack:**
```jsx
// Instead of space-y-4
<Stack spacing={2}>
  <Component1 />
  <Component2 />
</Stack>
```

### Flexbox

| Tailwind | MUI sx Prop |
|----------|-------------|
| `flex` | `sx={{ display: 'flex' }}` |
| `flex-col` | `sx={{ flexDirection: 'column' }}` |
| `flex-row` | `sx={{ flexDirection: 'row' }}` |
| `items-center` | `sx={{ alignItems: 'center' }}` |
| `items-start` | `sx={{ alignItems: 'flex-start' }}` |
| `items-end` | `sx={{ alignItems: 'flex-end' }}` |
| `justify-center` | `sx={{ justifyContent: 'center' }}` |
| `justify-between` | `sx={{ justifyContent: 'space-between' }}` |
| `justify-start` | `sx={{ justifyContent: 'flex-start' }}` |
| `justify-end` | `sx={{ justifyContent: 'flex-end' }}` |
| `flex-wrap` | `sx={{ flexWrap: 'wrap' }}` |
| `flex-1` | `sx={{ flex: 1 }}` |

**Example:**
```jsx
// Tailwind
<div className="flex items-center justify-between gap-4">

// MUI
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
```

### Grid

| Tailwind | MUI sx Prop |
|----------|-------------|
| `grid` | `sx={{ display: 'grid' }}` or `<Grid container>` |
| `grid-cols-2` | `sx={{ gridTemplateColumns: 'repeat(2, 1fr)' }}` or `<Grid item xs={6}>` |
| `grid-cols-3` | `sx={{ gridTemplateColumns: 'repeat(3, 1fr)' }}` or `<Grid item xs={4}>` |
| `grid-cols-4` | `sx={{ gridTemplateColumns: 'repeat(4, 1fr)' }}` or `<Grid item xs={3}>` |
| `gap-4` | `sx={{ gap: 2 }}` or `<Grid container spacing={2}>` |
| `gap-6` | `sx={{ gap: 3 }}` or `<Grid container spacing={3}>` |

**MUI Grid System (Recommended):**
```jsx
// Tailwind
<div className="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// MUI
<Grid container spacing={2}>
  <Grid item xs={12} md={4}><Item 1</Grid>
  <Grid item xs={12} md={4}><Item 2</Grid>
  <Grid item xs={12} md={4}><Item 3</Grid>
</Grid>
```

---

## Typography

### Font Size

| Tailwind | MUI sx Prop | Pixels |
|----------|-------------|--------|
| `text-xs` | `sx={{ fontSize: '0.75rem' }}` | 12px |
| `text-sm` | `sx={{ fontSize: '0.875rem' }}` | 14px |
| `text-base` | `sx={{ fontSize: '1rem' }}` | 16px |
| `text-lg` | `sx={{ fontSize: '1.125rem' }}` | 18px |
| `text-xl` | `sx={{ fontSize: '1.25rem' }}` | 20px |
| `text-2xl` | `sx={{ fontSize: '1.5rem' }}` | 24px |
| `text-3xl` | `sx={{ fontSize: '1.875rem' }}` | 30px |
| `text-4xl` | `sx={{ fontSize: '2.25rem' }}` | 36px |

**Better approach with Typography variants:**
```jsx
// Instead of <div className="text-2xl font-bold">
<Typography variant="h3">Title</Typography>

// Or customize variant
<Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
```

### Font Weight

| Tailwind | MUI sx Prop |
|----------|-------------|
| `font-normal` | `sx={{ fontWeight: 400 }}` |
| `font-medium` | `sx={{ fontWeight: 500 }}` |
| `font-semibold` | `sx={{ fontWeight: 600 }}` |
| `font-bold` | `sx={{ fontWeight: 700 }}` |

### Text Alignment

| Tailwind | MUI sx Prop |
|----------|-------------|
| `text-left` | `sx={{ textAlign: 'left' }}` |
| `text-center` | `sx={{ textAlign: 'center' }}` |
| `text-right` | `sx={{ textAlign: 'right' }}` |

### Line Height

| Tailwind | MUI sx Prop |
|----------|-------------|
| `leading-none` | `sx={{ lineHeight: 1 }}` |
| `leading-tight` | `sx={{ lineHeight: 1.2 }}` |
| `leading-snug` | `sx={{ lineHeight: 1.4 }}` |
| `leading-normal` | `sx={{ lineHeight: 1.5 }}` |
| `leading-relaxed` | `sx={{ lineHeight: 1.6 }}` |

---

## Colors

### Background Colors

| Tailwind | MUI sx Prop | Hex |
|----------|-------------|-----|
| `bg-white` | `sx={{ backgroundColor: 'background.paper' }}` | #FFFFFF |
| `bg-slate-50` | `sx={{ backgroundColor: 'grey.50' }}` or `#F8FAFC` | #F8FAFC |
| `bg-slate-100` | `sx={{ backgroundColor: 'grey.100' }}` or `#F1F5F9` | #F1F5F9 |
| `bg-slate-200` | `sx={{ backgroundColor: 'grey.200' }}` or `#E2E8F0` | #E2E8F0 |
| `bg-blue-50` | `sx={{ backgroundColor: '#EFF6FF' }}` | #EFF6FF |
| `bg-blue-600` | `sx={{ backgroundColor: 'primary.main' }}` or `#2563EB` | #2563EB |
| `bg-gradient-to-br from-slate-50 to-slate-100` | `sx={{ background: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)' }}` | - |

### Text Colors

| Tailwind | MUI sx Prop / Typography color | Hex |
|----------|-------------------------------|-----|
| `text-slate-900` | `color="text.primary"` or `sx={{ color: 'text.primary' }}` | #0F172A |
| `text-slate-600` | `color="text.secondary"` or `sx={{ color: 'text.secondary' }}` | #475569 |
| `text-slate-500` | `sx={{ color: 'grey.500' }}` or `#64748B` | #64748B |
| `text-white` | `sx={{ color: 'white' }}` or `#FFFFFF` | #FFFFFF |
| `text-blue-600` | `sx={{ color: 'primary.main' }}` or `#2563EB` | #2563EB |
| `text-green-600` | `sx={{ color: '#10B981' }}` | #10B981 |

**Typography Component:**
```jsx
// Tailwind
<p className="text-slate-600">Text</p>

// MUI
<Typography color="text.secondary">Text</Typography>
```

### Border Colors

| Tailwind | MUI sx Prop | Hex |
|----------|-------------|-----|
| `border-slate-200` | `sx={{ borderColor: 'divider' }}` or `#E2E8F0` | #E2E8F0 |
| `border-slate-300` | `sx={{ borderColor: 'grey.300' }}` or `#CBD5E1` | #CBD5E1 |
| `border-blue-600` | `sx={{ borderColor: 'primary.main' }}` or `#2563EB` | #2563EB |

---

## Borders & Shadows

### Border Radius

| Tailwind | MUI sx Prop | Pixels |
|----------|-------------|--------|
| `rounded` | `sx={{ borderRadius: 1 }}` | 4px |
| `rounded-md` | `sx={{ borderRadius: 1.5 }}` | 6px |
| `rounded-lg` | `sx={{ borderRadius: 2 }}` | 8px |
| `rounded-xl` | `sx={{ borderRadius: 3 }}` | 12px |
| `rounded-2xl` | `sx={{ borderRadius: 4 }}` | 16px |
| `rounded-full` | `sx={{ borderRadius: '50%' }}` or `9999px` | Circle |

### Borders

| Tailwind | MUI sx Prop |
|----------|-------------|
| `border` | `sx={{ border: '1px solid', borderColor: 'divider' }}` |
| `border-2` | `sx={{ border: '2px solid', borderColor: 'divider' }}` |
| `border-t` | `sx={{ borderTop: '1px solid', borderColor: 'divider' }}` |
| `border-b` | `sx={{ borderBottom: '1px solid', borderColor: 'divider' }}` |
| `border-l-2` | `sx={{ borderLeft: '2px solid', borderColor: 'primary.main' }}` |

### Box Shadow

| Tailwind | MUI sx Prop | Effect |
|----------|-------------|--------|
| `shadow-sm` | `sx={{ boxShadow: 1 }}` | Subtle |
| `shadow` | `sx={{ boxShadow: 2 }}` | Default |
| `shadow-md` | `sx={{ boxShadow: 3 }}` | Medium |
| `shadow-lg` | `sx={{ boxShadow: 4 }}` | Large |
| `shadow-xl` | `sx={{ boxShadow: 5 }}` | Extra large |
| Custom: `0 1px 3px rgba(0,0,0,0.1)` | `sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}` | Custom |

**MUI Card elevation:**
```jsx
<Card elevation={2}> // Same as shadow
<Card elevation={4}> // Same as shadow-lg
```

---

## Component Mappings

### Button

| Shadcn/Tailwind | MUI Equivalent |
|-----------------|----------------|
| `<Button>` | `<Button variant="contained">` |
| `<Button variant="outline">` | `<Button variant="outlined">` |
| `<Button variant="ghost">` | `<Button variant="text">` |
| `<Button size="lg">` | `<Button size="large">` |
| `<Button size="sm">` | `<Button size="small">` |

**Example:**
```jsx
// Shadcn
<Button size="lg" className="gap-2">
  <Icon /> Click Me
</Button>

// MUI
<Button size="large" startIcon={<Icon />}>
  Click Me
</Button>
```

### Card

| Shadcn | MUI Equivalent |
|--------|----------------|
| `<Card>` | `<Card>` |
| `<CardHeader>` | `<CardHeader>` |
| `<CardTitle>` | `<CardHeader title="...">` |
| `<CardDescription>` | `<CardHeader subheader="...">` |
| `<CardContent>` | `<CardContent>` |
| `<CardFooter>` | `<CardActions>` or `<CardContent>` with custom styling |

**Example:**
```jsx
// Shadcn
<Card className="p-6">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// MUI
<Card sx={{ p: 3 }}>
  <CardHeader
    title="Title"
    subheader="Description"
  />
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Badge / Chip

| Shadcn | MUI Equivalent |
|--------|----------------|
| `<Badge>` | `<Chip size="small">` |
| `<Badge variant="secondary">` | `<Chip color="default">` |
| `<Badge variant="outline">` | `<Chip variant="outlined">` |

**Example:**
```jsx
// Shadcn
<Badge>New</Badge>
<Badge variant="outline">React</Badge>

// MUI
<Chip label="New" size="small" />
<Chip label="React" size="small" variant="outlined" />
```

### Tabs

| Shadcn | MUI Equivalent |
|--------|----------------|
| `<Tabs value={tab} onValueChange={setTab}>` | `<Tabs value={tab} onChange={(e, v) => setTab(v)}>` |
| `<TabsList>` | `<Tabs>` (MUI uses Tabs for both container and list) |
| `<TabsTrigger value="1">Tab 1</TabsTrigger>` | `<Tab label="Tab 1" value="1" />` |
| `<TabsContent value="1">Content</TabsContent>` | Custom TabPanel component (see below) |

**TabPanel Helper:**
```jsx
function TabPanel({ children, value, activeTab }) {
  return (
    <Box hidden={value !== activeTab} sx={{ py: 3 }}>
      {value === activeTab && children}
    </Box>
  );
}
```

**Example:**
```jsx
// Shadcn
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="one">Tab 1</TabsTrigger>
    <TabsTrigger value="two">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="one">Content 1</TabsContent>
  <TabsContent value="two">Content 2</TabsContent>
</Tabs>

// MUI
<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
  <Tab label="Tab 1" value="one" />
  <Tab label="Tab 2" value="two" />
</Tabs>
<TabPanel value="one" activeTab={activeTab}>Content 1</TabPanel>
<TabPanel value="two" activeTab={activeTab}>Content 2</TabPanel>
```

### Input

| Shadcn | MUI Equivalent |
|--------|----------------|
| `<Input>` | `<TextField variant="outlined">` |
| `<Input type="email">` | `<TextField type="email" variant="outlined">` |
| `<Textarea>` | `<TextField multiline rows={4}>` |

**Example:**
```jsx
// Shadcn
<Input placeholder="Enter name" />
<Textarea placeholder="Message" rows={4} />

// MUI
<TextField placeholder="Enter name" variant="outlined" fullWidth />
<TextField placeholder="Message" multiline rows={4} variant="outlined" fullWidth />
```

### Separator / Divider

| Shadcn | MUI Equivalent |
|--------|----------------|
| `<Separator />` | `<Divider />` |
| `<Separator orientation="vertical" />` | `<Divider orientation="vertical" />` |

**Example:**
```jsx
// Shadcn
<Separator />

// MUI
<Divider />
```

### Select

| Shadcn | MUI Equivalent |
|--------|----------------|
| `<Select>` | `<TextField select>` or `<Select>` |
| `<SelectTrigger>` | Built into TextField |
| `<SelectContent>` | Automatic dropdown |
| `<SelectItem value="1">` | `<MenuItem value="1">` |

**Example:**
```jsx
// Shadcn
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>

// MUI (Simplified)
<TextField select value={value} onChange={(e) => setValue(e.target.value)}>
  <MenuItem value="1">Option 1</MenuItem>
  <MenuItem value="2">Option 2</MenuItem>
</TextField>
```

---

## Responsive Design

### Breakpoints

| Tailwind | MUI sx Prop | Pixels |
|----------|-------------|--------|
| Default (mobile first) | `xs` | 0px+ |
| `sm:` | `sm` | 600px+ |
| `md:` | `md` | 900px+ |
| `lg:` | `lg` | 1200px+ |
| `xl:` | `xl` | 1536px+ |

**Note:** MUI breakpoints are different from Tailwind!
- Tailwind `md:` = 768px
- MUI `md` = 900px

### Responsive Syntax

**Tailwind:**
```jsx
<div className="text-sm md:text-lg lg:text-xl">
```

**MUI:**
```jsx
<Typography sx={{ fontSize: { xs: '0.875rem', md: '1.125rem', lg: '1.25rem' } }}>
```

### Grid Columns (Responsive)

**Tailwind:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

**MUI (CSS Grid):**
```jsx
<Box sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  gap: 2
}}>
```

**MUI (Grid System):**
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} md={6} lg={4}>Item 1</Grid>
  <Grid item xs={12} md={6} lg={4}>Item 2</Grid>
  <Grid item xs={12} md={6} lg={4}>Item 3</Grid>
</Grid>
```

### Hide/Show Based on Breakpoint

**Tailwind:**
```jsx
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

**MUI:**
```jsx
<Box sx={{ display: { xs: 'none', md: 'block' } }}>Desktop only</Box>
<Box sx={{ display: { xs: 'block', md: 'none' } }}>Mobile only</Box>
```

### Padding/Margin (Responsive)

**Tailwind:**
```jsx
<div className="p-4 md:p-6 lg:p-8">
```

**MUI:**
```jsx
<Box sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
```

---

## States & Interactions

### Hover

**Tailwind:**
```jsx
<button className="bg-blue-600 hover:bg-blue-700">
```

**MUI:**
```jsx
<Button sx={{
  backgroundColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.dark',
  }
}}>
```

### Focus

**Tailwind:**
```jsx
<input className="border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
```

**MUI:**
```jsx
<TextField
  sx={{
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: 2,
      },
    },
  }}
/>
```

### Transitions

**Tailwind:**
```jsx
<div className="transition-all duration-200 ease-in-out">
```

**MUI:**
```jsx
<Box sx={{ transition: 'all 0.2s ease-in-out' }}>
```

### Transform

**Tailwind:**
```jsx
<div className="transform hover:translate-y-[-4px]">
```

**MUI:**
```jsx
<Box sx={{
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}}>
```

---

## Common Patterns

### Center Content

**Tailwind:**
```jsx
<div className="flex items-center justify-center min-h-screen">
```

**MUI:**
```jsx
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
```

### Full Width Button

**Tailwind:**
```jsx
<Button className="w-full">
```

**MUI:**
```jsx
<Button fullWidth>
```

### Aspect Ratio

**Tailwind:**
```jsx
<div className="aspect-video">
```

**MUI:**
```jsx
<Box sx={{ aspectRatio: '16/9' }}>
```

### Sticky Header

**Tailwind:**
```jsx
<header className="sticky top-0 z-50">
```

**MUI:**
```jsx
<AppBar position="sticky" sx={{ top: 0, zIndex: 50 }}>
```

### Card with Hover Effect

**Tailwind:**
```jsx
<div className="rounded-xl p-6 shadow hover:shadow-lg transition-all hover:-translate-y-1">
```

**MUI:**
```jsx
<Card sx={{
  borderRadius: 3,
  p: 3,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: 4,
    transform: 'translateY(-4px)',
  }
}}>
```

---

## Quick Reference Table

| Element | Tailwind | MUI |
|---------|----------|-----|
| **Container** | `<div className="container mx-auto">` | `<Container maxWidth="xl">` |
| **Card** | `<Card className="p-6 rounded-lg">` | `<Card sx={{ p: 3, borderRadius: 2 }}>` |
| **Button Primary** | `<Button>Click</Button>` | `<Button variant="contained">Click</Button>` |
| **Button Outline** | `<Button variant="outline">` | `<Button variant="outlined">` |
| **Text Small** | `<p className="text-sm">` | `<Typography variant="body2">` |
| **Badge** | `<Badge>New</Badge>` | `<Chip label="New" size="small" />` |
| **Input** | `<Input />` | `<TextField variant="outlined" />` |
| **Divider** | `<Separator />` | `<Divider />` |
| **Grid 3 cols** | `<div className="grid grid-cols-3">` | `<Grid container><Grid item xs={4}>` |
| **Flex Center** | `<div className="flex items-center justify-center">` | `<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>` |

---

## Pro Tips

### 1. Use MUI Theme for Colors

Instead of hardcoding colors:
```jsx
// ❌ Avoid
sx={{ color: '#475569' }}

// ✅ Better
sx={{ color: 'text.secondary' }}
```

### 2. Use Typography Variants

Instead of custom font sizes:
```jsx
// ❌ Avoid
<div className="text-2xl font-bold">

// ✅ Better
<Typography variant="h3">
```

### 3. Use Spacing System

Instead of arbitrary values:
```jsx
// ❌ Avoid
sx={{ padding: '24px' }}

// ✅ Better
sx={{ p: 3 }} // 3 * 8px = 24px
```

### 4. Leverage MUI Grid for Responsive Layouts

```jsx
// Complex responsive grid
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* Automatically responsive */}
  </Grid>
</Grid>
```

### 5. Use Stack for Vertical/Horizontal Spacing

```jsx
// Instead of manual gaps
<Stack spacing={2}>
  <Component1 />
  <Component2 />
  <Component3 />
</Stack>
```

---

This mapping guide should cover 95% of the conversions needed for the portfolio design. For any edge cases, refer to the MUI documentation or ask for clarification.
