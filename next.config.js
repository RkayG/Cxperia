module.exports = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during builds
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'placehold.co',
      // add other domains as needed
    ],
  },
  // Optimize for SPA-like behavior
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Enable Turbopack (now stable)
  turbopack: {
    // Turbopack configuration options can be added here
  },
  // Disable SSR for better performance
  trailingSlash: false,
  // Optimize bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
