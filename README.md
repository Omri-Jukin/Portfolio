# Personal Portfolio & Blog Website

A modern, full-stack personal portfolio and blog website built with Next.js and deployed on Cloudflare Workers. This project showcases professional experience, technical skills, and includes a fully functional blog with content management capabilities.

## 🚀 Live Demo

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/next-starter-template)

## ✨ Features

### Core Pages
- **About** - Professional background and personal introduction
- **Career** - Professional experience and career journey  
- **Resume** - Downloadable resume and skills overview
- **Contact** - Contact form with inquiry management system
- **Blog** - Full-featured blog with content management

### Technical Features
- 🌙 **Dark Mode Toggle** - Seamless theme switching
- 📝 **Blog CMS** - Full content management with drafts, publishing, tags
- 📬 **Contact Management** - Inquiry tracking and status management
- 🔐 **Admin System** - User authentication and role-based access
- 📱 **Responsive Design** - Mobile-first, responsive layout
- ⚡ **Type-Safe APIs** - End-to-end type safety with tRPC
- 🗄️ **Database Integration** - SQLite with Drizzle ORM
- 🎨 **Modern UI** - Material-UI components with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Tailwind CSS 4.1.1** - Utility-first CSS framework
- **Material-UI** - React component library
- **Geist Font** - Modern typography

### Backend & API
- **tRPC** - End-to-end typesafe APIs
- **React Query** - Data fetching and caching
- **Zod** - Runtime schema validation
- **Drizzle ORM** - Type-safe database operations
- **SQLite** - Lightweight, serverless database

### Deployment & Infrastructure
- **Cloudflare Workers** - Edge computing platform
- **OpenNext** - Next.js adapter for Cloudflare
- **Wrangler** - Cloudflare deployment tool

## 📁 Project Structure

```
Portfolio/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── about/          # About page
│   │   ├── career/         # Career page  
│   │   ├── contact/        # Contact page
│   │   ├── resume/         # Resume page
│   │   ├── blog/           # Blog pages
│   │   ├── api/            # API routes
│   │   └── server/         # tRPC server setup
│   └── components/         # Reusable React components
├── lib/
│   └── db/                 # Database configuration
│       ├── schema/         # Database schema definitions
│       ├── blog/           # Blog-related DB operations
│       ├── contact/        # Contact-related DB operations
│       └── users/          # User-related DB operations
├── public/                 # Static assets
├── roadmap/               # Project documentation
└── drizzle/               # Database migrations
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd portfolio
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Add your environment variables
   ```

3. **Initialize the database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📋 Available Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run check` | Build and type-check |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to Cloudflare |
| `npm run cf-typegen` | Generate Cloudflare types |

## 🗄️ Database Schema

The project uses a SQLite database with the following main entities:

- **Users** - Admin authentication and user management
- **Blog Posts** - Blog content with status, tags, and metadata
- **Contact Inquiries** - Contact form submissions and management

## 🚀 Deployment

### Cloudflare Workers

The project is optimized for deployment on Cloudflare Workers:

```bash
# Build and deploy
npm run deploy

# Preview before deploying
npm run preview
```

The deployment uses OpenNext to transform the Next.js build output for compatibility with Cloudflare Workers edge runtime.

### Environment Configuration

Ensure the following environment variables are configured in your Cloudflare dashboard:
- Database connection strings
- API keys and secrets
- Third-party service configurations

## 🔧 Development

### Database Management
- **Schema changes**: Update files in `lib/db/schema/`
- **Migrations**: Run `drizzle-kit generate` and `drizzle-kit migrate`
- **Type generation**: Database types are automatically generated

### Adding New Features
1. Create database schema if needed
2. Add tRPC procedures in `src/app/server/routers/`
3. Implement UI components in `src/components/`
4. Create pages in `src/app/`

## 📄 Documentation

- [Roadmap](./roadmap/README.md) - Project planning and implementation details
- [Architecture Decisions](./roadmap/) - Technical decision documentation

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome through the contact form or issues.

## 📝 License

This project is personal and proprietary. All rights reserved.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

## Content Management with YAML

All portfolio content (about, resume, career, etc.) is managed in modular YAML files under the new `content/` directory at the project root. This approach allows for easy updates, localization, and dynamic section rendering. Content is parsed and validated at build time using a dedicated TypeScript class.

- To add or update content, edit the relevant YAML file in `content/`.
- The system will automatically detect and render new sections based on the YAML structure.
- See the `content/README.md` for schema details and examples.
