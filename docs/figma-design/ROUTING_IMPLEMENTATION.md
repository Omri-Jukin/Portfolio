# Routing Implementation Guide - Next.js 15

Complete guide for implementing the three-page structure in Next.js 15 with App Router, TypeScript, and MUI.

---

## File Structure

```
app/
├── layout.tsx                  // Root layout (theme provider, fonts, metadata)
├── page.tsx                    // Landing page (/)
├── employers/
│   └── page.tsx               // Employer page (/employers)
├── clients/
│   └── page.tsx               // Client page (/clients)
├── globals.css                // Global styles
└── components/
    ├── layout/
    │   ├── Header.tsx         // Shared header with active state
    │   └── Footer.tsx         // Shared footer
    ├── sections/
    │   ├── HeroSection.tsx
    │   ├── PathSelectionCards.tsx
    │   ├── ProfessionalSummary.tsx
    │   ├── ExperienceTimeline.tsx
    │   ├── KeyAchievements.tsx
    │   ├── SkillsTechnologies.tsx
    │   ├── EducationCertifications.tsx
    │   ├── ServicesOverview.tsx
    │   ├── PricingPackages.tsx
    │   ├── ProcessSection.tsx
    │   ├── EmployerCTA.tsx
    │   └── ClientCTA.tsx
    ├── shared/
    │   ├── FeaturedProjects.tsx   // Context-aware
    │   └── ContactSection.tsx     // Context-aware
    └── ui/
        └── ... (MUI components)
```

---

## Root Layout (`app/layout.tsx`)

```tsx
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Omri Jukin - Full Stack Developer',
  description: 'Senior full-stack developer specialized in React, Node.js, and cloud infrastructure. Available for hire and freelance projects.',
  keywords: ['full stack developer', 'react', 'nodejs', 'typescript', 'web development'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

---

## Theme Configuration (`app/theme.ts`)

```tsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Can be controlled by state for dark mode
    primary: {
      main: '#2563EB',
      dark: '#1E40AF',
      light: '#3B82F6',
    },
    secondary: {
      main: '#9333EA',
      dark: '#7E22CE',
      light: '#A855F7',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      '@media (max-width:900px)': {
        fontSize: '1.75rem',
      },
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (max-width:900px)': {
        fontSize: '1.5rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:900px)': {
        fontSize: '1.25rem',
      },
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Base unit
});

export default theme;
```

---

## Landing Page (`app/page.tsx`)

```tsx
import { Box } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import PathSelectionCards from './components/sections/PathSelectionCards';
import FeaturedProjects from './components/shared/FeaturedProjects';

export const metadata = {
  title: 'Omri Jukin - Full Stack Developer | React, Node.js, Cloud Infrastructure',
  description: 'Senior full-stack developer available for hire and freelance projects. Specialized in React, Node.js, TypeScript, and cloud architecture.',
  keywords: ['full stack developer', 'react developer', 'nodejs developer', 'freelance developer', 'hire developer'],
};

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
      }}
    >
      <Header activePath="home" />
      <main>
        <HeroSection />
        <PathSelectionCards />
        <FeaturedProjects variant="neutral" limit={3} showViewAll={true} />
      </main>
      <Footer />
    </Box>
  );
}
```

---

## Employer Page (`app/employers/page.tsx`)

```tsx
import { Box, Container } from '@mui/material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import ProfessionalSummary from '../components/sections/ProfessionalSummary';
import ExperienceTimeline from '../components/sections/ExperienceTimeline';
import KeyAchievements from '../components/sections/KeyAchievements';
import SkillsTechnologies from '../components/sections/SkillsTechnologies';
import EducationCertifications from '../components/sections/EducationCertifications';
import EmployerCTA from '../components/sections/EmployerCTA';
import FeaturedProjects from '../components/shared/FeaturedProjects';
import ContactSection from '../components/shared/ContactSection';

export const metadata = {
  title: 'Hire Omri Jukin - Senior Full Stack Developer | React, Node.js Expert',
  description: 'Experienced full-stack developer with 5+ years building scalable web applications. View resume, portfolio, and technical achievements. Available for full-time and contract positions.',
  keywords: ['hire full stack developer', 'senior react developer', 'nodejs expert', 'full-time developer', 'contract developer'],
};

export default function EmployersPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
      }}
    >
      <Header activePath="employers" />
      <main>
        {/* Hero */}
        <HeroSection variant="employer" />

        {/* Content Cards */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <ProfessionalSummary />
          <ExperienceTimeline />
          <KeyAchievements />
          <SkillsTechnologies />
          <EducationCertifications />
        </Container>

        {/* Projects */}
        <FeaturedProjects variant="employer" limit={6} />

        {/* CTA */}
        <Container maxWidth="lg" sx={{ px: 2 }}>
          <EmployerCTA />
        </Container>

        {/* Contact */}
        <ContactSection variant="employer" />
      </main>
      <Footer />
    </Box>
  );
}
```

---

## Client Page (`app/clients/page.tsx`)

```tsx
import { Box, Container } from '@mui/material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import ServicesOverview from '../components/sections/ServicesOverview';
import PricingPackages from '../components/sections/PricingPackages';
import ProcessSection from '../components/sections/ProcessSection';
import ClientCTA from '../components/sections/ClientCTA';
import FeaturedProjects from '../components/shared/FeaturedProjects';
import ContactSection from '../components/shared/ContactSection';

export const metadata = {
  title: 'Web Development Services - Omri Jukin | Transparent Pricing & Quality Results',
  description: 'Professional web development services for businesses. View pricing, process, and portfolio. Specialized in React, Node.js, and cloud architecture. Request a quote today.',
  keywords: ['web development services', 'freelance web developer', 'custom web application', 'react development', 'web app pricing'],
};

