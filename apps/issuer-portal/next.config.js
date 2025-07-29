/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true,
  },
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  // Transpile shared packages
  transpilePackages: [
    '@greenlink/ui',
    '@greenlink/auth-ui', 
    '@greenlink/data-viz',
    '@greenlink/design-tokens',
    '@greenlink/api-client'
  ],
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3002',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'issuer-portal-secret',
  },
  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Output configuration
  output: 'standalone',
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  // Optimize bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
};

module.exports = nextConfig;