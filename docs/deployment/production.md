# Deployment Guide

## Overview

This guide covers deploying Cxperia to production environments. We support multiple deployment platforms with optimized configurations.

## 🚀 Quick Deploy to Vercel

### 1. One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/your-org/cxperia)

### 2. Manual Vercel Deployment

1. **Connect Repository**
   - Import your Cxperia repository to Vercel
   - Select the main branch

2. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   NEXT_PUBLIC_EXPERIENCE_SECRET=your_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project.vercel.app`

## 🏗️ Custom Infrastructure Deployment

### AWS Deployment

#### Prerequisites

- AWS CLI configured
- Terraform installed
- Docker installed

#### 1. Infrastructure Setup

```bash
# Clone infrastructure repository
git clone https://github.com/your-org/cxperia-infrastructure.git
cd cxperia-infrastructure

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

#### 2. Application Deployment

```bash
# Build Docker image
docker build -t cxperia:latest .

# Tag for ECR
docker tag cxperia:latest your-account.dkr.ecr.region.amazonaws.com/cxperia:latest

# Push to ECR
docker push your-account.dkr.ecr.region.amazonaws.com/cxperia:latest

# Deploy to ECS
aws ecs update-service --cluster cxperia-cluster --service cxperia-service --force-new-deployment
```

### Google Cloud Platform

#### 1. Setup Cloud Run

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/your-project/cxperia
gcloud run deploy cxperia --image gcr.io/your-project/cxperia --platform managed --region us-central1
```

#### 2. Configure Environment

```bash
# Set environment variables
gcloud run services update cxperia --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=your_url,NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key"
```

### DigitalOcean App Platform

#### 1. Create App Spec

```yaml
# app.yaml
name: cxperia
services:
- name: web
  source_dir: /
  github:
    repo: your-org/cxperia
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_SUPABASE_URL
    value: your_supabase_url
  - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
    value: your_supabase_anon_key
```

#### 2. Deploy

```bash
# Deploy using doctl
doctl apps create --spec app.yaml
```

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Build and Run

```bash
# Build image
docker build -t cxperia .

# Run container
docker run -p 3000:3000 --env-file .env.production cxperia
```

### 3. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# App Configuration
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-production-cloud-name
CLOUDINARY_API_KEY=your-production-api-key
CLOUDINARY_API_SECRET=your-production-api-secret

# Redis
UPSTASH_REDIS_REST_URL=your-production-redis-url
UPSTASH_REDIS_REST_TOKEN=your-production-redis-token

# Security
NEXT_PUBLIC_EXPERIENCE_SECRET=your-production-experience-secret

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### Environment-Specific Configurations

#### Development
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
```

#### Staging
```env
NODE_ENV=staging
NEXTAUTH_URL=https://staging.your-domain.com
```

#### Production
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
```

## 📊 Database Setup

### Supabase Production Setup

1. **Create Production Project**
   - Create new Supabase project
   - Configure production settings
   - Set up backup policies

2. **Run Migrations**
   ```bash
   # Run production migrations
   supabase db push --project-ref your-production-ref
   ```

3. **Configure RLS**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
   -- ... (see database setup files)
   ```

### Database Optimization

1. **Indexes**
   ```sql
   -- Create performance indexes
   CREATE INDEX idx_experiences_brand_id ON experiences(brand_id);
   CREATE INDEX idx_tutorials_experience_id ON tutorials(experience_id);
   CREATE INDEX idx_scan_events_created_at ON scan_events(created_at);
   ```

2. **Connection Pooling**
   - Configure Supabase connection pooling
   - Set appropriate pool sizes
   - Monitor connection usage

## 🔒 Security Configuration

### SSL/TLS

1. **Vercel**: Automatic SSL certificates
2. **Custom Domain**: Configure SSL certificates
3. **Load Balancer**: Terminate SSL at load balancer

### Security Headers

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### Environment Security

1. **Secrets Management**
   - Use environment variables for secrets
   - Never commit secrets to repository
   - Rotate secrets regularly

2. **Access Control**
   - Implement proper authentication
   - Use Row Level Security (RLS)
   - Regular security audits

## 📈 Performance Optimization

### Build Optimization

```javascript
// next.config.js
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
```

### Caching Strategy

1. **Static Assets**
   - CDN caching for images
   - Browser caching for assets
   - Service worker caching

2. **API Responses**
   - Redis caching for API responses
   - Database query caching
   - Edge caching with Vercel

### Monitoring

1. **Performance Monitoring**
   - Vercel Analytics
   - Core Web Vitals tracking
   - Error monitoring

2. **Uptime Monitoring**
   - Health check endpoints
   - Alert configuration
   - Incident response

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures

1. **Check Node.js Version**
   ```bash
   node --version  # Should be 20.0.0+
   ```

2. **Clear Cache**
   ```bash
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

#### Environment Variable Issues

1. **Verify Variables**
   ```bash
   # Check if all required variables are set
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Test Database Connection**
   ```bash
   # Test Supabase connection
   curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
   ```

#### Performance Issues

1. **Bundle Analysis**
   ```bash
   pnpm analyze
   ```

2. **Database Optimization**
   - Check slow queries
   - Optimize indexes
   - Monitor connection usage

### Debugging Production

1. **Enable Debug Logging**
   ```env
   DEBUG=cxperia:*
   ```

2. **Error Tracking**
   - Set up error tracking service
   - Monitor error rates
   - Set up alerts

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### Post-Deployment

- [ ] Health checks passing
- [ ] Performance metrics acceptable
- [ ] Error rates normal
- [ ] User acceptance testing
- [ ] Monitoring alerts configured
- [ ] Documentation updated

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Automated Testing

1. **Unit Tests**
   ```bash
   pnpm test
   ```

2. **E2E Tests**
   ```bash
   pnpm e2e:headless
   ```

3. **Linting**
   ```bash
   pnpm lint
   ```

## 📞 Support

For deployment issues:

- **Documentation**: Check this guide and other docs
- **GitHub Issues**: [Deployment Issues](https://github.com/your-org/cxperia/issues)
- **Email**: deployment@cxperia.com

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Guide](https://supabase.com/docs/guides/platform/going-into-prod)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
