# Seed Data Reference

This document lists all default data that is seeded when running `npm run seed`.

## Table of Contents

1. [Roles](#1-roles)
2. [Dashboard Sections](#2-dashboard-sections)
3. [Pricing Tables](#3-pricing-tables)
4. [Calculator Settings (Legacy)](#4-calculator-settings-legacy)
5. [Pricing Discounts](#5-pricing-discounts)
6. [Intake Templates](#6-intake-templates)
7. [Email Templates](#7-email-templates)
8. [Proposal Data](#8-proposal-data)

---

## 1. Roles

**Source**: `lib/db/roles/roles.ts` → `initializeDefaultRoles()`

| Name | Display Name | Description | Permissions |
|------|--------------|-------------|-------------|
| `admin` | Administrator | Full system access - can access admin panel and all system configuration | `canAccessAdmin: true`, `canEditContent: true`, `canEditTables: ["*"]` |
| `editor` | Editor | Content management access - can edit content but NOT system configuration | `canAccessAdmin: false`, `canEditContent: true`, `canEditTables: ["projects", "skills", "certifications", "education", "workExperiences", "services", "testimonials", "blog"]` |
| `user` | User | Customer/employer account - NO admin panel access, limited to profile/portfolio viewing | `canAccessAdmin: false`, `canEditContent: false`, `canEditTables: []` |
| `visitor` | Visitor | Unauthenticated user - public access only | `canAccessAdmin: false`, `canEditContent: false`, `canEditTables: []` |

---

## 2. Dashboard Sections

**Source**: `lib/db/adminDashboard/adminDashboard.ts` → `DEFAULT_SECTIONS`

| Section Key | Display Order | Enabled |
|-------------|---------------|---------|
| `pendingUsers` | 1 | true |
| `roles` | 2 | true |
| `blog` | 3 | true |
| `calculatorSettings` | 4 | true |
| `pricing` | 5 | true |
| `discounts` | 6 | true |
| `proposals` | 7 | true |
| `intakes` | 8 | true |
| `emails` | 9 | true |
| `workExperience` | 10 | true |
| `projects` | 11 | true |
| `skills` | 12 | true |
| `education` | 13 | true |
| `certifications` | 14 | true |
| `services` | 15 | true |
| `testimonials` | 16 | true |

---

## 3. Pricing Tables

**Source**: `scripts/seed-pricing-dynamic.ts` → `seedPricingDynamic()`

### 3.1 Project Types

| Key | Display Name | Base Rate (ILS) | Order |
|-----|--------------|-----------------|-------|
| `landing-page` | Landing Page (base) | 250 | 0 |
| `website` | Website (base) | 4000 | 1 |
| `portfolio` | Portfolio (base) | 7000 | 2 |
| `blog` | Blog (base) | 6000 | 3 |
| `app` | App/MVP (base) | 12000 | 4 |
| `ecommerce` | eCommerce (base) | 20000 | 5 |
| `saas` | SaaS (base) | 30000 | 6 |
| `other` | Other (base) | 10000 | 7 |

### 3.2 Features

| Key | Display Name | Default Cost (ILS) | Order |
|-----|--------------|-------------------|-------|
| `cms` | CMS | 5000 | 20 |
| `auth` | Auth | 3500 | 21 |
| `payment` | Payments | 8000 | 22 |
| `api` | 3rd-party API | 5000 | 23 |
| `realtime` | Realtime | 10000 | 24 |
| `analytics` | Analytics | 3000 | 25 |

### 3.3 Multiplier Groups & Values

#### Complexity Multipliers
| Option Key | Display Name | Value | Is Fixed |
|------------|--------------|-------|----------|
| `simple` | Simple | 1.0 | true |
| `moderate` | Moderate | 1.6 | false |
| `complex` | Complex | 2.4 | false |

#### Timeline Multipliers
| Option Key | Display Name | Value | Is Fixed |
|------------|--------------|-------|----------|
| `normal` | Normal | 1.0 | true |
| `fast` | Fast | 1.3 | false |
| `urgent` | Urgent | 1.6 | false |

#### Tech Stack Multipliers
| Option Key | Display Name | Value | Is Fixed |
|------------|--------------|-------|----------|
| `standard` | Standard | 1.0 | true |
| `advanced` | Advanced | 1.15 | false |
| `cutting-edge` | Cutting-edge | 1.35 | false |

#### Client Type Multipliers
| Option Key | Display Name | Value | Is Fixed |
|------------|--------------|-------|----------|
| `personal` | Personal | 1.0 | true |
| `startup` | Startup | 1.1 | false |
| `small-business` | Small Business | 1.0 | true |
| `medium-business` | Medium Business | 1.2 | false |
| `enterprise` | Enterprise | 1.6 | false |
| `charity` | Charity | 0.8 | false |
| `non-profit` | Non-profit | 0.85 | false |

### 3.4 Meta Settings

| Key | Value | Order |
|-----|-------|-------|
| `pageCostPerPage` | `{ value: 600 }` | 40 |
| `rangePercent` | `{ value: 0.18 }` | 41 |
| `defaultCurrency` | `{ value: "ILS" }` | 42 |
| `projectMinimums` | `{ "landing-page": 250, "website": 4000, "portfolio": 7000, "blog": 6000, "app": 12000, "ecommerce": 20000, "saas": 30000, "other": 10000 }` | 43 |

### 3.5 Tax Profiles

| Key | Label | Tax Lines |
|-----|-------|-----------|
| `israel-vat` | Israel VAT (17%) | VAT: 17% (orderIndex: 0) |
| `us-no-tax` | US - No Tax | (empty) |
| `eu-vat` | EU VAT (20%) | VAT: 20% (orderIndex: 0) |
| `uk-vat` | UK VAT (20%) | VAT: 20% (orderIndex: 0) |
| `israel-vat-surcharge` | Israel VAT + Surcharge | VAT: 17% (orderIndex: 0), Surcharge: 2% (orderIndex: 1) |

---

## 4. Calculator Settings (Legacy)

**Source**: `scripts/seed-calculator-settings.ts` → `seedCalculatorSettings()`

### 4.1 Base Rates (in ILS)

| Setting Key | Setting Value | Display Name | Description |
|-------------|---------------|--------------|-------------|
| `landing-page` | 250 | Landing Page (base) | Base for landing page |
| `website` | 4000 | Website (base) | Base for small company site |
| `portfolio` | 7000 | Portfolio (base) | Base for portfolio website |
| `blog` | 6000 | Blog (base) | Base for blog website |
| `app` | 12000 | App/MVP (base) | Base for web app / MVP |
| `ecommerce` | 20000 | eCommerce (base) | Base for online store |
| `saas` | 30000 | SaaS (base) | Base for SaaS project |
| `other` | 10000 | Other (base) | Generic base bucket |

### 4.2 Page Cost

| Setting Key | Setting Value | Display Name | Description |
|-------------|---------------|--------------|-------------|
| `page` | `{ value: 600 }` | Per Page | Cost per additional page |

### 4.3 Feature Costs (in ILS)

| Setting Key | Setting Value | Display Name | Description |
|-------------|---------------|--------------|-------------|
| `cms` | 5000 | CMS | Content management system |
| `auth` | 3500 | Auth | User authentication |
| `payment` | 8000 | Payments | Payment processing |
| `api` | 5000 | 3rd‑party API | External API integration |
| `realtime` | 10000 | Realtime | Realtime features |
| `analytics` | 3000 | Analytics | Tracking & dashboards |

### 4.4 Multipliers (grouped as objects)

| Setting Key | Setting Value | Display Name | Description |
|-------------|---------------|--------------|-------------|
| `complexity` | `{ simple: 1.0, moderate: 1.6, complex: 2.4 }` | Complexity | Complexity multiplier map |
| `timeline` | `{ normal: 1.0, fast: 1.3, urgent: 1.6 }` | Timeline | Timeline multiplier map |
| `tech` | `{ standard: 1.0, advanced: 1.15, "cutting-edge": 1.35 }` | Tech Stack | Tech multiplier map |
| `clientType` | `{ personal: 1.0, startup: 1.1, "small-business": 1.0, "medium-business": 1.2, enterprise: 1.6, charity: 0.8, "non-profit": 0.85 }` | Client Type | Client type multiplier map |

### 4.5 Meta Settings

| Setting Key | Setting Value | Display Name | Description |
|-------------|---------------|--------------|-------------|
| `rangePercent` | `{ value: 0.18 }` | Range Percent | ± percentage used for output range |
| `projectMinimums` | `{ "landing-page": 250, "website": 4000, "portfolio": 7000, "blog": 6000, "app": 12000, "ecommerce": 20000, "saas": 30000, "other": 10000 }` | Project Minimums | Minimum totals by type |
| `defaultCurrency` | `{ value: "ILS" }` | Default Currency | App default currency (ILS) |

---

## 5. Pricing Discounts

**Source**: `scripts/seed-pricing-discounts.ts` → `seedPricingDiscounts()`

| Code | Description | Type | Amount | Currency | Applies To | Max Uses | Per User Limit |
|------|-------------|------|--------|----------|------------|----------|----------------|
| `WEBSITE50` | 50% off for the next 50 website projects (excludes charity/non-profit) | percent | 50 | ILS | `projectTypes: ["website"]`, `excludeClientTypes: ["charity", "non-profit"]` | 50 | 1 |
| `STARTUP2024` | 20% off for startup clients - first 100 projects | percent | 20 | ILS | `projectTypes: ["website", "app", "saas"]` | 100 | 1 |
| `CHARITY100` | 1000 ILS fixed discount for charity/non-profit organizations | fixed | 1000 | ILS | `projectTypes: ["website", "app", "ecommerce"]` | unlimited | 1 |

---

## 6. Intake Templates

**Source**: `scripts/seed-intake-templates.ts` → `seedIntakeTemplates()`

### 6.1 E-commerce Website
- **Name**: E-commerce Website
- **Category**: `ecommerce`
- **Industry**: Retail/E-commerce
- **Size**: Small to Medium Business
- **Timeline**: 3-6 months
- **Budget**: $15,000 - $50,000 USD
- **Technologies**: Next.js, TypeScript, React, Node.js, PostgreSQL, Stripe, Tailwind CSS

### 6.2 Portfolio/Personal Website
- **Name**: Portfolio/Personal Website
- **Category**: `portfolio`
- **Timeline**: 2-4 weeks
- **Budget**: $2,000 - $8,000 USD
- **Technologies**: Next.js, TypeScript, React, Tailwind CSS, Framer Motion

### 6.3 Corporate/Business Website
- **Name**: Corporate/Business Website
- **Category**: `corporate`
- **Industry**: Business Services
- **Size**: Medium to Large Business
- **Timeline**: 4-8 weeks
- **Budget**: $5,000 - $25,000 USD
- **Technologies**: Next.js, TypeScript, Contentful/Strapi, React, Tailwind CSS

### 6.4 Blog Website
- **Name**: Blog Website
- **Category**: `blog`
- **Timeline**: 3-5 weeks
- **Budget**: $3,000 - $12,000 USD
- **Technologies**: Next.js, TypeScript, Markdown/MDX, React, Tailwind CSS

### 6.5 Landing Page
- **Name**: Landing Page
- **Category**: `landing`
- **Industry**: Marketing/SaaS
- **Size**: Startup to Medium Business
- **Timeline**: 1-3 weeks
- **Budget**: $1,500 - $6,000 USD
- **Technologies**: Next.js, TypeScript, React, Tailwind CSS, Framer Motion

### 6.6 Web Application (SaaS/Dashboard)
- **Name**: Web Application (SaaS/Dashboard)
- **Category**: `webapp`
- **Industry**: SaaS/Technology
- **Size**: Startup to Enterprise
- **Timeline**: 4-12 months
- **Budget**: $25,000 - $150,000 USD
- **Technologies**: Next.js, TypeScript, React, Node.js, PostgreSQL, Prisma/Drizzle, WebSockets, Stripe

---

## 7. Email Templates

**Source**: `scripts/seed-email-templates.ts` → `seedEmailTemplates()`

### 7.1 Welcome Email
- **Name**: Welcome Email
- **Subject**: Welcome to {{companyName}}!
- **Variables**: `firstName`, `companyName`, `senderName`

### 7.2 Follow-up Email
- **Name**: Follow-up Email
- **Subject**: Following up on our conversation
- **Variables**: `firstName`, `topic`, `message`, `actionUrl`, `actionText`, `senderName`

### 7.3 Project Update
- **Name**: Project Update
- **Subject**: Project Update: {{projectName}}
- **Variables**: `clientName`, `projectName`, `updateTitle`, `updateDetails`, `nextSteps`, `senderName`

### 7.4 Thank You Email
- **Name**: Thank You Email
- **Subject**: Thank you for your {{action}}
- **Variables**: `firstName`, `action`, `personalMessage`, `senderName`

### 7.5 Invoice Reminder
- **Name**: Invoice Reminder
- **Subject**: Reminder: Payment Due for {{invoiceNumber}}
- **Variables**: `clientName`, `invoiceNumber`, `amount`, `dueDate`, `paymentUrl`, `senderName`

---

## 8. Proposal Data

**Source**: `scripts/seed-proposals.ts` → `seedProposals()`

### 8.1 Proposal Statuses

| Key | Label | Color |
|-----|-------|-------|
| `draft` | Draft | grey |
| `sent` | Sent | blue |
| `accepted` | Accepted | green |
| `declined` | Declined | red |
| `expired` | Expired | orange |

### 8.2 Proposal Templates

#### Standard Proposal
- **Name**: Standard Proposal
- **Description**: A standard proposal template with common sections
- **Default Currency**: ILS
- **Default Tax Profile Key**: `israel-vat`
- **Default Price Display**: `taxExclusive`
- **Sections**:
  - `development` - Development Services (sortOrder: 0)
  - `additional` - Additional Services (sortOrder: 1)

---

## Notes

- All seed scripts are **idempotent** - safe to run multiple times
- Tax profiles are seeded by `seed-pricing-dynamic.ts`, not `seed-proposals.ts`
- Calculator settings are legacy and may be deprecated in favor of dynamic pricing tables
- Email templates require an admin user to exist in the database
- Individual seed scripts can still be imported and used programmatically if needed

