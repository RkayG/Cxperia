# Installation Guide

## Prerequisites

Before installing Cxperia, ensure you have the following installed:

### Required Software

- **Node.js** 20.0.0 or higher
- **pnpm** package manager (recommended) or npm
- **Git** for version control

### Required Accounts

- **Supabase** account for database and authentication
- **Cloudinary** account for media storage (optional)
- **Vercel** account for deployment (optional)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/cxperia.git
cd cxperia
```

### 2. Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### 3. Environment Configuration

Copy the environment template:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis Configuration (Optional)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# App Configuration
NEXT_PUBLIC_EXPERIENCE_SECRET=your_experience_secret_key
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
```

### 4. Database Setup

#### Supabase Setup

1. **Create a new Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Run database migrations**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Initialize Supabase
   supabase init

   # Link to your project
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

3. **Set up Row Level Security (RLS)**:
   ```bash
   # Run RLS policies
   supabase db push --include-all
   ```

#### Manual Database Setup

If you prefer to set up the database manually:

1. **Create tables**:
   ```sql
   -- Run the SQL files in order:
   -- 1. create-feedback-table.sql
   -- 2. create-scan-events-table.sql
   -- 3. fix-profiles-rls-specific.sql
   -- 4. fix-platform-feedback-rls.sql
   ```

2. **Set up RLS policies**:
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
   -- ... (see SQL files for complete setup)
   ```

### 5. Cloudinary Setup (Optional)

1. **Create Cloudinary account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account
   - Get your cloud name, API key, and API secret

2. **Configure environment variables**:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 6. Redis Setup (Optional)

1. **Create Upstash Redis database**:
   - Go to [upstash.com](https://upstash.com)
   - Create a new Redis database
   - Get your REST URL and token

2. **Configure environment variables**:
   ```env
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ```

### 7. Start Development Server

```bash
# Start the development server
pnpm dev

# Or with HTTPS (for PWA testing)
pnpm dev:spa
```

The application will be available at:
- **HTTP**: [http://localhost:3000](http://localhost:3000)
- **HTTPS**: [https://localhost:3000](https://localhost:3000) (if using dev:spa)

## Verification

### 1. Check Installation

Visit [http://localhost:3000](http://localhost:3000) to verify the installation.

### 2. Test Database Connection

Check the browser console for any database connection errors.

### 3. Test Authentication

Try creating an account to verify authentication is working.

### 4. Test File Uploads

If Cloudinary is configured, test uploading an image.

## Troubleshooting

### Common Issues

#### 1. Node.js Version

Ensure you're using Node.js 20.0.0 or higher:
```bash
node --version
```

#### 2. Package Manager Issues

If you encounter issues with pnpm, try:
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 3. Environment Variables

Verify all required environment variables are set:
```bash
# Check environment variables
cat .env.local
```

#### 4. Database Connection

Test Supabase connection:
```bash
# Test with Supabase CLI
supabase status
```

#### 5. Port Conflicts

If port 3000 is in use:
```bash
# Use a different port
pnpm dev -- -p 3001
```

### Error Messages

#### "Module not found"
- Run `pnpm install` to ensure all dependencies are installed
- Check if you're in the correct directory

#### "Database connection failed"
- Verify Supabase URL and keys in `.env.local`
- Check if your Supabase project is active

#### "Authentication failed"
- Verify Supabase anon key and service role key
- Check if RLS policies are properly set up

#### "File upload failed"
- Verify Cloudinary credentials
- Check file size limits

## Development Tools

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**

### Browser Extensions

- **React Developer Tools**
- **Redux DevTools** (for Zustand)
- **Supabase DevTools**

## Next Steps

After successful installation:

1. **Read the [Quick Start Guide](./quick-start.md)**
2. **Explore the [API Documentation](./api/README.md)**
3. **Check out the [Component Library](./components/README.md)**
4. **Set up [Deployment](./deployment/production.md)**

## Support

If you encounter issues during installation:

- **GitHub Issues**: [Create an issue](https://github.com/your-org/cxperia/issues)
- **Documentation**: Check this guide and other docs
- **Email**: support@cxperia.com

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
