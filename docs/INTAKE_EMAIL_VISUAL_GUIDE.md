# Intake Email Visual Structure Guide

## Email Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  🎯 NEW INTAKE RECEIVED                      │
│             Fri, Nov 2, 2024, 03:45 PM                      │
│         [Red gradient header with timestamp]                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Project Title Here                    [MEDIUM PRIORITY] 🟡 │
│  Organization Name                                          │
│─────────────────────────────────────────────────────────────│
│      💰              📅              📞                       │
│    Budget          Timeline      Contact Method             │
│   $10,000          3 months         Email                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    QUICK ACTIONS                            │
│  [📊 View in Admin] [✉️ Reply] [📞 Schedule Call]         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  👤 Contact Information                                     │
│  Name:     John Doe                                         │
│  Email:    john@example.com (clickable)                     │
│  Phone:    +1-555-0123 (clickable)                          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  🏢 Organization                                            │
│  Name:     Acme Corp                                        │
│  Website:  https://acme.com (clickable)                     │
│  Industry: Technology                                       │
│  Size:     50-100 employees                                 │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  💼 Project Information                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ DESCRIPTION                                           │ │
│  │ Build a modern e-commerce platform with...           │ │
│  └───────────────────────────────────────────────────────┘ │
│  Timeline:    3 months                                      │
│  Budget:      $10,000                                       │
│  Start Date:  2025-12-01                                    │
│                                                             │
│  Technologies:                                              │
│  [React] [Node.js] [PostgreSQL] [AWS]                     │
│                                                             │
│  Requirements:                                              │
│  • User authentication                                      │
│  • Shopping cart functionality                              │
│  • Payment processing                                       │
│                                                             │
│  Goals:                                                     │
│  • Launch within 3 months                                   │
│  • Support 1000+ concurrent users                           │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  📋 Additional Information                                  │
│  Timezone: Asia/Jerusalem                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ NOTES                                                 │ │
│  │ We need this ASAP for our Q1 launch...               │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│              📌 Next Steps                                   │
│  Review the full proposal in the admin panel and            │
│  respond to John within 24-48 hours.                        │
│         [Purple gradient background]                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│   This is an automated notification from your portfolio     │
│                  intake system.                             │
└─────────────────────────────────────────────────────────────┘
```

## Color Coding

### Priority Levels

- **🔴 URGENT** - `#dc3545` (Red) - Immediate attention required
- **🟠 HIGH** - `#fd7e14` (Orange) - High priority
- **🟡 MEDIUM** - `#ffc107` (Yellow) - Standard priority
- **🟢 LOW** - `#28a745` (Green) - Low priority

### Action Buttons

- **View in Admin** - `#667eea` (Purple-blue) - Primary action
- **Reply to Client** - `#28a745` (Green) - Communication action
- **Schedule Call** - `#17a2b8` (Cyan) - Calendar action

### Section Headers

- All section headers use `#667eea` (Purple-blue)
- Left border accent: 3px solid `#667eea`

## Interactive Elements

### Clickable Links

1. **Email addresses** - Opens default mail client
2. **Phone numbers** - Opens phone dialer (mobile)
3. **Websites** - Opens in new tab
4. **View in Admin** - Direct link to admin dashboard
5. **Reply buttons** - Pre-filled mailto links

### Pre-filled Email Templates

#### Reply to Client

```
To: client@email.com
Subject: Re: Project Title
Body: [Empty - ready for your message]
```

#### Schedule Call

```
To: client@email.com
Subject: Let's Schedule a Call
Body: Hi [FirstName],
```

## Responsive Design

### Desktop (650px+)

- Three-column metrics layout
- Side-by-side action buttons
- Full width tables

### Mobile (<650px)

- Stacked metrics (single column)
- Full-width action buttons (stacked)
- Responsive tables

## Typography Scale

```
Header:        28px (bold, white)
Sub-header:    20px (semi-bold, dark)
Section Title: 16px (semi-bold, purple-blue)
Body Text:     14px (regular, dark gray)
Labels:        14px (semi-bold, gray)
Timestamps:    14px (regular, light)
Badges:        12px (bold, uppercase)
Footer:        12px (regular, light gray)
```

## Spacing & Padding

```
Container Padding:    20-30px
Card Padding:         20px
Section Margins:      20px bottom
Button Padding:       12px 24px
Table Cell Padding:   8px 0
Border Radius:        6-10px (cards), 15-20px (badges)
```

## Email Client Compatibility

### Fully Supported

✅ Gmail (web, iOS, Android)
✅ Apple Mail (macOS, iOS)
✅ Outlook (2016+, 365, web)
✅ Yahoo Mail
✅ ProtonMail

### Partially Supported (graceful degradation)

⚠️ Outlook 2013 (some flex properties may not work)
⚠️ Older mobile clients (may not support some gradients)

### Known Limitations

- Flexbox may fall back to block layout in older clients
- Gradients may show as solid colors in some clients
- System fonts fall back to Arial in older clients

## Accessibility Features

1. **High Contrast** - WCAG AA compliant color ratios
2. **Clickable Targets** - Minimum 44px touch targets
3. **Semantic HTML** - Proper heading hierarchy
4. **Alt Text** - Emoji used for decoration only (text labels present)
5. **Clear Labels** - All actions clearly labeled

## Testing Checklist

- [ ] All links work correctly
- [ ] Mailto links pre-fill subject correctly
- [ ] Priority badge color matches urgency level
- [ ] Budget displays correctly (not `[object Object]`)
- [ ] Timestamp shows in correct timezone
- [ ] All sections render properly
- [ ] Mobile layout works on small screens
- [ ] Action buttons are easily clickable
- [ ] Technologies display as badges
- [ ] No linter/type errors

## Preview in Development

To preview this email during development:

1. Submit a test intake form
2. Check your admin email inbox
3. Review all sections and click all links
4. Test on mobile device
5. Verify urgent vs. low priority styling differences

## Customization Points

Easy to customize in `lib/email/intake.ts`:

- **Colors**: Update `urgencyColors` object
- **Admin URL**: Set `NEXT_PUBLIC_BASE_URL` environment variable
- **Metrics displayed**: Modify the key metrics section
- **Action buttons**: Add/remove/modify button links
- **Section icons**: Change emoji icons
- **Timestamp format**: Adjust `toLocaleString` options
