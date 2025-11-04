# Design Specifications - Complete Design System

This document contains the complete design system for the portfolio website, including all measurements, colors, typography, spacing, and component specifications.

---

## Color Palette

### Light Mode Colors

**Primary Colors:**
```
Primary Blue:     #2563EB (rgb(37, 99, 235))   - slate-600/blue-600
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

**Gradient CTA Buttons:**
```
Employer CTA (Blue-Cyan):
  Background: Linear gradient from #2563EB to #06B6D4
  
Client CTA (Purple-Pink):
  Background: Linear gradient from #9333EA to #EC4899
  
Both:
  Text Color: #FFFFFF
  Padding: 12px 32px
  Border Radius: 8px
  Font Weight: 600
  Box Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
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

**Gradient CTA Card:**
```
Background: Linear gradient (blue-cyan or purple-pink)
Border: none
Border Radius: 12px
Padding: 32px (theme.spacing(4))
Text Color: #FFFFFF
Box Shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
```

**Project Card:**
```
Structure:
  - Image area (aspect ratio 16:9)
  - Content area with padding 24px
  
Image Area:
  Aspect Ratio: 16:9
  Background: Gradient (varies by project)
  Icon: Centered, 64px size, white with 30% opacity

Content Area:
  Padding: 24px
  Background: #FFFFFF
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

Secondary Variant:
  Background: #E0E7FF (blue-100)
  Text Color: #3730A3 (blue-800)

Outlined Variant:
  Background: transparent
  Border: 1px solid #E2E8F0
  Text Color: #475569
```

**Status Badge:**
```
Available (Green):
  Background: #D1FAE5
  Text Color: #065F46
  Icon: Green dot (8px diameter)

Limited (Yellow):
  Background: #FEF3C7
  Text Color: #92400E
  Icon: Yellow dot (8px diameter)
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
  
Error State:
  Border: 2px solid #EF4444
  
Placeholder Color: #94A3B8
```

**Textarea:**
```
Same as text input, but:
  Min Height: 120px
  Padding: 12px
  Resize: vertical
```

**Select/Dropdown:**
```
Same as text input styling
Icon: Chevron down, 16px, right-aligned with 12px padding
```

### Tabs

**Tab Container:**
```
Background: #F1F5F9
Border Radius: 8px
Padding: 4px
Display: Inline-flex
Gap: 4px
```

**Tab Button:**
```
Inactive:
  Background: transparent
  Text Color: #475569
  Padding: 10px 20px
  Border Radius: 6px
  Font Weight: 500
  Font Size: 14px

Active:
  Background: #FFFFFF
  Text Color: #0F172A
  Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
  
Hover (Inactive):
  Background: rgba(255, 255, 255, 0.5)
```

**Tab Icon:**
```
Size: 16px
Margin Right: 8px
Color: Inherits from tab text color
```

### Separators/Dividers

**Horizontal Divider:**
```
Height: 1px
Background: #E2E8F0
Margin: 16px 0 (theme.spacing(2, 0))
```

**Vertical Divider:**
```
Width: 1px
Background: #E2E8F0
Height: 100%
```

---

## Layout Specifications

### Header

**Desktop Header (≥900px):**
```
Height: 64px
Position: Sticky, top: 0
Z-Index: 50
Background: rgba(255, 255, 255, 0.95)
Backdrop Filter: blur(10px)
Border Bottom: 1px solid #E2E8F0

Content Layout:
  Container: Max-width 1280px, padding 0 16px
  Display: Flex, justify-content: space-between, align-items: center
  
Left Side:
  Logo: 40px circle
  Name: 16px semibold
  Title: 14px regular, color: slate-600
  Gap: 12px

Right Side:
  Navigation Links: 14px, gap 24px
  CTA Button: Primary button, medium size
  Gap between nav and button: 24px
```

**Mobile Header (<900px):**
```
Height: 64px
Left Side: Logo + Name only (title hidden)
Right Side: CTA button only (nav links hidden)
```

### Hero Section

