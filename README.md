# Portfolio - Modern Developer Portfolio

A modern, interactive, and performant portfolio website built with Next.js, TypeScript, and Material-UI. Features a clean design, smooth animations, and comprehensive functionality for showcasing professional work.

## 🚀 Features

### Core Features

- **Modern Design**: Clean, minimal aesthetic inspired by top developer portfolios
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark/Light Mode**: Theme switching with system preference detection
- **Internationalization**: Multi-language support (EN, ES, FR, HE)
- **Performance Optimized**: Fast loading with lazy loading and code splitting
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support

### Sections

- **Hero Section**: Impactful landing with animated elements and CTA buttons
- **About Section**: Professional introduction with skills showcase
- **Experience Timeline**: Career history with detailed work experience
- **Projects Showcase**: Featured projects with case studies
- **Contact Form**: Functional contact form with validation and email integration
- **Skills Display**: Interactive tech stack with categories and proficiency levels

### Technical Features

- **CMS Integration**: Content management with tRPC and database
- **Contact Form**: Working contact form with email notifications
- **Performance Monitoring**: Real-time performance tracking and analytics
- **SEO Optimized**: Structured data, sitemap, and meta tags
- **PWA Support**: Progressive Web App capabilities with service worker
- **Testing**: Comprehensive test suite with unit, integration, and E2E tests

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Material-UI 7.3.1** - Component library
- **Tailwind CSS 4.1.1** - Utility-first CSS
- **Framer Motion** - Animations and transitions
- **next-intl** - Internationalization

### Backend

- **tRPC** - Type-safe API layer
- **Drizzle ORM** - Database ORM
- **PostgreSQL/Cloudflare D1** - Database
- **AWS SES** - Email service
- **Cloudflare Pages** - Hosting and deployment

### Development

- **Jest** - Unit testing
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Database (PostgreSQL or Cloudflare D1)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp config/production.env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database setup**

   ```bash
   npm run migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Cloudflare Pages

1. **Build the application**

   ```bash
   npm run build:production
   ```

2. **Deploy to Cloudflare Pages**
   ```bash
   npm run deploy
   ```

### Manual Deployment

1. **Run production build**

   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider**
   ```bash
   npm run deploy:pages
   ```

## 🧪 Testing

### Unit Tests

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
```

### All Tests

```bash
npm run test:ci
```

## 📁 Project Structure

```
portfolio/
├── Components/           # React components
│   ├── Hero/            # Hero section
│   ├── About/           # About section
│   ├── Contact/         # Contact section
│   ├── Projects/        # Projects showcase
│   └── ...
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── [locale]/    # Internationalized routes
│   │   └── api/         # API routes
│   └── server/          # Server-side code
├── lib/                 # Utilities and configurations
│   ├── db/              # Database schema and queries
│   ├── utils/           # Utility functions
│   └── constants.ts     # Application constants
├── messages/            # Internationalization files
├── public/              # Static assets
├── docs/                # Documentation
├── scripts/             # Build and deployment scripts
└── __tests__/           # Test files
```

## 🎨 Customization

### Theme

The application uses a custom Material-UI theme. To customize:

1. Edit `lib/theme/portfolioTheme.ts`
2. Update color palette, typography, and component styles
3. Modify `lib/constants.ts` for global constants

### Content

Content is managed through:

1. **Database**: Dynamic content via tRPC
2. **Translation files**: Static content in `messages/`
3. **Components**: Hardcoded content in component files

### Styling

- **Material-UI**: Component styling in `.style.ts` files
- **Tailwind CSS**: Utility classes for custom styling
- **Global CSS**: Global styles in `src/app/globals.css`

## 🔧 Configuration

### Environment Variables

| Variable                | Description                | Required |
| ----------------------- | -------------------------- | -------- |
| `DATABASE_URL`          | Database connection string | Yes      |
| `JWT_SECRET`            | JWT signing secret         | Yes      |
| `NEXT_PUBLIC_APP_URL`   | Application URL            | Yes      |
| `AWS_ACCESS_KEY_ID`     | AWS credentials for email  | Yes      |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials for email  | Yes      |
| `FROM_EMAIL`            | Email sender address       | Yes      |

### Database Schema

The application uses the following main tables:

- `users` - User accounts
- `contact_inquiries` - Contact form submissions
- `projects` - Project showcase data
- `skills` - Skills and technologies
- `work_experiences` - Career history
- `certifications` - Professional credentials

## 📊 Performance

### Metrics

- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**: All metrics in green
- **Bundle Size**: Optimized with code splitting
- **Load Time**: < 3 seconds on 3G

### Optimization Features

- Lazy loading for heavy components
- Image optimization with Next.js Image
- Service worker for caching
- Bundle analysis and optimization
- Performance monitoring

## 🔒 Security

### Security Features

- Input validation with Zod schemas
- Rate limiting on API endpoints
- CORS configuration
- Environment variable protection
- Database query sanitization

### Best Practices

- Never commit secrets
- Use HTTPS in production
- Regular dependency updates
- Security headers configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from top developer portfolios
- Next.js team for the excellent framework
- Material-UI team for the component library
- Cloudflare for hosting and services

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Contact: omrijukin@gmail.com
- Website: https://omrijukin.com

---

**Built with ❤️ by Omri Jukin**
