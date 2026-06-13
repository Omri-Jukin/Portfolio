import { Project } from "./Portfolio.type";

export const FEATURED_PORTFOLIO_PROJECT_IDS = [
  "socially",
  "clipwhisperer",
  "snow-hq",
  "portfolio-platform",
] as const;

export const PORTFOLIO_CONSTANTS = {
  PROJECTS: [
    {
      id: "socially",
      title: "Socially",
      subtitle: "Creator Operations Platform",
      description:
        "A creator operations platform focused on cross-platform content workflows, publishing flows, analytics, and creator-facing operations.",
      technologies: [
        "React Native",
        "TypeScript",
        "Supabase",
        "Cloudflare",
      ],
      problem:
        "Creator teams need a unified operations layer for publishing, analytics, and workflow management instead of fragmented tooling.",
      solution:
        "Designed and implemented a TypeScript-based platform spanning mobile frontend, backend services, authentication, and integration boundaries for scalable creator workflows.",
      architecture:
        "React Native client with Supabase-backed services and Cloudflare-based infrastructure, structured for maintainability, release safety, and future platform integrations.",
      keyFeatures: [
        "Cross-platform creator operations workflows",
        "Publishing and analytics-oriented product structure",
        "Auth and integration boundaries designed for scale",
        "End-to-end technical ownership from architecture to delivery",
      ],
      codeExamples: [],
      technicalChallenges: [
        {
          title: "Cross-platform workflow modeling",
          description:
            "Creator operations span mobile UX, backend services, and external integrations that must stay coherent as the product grows.",
          solution:
            "Structured the system around clear service boundaries, typed contracts, and workflow models that can evolve without breaking core operations.",
        },
      ],
    },
    {
      id: "clipwhisperer",
      title: "ClipWhisperer",
      subtitle: "AI-Powered Video Processing Microservices Platform",
      description:
        "A comprehensive microservices ecosystem for automated video processing and content creation, featuring AI-powered narration, video rendering, and orchestrated workflows.",
      technologies: [
        "TypeScript",
        "Node.js",
        "Microservices",
        "AI/ML",
        "Video Processing",
        "Docker",
        "Kubernetes",
      ],
      problem:
        "Traditional video processing workflows are manual, time-consuming, and require significant human intervention. Content creators need an automated solution that can process videos, add AI-generated narration, and render final content efficiently.",
      solution:
        "Designed and implemented a microservices architecture that separates concerns into specialized services: video processing, AI narration generation, rendering, and orchestration. Each service handles a specific aspect of the pipeline, allowing for scalability and independent development.",
      architecture:
        "Microservices architecture with event-driven communication, containerized deployment, and centralized orchestration. Services include Hub (orchestration), Narrator (AI text-to-speech), Renderer (video processing), and Scraper (content extraction).",
      keyFeatures: [
        "Event-driven microservices architecture",
        "AI-powered text-to-speech narration",
        "Automated video rendering pipeline",
        "Containerized deployment with Docker",
        "Centralized service orchestration",
        "Real-time processing status updates",
      ],
      codeExamples: [
        {
          title: "Service Orchestration Pattern",
          code: `class HubService {
  async processVideo(videoId: string): Promise<void> {
    // 1. Extract audio and generate transcript
    const transcript = await this.scraperService.extractTranscript(videoId);
    
    // 2. Generate AI narration
    const narration = await this.narratorService.generateNarration(transcript);
    
    // 3. Render final video
    await this.rendererService.renderVideo(videoId, narration);
    
    // 4. Update processing status
    await this.updateStatus(videoId, 'completed');
  }
}`,
          explanation:
            "This demonstrates the orchestration pattern where the Hub service coordinates multiple microservices to complete a video processing workflow.",
        },
        {
          title: "Event-Driven Communication",
          code: `// Service communication via events
eventBus.emit('video.processed', {
  videoId,
  transcript,
  timestamp: new Date()
});

// Other services listen for events
eventBus.on('video.processed', async (data) => {
  await this.handleVideoProcessed(data);
});`,
          explanation:
            "Shows how services communicate asynchronously through events, enabling loose coupling and scalability.",
        },
      ],
      technicalChallenges: [
        {
          title: "Service Coordination & State Management",
          description:
            "Managing the state of long-running video processing workflows across multiple services while ensuring consistency and fault tolerance.",
          solution:
            "Implemented a centralized state machine with event sourcing, allowing services to track workflow progress and recover from failures gracefully.",
        },
        {
          title: "Video Processing Performance",
          description:
            "Processing large video files efficiently while maintaining quality and meeting performance requirements.",
          solution:
            "Used streaming processing, parallel processing for different video segments, and optimized encoding parameters for the target output format.",
        },
      ],
    },
    {
      id: "snow-hq",
      title: "Snow HQ",
      subtitle: "Real-Time CRM with Advanced Analytics",
      description:
        "A comprehensive CRM prototype featuring real-time analytics, automated workflows, and advanced reporting capabilities built with modern web technologies.",
      technologies: [
        "Next.js",
        "TypeScript",
        "tRPC",
        "Drizzle ORM",
        "PostgreSQL",
        "Real-time Analytics",
        "Material-UI",
      ],
      problem:
        "Traditional CRM systems lack real-time insights and require manual data entry and workflow management. Sales teams need immediate visibility into customer interactions and automated processes to improve efficiency.",
      solution:
        "Built a modern, real-time CRM using Next.js with server-side rendering, implemented type-safe APIs with tRPC, and designed a responsive database schema with Drizzle ORM for optimal performance.",
      architecture:
        "Full-stack Next.js application with App Router, tRPC for end-to-end type safety, PostgreSQL database with Drizzle ORM, and real-time updates using WebSockets. The frontend uses Material-UI components with custom theming.",
      keyFeatures: [
        "Real-time customer data updates",
        "Advanced analytics dashboard",
        "Automated workflow management",
        "Type-safe API endpoints",
        "Responsive Material-UI design",
        "Database query optimization",
      ],
      codeExamples: [
        {
          title: "Type-Safe API with tRPC",
          code: `// Server-side procedure definition
export const customerRouter = router({
  getCustomers: protectedProcedure
    .input(z.object({
      page: z.number().min(1),
      limit: z.number().min(1).max(100)
    }))
    .query(async ({ input, ctx }) => {
      const customers = await ctx.db
        .select()
        .from(customers)
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);
      
      return customers;
    })
});`,
          explanation:
            "Demonstrates how tRPC provides end-to-end type safety, ensuring the frontend and backend are always in sync.",
        },
        {
          title: "Database Schema with Drizzle ORM",
          code: `export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});`,
          explanation:
            "Shows the type-safe database schema definition using Drizzle ORM, which automatically generates TypeScript types.",
        },
      ],
      technicalChallenges: [
        {
          title: "Real-Time Data Synchronization",
          description:
            "Keeping the UI in sync with real-time database changes across multiple users and sessions.",
          solution:
            "Implemented WebSocket connections with a pub/sub pattern, using React Query for client-side state management and optimistic updates.",
        },
        {
          title: "Database Performance Optimization",
          description:
            "Handling large datasets efficiently while maintaining fast query response times for analytics.",
          solution:
            "Designed proper database indexes, implemented pagination, and used database views for complex analytics queries.",
        },
      ],
    },
    {
      id: "clothest",
      title: "Clothest",
      subtitle: "AI-Powered Wardrobe Management System",
      description:
        "An intelligent wardrobe management system with personalized clothing recommendations, inventory tracking, and outfit planning capabilities.",
      technologies: [
        "React",
        "Express.js",
        "MongoDB",
        "Node.js",
        "AI Recommendations",
        "Image Processing",
        "Responsive Design",
      ],
      problem:
        "People struggle to organize their clothing, make outfit decisions, and track what they own. They need an intelligent system that can categorize items, suggest combinations, and help manage their wardrobe efficiently.",
      solution:
        "Developed a full-stack application with React frontend and Express.js backend, implemented AI-powered recommendation algorithms, and created an intuitive user interface for wardrobe management.",
      architecture:
        "MERN stack application with React frontend, Express.js REST API, MongoDB database, and AI recommendation engine. The frontend uses modern React patterns with hooks and context for state management.",
      keyFeatures: [
        "AI-powered outfit recommendations",
        "Smart clothing categorization",
        "Inventory tracking system",
        "Outfit planning calendar",
        "Responsive mobile design",
        "Image upload and processing",
      ],
      codeExamples: [
        {
          title: "AI Recommendation Algorithm",
          code: `class OutfitRecommender {
  recommendOutfit(occasion: string, weather: Weather): Outfit {
    const suitableItems = this.filterByOccasion(occasion);
    const weatherAppropriate = this.filterByWeather(suitableItems, weather);
    
    return this.createOutfit(weatherAppropriate, {
      style: occasion,
      temperature: weather.temperature,
      season: weather.season
    });
  }
  
  private createOutfit(items: ClothingItem[], context: OutfitContext): Outfit {
    // AI logic for creating cohesive outfits
    return this.aiModel.predict(items, context);
  }
}`,
          explanation:
            "Shows the AI recommendation system that considers occasion, weather, and personal style preferences to suggest outfits.",
        },
        {
          title: "Responsive Component Design",
          code: `const ClothingItem = styled.div\`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 1024px) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
  }
\`;`,
          explanation:
            "Demonstrates responsive design principles with CSS-in-JS, ensuring the app works well on all device sizes.",
        },
      ],
      technicalChallenges: [
        {
          title: "AI Recommendation Accuracy",
          description:
            "Creating an AI system that provides relevant and personalized outfit recommendations based on user preferences and context.",
          solution:
            "Implemented a hybrid recommendation system combining collaborative filtering, content-based filtering, and rule-based logic for better accuracy.",
        },
        {
          title: "Image Processing & Storage",
          description:
            "Efficiently processing, storing, and retrieving clothing images while maintaining quality and performance.",
          solution:
            "Used image compression, implemented lazy loading, and created optimized thumbnail versions for faster loading times.",
        },
      ],
    },
    {
      id: "portfolio-platform",
      title: "Portfolio Platform",
      subtitle: "Public site with authenticated CMS and backoffice",
      description:
        "A multilingual portfolio platform with a polished public experience and a maintainable CMS for content, career data, and technical case studies.",
      technologies: [
        "Next.js",
        "TypeScript",
        "tRPC",
        "Drizzle ORM",
        "Supabase",
        "NextAuth",
        "next-intl",
      ],
      liveUrl: "https://omrijukin.com",
      problem:
        "A portfolio site needs both a recruiter-friendly public experience and a maintainable way to manage content, career data, and technical case studies without duplicating state across tools.",
      solution:
        "Built a modular Next.js platform with locale-aware public pages, RBAC-protected admin routes, Postgres-backed APIs, and section-driven homepage composition.",
      architecture:
        "Public i18n site plus authenticated CMS/backoffice, Drizzle-backed Postgres schema, tRPC procedures for content operations, and reusable section components for homepage composition.",
      keyFeatures: [
        "Locale-aware public site (EN, ES, FR, HE)",
        "RBAC-protected CMS and dashboard",
        "Type-safe tRPC content APIs",
        "Modular homepage section composition",
        "Resume and technical portfolio generation",
        "Deployment-ready Next.js App Router structure",
      ],
      codeExamples: [
        {
          title: "Internationalization Setup",
          code: `// i18n configuration
export const i18n = createI18n({
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'he'],
  localeDetection: true,
  domains: [
    {
      domain: 'omrijukin.com',
      defaultLocale: 'en'
    }
  ]
});

// Usage in components
const t = useTranslations('common');
return <h1>{t('title')}</h1>;`,
          explanation:
            "Shows the internationalization setup that enables the website to support multiple languages seamlessly.",
        },
        {
          title: "Theme System with Material-UI",
          code: `const theme = createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none'
        }
      }
    }
  }
});`,
          explanation:
            "Demonstrates the custom theme system that provides consistent styling and dark/light mode support.",
        },
      ],
      technicalChallenges: [
        {
          title: "Performance Optimization",
          description:
            "Achieving optimal performance scores while maintaining rich animations and interactive features across different devices and network conditions.",
          solution:
            "Implemented code splitting, lazy loading, optimized images, and used Cloudflare Workers for edge computing to minimize latency globally.",
        },
        {
          title: "Responsive Design System",
          description:
            "Creating a design system that works seamlessly across all device sizes while maintaining visual consistency and usability.",
          solution:
            "Developed a mobile-first approach with Material-UI breakpoints, custom responsive components, and tested across various device sizes and orientations.",
        },
      ],
    },
  ] as Project[],
};