**Desktop (≥900px):**
```
Container: Max-width 896px, centered
Padding: 48px vertical, 16px horizontal
Text Align: Center

Badge:
  Margin Bottom: 16px
  
Heading:
  Margin Bottom: 16px
  Max-width: 100%
  
Subtext:
  Margin Bottom: 32px
  Max-width: 672px
  Centered
  
CTA Buttons:
  Display: Flex
  Gap: 16px
  Justify-content: center
  Margin Bottom: 48px
  
Stats Grid:
  Grid: 4 columns
  Gap: 32px
  Each stat: Text align center
```

**Mobile (<900px):**
```
Padding: 32px vertical
Stats Grid: 2x2 grid, gap 16px
CTA Buttons: Stack vertically
```

### Tab Content Area

**Tab Panels:**
```
Padding: 32px 0
Max-width: 1152px (lg container)
Centered
```

**Content Spacing:**
```
Gap between cards: 32px (theme.spacing(4))
```

### Grid Layouts

**3-Column Grid (Services, Projects):**
```
Desktop (≥1200px):  3 columns, 24px gap
Tablet (900-1199px): 2 columns, 16px gap
Mobile (<900px):    1 column, 16px gap

CSS:
display: grid
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
gap: 24px
```

**4-Column Grid (Stats):**
```
Desktop (≥900px):   4 columns
Tablet (600-899px): 2 columns (2x2)
Mobile (<600px):    2 columns (2x2)

Gap: 32px desktop, 16px mobile
```

**2-Column Grid (Contact Section):**
```
Desktop (≥900px):   2 columns (1fr 1fr)
Mobile (<900px):    1 column

Gap: 32px
```

---

## Shadows

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

Level 5 (Modal):
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)
```

---

## Border Radius

**Standard Border Radius:**
```
Small (Buttons, Inputs):  6px
Medium (Cards):           12px
Large (Modals):           16px
Full (Badges, Pills):     9999px (fully rounded)
Circle (Avatars):         50%
```

---

## Transitions

**Standard Transitions:**
```
Fast:     150ms ease-in-out
Normal:   200ms ease-in-out
Slow:     300ms ease-in-out

Hover Effects:
  transition: all 0.2s ease-in-out

Shadow Changes:
  transition: box-shadow 0.2s ease-in-out

Transform:
  transition: transform 0.2s ease-in-out
```

---

## Z-Index Scale

```
Header:           50
Dropdown Menu:    100
Modal Backdrop:   1000
Modal Content:    1001
Tooltip:          1100
```

---

## Accessibility

**Focus States:**
```
Outline: 2px solid #2563EB
Outline Offset: 2px
Border Radius: 4px
```

**Minimum Touch Targets:**
```
Buttons: 44px × 44px minimum
Links: 44px × 44px minimum (or adequate padding)
Form Inputs: 44px height minimum
```

**Color Contrast Ratios:**
```
Normal Text:    4.5:1 minimum (WCAG AA)
Large Text:     3:1 minimum (WCAG AA)
UI Components:  3:1 minimum
```

---

## Responsive Images

**Aspect Ratios:**
```
Project Cards:    16:9
Profile Images:   1:1 (square)
Hero Images:      varies (maintain intrinsic ratio)
```

**Image Sizing:**
```
Logo:             40px × 40px
Profile Avatar:   48px × 48px (mobile), 64px × 64px (desktop)
Project Card:     100% width, auto height (16:9 aspect)
Icons:            16px (small), 20px (medium), 24px (large)
```

---

## Animation Specifications

**Card Hover Animation:**
```
@keyframes cardHover {
  from {
    transform: translateY(0);
    box-shadow: level-2;
  }
  to {
    transform: translateY(-4px);
    box-shadow: level-4;
  }
}

Duration: 200ms
Easing: ease-in-out
```

**Button Hover Animation:**
```
@keyframes buttonHover {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-1px);
  }
}

Duration: 150ms
Easing: ease-in-out
```

**Tab Switch Animation:**
```
Content fade: opacity 0 to 1, 200ms ease-in
```

---

This completes the design specifications. All measurements are exact and can be directly applied to MUI components using the theme system.
