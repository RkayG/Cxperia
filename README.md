# Cxperia - Digital Experience Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.57-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Cxperia** is a comprehensive digital experience platform that enables beauty and cosmetic brands to create immersive, interactive product experiences through QR codes, tutorials, and analytics.

## 🌟 What is Cxperia?

Cxperia transforms how beauty brands connect with their customers by providing a complete digital experience ecosystem. Brands can create interactive product experiences that customers access by scanning QR codes, providing tutorials, usage instructions, and collecting valuable feedback and analytics.

### Key Features

- 🎨 **Brand Experience Creation** - Build custom digital experiences for products
- 📱 **QR Code Generation** - Generate scannable codes for instant access
- 📚 **Tutorial Management** - Create step-by-step product tutorials and routines
- 📊 **Analytics Dashboard** - Track engagement, scans, and user behavior
- 🎯 **Customer Feedback** - Collect and manage product feedback
- 📱 **Mobile-First Design** - Optimized for mobile scanning and interaction
- 🔒 **Secure & Scalable** - Enterprise-grade security and performance

## 🚀 Quick Start

### Prerequisites

- Node.js 20.0.0 or higher
- pnpm package manager
- Supabase account
- Cloudinary account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/cxperia.git
   cd cxperia
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
cxperia/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Brand dashboard
│   ├── experience/        # Public experience pages
│   └── auth/              # Authentication pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API service layers
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── docs/                  # Documentation
```

## 🏗️ Architecture Overview

### Frontend Architecture
- **Next.js 15** with App Router for file-based routing
- **React 19** with modern hooks and concurrent features
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives

### Backend Architecture
- **Next.js API Routes** for serverless API endpoints
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** with Row Level Security (RLS)
- **Redis** for caching and session management

### State Management
- **Zustand** for global state management
- **React Query** for server state and caching
- **Context API** for component-level state

## 🎯 Core Features

### 1. Brand Dashboard
Comprehensive dashboard for brands to manage their digital experiences:

- **Experience Management** - Create, edit, and manage product experiences
- **Tutorial Creation** - Build step-by-step tutorials and routines
- **Analytics** - Track scans, engagement, and user behavior
- **Content Management** - Manage tutorials, instructions, and media
- **Brand Customization** - Customize colors, themes, and branding

### 2. QR Code System
Advanced QR code generation and management:

- **Dynamic QR Codes** - Generate codes linked to specific experiences
- **Download Options** - PNG and PDF download formats
- **Analytics Tracking** - Track scan events and user interactions
- **Custom Branding** - Branded QR codes with logos

### 3. Tutorial Management
Comprehensive tutorial and routine system:

- **Step-by-Step Creation** - Visual tutorial builder
- **Media Integration** - Images, videos, and interactive content
- **Categorization** - Organize by skin type, occasion, difficulty
- **Publishing Control** - Draft, publish, and unpublish tutorials

### 4. Customer Experience
Mobile-optimized experience for end users:

- **QR Code Scanning** - Instant access to product information
- **Interactive Tutorials** - Step-by-step guidance
- **Feedback System** - Rate and review products
- **Offline Support** - Works without internet connection

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm dev:spa          # Start with HTTPS

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm prettier         # Check Prettier formatting
pnpm prettier:fix     # Fix Prettier formatting

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm e2e:headless     # Run E2E tests
pnpm e2e:ui           # Run E2E tests with UI

# Analysis
pnpm analyze          # Analyze bundle size
pnpm coupling-graph   # Generate dependency graph
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (optional)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# App Configuration
NEXT_PUBLIC_EXPERIENCE_SECRET=your_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📊 Performance

Cxperia is built with performance in mind:

- **Lighthouse Score**: 100/100 across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimized with tree shaking and code splitting
- **Image Optimization**: Automatic optimization with Next.js
- **Caching**: Multi-layer caching strategy

## 🔒 Security

Security is a top priority:

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Data Validation**: Zod schema validation
- **HTTPS**: Enforced in production
- **CORS**: Properly configured
- **Rate Limiting**: API rate limiting implemented

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **PWA Ready**: Progressive Web App capabilities
- **Touch Optimized**: Touch-friendly interactions
- **Offline Support**: Service worker implementation
- **App-like Experience**: Native app feel on mobile devices

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Installation Guide](./docs/installation.md)
- [API Reference](./docs/api/README.md)
- [Component Library](./docs/components/README.md)
- [Deployment Guide](./docs/deployment/production.md)
- [User Guides](./docs/user-guides/README.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.cxperia.com](https://docs.cxperia.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/cxperia/issues)
- **Email**: support@cxperia.com

## 🙏 Acknowledgments

- Built with [Next.js Enterprise Boilerplate](https://github.com/Blazity/next-enterprise)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)

---

**Made with ❤️ by the Cxperia Team**