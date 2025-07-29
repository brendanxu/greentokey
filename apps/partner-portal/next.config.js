/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@greenlink/ui',
    '@greenlink/auth-ui',
    '@greenlink/data-viz',
    '@greenlink/design-tokens',
    '@greenlink/api-client'
  ],
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'res.cloudinary.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'GreenLink Partner Portal',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;