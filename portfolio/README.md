# Portfolio Website

A modern portfolio website built with Next.js 15, React 19, and Payload CMS v3.

## Features

- **Content Management**: Full-featured CMS with Payload
- **Modular Pages**: Create custom pages with drag-and-drop blocks
- **Project Showcase**: Display projects with rich content
- **Blog System**: Write and manage blog posts
- **Skills & Experience**: Showcase professional skills and work history
- **Testimonials**: Display client feedback and recommendations
- **Responsive Design**: Built with Tailwind CSS
- **SEO Optimized**: Built-in SEO management
- **Admin Interface**: User-friendly content management

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **CMS**: Payload CMS v3
- **Database**: SQLite (via @payloadcms/db-sqlite)
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Authentication**: Built-in user management

## Getting Started

### Prerequisites

- Node.js 18.18+ (LTS recommended)
- npm package manager

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment file:

   ```bash
   cp env.example .env
   ```

4. Update `.env` with your configuration:
   - Generate a random `PAYLOAD_SECRET`
   - Set your `NEXT_PUBLIC_SITE_URL`

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Access the admin panel at `/admin`

### First Time Setup

1. Create your first admin user at `/admin`
2. Set up your homepage content in the Home global
3. Configure navigation in the Navigation global
4. Add your first project, skills, and other content

## Project Structure

```
src/
├── app/
│   ├── (payload)/          # Admin routes
│   └── (my-app)/           # Public site routes
│       ├── pages/[slug]/   # Dynamic modular pages
│       └── page.tsx        # Homepage
├── collections/             # Payload collections
├── globals/                # Payload globals
├── components/             # React components
├── lib/                    # Utilities and helpers
└── styles/                 # Tailwind CSS
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

## Content Management

### Collections

- **Pages**: Modular pages with layout blocks
- **Projects**: Portfolio projects with rich content
- **Posts**: Blog posts and articles
- **Skills**: Professional skills and expertise
- **Work Experience**: Employment history
- **Certifications**: Professional certifications
- **Testimonials**: Client feedback
- **Media**: Image and file management
- **Categories**: Content organization
- **Users**: Admin user management

### Layout Blocks

Pages support the following block types:

- **Hero**: Title, subtitle, and image
- **Text**: Rich text content
- **Media**: Image galleries
- **CTA**: Call-to-action buttons

## Deployment

The project is configured for deployment on various platforms:

- **Vercel**: Optimized for Next.js
- **Netlify**: Static site generation
- **Cloudflare Pages**: Edge deployment

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Follow the component naming convention
4. Test your changes thoroughly

## License

This project is licensed under the MIT License.
