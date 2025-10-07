# Documentation Website Setup

## Overview

We'll create a custom documentation website using Next.js that integrates seamlessly with our existing Cxperia project. This approach gives us full control over design, functionality, and performance.

## 🎯 Why Custom Next.js Docs Site?

- **Consistent Tech Stack**: Uses the same Next.js, TypeScript, and Tailwind CSS
- **Full Control**: Custom design and functionality
- **Performance**: Optimized for speed and SEO
- **Integration**: Can use our existing components
- **Cost**: Free hosting on Vercel
- **Custom Features**: Search, interactive examples, code playgrounds

## 🏗️ Implementation Plan

### Phase 1: Basic Structure
1. Create docs site structure
2. Set up routing and navigation
3. Implement markdown rendering
4. Add basic styling

### Phase 2: Advanced Features
1. Search functionality
2. Interactive code examples
3. Dark/light mode
4. Mobile optimization

### Phase 3: Integration
1. Deploy to Vercel
2. Custom domain setup
3. Analytics integration
4. Performance optimization

## 📁 Project Structure

```
docs-site/
├── app/
│   ├── (docs)/
│   │   ├── page.tsx              # Docs homepage
│   │   ├── layout.tsx            # Docs layout
│   │   ├── [slug]/
│   │   │   └── page.tsx         # Dynamic doc pages
│   │   └── api/
│   │       └── search/
│   │           └── route.ts      # Search API
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/
│   ├── docs/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── Search.tsx           # Search component
│   │   ├── TableOfContents.tsx  # TOC component
│   │   └── CodeBlock.tsx        # Syntax highlighting
│   └── ui/                      # Reusable UI components
├── content/                     # Markdown content
│   ├── getting-started/
│   ├── api/
│   ├── components/
│   └── deployment/
├── lib/
│   ├── mdx.ts                   # MDX configuration
│   ├── search.ts                # Search functionality
│   └── utils.ts                 # Utility functions
└── public/
    └── images/                  # Documentation images
```

## 🛠️ Technology Stack

- **Next.js 15**: App Router for routing
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **MDX**: Markdown with React components
- **Fuse.js**: Client-side search
- **Prism.js**: Syntax highlighting
- **Lucide React**: Icons

## 🚀 Getting Started

### 1. Create Docs Site

```bash
# Create new Next.js app for docs
npx create-next-app@latest cxperia-docs --typescript --tailwind --app --src-dir=false

cd cxperia-docs

# Install additional dependencies
pnpm add @next/mdx @mdx-js/loader @mdx-js/react
pnpm add fuse.js prismjs
pnpm add lucide-react clsx tailwind-merge
```

### 2. Configure MDX

```javascript
// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
```

### 3. Create Layout Components

```tsx
// app/(docs)/layout.tsx
import { Sidebar } from '@/components/docs/Sidebar'
import { Search } from '@/components/docs/Search'
import { TableOfContents } from '@/components/docs/TableOfContents'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <Search />
            {children}
          </div>
        </main>
        <TableOfContents />
      </div>
    </div>
  )
}
```

### 4. Create Navigation Sidebar

```tsx
// components/docs/Sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Installation', href: '/installation' },
      { title: 'Quick Start', href: '/quick-start' },
      { title: 'Configuration', href: '/configuration' },
    ],
  },
  {
    title: 'User Guides',
    items: [
      { title: 'Brand Dashboard', href: '/user-guides/brand-dashboard' },
      { title: 'Experience Creation', href: '/user-guides/experience-creation' },
      { title: 'Tutorial Management', href: '/user-guides/tutorial-management' },
    ],
  },
  {
    title: 'Developer Docs',
    items: [
      { title: 'API Reference', href: '/api' },
      { title: 'Component Library', href: '/components' },
      { title: 'Architecture', href: '/architecture' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold">
          Cxperia Docs
        </Link>
      </div>
      <nav className="px-6 pb-6">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 text-sm rounded-md transition-colors',
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
```

### 5. Create Search Component

```tsx
// components/docs/Search.tsx
'use client'

import { useState, useMemo } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import Fuse from 'fuse.js'

const searchData = [
  { title: 'Installation', content: 'How to install Cxperia...', href: '/installation' },
  { title: 'API Reference', content: 'Complete API documentation...', href: '/api' },
  // ... more search data
]

const fuse = new Fuse(searchData, {
  keys: ['title', 'content'],
  threshold: 0.3,
})

export function Search() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo(() => {
    if (!query) return []
    return fuse.search(query).map(result => result.item)
  }, [query])

  return (
    <div className="relative mb-8">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {results.length > 0 ? (
            <div className="py-2">
              {results.slice(0, 5).map((result, index) => (
                <a
                  key={index}
                  href={result.href}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {result.content.substring(0, 100)}...
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### 6. Create Dynamic Pages

```tsx
// app/(docs)/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { CodeBlock } from '@/components/docs/CodeBlock'

const components = {
  pre: CodeBlock,
  // Add more custom components
}

async function getDoc(slug: string) {
  try {
    const content = await import(`@/content/${slug}.mdx`)
    return content.default
  } catch {
    return null
  }
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const Doc = await getDoc(params.slug)
  
  if (!Doc) {
    notFound()
  }

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      <MDXRemote source={Doc} components={components} />
    </article>
  )
}
```

## 🎨 Design Features

### Custom Styling
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Typography**: Optimized for readability
- **Code Highlighting**: Syntax highlighting for code blocks
- **Interactive Elements**: Hover effects and animations

### Advanced Features
- **Live Search**: Real-time search with Fuse.js
- **Table of Contents**: Auto-generated from headings
- **Breadcrumbs**: Navigation context
- **Copy Code**: One-click code copying
- **Print Styles**: Optimized for printing

## 🚀 Deployment

### Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod

# Custom domain
vercel domains add docs.cxperia.com
```

### Custom Domain Setup
1. **DNS Configuration**: Point docs subdomain to Vercel
2. **SSL Certificate**: Automatic HTTPS
3. **CDN**: Global content delivery
4. **Analytics**: Vercel Analytics integration

## 📊 Benefits of Custom Solution

### Performance
- **Fast Loading**: Optimized Next.js performance
- **SEO Optimized**: Server-side rendering
- **Caching**: Intelligent caching strategies
- **CDN**: Global content delivery

### Customization
- **Brand Integration**: Match Cxperia design system
- **Interactive Examples**: Live code playgrounds
- **Custom Components**: Reuse existing UI components
- **Advanced Search**: Full-text search with filters

### Cost
- **Free Hosting**: Vercel free tier
- **No Monthly Fees**: Unlike GitBook
- **Scalable**: Grows with your needs
- **Full Control**: No vendor lock-in

## 🔄 Migration from Current Docs

### Content Migration
1. **Move Markdown Files**: Copy existing docs to `/content`
2. **Update Links**: Fix internal references
3. **Add Metadata**: Frontmatter for each page
4. **Optimize Images**: Compress and optimize

### SEO Migration
1. **301 Redirects**: Redirect old URLs
2. **Sitemap**: Generate new sitemap
3. **Meta Tags**: Update meta descriptions
4. **Analytics**: Transfer tracking

## 🎯 Next Steps

1. **Create Docs Site**: Set up Next.js documentation site
2. **Migrate Content**: Move existing documentation
3. **Add Features**: Implement search and navigation
4. **Deploy**: Deploy to Vercel with custom domain
5. **Optimize**: Performance and SEO optimization

Would you like me to start implementing this custom documentation website? I can create the initial structure and begin migrating our existing documentation content.