export default function ClientsPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #F8FAFC, #F1F5F9)',
      }}
    >
      <Header activePath="clients" />
      <main>
        {/* Hero */}
        <HeroSection variant="client" />

        {/* Content Cards */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <ServicesOverview />
          <PricingPackages />
          <ProcessSection />
        </Container>

        {/* Projects */}
        <FeaturedProjects variant="client" limit={6} />

        {/* CTA */}
        <Container maxWidth="lg" sx={{ px: 2 }}>
          <ClientCTA />
        </Container>

        {/* Contact */}
        <ContactSection variant="client" />
      </main>
      <Footer />
    </Box>
  );
}
```

---

## Navigation & Linking

### Link Behavior

**Internal Links:**
```tsx
import Link from 'next/link';
import { Button } from '@mui/material';

// Using Next.js Link
<Link href="/employers" passHref>
  <Button variant="contained">I'm Hiring</Button>
</Link>

// Using MUI Button with href (recommended)
<Button variant="contained" href="/employers">
  I'm Hiring
</Button>
```

**Anchor Links (Same Page):**
```tsx
<Button variant="outlined" href="#contact">
  Contact
</Button>
```

**External Links:**
```tsx
<Button
  component="a"
  href="https://github.com/omrijukin"
  target="_blank"
  rel="noopener noreferrer"
>
  GitHub
</Button>
```

---

## Data Management

### Option 1: Local Data Files

```
app/
├── data/
│   ├── projects.ts
│   ├── experience.ts
│   ├── skills.ts
│   └── education.ts
```

**Example: `app/data/projects.ts`**

```tsx
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: {
    neutral: string;
    employer: string;
    client: string;
  };
  technologies: string[];
  metrics: {
    impact?: string;
    year: string;
    teamSize?: string;
    scale?: string;
    timeline?: string;
  };
  gradient: string;
}

export const projects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    subtitle: 'Full-stack marketplace application',
    description: {
      neutral: 'Built a scalable e-commerce platform handling 10K+ daily transactions with real-time inventory management.',
      employer: 'Built a scalable e-commerce platform handling 10K+ daily transactions with real-time inventory management. Led a team of 3 developers and architected microservices architecture using Node.js and PostgreSQL.',
      client: 'Built a scalable e-commerce platform that increased client revenue by 150% in the first 6 months. Delivered on time and under budget with regular client updates throughout the development process.',
    },
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    metrics: {
      impact: '↑ 150% Revenue',
      year: '2023',
      teamSize: '3 developers',
      scale: '10K+ daily transactions',
      timeline: 'Delivered in 8 weeks',
    },
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
  },
  // ... more projects
];
```

### Option 2: CMS Integration

If you have a headless CMS:

```tsx
// app/lib/cms.ts
export async function getProjects() {
  const response = await fetch('https://your-cms.com/api/projects');
  return response.json();
}

// In component
import { getProjects } from '@/lib/cms';

export default async function ClientsPage() {
  const projects = await getProjects();
  // ...
}
```

---

## SEO Optimization

### Metadata per Page

Each page has its own metadata:

```tsx
// app/employers/page.tsx
export const metadata = {
  title: 'Hire Omri Jukin - Senior Full Stack Developer',
  description: '...',
  keywords: [...],
  openGraph: {
    title: 'Hire Omri Jukin - Senior Full Stack Developer',
    description: '...',
    url: 'https://omrijukin.com/employers',
    siteName: 'Omri Jukin Portfolio',
    images: [
      {
        url: 'https://omrijukin.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Omri Jukin - Senior Full Stack Developer',
    description: '...',
    images: ['https://omrijukin.com/og-image.png'],
  },
};
```

### Structured Data (JSON-LD)

```tsx
// app/employers/page.tsx
export default function EmployersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Omri Jukin',
    jobTitle: 'Senior Full Stack Developer',
    url: 'https://omrijukin.com/employers',
    sameAs: [
      'https://github.com/omrijukin',
      'https://linkedin.com/in/omrijukin',
    ],
    knowsAbout: ['React', 'Node.js', 'TypeScript', 'Cloud Architecture'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

---

## Analytics Integration

### Google Analytics

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Event Tracking

```tsx
// app/lib/analytics.ts
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};

// Usage in component
import { trackEvent } from '@/lib/analytics';

<Button
  onClick={() => {
    trackEvent('employer_cta_clicked', { source: 'hero' });
  }}
  href="/employers"
>
  I'm Hiring
</Button>
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://omrijukin.com
```

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm run start
```

---

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./app/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Testing

### Unit Tests (Jest + React Testing Library)

```tsx
// __tests__/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from '@/components/layout/Header';

describe('Header', () => {
  it('highlights active path', () => {
    render(<Header activePath="employers" />);
    const employersLink = screen.getByText('For Employers');
    expect(employersLink).toHaveStyle({ fontWeight: 600 });
  });
});
```

---

## Summary

### Routes

- `/` - Landing page
- `/employers` - Employer-focused page
- `/clients` - Client-focused page

### Key Features

- ✅ Next.js 15 App Router
- ✅ TypeScript support
- ✅ MUI theming
- ✅ SEO optimization
- ✅ Analytics integration
- ✅ Context-aware components
- ✅ Responsive design
- ✅ Dark mode ready

### Next Steps

1. Create file structure
2. Implement root layout
3. Create shared components
4. Build landing page
5. Build employer page
6. Build client page
7. Add analytics
8. Deploy to Vercel

---

This completes the routing implementation guide.
