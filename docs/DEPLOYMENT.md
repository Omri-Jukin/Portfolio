# Portfolio Deployment Guide

This document provides a comprehensive guide for deploying the Portfolio application to production.

## Prerequisites

- Node.js 18+ installed
- Cloudflare account with Pages enabled
- Database (Cloudflare D1 or PostgreSQL)
- Domain name (optional)

## Environment Setup

### 1. Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Database
DATABASE_URL="your-database-connection-string"
DB_TYPE="d1" # or "postgresql"

# Authentication
JWT_SECRET="your-jwt-secret-key"
SESSION_SECRET="your-session-secret"

# Email Service (AWS SES)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
FROM_EMAIL="noreply@yourdomain.com"

# Application
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Analytics (optional)
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

### 2. Database Setup

#### For Cloudflare D1:

1. Create a D1 database in Cloudflare dashboard
2. Run migrations:
   ```bash
   npm run migrate
   ```

#### For PostgreSQL:

1. Set up PostgreSQL database
2. Run migrations:
   ```bash
   npm run migrate
   ```

## Deployment Steps

### 1. Pre-deployment Checklist

- [ ] All tests passing (`npm run test:ci`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Images optimized
- [ ] Performance audit passed
- [ ] Accessibility audit passed
- [ ] SEO audit passed

### 2. Cloudflare Pages Deployment

#### Using Wrangler CLI:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
npm run deploy:pages
```

#### Using Git Integration:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `.open-next`
4. Configure environment variables in Cloudflare dashboard

### 3. Domain Configuration

1. Add custom domain in Cloudflare Pages dashboard
2. Configure DNS records
3. Enable SSL/TLS
4. Set up redirects if needed

## Post-deployment Verification

### 1. Functionality Tests

- [ ] Homepage loads correctly
- [ ] All sections are visible
- [ ] Contact form works
- [ ] Navigation works
- [ ] Responsive design works
- [ ] Dark/light mode works
- [ ] Language switching works

### 2. Performance Tests

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals in green
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] Bundle size optimized

### 3. SEO Tests

- [ ] Meta tags present
- [ ] Structured data valid
- [ ] Sitemap accessible
- [ ] Robots.txt present
- [ ] Open Graph tags working

### 4. Accessibility Tests

- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Color contrast adequate
- [ ] Alt text present
- [ ] ARIA labels correct

## Monitoring Setup

### 1. Analytics

- Google Analytics 4
- Cloudflare Analytics
- Performance monitoring

### 2. Error Tracking

- Cloudflare Error Pages
- Custom error handling
- Log monitoring

### 3. Uptime Monitoring

- Cloudflare Uptime
- External monitoring service
- Health check endpoints

## Maintenance

### 1. Regular Updates

- Dependencies updates
- Security patches
- Content updates
- Performance optimizations

### 2. Backup Strategy

- Database backups
- Code repository backups
- Asset backups

### 3. Monitoring

- Performance monitoring
- Error tracking
- User analytics
- Security monitoring

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check environment variables
   - Verify dependencies
   - Check build logs

2. **Database Connection Issues**

   - Verify connection string
   - Check database permissions
   - Test connection locally

3. **Performance Issues**

   - Check bundle size
   - Optimize images
   - Review caching strategy

4. **SEO Issues**
   - Validate structured data
   - Check meta tags
   - Verify sitemap

### Support

For deployment issues:

1. Check Cloudflare Pages logs
2. Review build logs
3. Test locally
4. Contact support if needed

## Security Considerations

1. **Environment Variables**

   - Never commit secrets
   - Use secure storage
   - Rotate keys regularly

2. **Database Security**

   - Use connection pooling
   - Enable SSL
   - Regular backups

3. **Application Security**
   - Input validation
   - Rate limiting
   - CORS configuration

## Performance Optimization

1. **Build Optimization**

   - Code splitting
   - Tree shaking
   - Bundle analysis

2. **Runtime Optimization**

   - Caching strategies
   - CDN usage
   - Image optimization

3. **Monitoring**
   - Core Web Vitals
   - Lighthouse scores
   - Real user monitoring

